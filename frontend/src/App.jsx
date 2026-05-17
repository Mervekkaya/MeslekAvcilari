// src/App.jsx
import React, { useState } from 'react';
import IntroCard from './IntroCard';
import GameScreen from './GameScreen';
import TeacherForm from './TeacherForm';
import Dashboard from './Dashboard';

export default function App() {
  // Uygulamanın hangi ekranda olduğunu takip eden state
  // 'intro' | 'game' | 'teacherForm' | 'dashboard'
  const [currentScreen, setCurrentScreen] = useState('intro');

  // Seçilen yaş grubunu takip eden state: 'ilkokul' | 'ortaokul' | 'lise'
  const [audience, setAudience] = useState(null);

  const startGame = (selectedAudience) => {
    setAudience(selectedAudience);
    setCurrentScreen('game');
  };

  const finishGame = () => {
    setCurrentScreen('teacherForm');
  };

  const resetApp = () => {
    setCurrentScreen('intro');
    setAudience(null);
  };

  const goToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-sans">
      {currentScreen === 'intro' && (
        <IntroCard onStart={startGame} onDashboard={goToDashboard} />
      )}

      {currentScreen === 'game' && (
        <GameScreen audience={audience} onFinish={finishGame} />
      )}

      {currentScreen === 'teacherForm' && (
        <TeacherForm audience={audience} onRestart={resetApp} />
      )}

      {currentScreen === 'dashboard' && (
        <Dashboard onBack={resetApp} />
      )}
    </div>
  );
}
