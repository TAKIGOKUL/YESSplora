import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Camera, MapPin, Trophy } from 'lucide-react';
import './TaskModal.css';

const TaskModal = ({ task, onComplete, onClose }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  if (!task) return null;

  const handleComplete = async () => {
    setIsCompleting(true);
    
    // Simulate task completion process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowCompletion(true);
    
    // Show completion animation for a moment
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const getTaskIcon = (taskType) => {
    switch (taskType) {
      case 'photo':
        return <Camera size={24} />;
      case 'location':
        return <MapPin size={24} />;
      case 'qr':
        return <CheckCircle size={24} />;
      default:
        return <Trophy size={24} />;
    }
  };

  const getTaskTypeColor = (taskType) => {
    switch (taskType) {
      case 'photo':
        return '#00ff00';
      case 'location':
        return '#0066ff';
      case 'qr':
        return '#ff6600';
      default:
        return '#E50914';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="task-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="task-modal"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="task-icon">
              {getTaskIcon(task.type || 'default')}
            </div>
            <div className="task-info">
              <h2 className="task-title">{task.name}</h2>
              <div className="task-meta">
                <span className="task-type" style={{ color: getTaskTypeColor(task.type || 'default') }}>
                  {task.type || 'Treasure Task'}
                </span>
                <span className="task-location">
                  <MapPin size={14} />
                  {task.latitude?.toFixed(4)}, {task.longitude?.toFixed(4)}
                </span>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="modal-content">
            {task.description && (
              <div className="task-description">
                <h3>Description</h3>
                <p>{task.description}</p>
              </div>
            )}

            {task.task && (
              <div className="task-instructions">
                <h3>Instructions</h3>
                <p>{task.task}</p>
              </div>
            )}

            {/* Task-specific content */}
            {task.type === 'photo' && (
              <div className="task-requirements">
                <h3>Photo Requirements</h3>
                <ul>
                  <li>Take a clear photo of the specified object</li>
                  <li>Ensure good lighting and focus</li>
                  <li>Include yourself in the photo if required</li>
                </ul>
              </div>
            )}

            {task.type === 'qr' && (
              <div className="task-requirements">
                <h3>QR Code Scan</h3>
                <ul>
                  <li>Use the QR scanner to scan the code</li>
                  <li>Ensure the code is clearly visible</li>
                  <li>Hold steady until scan is complete</li>
                </ul>
              </div>
            )}

            {task.type === 'location' && (
              <div className="task-requirements">
                <h3>Location Check</h3>
                <ul>
                  <li>You are currently at the correct location</li>
                  <li>Stay within the 20-meter radius</li>
                  <li>Complete the task to proceed</li>
                </ul>
              </div>
            )}

            {/* Completion Animation */}
            <AnimatePresence>
              {showCompletion && (
                <motion.div
                  className="completion-animation"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                >
                  <div className="completion-icon">
                    <CheckCircle size={48} />
                  </div>
                  <h3>Task Completed!</h3>
                  <p>Great job! You've successfully completed this treasure task.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          {!showCompletion && (
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn btn-primary complete-btn"
                onClick={handleComplete}
                disabled={isCompleting}
              >
                {isCompleting ? (
                  <>
                    <div className="btn-spinner"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Complete Task
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;

