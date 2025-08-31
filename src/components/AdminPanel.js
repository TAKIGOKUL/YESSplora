import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Plus, Trash2, Users, LogOut, Eye, EyeOff } from 'lucide-react';
import { useGame } from '../context/GameContext';
import toast from 'react-hot-toast';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { state, actions } = useGame();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [newSpot, setNewSpot] = useState({
    name: '',
    description: '',
    task: '',
    latitude: '',
    longitude: '',
  });

  // Check if already logged in
  useEffect(() => {
    if (state.admin.isLoggedIn) {
      setIsLoggedIn(true);
    }
  }, [state.admin.isLoggedIn]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoginError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (loginData.username === 'yessplora25' && loginData.password === 'applejuice') {
        actions.setAdminState({ isLoggedIn: true });
        setIsLoggedIn(true);
        toast.success('Welcome, Admin! 🔐');
      } else {
        setLoginError('Invalid credentials');
        toast.error('Invalid username or password');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    actions.setAdminState({ isLoggedIn: false });
    setIsLoggedIn(false);
    setCurrentView('dashboard');
    toast.success('Logged out successfully');
  };

  // Handle adding new treasure spot
  const handleAddSpot = (e) => {
    e.preventDefault();
    
    if (!newSpot.name || !newSpot.latitude || !newSpot.longitude) {
      toast.error('Please fill in all required fields');
      return;
    }

    const spot = {
      name: newSpot.name,
      description: newSpot.description,
      task: newSpot.task,
      latitude: parseFloat(newSpot.latitude),
      longitude: parseFloat(newSpot.longitude),
      radius: 20, // 20 meter radius
    };

    actions.addTreasureSpot(spot);
    setNewSpot({
      name: '',
      description: '',
      task: '',
      latitude: '',
      longitude: '',
    });
    setCurrentView('dashboard');
  };

  // Handle removing treasure spot
  const handleRemoveSpot = (spotId) => {
    if (window.confirm('Are you sure you want to remove this treasure spot?')) {
      actions.removeTreasureSpot(spotId);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewSpot(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        toast.success('Location captured!');
      },
      (error) => {
        toast.error('Unable to get your location');
        console.error('Geolocation error:', error);
      }
    );
  };

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <motion.div
          className="login-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-header">
            <h1>Admin Access</h1>
            <p>Enter your credentials to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="form-input"
                placeholder="Enter username"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input"
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="error-message"
              >
                {loginError}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="login-btn"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <div className="btn-spinner"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          <button
            className="back-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Dashboard</h1>
          <p>Manage treasure hunt locations and monitor participants</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-sidebar">
          <nav className="admin-nav">
            <button
              className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <MapPin size={20} />
              Dashboard
            </button>
            <button
              className={`nav-item ${currentView === 'add-spot' ? 'active' : ''}`}
              onClick={() => setCurrentView('add-spot')}
            >
              <Plus size={20} />
              Add Location
            </button>
            <button
              className={`nav-item ${currentView === 'participants' ? 'active' : ''}`}
              onClick={() => setCurrentView('participants')}
            >
              <Users size={20} />
              Participants
            </button>
          </nav>
        </div>

        <div className="admin-main">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="dashboard-view"
              >
                <h2>Treasure Spots</h2>
                <div className="spots-grid">
                  {state.admin.treasureSpots.length === 0 ? (
                    <div className="empty-state">
                      <MapPin size={48} />
                      <h3>No treasure spots yet</h3>
                      <p>Add your first treasure spot to get started</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => setCurrentView('add-spot')}
                      >
                        Add First Spot
                      </button>
                    </div>
                  ) : (
                    state.admin.treasureSpots.map((spot) => (
                      <div key={spot.id} className="spot-card">
                        <div className="spot-header">
                          <h3>{spot.name}</h3>
                          <button
                            className="delete-btn"
                            onClick={() => handleRemoveSpot(spot.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="spot-description">{spot.description}</p>
                        <div className="spot-coordinates">
                          <span>📍 {spot.latitude.toFixed(6)}, {spot.longitude.toFixed(6)}</span>
                        </div>
                        <div className="spot-radius">
                          <span>🎯 {spot.radius}m radius</span>
                        </div>
                        {spot.task && (
                          <div className="spot-task">
                            <strong>Task:</strong> {spot.task}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {currentView === 'add-spot' && (
              <motion.div
                key="add-spot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="add-spot-view"
              >
                <h2>Add New Treasure Spot</h2>
                <form onSubmit={handleAddSpot} className="add-spot-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="spot-name" className="form-label">
                        Spot Name *
                      </label>
                      <input
                        type="text"
                        id="spot-name"
                        value={newSpot.name}
                        onChange={(e) => setNewSpot(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input"
                        placeholder="e.g., Main Entrance"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="spot-description" className="form-label">
                      Description
                    </label>
                    <textarea
                      id="spot-description"
                      value={newSpot.description}
                      onChange={(e) => setNewSpot(prev => ({ ...prev, description: e.target.value }))}
                      className="form-input"
                      placeholder="Describe this location..."
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="spot-task" className="form-label">
                      Task Description
                    </label>
                    <textarea
                      id="spot-task"
                      value={newSpot.task}
                      onChange={(e) => setNewSpot(prev => ({ ...prev, task: e.target.value }))}
                      className="form-input"
                      placeholder="What should participants do here?"
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="latitude" className="form-label">
                        Latitude *
                      </label>
                      <input
                        type="number"
                        id="latitude"
                        value={newSpot.latitude}
                        onChange={(e) => setNewSpot(prev => ({ ...prev, latitude: e.target.value }))}
                        className="form-input"
                        placeholder="e.g., 11.2588"
                        step="any"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="longitude" className="form-label">
                        Longitude *
                      </label>
                      <input
                        type="number"
                        id="longitude"
                        value={newSpot.longitude}
                        onChange={(e) => setNewSpot(prev => ({ ...prev, longitude: e.target.value }))}
                        className="form-input"
                        placeholder="e.g., 75.7804"
                        step="any"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={getCurrentLocation}
                    >
                      📍 Use Current Location
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Treasure Spot
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {currentView === 'participants' && (
              <motion.div
                key="participants"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="participants-view"
              >
                <h2>Participants</h2>
                <div className="participants-stats">
                  <div className="stat-card">
                    <h3>Total Participants</h3>
                    <p className="stat-number">0</p>
                  </div>
                  <div className="stat-card">
                    <h3>Active Now</h3>
                    <p className="stat-number">0</p>
                  </div>
                  <div className="stat-card">
                    <h3>Completed</h3>
                    <p className="stat-number">0</p>
                  </div>
                </div>
                <div className="empty-state">
                  <Users size={48} />
                  <h3>No participants yet</h3>
                  <p>Participants will appear here once they start the game</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

