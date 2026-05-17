// src/GameScreen.jsx
import React, { useState } from "react";

const professionsDb = [
  { name: "Bilgisayar Muhendisi", emojis: "💻 ⌨️ 🧠 ⚙️", ilkokulDesc: "Gelecegin dunyasini kodlarla insa ederler! Bilgisayar oyunlari ve harika uygulamalar yaparlar.", ortaokulClues: ["Sifir ve birlerden olusan gorunmez bir dili konusurlar.", "Makinelere zeka katarak onlari dusundururler."], liseClues: ["Sifir ve birlerden olusan gorunmez bir evrenin mimarlaridir.", "Donanim ve yazilimi birlestirip makinelere zeka katarlar.", "Surekli hata (bug) arar ve sistemleri kusursuzlastirirlar."], liseDesc: "Gelecegin teknolojilerini, yapay zeka sistemlerini ve yazilimlari tasarlayan dijital dunyanin yaraticilaridir." },
  { name: "Avukat", emojis: "⚖️ 📜 💼 🗣️", ilkokulDesc: "Kurallari korur ve haksizliga ugrayan insanlara mahkemede yardim ederler!", ortaokulClues: ["Sozcukleri birer kilic gibi kullanirlar.", "Hakliyi haksizdan ayirmak icin yasalari incelerler."], liseClues: ["Sozcukleri birer kilic, yasalari ise kalkan olarak kullanirlar.", "Hakliyi haksizdan ayirmak icin satir aralarindaki gercegi ararlar.", "Adalet terazisinin dengede kalmasi icin mahkeme salonlarinda savasirlar."], liseDesc: "Insanlarin haklarini savunan, kanunlarin dogru uygulanmasini saglayan adaletin yilmaz savunucularidir." },
  { name: "Ogretmen", emojis: "🏫 �� 🍎 👩‍🏫", ilkokulDesc: "Bilgi tohumlarini eker, geleceğimizi yetistirirler!", ortaokulClues: ["Her gun sahneye cikar ama ezberlediklerini degil, inandiklarin anlatirlar.", "Bir insanin hayatina dokunup vizyonunu degistirirler."], liseClues: ["Kendi heykellerini degil, gelecegin mimarlarini sekillendirirler.", "Sahneye her gun cikarlar ama inandiklarin anlatirlar.", "Sadece bilgi aktarmaz, bir insanin hayatina dokunup vizyonunu degistirirler."], liseDesc: "Toplumun temelini atan, genc beyinlere ilham verip onlari hayata hazirlayan rehberlerdir." },
  { name: "Doktor", emojis: "🏥 🩺 💊 🧑‍⚕️", ilkokulDesc: "Hastalandigimizda bizi iyilestirir, saglik ve mutluluk dagitirlar!", ortaokulClues: ["Insan vucudunun sirlarini bilir, hastaliklarin sifresini cozerler.", "Hata payinin olmadigi bir sahnede gorev yaparlar."], liseClues: ["Hata payinin olmadigi, zamanla yarisian bir sahnede gorev yaparlar.", "Insan anatomisinin sirlarini bilir, hastaliklarin sifresini cozerler.", "Bir yasami kurtarmanin verdigi o tarifsiz hissi her gun yasarlar."], liseDesc: "Bilim ve sefkati birlestirerek hastaliklari iyilestiren, insan hayatini koruyan modern zaman kahramanlaridirlar." },
  { name: "Polis - Asker", emojis: "🚓 🛡️ 👮‍♂️ 🛑", ilkokulDesc: "Guvenligimizi saglar, kurallari korur ve bize her zaman yardim ederler!", ortaokulClues: ["Cogu insan tehlikeden kacerken onlar tehlikenin kalbine kosarlar.", "Uniformalari cesaretin ve fedakarligin semboludur."], liseClues: ["Cogu insan tehlikeden kacerken, onlar tehlikenin tam kalbine dogru kosarlar.", "Uniformalari sadece bir kiyafet degil, cesaretin ve fedakarligin semboludur.", "Huzur ve guvenligin devam etmesi icin gece gunduz nobet tutarlar."], liseDesc: "Ulkenin sinirlarini ve sehirlerin sokaklarini koruyan, vatan ve millet icin kendi hayatini siper eden koruyuculardirlar." },
  { name: "Pilot", emojis: "✈️ ☁️ 🌍 👨‍✈️", ilkokulDesc: "Devasa ucaklari ucurur, gokyuzunde suzerek dunyayi birbirine baglarlar!", ortaokulClues: ["Ofislerinin manzarasi surekli degisir ve hep bulutlarin uzerindedir.", "Tonlarca agirligtaki metal devlerini gokyuzunde dans ettirirler."], liseClues: ["Ofislerinin manzarasi surekli degisir ve hep bulutlarin uzerindedir.", "Tonlarca agirligtaki metal devlerini aerodinamik kurallariyla gokyuzunde dans ettirirler.", "Kokpitte yuzlerce tus, ekran ve kadrana ayni anda humederler."], liseDesc: "Kitalaari birbirine baglayan, gokyuzunun kurallarini yazan ve yercekimine meydan okuyan gokyuzu kaptanlaridir." },
  { name: "Veteriner", emojis: "🐶 🐱 🩺 🏥", ilkokulDesc: "Sevimli hayvan dostlarimizin sagligi ve mutlulugu onlara emanettir!", ortaokulClues: ["Hastalari onlara neresinin agridigini asla soyleyemez.", "Sozsuz bir dilde iletisim kurarak canlari iyilestirirler."], liseClues: ["Hastalari onlara neresinin agridigini asla soyleyemez.", "Hem bir cerrah, hem bir disci, hem de bir cocuk doktoru gibi calisirlar.", "Sozsuz bir dilde iletisim kurar, en masum canlarin kahramani olurlar."], liseDesc: "Hayvan dostlarimizin sagligini koruyan, doganin ve ekosistemin sessiz koruyuculari olan tip uzmanlaridir." },
  { name: "Sporcu", emojis: "⚽ 🥇 🏃‍♂️ 💪", ilkokulDesc: "Saglikli yasar, oyunlar oynar ve madalyalar kazanarak bizi gururlandirirlar!", ortaokulClues: ["Vucutlarinin sinirlarini zorlamak onlarin gunluk rutinidir.", "Saniyelerin ve milimetrelerin sampiyonu belirledigi bir arenada savasirlar."], liseClues: ["Vucutlarinin sinirlarini zorlamak onlarin gunluk rutinidir.", "Yenilgiyi bir son degil, daha guclu kalkmak icin bir basamak olarak gorurler.", "Saniyelerin, milimetrelerin ve taktigin sampiyonu belirledigi bir arenada savasirlar."], liseDesc: "Disiplin, tutku ve fiziksel gucu birlestirerek rekorlar kiran ve milyonlara ilham veren atletlerdir." },
  { name: "Asci (Sef)", emojis: "🍳 🥘 🔪 👨‍🍳", ilkokulDesc: "En lezzetli yemekleri yapar, sihirli tariflerle herkesin karnini doyururlar!", ortaokulClues: ["Mutfak onlarin laboratuvari, baharatlar ise sihirli iksirleridir.", "Insanlarin sadece karnini degil, ruhunu da doyururlar."], liseClues: ["Mutfak onlarin laboratuvari, baharatlar ise sihirli iksirleridir.", "Atesle oynar, bicaklarla dans eder ve zamanla yarisirlar.", "Insanlarin sadece karnini degil, ruhunu da doyuracak sanat eserleri yaratirlar."], liseDesc: "Lezzetleri bir tablo gibi tabaklara isleyen, tat alma duyumuza hitap eden gastronomi ustalaridirlar." },
  { name: "Sarkici / Oyuncu", emojis: "🎤 🎭 🎬 🌟", ilkokulDesc: "Sarkilar soyler, filmlerde oynar ve bizi eglendirirler!", ortaokulClues: ["Kendi hayatlarini birakip baska bir karakterin ruhuna burunurler.", "Ses dalgalari veya yuz ifadeleriyle milyonlarca insani ayni anda etkilerler."], liseClues: ["Kendi hayatlarini birakip, her gun baska bir karakterin ruhuna burunurler.", "Ses dalgalari veya yuz ifadeleriyle milyonlarca insani ayni anda aglatip guldurebirler.", "Sahnede veya kamera karsisinda devlesir, kitlelere ilham veren ikonlar olurlar."], liseDesc: "Sanatin gucuyle hikayeler anlatan, duygularimiza tercuman olan ve sahneleri aydinlatan yildizlardir." },
  { name: "Psikolog", emojis: "🛋️ 🧠 🗣️ 📝", ilkokulDesc: "Uzulduğumuzde bizi dinler ve kendimizi daha iyi hissetmemize yardimci olurlar!", ortaokulClues: ["Zihin okuyamazlar ama cok iyi dinlerler.", "Gorunmeyen yararlari sararlar."], liseClues: ["Zihin okuyamazlar ama cok iyi dinlerler.", "Kanayan yararlari degil, gorunmeyen yararlari sararlar.", "Insan davranislarinin, korkularinin ve hayallerinin sifresini cozerler."], liseDesc: "Insan zihninin derinliklerine inip, ruh sagligimizi iyilestiren ve kendimizi bulmamizi saglayan rehberlerdir." },
];

