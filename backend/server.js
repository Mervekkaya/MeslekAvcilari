// backend/server.js
console.log("🚀 Sunucu dosyası okunmaya başlandı, lütfen bekleyin...");

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // .env dosyasındaki gizli bilgileri okur
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const { GoogleGenAI } = require('@google/genai');

const app = express();

// ==========================================
// MİDDLEWARE (Ara Yazılımlar)
// ==========================================
app.use(cors()); // Frontend'in (React) backend ile konuşmasına izin verir
app.use(express.json()); // Gelen verileri JSON formatında okumamızı sağlar

// ==========================================
// POSTGRESQL VERİTABANI BAĞLANTISI
// ==========================================
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Veritabanı bağlantısını test et
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Veritabanına bağlanırken hata oluştu:', err.stack);
  }
  console.log('✅ PostgreSQL veritabanına başarıyla bağlanıldı!');
  release();
});

// ==========================================
// YAPAY ZEKA (GEMINI) KURULUMU
// ==========================================
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


// ==========================================
// 1. ENDPOINT: Öğrencileri Veritabanına Kaydetme
// ==========================================
app.post('/api/save-students', async (req, res) => {
  const { school, teacher, audienceGroup, students } = req.body;

  // Gelen veri boş mu kontrolü
  if (!students || students.length === 0) {
    return res.status(400).json({ error: 'Kaydedilecek öğrenci bulunamadı.' });
  }

  try {
    // Transaction (İşlem) başlatıyoruz ki biri bile hata verirse tüm kayıtlar geri alınsın
    await pool.query('BEGIN');

    for (let student of students) {
      const queryText = `
        INSERT INTO students (school_name, teacher_name, audience_group, student_name, profession, created_at) 
        VALUES ($1, $2, $3, $4, $5, NOW())
      `;
      const values = [school, teacher || null, audienceGroup, student.name, student.profession];
      await pool.query(queryText, values);
    }

    await pool.query('COMMIT'); // Hata yoksa işlemi onayla
    console.log(`✅ ${school} okulu için ${students.length} öğrenci başarıyla kaydedildi.`);
    res.status(200).json({ message: 'Veriler başarıyla veritabanına kaydedildi! 🚀' });

  } catch (err) {
    await pool.query('ROLLBACK'); // Hata varsa işlemleri geri al
    console.error('❌ Kayıt sırasında hata:', err.message);
    res.status(500).json({ error: 'Sunucu tarafında veriler kaydedilemedi.' });
  }
});


