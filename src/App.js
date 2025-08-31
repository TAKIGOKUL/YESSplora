import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import GameIntro from './components/GameIntro';
import MainGame from './components/MainGame';
import { GameProvider } from './context/GameContext';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if app is running as PWA
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator.standalone);
      
      setIsPWA(isStandalone || (isIOS && isInStandaloneMode));
    };

    checkPWA();

    // Simulate loading time for smooth experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <h1>YESSplora25</h1>
            <div className="loading-spinner"></div>
          </div>
          <p className="loading-text">Preparing your AR adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/intro" element={<GameIntro />} />
            <Route path="/game" element={<MainGame />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Global Toast Notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1C1C1C',
                color: '#FFFFFF',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#E50914',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#E50914',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
        </div>
      </Router>
    </GameProvider>
  );
}

export default App;