const THEMES = {
  ilkokul: {
    bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #e0f2fe 100%)",
    accent: "#3b82f6",
    accentLight: "#dbeafe",
    cardBg: "#ffffff",
    cardBorder: "#bfdbfe",
    text: "#1e3a5f",
    subText: "#64748b",
    btnBg: "linear-gradient(135deg, #3b82f6, #6366f1)",
    btnGlow: "rgba(59,130,246,0.4)",
    aiBg: "#f0f9ff",
    aiAccent: "#7c3aed",
    label: "MİNİK KAŞİFLER",
    progressColor: "#3b82f6",
    clueColors: ["#3b82f6","#8b5cf6","#ec4899"],
  },
  ortaokul: {
    bg: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0c4a6e 100%)",
    accent: "#10b981",
    accentLight: "rgba(16,185,129,0.15)",
    cardBg: "rgba(255,255,255,0.05)",
    cardBorder: "rgba(16,185,129,0.3)",
    text: "#ecfdf5",
    subText: "rgba(167,243,208,0.7)",
    btnBg: "linear-gradient(135deg, #10b981, #06b6d4)",
    btnGlow: "rgba(16,185,129,0.5)",
    aiBg: "rgba(16,185,129,0.1)",
    aiAccent: "#34d399",
    label: "KAŞİF DEDEKTİFLER",
    progressColor: "#10b981",
    clueColors: ["#10b981","#06b6d4","#a78bfa"],
  },
  lise: {
    bg: "linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #0d1b3e 100%)",
    accent: "#818cf8",
    accentLight: "rgba(129,140,248,0.15)",
    cardBg: "rgba(255,255,255,0.04)",
    cardBorder: "rgba(129,140,248,0.25)",
    text: "#e2e8f0",
    subText: "rgba(148,163,184,0.8)",
    btnBg: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    btnGlow: "rgba(99,102,241,0.5)",
    aiBg: "rgba(99,102,241,0.1)",
    aiAccent: "#a78bfa",
    label: "GİZEMLİ DOSYALAR",
    progressColor: "#818cf8",
    clueColors: ["#38bdf8","#a78bfa","#f472b6"],
  },
};

