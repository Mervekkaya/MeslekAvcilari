// src/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#a78bfa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(15,12,41,0.95)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '12px', padding: '10px 16px', backdropFilter: 'blur(10px)' }}>
      <p style={{ color: '#a78bfa', fontWeight: 700, margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: '#818cf8', fontWeight: 800, margin: 0 }}>{payload[0].value} öğrenci</p>
    </div>
  );
};

const DEMO = {
  totalStudents: 156, totalSchools: 4, popularProfession: 'Bilgisayar Mühendisi',
  schools: ['Yozgat Merkez İlkokulu', 'Sorgun Ortaokulu', 'Yozgat Lisesi', 'Akdağmadeni İlkokulu'],
  professionData: [
    { name: 'Bilg. Müh.', count: 45 }, { name: 'Doktor', count: 32 },
    { name: 'Polis/Asker', count: 28 }, { name: 'Öğretmen', count: 18 },
    { name: 'Sporcu', count: 15 }, { name: 'Aşçı', count: 10 }, { name: 'Psikolog', count: 8 },
  ],
  audienceData: [
    { name: 'İlkokul', value: 72 }, { name: 'Ortaokul', value: 48 }, { name: 'Lise', value: 36 },
  ],
  recentActivity: [
    { school: 'Yozgat Merkez İlkokulu', count: 28, date: '07.05.2026', audience: 'ilkokul' },
    { school: 'Sorgun Ortaokulu', count: 35, date: '06.05.2026', audience: 'ortaokul' },
    { school: 'Yozgat Lisesi', count: 42, date: '05.05.2026', audience: 'lise' },
    { school: 'Akdağmadeni İlkokulu', count: 51, date: '03.05.2026', audience: 'ilkokul' },
  ],
};

const audienceColors = { ilkokul: '#10b981', ortaokul: '#f59e0b', lise: '#6366f1' };
const audiencePieColors = ['#10b981', '#f59e0b', '#6366f1'];

export default function Dashboard({ onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || '') + '/api/statistics')
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { setStats(d); setLoading(false); })
      .catch(() => { setStats(DEMO); setIsDemo(true); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #1e1b4b)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ fontSize: '4rem' }} className="animate-float">📊</div>
      <p style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>İstatistikler Yükleniyor...</p>
    </div>
  );

  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', backdropFilter: 'blur(20px)' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0d1b3e 100%)', fontFamily: 'system-ui, sans-serif', overflowY: 'auto' }}>

      {/* Üst Bar */}
      <div style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ color: 'white', fontWeight: 900, fontSize: '1.75rem', margin: 0 }}>📊 Yönetici Paneli</h1>
          <p style={{ color: 'rgba(148,163,184,0.6)', fontSize: '0.85rem', margin: '2px 0 0' }}>Meslek Avcıları — Genel İstatistikler</p>
        </div>
        <button onClick={onBack}
          style={{ padding: '0.6rem 1.25rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'rgba(203,213,225,0.9)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(203,213,225,0.9)'; }}>
          ❮ Ana Ekrana Dön
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Demo uyarısı */}
        {isDemo && (
          <div style={{ marginBottom: '1.5rem', padding: '0.875rem 1.25rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', color: '#fbbf24', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Demo mod: Sunucu bağlantısı yok, örnek veriler gösteriliyor.
          </div>
        )}

        {/* Özet Kartları */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {[
            { emoji: '🎓', label: 'Toplam Öğrenci', value: stats.totalStudents, color: '#818cf8', big: true },
            { emoji: '🏫', label: 'Ulaşılan Okul', value: stats.totalSchools, color: '#a78bfa', big: true },
            { emoji: '⭐', label: 'En Popüler Meslek', value: stats.popularProfession, color: '#34d399', big: false },
          ].map((c, i) => (
            <div key={i} style={{ ...card, padding: '1.75rem', textAlign: 'center', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{c.emoji}</div>
              <p style={{ color: 'rgba(148,163,184,0.7)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>{c.label}</p>
              <p style={{ color: c.color, fontWeight: 900, fontSize: c.big ? '2.5rem' : '1.3rem', margin: 0 }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Grafikler */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

          {/* Bar Chart */}
          <div style={{ ...card, padding: '1.75rem' }}>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Meslek Tercih Dağılımı</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.professionData} margin={{ top: 5, right: 10, left: -20, bottom: 45 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }} interval={0} angle={-35} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: 'rgba(148,163,184,0.7)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stats.professionData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div style={{ ...card, padding: '1.75rem' }}>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '1.5rem' }}>Yaş Grubu Analizi</h3>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.audienceData} cx="50%" cy="45%" innerRadius={65} outerRadius={100} paddingAngle={4} dataKey="value"
                    label={({ name, percent }) => `${name} %${(percent * 100).toFixed(0)}`}
                    labelLine={{ stroke: 'rgba(148,163,184,0.4)' }}>
                    {stats.audienceData.map((_, i) => <Cell key={i} fill={audiencePieColors[i % audiencePieColors.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'rgba(15,12,41,0.95)', border: '1px solid rgba(129,140,248,0.3)', borderRadius: '12px', color: 'white' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: 'rgba(148,163,184,0.8)', fontSize: '0.85rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Son Etkinlikler */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Son Etkinlikler</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Okul', 'Grup', 'Öğrenci', 'Tarih'].map((h, i) => (
                    <th key={i} style={{ padding: '0.75rem 1.5rem', textAlign: i === 2 ? 'center' : i === 3 ? 'right' : 'left', color: 'rgba(148,163,184,0.6)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem', color: '#e2e8f0', fontWeight: 600, fontSize: '0.9rem' }}>{row.school}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: audienceColors[row.audience] + '20', color: audienceColors[row.audience], border: '1px solid ' + audienceColors[row.audience] + '40' }}>
                        {row.audience === 'ilkokul' ? 'İlkokul' : row.audience === 'ortaokul' ? 'Ortaokul' : 'Lise'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#818cf8', fontWeight: 800, fontSize: '1rem' }}>{row.count}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', color: 'rgba(148,163,184,0.6)', fontSize: '0.85rem' }}>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
