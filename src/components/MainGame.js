import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Trophy, Settings, Home, QrCode, Target } from 'lucide-react';
import { useGame } from '../context/GameContext';
import ARCamera from './ARCamera';
import TaskModal from './TaskModal';
import ProgressTracker from './ProgressTracker';
import LocationTracker from './LocationTracker';
import QRScanner from './QRScanner';
import toast from 'react-hot-toast';
import './MainGame.css';

const MainGame = () => {
  const navigate = useNavigate();
  const { state, actions } = useGame();
  const [currentView, setCurrentView] = useState('camera');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isNearTreasure, setIsNearTreasure] = useState(false);
  const [nearbySpot, setNearbySpot] = useState(null);

  // Check if user is authenticated and game is started
  useEffect(() => {
    if (!state.user.isAuthenticated) {
      navigate('/');
      return;
    }
    if (!state.game.isStarted) {
      navigate('/intro');
      return;
    }
  }, [state.user.isAuthenticated, state.game.isStarted, navigate]);

  // Location tracking effect
  useEffect(() => {
    if (!state.permissions.location) {
      setLocationError('Location permission not granted');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        actions.updateLocation(userLocation);

        // Check if user is near any treasure spots
        const nearbySpots = actions.getNearbySpots(userLocation, state.admin.treasureSpots, 20);
        
        if (nearbySpots.length > 0 && !isNearTreasure) {
          setIsNearTreasure(true);
          setNearbySpot(nearbySpots[0]);
          setCurrentTask(nearbySpots[0]);
          setShowTaskModal(true);
          toast.success(`🎯 Treasure spot detected: ${nearbySpots[0].name}!`);
        } else if (nearbySpots.length === 0 && isNearTreasure) {
          setIsNearTreasure(false);
          setNearbySpot(null);
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError('Unable to get your location');
        toast.error('Location tracking failed');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [state.permissions.location, state.admin.treasureSpots, actions, isNearTreasure]);

  // Handle task completion
  const handleTaskComplete = (taskId) => {
    actions.completeTask(taskId);
    setShowTaskModal(false);
    setCurrentTask(null);
    toast.success('Task completed! 🎉');
  };

  // Handle QR scan
  const handleQRScan = (data) => {
    // Process QR code data
    console.log('QR Code scanned:', data);
    toast.success('QR Code scanned successfully!');
    setShowQRScanner(false);
    
    // Here you would typically validate the QR code and complete a task
    // For now, we'll just show a success message
  };

  // Navigation handlers
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSettings = () => {
    // Open settings modal or navigate to settings
    toast.info('Settings coming soon!');
  };

  // Calculate progress
  const progress = state.game.progress;
  const completedTasks = state.game.completedTasks.length;
  const totalTasks = 9; // Assuming 9 total tasks

  return (
    <div className="main-game">
      {/* Header */}
      <div className="game-header">
        <div className="header-left">
          <button className="header-btn" onClick={handleGoHome}>
            <Home size={20} />
          </button>
          <div className="user-info">
            <span className="user-name">{state.user.name}</span>
            <span className="user-ticket">{state.user.ticketId}</span>
          </div>
        </div>
        
        <div className="header-center">
          <h1 className="game-title">YESSplora25</h1>
        </div>
        
        <div className="header-right">
          <button className="header-btn" onClick={handleSettings}>
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-info">
          <span className="progress-text">
            {completedTasks} of {totalTasks} tasks completed
          </span>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="game-content">
        <AnimatePresence mode="wait">
          {currentView === 'camera' && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="camera-view"
            >
              <ARCamera />
              
              {/* AR Overlay */}
              <div className="ar-overlay">
                {isNearTreasure && nearbySpot && (
                  <motion.div
                    className="treasure-indicator"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="treasure-pulse"></div>
                    <div className="treasure-icon">🎯</div>
                    <div className="treasure-text">{nearbySpot.name}</div>
                  </motion.div>
                )}
                
                {locationError && (
                  <div className="location-error">
                    <MapPin size={16} />
                    {locationError}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="map-view"
            >
              <LocationTracker />
            </motion.div>
          )}

          {currentView === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="progress-view"
            >
              <ProgressTracker />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <button
          className={`nav-item ${currentView === 'camera' ? 'active' : ''}`}
          onClick={() => handleViewChange('camera')}
        >
          <Camera size={24} />
          <span>Camera</span>
        </button>
        
        <button
          className={`nav-item ${currentView === 'map' ? 'active' : ''}`}
          onClick={() => handleViewChange('map')}
        >
          <MapPin size={24} />
          <span>Map</span>
        </button>
        
        <button
          className="nav-item qr-scanner"
          onClick={() => setShowQRScanner(true)}
        >
          <QrCode size={24} />
          <span>Scan QR</span>
        </button>
        
        <button
          className={`nav-item ${currentView === 'progress' ? 'active' : ''}`}
          onClick={() => handleViewChange('progress')}
        >
          <Trophy size={24} />
          <span>Progress</span>
        </button>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && currentTask && (
          <TaskModal
            task={currentTask}
            onComplete={() => handleTaskComplete(currentTask.id)}
            onClose={() => setShowTaskModal(false)}
          />
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowQRScanner(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainGame;

