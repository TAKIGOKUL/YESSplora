import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Target, Clock, Wifi, WifiOff } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './LocationTracker.css';

const LocationTracker = () => {
  const { state, actions } = useGame();
  const [mapCenter, setMapCenter] = useState({ lat: 11.2588, lng: 75.7804 }); // NIT Calicut coordinates
  const [zoom, setZoom] = useState(16);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update map center when user location changes
  useEffect(() => {
    if (state.game.currentLocation) {
      setMapCenter({
        lat: state.game.currentLocation.latitude,
        lng: state.game.currentLocation.longitude
      });
    }
  }, [state.game.currentLocation]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatDistance = (distance) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const getDistanceToSpot = (spot) => {
    if (!state.game.currentLocation) return null;
    
    const R = 6371e3; // Earth's radius in meters
    const φ1 = state.game.currentLocation.latitude * Math.PI / 180;
    const φ2 = spot.latitude * Math.PI / 180;
    const Δφ = (spot.latitude - state.game.currentLocation.latitude) * Math.PI / 180;
    const Δλ = (spot.longitude - state.game.currentLocation.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const getSpotStatus = (spot) => {
    const distance = getDistanceToSpot(spot);
    if (!distance) return 'unknown';
    
    if (distance <= 20) return 'active';
    if (distance <= 100) return 'nearby';
    return 'far';
  };

  return (
    <div className="location-tracker">
      <div className="map-header">
        <h2>Treasure Map</h2>
        <div className="connection-status">
          {isOnline ? (
            <Wifi size={16} className="online" />
          ) : (
            <WifiOff size={16} className="offline" />
          )}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div>

      {/* Current Location Info */}
      {state.game.currentLocation && (
        <motion.div
          className="current-location"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="location-header">
            <Navigation size={20} />
            <h3>Your Location</h3>
          </div>
          <div className="location-details">
            <div className="location-coords">
              <span className="coord-label">Latitude:</span>
              <span className="coord-value">{state.game.currentLocation.latitude.toFixed(6)}</span>
            </div>
            <div className="location-coords">
              <span className="coord-label">Longitude:</span>
              <span className="coord-value">{state.game.currentLocation.longitude.toFixed(6)}</span>
            </div>
            <div className="location-accuracy">
              <span className="accuracy-label">Accuracy:</span>
              <span className="accuracy-value">±{Math.round(state.game.currentLocation.accuracy)}m</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Simple Map Visualization */}
      <div className="map-container">
        <div className="map-placeholder">
          <div className="map-grid">
            {[...Array(10)].map((_, row) => (
              <div key={row} className="map-row">
                {[...Array(10)].map((_, col) => (
                  <div key={col} className="map-cell" />
                ))}
              </div>
            ))}
          </div>
          
          {/* User Location Marker */}
          {state.game.currentLocation && (
            <motion.div
              className="user-marker"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Navigation size={16} />
            </motion.div>
          )}
          
          {/* Treasure Spot Markers */}
          {state.admin.treasureSpots.map((spot, index) => {
            const distance = getDistanceToSpot(spot);
            const status = getSpotStatus(spot);
            
            return (
              <motion.div
                key={spot.id}
                className={`treasure-marker ${status}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                style={{
                  left: `${50 + (spot.longitude - mapCenter.lng) * 1000}%`,
                  top: `${50 - (spot.latitude - mapCenter.lat) * 1000}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Target size={14} />
                <div className="marker-label">{spot.name}</div>
                {distance && (
                  <div className="marker-distance">{formatDistance(distance)}</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Treasure Spots List */}
      <div className="treasure-spots-list">
        <h3>Treasure Spots</h3>
        {state.admin.treasureSpots.length === 0 ? (
          <div className="empty-state">
            <Target size={48} />
            <p>No treasure spots available yet</p>
            <p className="empty-subtitle">Admin needs to add treasure locations</p>
          </div>
        ) : (
          <div className="spots-grid">
            {state.admin.treasureSpots.map((spot) => {
              const distance = getDistanceToSpot(spot);
              const status = getSpotStatus(spot);
              
              return (
                <motion.div
                  key={spot.id}
                  className={`spot-card ${status}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="spot-header">
                    <div className="spot-icon">
                      <Target size={20} />
                    </div>
                    <div className="spot-status">
                      <span className={`status-badge ${status}`}>
                        {status === 'active' ? 'Active' : 
                         status === 'nearby' ? 'Nearby' : 'Far'}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="spot-name">{spot.name}</h4>
                  {spot.description && (
                    <p className="spot-description">{spot.description}</p>
                  )}
                  
                  <div className="spot-info">
                    <div className="spot-distance">
                      <MapPin size={14} />
                      {distance ? formatDistance(distance) : 'Unknown'}
                    </div>
                    <div className="spot-coords">
                      {spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}
                    </div>
                  </div>
                  
                  {status === 'active' && (
                    <div className="active-indicator">
                      <div className="pulse-ring"></div>
                      <span>You're in range!</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationTracker;

