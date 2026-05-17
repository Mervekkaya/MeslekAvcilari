// src/TeacherForm.jsx
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const professionOptions = [
  "Bilgisayar Mühendisi","Avukat","Öğretmen","Doktor",
  "Polis - Asker","Pilot","Veteriner","Sporcu",
  "Aşçı (Şef)","Şarkıcı / Oyuncu","Psikolog","Mimar","Girişimci","Diğer",
];

function tr2ascii(s) {
  return s.replace(/ğ/g,'g').replace(/Ğ/g,'G').replace(/ü/g,'u').replace(/Ü/g,'U')
    .replace(/ş/g,'s').replace(/Ş/g,'S').replace(/ı/g,'i').replace(/İ/g,'I')
    .replace(/ö/g,'o').replace(/Ö/g,'O').replace(/ç/g,'c').replace(/Ç/g,'C');
}

const audienceLabel = {
  ilkokul: 'İlkokul — Minik Kaşifler (1-4. Sınıf)',
  ortaokul: 'Ortaokul — Kaşif Dedektifler (5-8. Sınıf)',
  lise: 'Lise — Gizemli Dosyalar (9-12. Sınıf)',
};

const audienceBadge = {
  ilkokul: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  ortaokul: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
  lise: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
};

export default function TeacherForm({ audience, onRestart }) {
  const [schoolName, setSchoolName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [selectedProf, setSelectedProf] = useState(professionOptions[0]);
  const [studentList, setStudentList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const badge = audienceBadge[audience] || audienceBadge.lise;

  const profSummary = studentList.reduce((acc, s) => {
    acc[s.profession] = (acc[s.profession] || 0) + 1;
    return acc;
  }, {});

  const handleAdd = (e) => {
    e.preventDefault();
    if (!studentName.trim() || !schoolName.trim()) return;
    setStudentList([...studentList, { id: Date.now(), name: studentName.trim(), profession: selectedProf }]);
    setStudentName('');
  };

  const generatePDF = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const today = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });

    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 48, 'F');
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 44, 210, 4, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text(tr2ascii('Sinifin Gelecek Tablosu'), 14, 20);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(199, 210, 254);
    doc.text(tr2ascii('Meslek Avcilari — Kariyer Farkindalik Etkinligi'), 14, 30);
    doc.text(tr2ascii(`Tarih: ${today}`), 196, 20, { align: 'right' });
    doc.text(tr2ascii(`Grup: ${audienceLabel[audience] || audience}`), 196, 30, { align: 'right' });

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 48, 210, 22, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(tr2ascii(`Okul: ${schoolName}`), 14, 58);
    if (teacherName) doc.text(tr2ascii(`Ogretmen: ${teacherName}`), 14, 65);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(tr2ascii(`Toplam Ogrenci: ${studentList.length}`), 196, 58, { align: 'right' });

    autoTable(doc, {
      head: [['#', tr2ascii('Öğrenci Adı'), tr2ascii('Hayalindeki Meslek')]],
      body: studentList.map((s, i) => [i + 1, tr2ascii(s.name), tr2ascii(s.profession)]),
      startY: 75,
      theme: 'grid',
      styles: { fontSize: 11, cellPadding: 4 },
      headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold', halign: 'center' },
      columnStyles: { 0: { halign: 'center', cellWidth: 12 }, 1: { cellWidth: 90 }, 2: { cellWidth: 80 } },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 },
    });

    const sy = doc.lastAutoTable.finalY + 14;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(tr2ascii('Meslek Tercih Ozeti'), 14, sy);

    autoTable(doc, {
      head: [[tr2ascii('Meslek'), tr2ascii('Öğrenci Sayısı'), 'Oran']],
      body: Object.entries(profSummary).sort((a,b)=>b[1]-a[1]).map(([p,c]) => [tr2ascii(p), c, `%${Math.round(c/studentList.length*100)}`]),
      startY: sy + 5,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [124, 58, 237], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'center' } },
      margin: { left: 14, right: 14 },
    });

    const pc = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pc; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(tr2ascii('Meslek Avcilari — Kariyer Farkindalik Etkinligi'), 14, doc.internal.pageSize.height - 8);
      doc.text(`Sayfa ${i} / ${pc}`, 196, doc.internal.pageSize.height - 8, { align: 'right' });
    }

    doc.save(`${tr2ascii(schoolName).replace(/\s+/g,'_')}_Gelecek_Tablosu.pdf`);
  };

  const handleSave = async () => {
    if (!studentList.length) { alert('Lütfen en az bir öğrenci ekleyin!'); return; }
    setIsSaving(true);
    try {
      const r = await fetch((import.meta.env.VITE_API_URL || '') + '/api/save-students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school: schoolName, teacher: teacherName, audienceGroup: audience, students: studentList }),
      });
      if (!r.ok) throw new Error();
      generatePDF();
      alert('Veriler kaydedildi ve PDF indirildi! 🚀');
      onRestart();
    } catch {
      generatePDF();
      alert('PDF indirildi! (Sunucu bağlantısı kurulamadı.)');
    } finally {
      setIsSaving(false);
    }
  };

  const inp = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)',
    color: '#e2e8f0', fontSize: '0.95rem', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0d1b3e 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>

      {/* Başlık */}
      <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '700px' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>
          📋 Sınıfın Gelecek Tablosu
        </h1>
        <p style={{ color: 'rgba(148,163,184,0.8)', fontSize: '1rem', marginBottom: '0.75rem' }}>
          Tahtaya yazılan hayalleri dijitale aktarın, tek tuşla PDF olarak indirin.
        </p>
        <span style={{ display: 'inline-block', padding: '4px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, background: badge.bg, color: badge.color, border: '1px solid ' + badge.border }}>
          {audienceLabel[audience] || audience}
        </span>
      </div>

      {/* Ana Panel */}
      <div style={{ width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '1.5rem' }}>

        {/* SOL: Form */}
        <div style={{ flex: '1 1 380px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏫 Okul Bilgileri
          </h2>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: 'rgba(148,163,184,0.9)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>OKUL ADI *</label>
            <input style={inp} type="text" placeholder="Örn: Yozgat Merkez İlkokulu" value={schoolName} onChange={e => setSchoolName(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#818cf8'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: 'rgba(148,163,184,0.9)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>ÖĞRETMEN ADI (isteğe bağlı)</label>
            <input style={inp} type="text" placeholder="Örn: Ayşe Öğretmen" value={teacherName} onChange={e => setTeacherName(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#818cf8'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
            <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ➕ Öğrenci Ekle
            </h3>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(148,163,184,0.9)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>ÖĞRENCİ ADI SOYADI</label>
                <input style={inp} type="text" placeholder="Örn: Ahmet Yılmaz" value={studentName} onChange={e => setStudentName(e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#818cf8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'} />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(148,163,184,0.9)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', letterSpacing: '0.05em' }}>SEÇTİĞİ MESLEK</label>
                <select style={{ ...inp, cursor: 'pointer' }} value={selectedProf} onChange={e => setSelectedProf(e.target.value)}>
                  {professionOptions.map((p, i) => <option key={i} value={p} style={{ background: '#1e1b4b' }}>{p}</option>)}
                </select>
              </div>
              <button type="submit" disabled={!studentName.trim() || !schoolName.trim()}
                style={{ padding: '0.8rem', borderRadius: '12px', border: 'none', background: (!studentName.trim() || !schoolName.trim()) ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', fontWeight: 700, fontSize: '0.95rem', cursor: (!studentName.trim() || !schoolName.trim()) ? 'not-allowed' : 'pointer', opacity: (!studentName.trim() || !schoolName.trim()) ? 0.5 : 1, transition: 'all 0.2s' }}>
                + Listeye Ekle
              </button>
            </form>
          </div>
        </div>

        {/* SAĞ: Liste */}
        <div style={{ flex: '1 1 380px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>Sınıf Listesi</h3>
            <span style={{ background: 'rgba(99,102,241,0.2)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '20px', padding: '3px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
              {studentList.length} Öğrenci
            </span>
          </div>

          {/* Liste */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: '240px', maxHeight: '340px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {studentList.length === 0 ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'rgba(148,163,184,0.4)', gap: '0.75rem', padding: '2rem 0' }}>
                <span style={{ fontSize: '3rem' }}>📝</span>
                <p style={{ fontStyle: 'italic', textAlign: 'center', fontSize: '0.9rem' }}>Henüz öğrenci eklenmedi.<br />Sol taraftan eklemeye başlayın.</p>
              </div>
            ) : studentList.map((s, idx) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: '26px', height: '26px', background: 'rgba(99,102,241,0.2)', color: '#a78bfa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</span>
                  <div>
                    <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>{s.name}</p>
                    <p style={{ color: '#818cf8', fontSize: '0.78rem', margin: 0 }}>{s.profession}</p>
                  </div>
                </div>
                <button onClick={() => setStudentList(studentList.filter(x => x.id !== s.id))}
                  style={{ background: 'none', border: 'none', color: 'rgba(148,163,184,0.3)', cursor: 'pointer', fontSize: '1rem', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.3)'}>✕</button>
              </div>
            ))}
          </div>

          {/* Özet etiketleri */}
          {studentList.length > 0 && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>MESLEK ÖZETİ</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {Object.entries(profSummary).sort((a,b)=>b[1]-a[1]).map(([p,c]) => (
                  <span key={p} style={{ padding: '2px 10px', background: 'rgba(99,102,241,0.15)', color: '#a78bfa', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{p}: {c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Butonlar */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={handleSave} disabled={!studentList.length || isSaving}
              style={{ padding: '0.9rem', borderRadius: '14px', border: 'none', background: (!studentList.length || isSaving) ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #059669, #10b981)', color: 'white', fontWeight: 800, fontSize: '1rem', cursor: (!studentList.length || isSaving) ? 'not-allowed' : 'pointer', opacity: (!studentList.length || isSaving) ? 0.5 : 1, transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: studentList.length && !isSaving ? '0 8px 25px rgba(16,185,129,0.3)' : 'none' }}>
              {isSaving ? '⏳ Kaydediliyor...' : '📄 Kaydet ve PDF İndir'}
            </button>
            <button onClick={onRestart}
              style={{ padding: '0.75rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(148,163,184,0.8)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(148,163,184,0.8)'; }}>
              ← Başa Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