// ==========================================
// 2. ENDPOINT: Yapay Zeka Asistanından Kısa İpucu Alma
// ==========================================
app.post('/api/get-hint', async (req, res) => {
  const { profession, audience } = req.body;

  if (!profession || !audience) {
    return res.status(400).json({ error: 'Meslek ve kitle bilgisi eksik.' });
  }
  
  const prompt = `
    Sen eğitimsel bir kariyer oyununda çocuklara yardım eden minik, eğlenceli bir yapay zeka asistanısın. 
    Şu an bulmaları gereken meslek: ${profession}. 
    Karşındaki kitle: ${audience === 'lise' ? 'Lise' : 'İlkokul'} öğrencileri.
    Onlara bu mesleği tahmin etmeleri için 1 cümlelik, akıllıca ve yaşlarına uygun tatlı bir ipucu ver. 
    Lütfen sadece ipucunu söyle, mesleğin adını veya emojileri asla kullanma!
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    console.log(`🤖 AI İpucu Üretti (${profession} için)`);
    res.status(200).json({ hint: response.text });

  } catch (error) {
    console.error('❌ Yapay Zeka Hatası (İpucu):', error);
    res.status(500).json({ error: 'Asistanımız şu an kısa bir kahve molasında, lütfen tekrar deneyin! ☕' });
  }
});


// ==========================================
// 3. ENDPOINT: İstatistik Paneli Verileri
// ==========================================
app.get('/api/statistics', async (req, res) => {
  try {
    // Toplam öğrenci sayısı
    const totalStudentsResult = await pool.query('SELECT COUNT(*) FROM students');
    const totalStudents = parseInt(totalStudentsResult.rows[0].count, 10);

    // Toplam okul sayısı
    const totalSchoolsResult = await pool.query('SELECT COUNT(DISTINCT school_name) FROM students');
    const totalSchools = parseInt(totalSchoolsResult.rows[0].count, 10);

    // Okul listesi
    const schoolsResult = await pool.query('SELECT DISTINCT school_name FROM students ORDER BY school_name');
    const schools = schoolsResult.rows.map(r => r.school_name);

    // Meslek bazında dağılım
    const professionResult = await pool.query(`
      SELECT profession AS name, COUNT(*) AS count
      FROM students
      GROUP BY profession
      ORDER BY count DESC
      LIMIT 10
    `);
    const professionData = professionResult.rows.map(r => ({
      name: r.name,
      count: parseInt(r.count, 10),
    }));

    // En popüler meslek
    const popularProfession = professionData.length > 0 ? professionData[0].name : '-';

    // Kitle (audience) bazında dağılım
    const audienceResult = await pool.query(`
      SELECT audience_group AS name, COUNT(*) AS value
      FROM students
      GROUP BY audience_group
      ORDER BY value DESC
    `);
    const audienceData = audienceResult.rows.map(r => ({
      name: r.name === 'ilkokul' ? 'İlkokul' : r.name === 'ortaokul' ? 'Ortaokul' : 'Lise',
      value: parseInt(r.value, 10),
    }));

    // Son etkinlikler (okul bazında son kayıtlar)
    const recentResult = await pool.query(`
      SELECT school_name AS school, audience_group AS audience,
             COUNT(*) AS count,
             TO_CHAR(MAX(created_at), 'DD.MM.YYYY') AS date
      FROM students
      GROUP BY school_name, audience_group
      ORDER BY MAX(created_at) DESC
      LIMIT 10
    `);
    const recentActivity = recentResult.rows.map(r => ({
      school: r.school,
      audience: r.audience,
      count: parseInt(r.count, 10),
      date: r.date,
    }));

    res.status(200).json({
      totalStudents,
      totalSchools,
      popularProfession,
      schools,
      professionData,
      audienceData,
      recentActivity,
    });
  } catch (err) {
    console.error('❌ İstatistik hatası:', err.message);
    res.status(500).json({ error: 'İstatistikler alınamadı.' });
  }
});


// ==========================================
// 4. ENDPOINT: Meslek Hakkında Detaylı Bilgi Alma
// ==========================================
app.post('/api/get-profession-details', async (req, res) => {
  const { profession, audience } = req.body;

  if (!profession || !audience) {
    return res.status(400).json({ error: 'Meslek ve kitle bilgisi eksik.' });
  }
  
  const prompt = `
    Sen "Meslek Avcıları" oyununda çocuklara meslekleri tanıtan sevimli, vizyoner ve ilham verici bir yapay zeka asistanısın. 
    Anlatacağın meslek: ${profession}. 
    Karşındaki kitle: ${audience === 'lise' ? 'Lise' : 'İlkokul'} öğrencileri.
    Onlara bu mesleği yapanların tam olarak ne iş yaptığını, bir günlerinin nasıl geçtiğini ve dünyaya nasıl bir katkı sağladıklarını, onların yaş seviyesine uygun, akıcı ve heyecan verici bir dille anlat. 
    Lütfen sıkıcı tanımlardan kaçın, maksimum 3-4 cümleyle ilham verici bir hikaye gibi özetle!
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    console.log(`🤖 AI Detaylı Bilgi Üretti (${profession} için)`);
    res.status(200).json({ details: response.text });

  } catch (error) {
    console.error('❌ Yapay Zeka Hatası (Detay):', error);
    res.status(500).json({ error: 'Asistanımız şu an kütüphanede araştırma yapıyor, lütfen birazdan tekrar dene! 📚' });
  }
});


// ==========================================
// SUNUCUYU AYAĞA KALDIR
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend sunucusu http://localhost:${PORT} adresinde koşuyor!`);
});