import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import RobotModel from './3D/RobotModel';
import PWAInstallPrompt from './PWAInstallPrompt';
import { useGame } from '../context/GameContext';
import toast from 'react-hot-toast';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { actions } = useGame();
  const [formData, setFormData] = useState({
    name: '',
    ticketId: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showAdminAccess, setShowAdminAccess] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.ticketId.trim()) {
      newErrors.ticketId = 'YESS Ticket ID is required';
    } else if (!/^[A-Z0-9]{6,12}$/i.test(formData.ticketId.trim())) {
      newErrors.ticketId = 'Please enter a valid YESS Ticket ID';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save user data
      actions.setUser({
        name: formData.name.trim(),
        ticketId: formData.ticketId.trim().toUpperCase(),
        isAuthenticated: true,
      });
      
      toast.success(`Welcome, ${formData.name}! 🎉`);
      
      // Navigate to game intro
      navigate('/intro');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle admin access
  const handleAdminAccess = () => {
    navigate('/admin');
  };

  // Check for PWA install prompt
  useEffect(() => {
    // let deferredPrompt;
    
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      // deferredPrompt = e;
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="landing-page">
      {/* Background Effects */}
      <div className="background-effects">
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="landing-content">
        {/* Header */}
        <motion.header 
          className="landing-header"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="landing-title">
            <span className="title-main">YESSplora</span>
            <span className="title-year">25</span>
          </h1>
          <p className="landing-subtitle">
            Embark on an AR-powered treasure hunt adventure at IEEE YESS 2025
          </p>
        </motion.header>

        {/* 3D Robot Section */}
        <motion.div 
          className="robot-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          <div className="robot-container">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              style={{ width: '100%', height: '400px' }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} color="#E50914" intensity={0.5} />
              
              <RobotModel />
              
              <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                minDistance={3}
                maxDistance={8}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
              
              <Environment preset="night" />
              <ContactShadows
                rotation-x={Math.PI / 2}
                position={[0, -2, 0]}
                opacity={0.25}
                width={10}
                height={10}
                blur={1.5}
                far={2}
              />
            </Canvas>
            
            <div className="robot-instructions">
              <p>👆 Drag to rotate • Pinch to zoom • Watch me wave!</p>
            </div>
          </div>
        </motion.div>

        {/* User Input Form */}
        <motion.div 
          className="form-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="form-container">
            <h2 className="form-title">Join the Adventure</h2>
            <p className="form-subtitle">
              Enter your details to begin your treasure hunt journey
            </p>
            
            <form onSubmit={handleSubmit} className="user-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="error-message"
                    >
                      {errors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="form-group">
                <label htmlFor="ticketId" className="form-label">
                  YESS Ticket ID *
                </label>
                <input
                  type="text"
                  id="ticketId"
                  name="ticketId"
                  value={formData.ticketId}
                  onChange={handleInputChange}
                  className={`form-input ${errors.ticketId ? 'error' : ''}`}
                  placeholder="Enter your YESS ticket ID"
                  disabled={isSubmitting}
                />
                <AnimatePresence>
                  {errors.ticketId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="error-message"
                    >
                      {errors.ticketId}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    Starting Adventure...
                  </>
                ) : (
                  <>
                    🚀 Start Your Adventure
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Admin Access */}
        <motion.button
          className="admin-access-btn"
          onClick={handleAdminAccess}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ⚙️
        </motion.button>
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default LandingPage;

