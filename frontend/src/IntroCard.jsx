// src/IntroCard.jsx
import React, { useState } from 'react';

const modes = [
  {
    id: 'ilkokul',
    emoji: '🧩',
    title: 'Minik Kaşifler',
    sub: 'İlkokul · 1–4. Sınıf',
    desc: 'Emojilerle dolu eğlenceli bir macera!',
    from: '#f97316',
    to: '#ec4899',
    glow: 'rgba(249,115,22,0.5)',
    border: '#f97316',
  },
  {
    id: 'ortaokul',
    emoji: '🔬',
    title: 'Kaşif Dedektifler',
    sub: 'Ortaokul · 5–8. Sınıf',
    desc: 'İpuçlarını çöz, mesleği bul!',
    from: '#10b981',
    to: '#06b6d4',
    glow: 'rgba(16,185,129,0.5)',
    border: '#10b981',
  },
  {
    id: 'lise',
    emoji: '🕵️',
    title: 'Gizemli Dosyalar',
    sub: 'Lise · 9–12. Sınıf',
    desc: 'Gizli dosyaları çöz, kariyerini keşfet!',
    from: '#6366f1',
    to: '#8b5cf6',
    glow: 'rgba(99,102,241,0.5)',
    border: '#6366f1',
  },
];

export default function IntroCard({ onStart, onDashboard }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 40%, #0d1b3e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Arka plan dekoratif daireler */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Ana kart */}
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '860px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '28px',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo / Başlık */}
        <div className="animate-float" style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔭</div>

        <h1
          className="shimmer-text"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            lineHeight: 1.1,
          }}
        >
          Meslek Avcıları
        </h1>

        <p style={{
          color: 'rgba(203,213,225,0.8)',
          fontSize: '1.15rem',
          fontWeight: 300,
          marginBottom: '2.5rem',
          lineHeight: 1.7,
        }}>
          Geleceğin dünyasını keşfetmeye hazır mısın?<br />
          Yaş grubunu seç ve maceraya başla!
        </p>

        {/* Mod Kartları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => onStart(m.id)}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === m.id
                  ? `linear-gradient(135deg, ${m.from}, ${m.to})`
                  : 'rgba(255,255,255,0.06)',
                border: `2px solid ${hovered === m.id ? 'transparent' : m.border + '60'}`,
                borderRadius: '20px',
                padding: '1.75rem 1.25rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                transform: hovered === m.id ? 'translateY(-6px) scale(1.03)' : 'translateY(0) scale(1)',
                boxShadow: hovered === m.id ? `0 20px 40px ${m.glow}` : '0 4px 20px rgba(0,0,0,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'white',
              }}
            >
              <span style={{ fontSize: '2.5rem' }}>{m.emoji}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{m.title}</span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                opacity: 0.75,
                background: 'rgba(255,255,255,0.15)',
                padding: '2px 10px',
                borderRadius: '20px',
              }}>{m.sub}</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '0.25rem' }}>{m.desc}</span>
            </button>
          ))}
        </div>

        {/* Yönetici Paneli */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
          <button
            onClick={onDashboard}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              padding: '0.6rem 1.5rem',
              color: 'rgba(203,213,225,0.7)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'rgba(203,213,225,0.7)';
            }}
          >
            📊 Yönetici Paneli
          </button>
        </div>
      </div>

      {/* Alt yazı */}
      <p style={{
        marginTop: '2rem',
        color: 'rgba(148,163,184,0.4)',
        fontSize: '0.8rem',
        letterSpacing: '0.1em',
      }}>
        MESLEK FARKINDALIK ETKİNLİĞİ
      </p>
    </div>
  );
}