export default function GameScreen({ audience, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealState, setRevealState] = useState(0);
  const [aiMessage, setAiMessage] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const t = THEMES[audience] || THEMES.lise;
  const prof = professionsDb[currentIndex];
  const isIlkokul = audience === "ilkokul";
  const isOrtaokul = audience === "ortaokul";
  const totalSteps = isIlkokul ? 1 : isOrtaokul ? 2 : 3;
  const isRevealed = revealState > totalSteps;
  const clues = isOrtaokul ? prof.ortaokulClues : prof.liseClues;
  const progress = ((currentIndex + (isRevealed ? 1 : 0)) / professionsDb.length) * 100;

  const fetchAI = async (ep) => {
    setIsAiLoading(true);
    setAiMessage("");
    try {
      const r = await fetch((import.meta.env.VITE_API_URL || '') + '/api/' + ep, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profession: prof.name, audience }),
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setAiMessage(d.hint || d.details);
    } catch {
      setAiMessage("Bip bop! 🤖 Sunucuya ulaşamadım.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleNext = () => {
    if (isRevealed) {
      if (currentIndex < professionsDb.length - 1) {
        setCurrentIndex(p => p + 1);
        setRevealState(0);
        setAiMessage("");
      } else {
        onFinish();
      }
    } else {
      setRevealState(p => p + 1);
    }
  };

  const btnLabel = () => {
    if (isIlkokul) return revealState === 0 ? "Cevabı Gör! 🎉" : "Sıradaki Meslek ❯";
    if (isRevealed) return "Sıradaki Dosya ❯";
    if (revealState === 0) return "İlk İpucu ❯";
    if (revealState < totalSteps) return "Sonraki İpucu ❯";
    return "Bu Hangi Meslek? 🤔";
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", fontFamily: "system-ui, sans-serif", position: "relative" }}>

      {/* Üst bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: t.accent, fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.15em", opacity: 0.8 }}>{t.label}</span>
        <span style={{ color: t.subText, fontWeight: 600, fontSize: "0.85rem" }}>
          {currentIndex + 1} / {professionsDb.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", top: "3.5rem", left: "2rem", right: "2rem", height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: progress + "%", background: t.progressColor, borderRadius: "2px", transition: "width 0.6s ease", boxShadow: "0 0 8px " + t.progressColor }} />
      </div>

      {/* İçerik */}
      <div style={{ display: "flex", flexDirection: "row", gap: "1.5rem", width: "100%", maxWidth: "1100px", marginTop: "4rem", flexWrap: "wrap", justifyContent: "center" }}>

        {/* ANA KART */}
        <div style={{ flex: "1 1 560px", background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: "24px", padding: "2.5rem", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>

          {/* İLKOKUL */}
          {isIlkokul && (
            <div style={{ width: "100%" }}>
              <div style={{ fontSize: revealState === 0 ? "6rem" : "4rem", marginBottom: "1.5rem", transition: "all 0.5s", opacity: revealState === 0 ? 1 : 0.6, letterSpacing: "0.1em" }} className={revealState === 0 ? "animate-float" : ""}>
                {prof.emojis}
              </div>
              {revealState === 0 ? (
                <div>
                  <h2 style={{ fontSize: "2rem", fontWeight: 900, color: t.accent, marginBottom: "0.5rem" }}>Bu hangi meslek? 🤔</h2>
                  <p style={{ color: t.subText, fontSize: "1rem" }}>Emojiyi incele ve tahmin et!</p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <h2 style={{ fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 900, color: "#10b981", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{prof.name}</h2>
                  <p style={{ fontSize: "1.1rem", color: t.subText, marginBottom: "1.5rem", lineHeight: 1.7 }}>{prof.ilkokulDesc}</p>
                  <div style={{ background: "rgba(59,130,246,0.08)", border: "2px dashed rgba(59,130,246,0.3)", borderRadius: "16px", padding: "1.25rem" }}>
                    <p style={{ color: t.accent, fontWeight: 700, fontSize: "1rem", lineHeight: 1.6 }}>
                      ✍️ Kimler <strong>{prof.name}</strong> olmak istiyor?<br />Haydi akıllı tahtaya isimleri yazalım!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORTAOKUL & LİSE */}
          {!isIlkokul && (
            <div style={{ width: "100%", textAlign: "left" }}>
              <div style={{ display: "inline-block", border: "1px solid " + t.accent, color: t.accent, borderRadius: "20px", padding: "3px 14px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "1.5rem" }}>
                DOSYA #{currentIndex + 1}
              </div>

              {!isRevealed ? (
                <div style={{ minHeight: "220px" }}>
                  {revealState === 0 && (
                    <p style={{ color: t.subText, fontStyle: "italic", fontSize: "1rem", opacity: 0.6 }}>İpuçları bekleniyor... İlk ipucunu almak için butona bas.</p>
                  )}
                  {clues.map((clue, i) => revealState > i && (
                    <div key={i} className="animate-fade-in-left" style={{ borderLeft: "4px solid " + t.clueColors[i], background: "rgba(255,255,255,0.04)", borderRadius: "0 12px 12px 0", padding: "1rem 1.25rem", marginBottom: "1rem" }}>
                      <span style={{ color: t.clueColors[i], fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.1em", display: "block", marginBottom: "0.4rem" }}>
                        {i === 0 ? "1. İPUCU" : i === 1 ? "2. İPUCU" : "SON İPUCU"}
                      </span>
                      <span style={{ color: t.text, fontSize: "1.1rem", lineHeight: 1.6 }}>{clue}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-fade-in" style={{ textAlign: "center", width: "100%" }}>
                  <h2 style={{ fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1rem", background: "linear-gradient(135deg, " + t.clueColors[0] + ", " + t.clueColors[2] + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {prof.name}
                  </h2>
                  <p style={{ color: t.subText, fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>{prof.liseDesc}</p>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "1.25rem" }}>
                    <p style={{ color: t.accent, fontWeight: 700, fontSize: "1rem", lineHeight: 1.6 }}>
                      Hedefinde <strong>"{prof.name}"</strong> olanlar kimler?<br />Vizyonunu beyaz tahtaya yaz! 🚀
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* İlerleme Butonu */}
          <button
            onClick={handleNext}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              marginTop: "2rem",
              padding: "0.9rem 2.5rem",
              borderRadius: "50px",
              border: "none",
              background: btnHover ? t.btnBg : "transparent",
              color: btnHover ? "white" : t.accent,
              fontWeight: 800,
              fontSize: "1.1rem",
              cursor: "pointer",
              transition: "all 0.25s",
              boxShadow: btnHover ? "0 8px 30px " + t.btnGlow : "none",
              transform: btnHover ? "translateY(-2px)" : "translateY(0)",
              letterSpacing: "0.02em",
            }}
          >
            {btnLabel()}
          </button>
        </div>

        {/* AI ASİSTAN */}
        <div style={{ flex: "0 1 300px", background: t.cardBg, border: "1px solid " + t.cardBorder, borderRadius: "24px", padding: "1.75rem", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }} className="animate-float">🤖</div>
          <h3 style={{ color: t.aiAccent, fontWeight: 800, fontSize: "1.1rem", marginBottom: "0.25rem" }}>AI Asistan</h3>
          <p style={{ color: t.subText, fontSize: "0.8rem", marginBottom: "1.25rem" }}>Takıldığın yerde bana sor!</p>

          {/* Mesaj kutusu */}
          <div style={{ width: "100%", minHeight: "110px", background: t.aiBg, borderRadius: "16px", padding: "1rem", marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            {isAiLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", opacity: 0.7 }}>
                <span style={{ fontSize: "1.75rem" }}>🤔</span>
                <span style={{ color: t.subText, fontSize: "0.85rem" }}>Düşünüyor...</span>
              </div>
            ) : aiMessage ? (
              <p className="animate-fade-in" style={{ color: t.text, fontSize: "0.95rem", lineHeight: 1.65, fontWeight: 500 }}>{aiMessage}</p>
            ) : (
              <p style={{ color: t.subText, fontStyle: "italic", fontSize: "0.85rem", opacity: 0.6 }}>Yardıma ihtiyacın olduğunda butona bas.</p>
            )}
          </div>

          {/* AI Buton */}
          {!isRevealed ? (
            <button
              onClick={() => fetchAI("get-hint")}
              disabled={isAiLoading}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "none", background: isAiLoading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #7c3aed, #a855f7)", color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: isAiLoading ? "not-allowed" : "pointer", opacity: isAiLoading ? 0.5 : 1, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              💡 Yapay Zekadan İpucu İste
            </button>
          ) : (
            <button
              onClick={() => fetchAI("get-profession-details")}
              disabled={isAiLoading}
              style={{ width: "100%", padding: "0.75rem", borderRadius: "12px", border: "none", background: isAiLoading ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #059669, #10b981)", color: "white", fontWeight: 700, fontSize: "0.9rem", cursor: isAiLoading ? "not-allowed" : "pointer", opacity: isAiLoading ? 0.5 : 1, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              📖 Bu Meslek Ne İş Yapar?
            </button>
          )}

          {/* Mini progress */}
          <div style={{ marginTop: "1.5rem", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: t.subText, marginBottom: "0.4rem" }}>
              <span>İlerleme</span>
              <span>{currentIndex + 1}/{professionsDb.length}</span>
            </div>
            <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: ((currentIndex + 1) / professionsDb.length * 100) + "%", background: t.progressColor, borderRadius: "2px", transition: "width 0.5s ease" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
