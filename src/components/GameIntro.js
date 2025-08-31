import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Shield, Play, ArrowRight, CheckCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import toast from 'react-hot-toast';
import './GameIntro.css';

const GameIntro = () => {
  const navigate = useNavigate();
  const { state, actions } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
  });
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);

  const introSteps = [
    {
      title: "Welcome to YESSplora25!",
      content: "Get ready for an incredible AR-powered treasure hunt adventure across the IEEE YESS 2025 venue at NIT Calicut.",
      icon: "🎉",
      type: "welcome"
    },
    {
      title: "How It Works",
      content: "Explore the campus, discover hidden treasure spots, complete exciting tasks, and unlock achievements as you progress through your adventure.",
      icon: "🗺️",
      type: "explanation"
    },
    {
      title: "Your Mission",
      content: "Find 9 treasure spots scattered across the venue. Each spot contains a unique task that will test your skills and creativity. Complete them all to become the ultimate YESSplora champion!",
      icon: "🎯",
      type: "mission"
    },
    {
      title: "Permissions Required",
      content: "To provide you with the best AR experience, we need access to your camera and location. Don't worry - your privacy is our priority!",
      icon: "🔒",
      type: "permissions"
    }
  ];

  const gameRules = [
    "Use your camera to scan QR codes and complete tasks",
    "Stay within the 20-meter radius of treasure spots to activate them",
    "Complete tasks in any order you prefer",
    "Take photos and videos as part of your challenges",
    "Ask volunteers for help if you get stuck",
    "Have fun and explore the amazing NIT Calicut campus!"
  ];

  // Check if user is authenticated
  useEffect(() => {
    if (!state.user.isAuthenticated) {
      navigate('/');
    }
  }, [state.user.isAuthenticated, navigate]);

  // Request permissions
  const requestPermissions = async () => {
    setIsRequestingPermissions(true);
    
    try {
      // Request camera permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
          setPermissions(prev => ({ ...prev, camera: true }));
          toast.success('Camera permission granted! 📸');
        } catch (error) {
          console.error('Camera permission denied:', error);
          toast.error('Camera permission is required for AR features');
        }
      }

      // Request location permission
      if (navigator.geolocation) {
        try {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setPermissions(prev => ({ ...prev, location: true }));
                toast.success('Location permission granted! 📍');
                resolve(position);
              },
              (error) => {
                console.error('Location permission denied:', error);
                toast.error('Location permission is required for treasure hunting');
                reject(error);
              },
              { timeout: 10000 }
            );
          });
        } catch (error) {
          console.error('Location error:', error);
        }
      }

      // Save permissions to context
      actions.setPermissions(permissions);
      
    } catch (error) {
      console.error('Permission request failed:', error);
      toast.error('Failed to request permissions');
    } finally {
      setIsRequestingPermissions(false);
    }
  };

  // Start the game
  const startGame = () => {
    if (!permissions.camera || !permissions.location) {
      toast.error('Please grant all required permissions to continue');
      return;
    }

    actions.setGameState({ isStarted: true });
    toast.success('Game started! Good luck on your adventure! 🚀');
    navigate('/game');
  };

  // Next step
  const nextStep = () => {
    if (currentStep < introSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Skip intro
  const skipIntro = () => {
    if (permissions.camera && permissions.location) {
      startGame();
    } else {
      requestPermissions();
    }
  };

  const currentStepData = introSteps[currentStep];

  return (
    <div className="game-intro">
      <div className="intro-container">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / introSteps.length) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            className="step-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="step-icon">
              {currentStepData.icon}
            </div>
            
            <h1 className="step-title">
              {currentStepData.title}
            </h1>
            
            <p className="step-description">
              {currentStepData.content}
            </p>

            {/* Special content for different step types */}
            {currentStepData.type === 'explanation' && (
              <motion.div
                className="rules-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3>Game Rules</h3>
                <ul className="rules-list">
                  {gameRules.map((rule, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <CheckCircle size={16} />
                      {rule}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {currentStepData.type === 'permissions' && (
              <motion.div
                className="permissions-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="permission-item">
                  <Camera size={24} />
                  <div>
                    <h4>Camera Access</h4>
                    <p>Required for AR features and QR code scanning</p>
                    {permissions.camera && <CheckCircle size={20} className="permission-granted" />}
                  </div>
                </div>
                
                <div className="permission-item">
                  <MapPin size={24} />
                  <div>
                    <h4>Location Access</h4>
                    <p>Required for geofencing and treasure spot detection</p>
                    {permissions.location && <CheckCircle size={20} className="permission-granted" />}
                  </div>
                </div>
                
                <div className="permission-item">
                  <Shield size={24} />
                  <div>
                    <h4>Privacy Protection</h4>
                    <p>Your data is encrypted and never shared with third parties</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="intro-navigation">
          <div className="nav-buttons">
            {currentStep > 0 && (
              <motion.button
                className="nav-btn secondary"
                onClick={prevStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Previous
              </motion.button>
            )}
            
            <div className="nav-spacer" />
            
            {currentStep < introSteps.length - 1 ? (
              <motion.button
                className="nav-btn primary"
                onClick={nextStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next <ArrowRight size={20} />
              </motion.button>
            ) : (
              <motion.button
                className="nav-btn primary start-game"
                onClick={permissions.camera && permissions.location ? startGame : requestPermissions}
                disabled={isRequestingPermissions}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isRequestingPermissions ? (
                  <>
                    <div className="btn-spinner"></div>
                    Requesting Permissions...
                  </>
                ) : permissions.camera && permissions.location ? (
                  <>
                    <Play size={20} />
                    Start Adventure!
                  </>
                ) : (
                  <>
                    Grant Permissions
                  </>
                )}
              </motion.button>
            )}
          </div>
          
          <button
            className="skip-btn"
            onClick={skipIntro}
          >
            Skip Introduction
          </button>
        </div>

        {/* User Info */}
        <div className="user-info">
          <p>Welcome, <strong>{state.user.name}</strong>!</p>
          <p className="ticket-id">Ticket: {state.user.ticketId}</p>
        </div>
      </div>
    </div>
  );
};

export default GameIntro;

