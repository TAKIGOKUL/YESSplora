import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, Target, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const { state } = useGame();
  
  const completedTasks = state.game.completedTasks.length;
  const totalTasks = 9;
  const progress = state.game.progress;

  // Mock task data - in a real app, this would come from the backend
  const allTasks = [
    { id: '1', name: 'Welcome Challenge', description: 'Find the main entrance', completed: completedTasks >= 1 },
    { id: '2', name: 'Tech Discovery', description: 'Locate the computer lab', completed: completedTasks >= 2 },
    { id: '3', name: 'Innovation Hub', description: 'Visit the innovation center', completed: completedTasks >= 3 },
    { id: '4', name: 'Library Quest', description: 'Find the central library', completed: completedTasks >= 4 },
    { id: '5', name: 'Cafeteria Code', description: 'Decode the cafeteria menu', completed: completedTasks >= 5 },
    { id: '6', name: 'Sports Arena', description: 'Reach the sports complex', completed: completedTasks >= 6 },
    { id: '7', name: 'Garden Mystery', description: 'Solve the garden puzzle', completed: completedTasks >= 7 },
    { id: '8', name: 'Auditorium Challenge', description: 'Complete the auditorium task', completed: completedTasks >= 8 },
    { id: '9', name: 'Final Boss', description: 'Face the ultimate challenge', completed: completedTasks >= 9 },
  ];

  const getAchievementLevel = () => {
    if (completedTasks === 0) return { level: 'Explorer', color: '#666', icon: Target };
    if (completedTasks < 3) return { level: 'Adventurer', color: '#0066ff', icon: Target };
    if (completedTasks < 6) return { level: 'Treasure Hunter', color: '#ff6600', icon: Trophy };
    if (completedTasks < 9) return { level: 'Master Explorer', color: '#E50914', icon: Award };
    return { level: 'YESSplora Champion', color: '#00ff00', icon: Trophy };
  };

  const achievement = getAchievementLevel();
  const AchievementIcon = achievement.icon;

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h2>Your Progress</h2>
        <div className="achievement-badge">
          <AchievementIcon size={24} style={{ color: achievement.color }} />
          <span style={{ color: achievement.color }}>{achievement.level}</span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="overall-progress">
        <div className="progress-stats">
          <div className="stat-item">
            <span className="stat-number">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{totalTasks - completedTasks}</span>
            <span className="stat-label">Remaining</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{Math.round(progress)}%</span>
            <span className="stat-label">Progress</span>
          </div>
        </div>
        
        <div className="progress-bar-large">
          <div 
            className="progress-fill-large"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-section">
        <h3>Treasure Tasks</h3>
        <div className="tasks-list">
          {allTasks.map((task, index) => (
            <motion.div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="task-number">
                {task.completed ? (
                  <CheckCircle size={20} className="task-check" />
                ) : (
                  <span className="task-number-text">{index + 1}</span>
                )}
              </div>
              
              <div className="task-content">
                <h4 className="task-name">{task.name}</h4>
                <p className="task-description">{task.description}</p>
              </div>
              
              <div className="task-status">
                {task.completed ? (
                  <span className="status-completed">Completed</span>
                ) : (
                  <span className="status-pending">Pending</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h3>Achievements</h3>
        <div className="achievements-grid">
          <div className={`achievement-item ${completedTasks >= 1 ? 'unlocked' : ''}`}>
            <Target size={24} />
            <span>First Steps</span>
          </div>
          <div className={`achievement-item ${completedTasks >= 3 ? 'unlocked' : ''}`}>
            <Trophy size={24} />
            <span>Getting Started</span>
          </div>
          <div className={`achievement-item ${completedTasks >= 6 ? 'unlocked' : ''}`}>
            <Award size={24} />
            <span>Halfway Hero</span>
          </div>
          <div className={`achievement-item ${completedTasks >= 9 ? 'unlocked' : ''}`}>
            <Trophy size={24} />
            <span>Champion</span>
          </div>
        </div>
      </div>

      {/* Completion Message */}
      {completedTasks === totalTasks && (
        <motion.div
          className="completion-celebration"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Trophy size={48} />
          <h3>Congratulations!</h3>
          <p>You've completed all treasure hunt tasks and become a YESSplora Champion!</p>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressTracker;

