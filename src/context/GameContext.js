import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const GameContext = createContext();

// Initial state
const initialState = {
  user: {
    name: '',
    ticketId: '',
    isAuthenticated: false,
  },
  game: {
    isStarted: false,
    currentTask: null,
    completedTasks: [],
    currentLocation: null,
    nearbySpots: [],
    progress: 0,
  },
  admin: {
    isLoggedIn: false,
    treasureSpots: [],
    participants: [],
  },
  permissions: {
    camera: false,
    location: false,
  },
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    notificationsEnabled: true,
  },
};

// Action types
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_ADMIN_STATE: 'SET_ADMIN_STATE',
  SET_PERMISSIONS: 'SET_PERMISSIONS',
  SET_SETTINGS: 'SET_SETTINGS',
  UPDATE_LOCATION: 'UPDATE_LOCATION',
  COMPLETE_TASK: 'COMPLETE_TASK',
  ADD_TREASURE_SPOT: 'ADD_TREASURE_SPOT',
  REMOVE_TREASURE_SPOT: 'REMOVE_TREASURE_SPOT',
  RESET_GAME: 'RESET_GAME',
};

// Reducer
function gameReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    case ActionTypes.SET_GAME_STATE:
      return {
        ...state,
        game: { ...state.game, ...action.payload },
      };
    
    case ActionTypes.SET_ADMIN_STATE:
      return {
        ...state,
        admin: { ...state.admin, ...action.payload },
      };
    
    case ActionTypes.SET_PERMISSIONS:
      return {
        ...state,
        permissions: { ...state.permissions, ...action.payload },
      };
    
    case ActionTypes.SET_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    case ActionTypes.UPDATE_LOCATION:
      return {
        ...state,
        game: {
          ...state.game,
          currentLocation: action.payload.location,
          nearbySpots: action.payload.nearbySpots || [],
        },
      };
    
    case ActionTypes.COMPLETE_TASK:
      const completedTasks = [...state.game.completedTasks, action.payload];
      const progress = (completedTasks.length / 9) * 100; // Assuming 9 total tasks
      return {
        ...state,
        game: {
          ...state.game,
          completedTasks,
          progress,
          currentTask: null,
        },
      };
    
    case ActionTypes.ADD_TREASURE_SPOT:
      return {
        ...state,
        admin: {
          ...state.admin,
          treasureSpots: [...state.admin.treasureSpots, action.payload],
        },
      };
    
    case ActionTypes.REMOVE_TREASURE_SPOT:
      return {
        ...state,
        admin: {
          ...state.admin,
          treasureSpots: state.admin.treasureSpots.filter(
            spot => spot.id !== action.payload
          ),
        },
      };
    
    case ActionTypes.RESET_GAME:
      return {
        ...initialState,
        user: state.user, // Keep user data
        admin: state.admin, // Keep admin data
      };
    
    default:
      return state;
  }
}

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load saved state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('yessplora25-game-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: ActionTypes.SET_USER, payload: parsedState.user });
        dispatch({ type: ActionTypes.SET_GAME_STATE, payload: parsedState.game });
        dispatch({ type: ActionTypes.SET_SETTINGS, payload: parsedState.settings });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    const stateToSave = {
      user: state.user,
      game: state.game,
      settings: state.settings,
    };
    localStorage.setItem('yessplora25-game-state', JSON.stringify(stateToSave));
  }, [state.user, state.game, state.settings]);

  // Actions
  const actions = {
    setUser: (userData) => {
      dispatch({ type: ActionTypes.SET_USER, payload: userData });
    },

    setGameState: (gameData) => {
      dispatch({ type: ActionTypes.SET_GAME_STATE, payload: gameData });
    },

    setAdminState: (adminData) => {
      dispatch({ type: ActionTypes.SET_ADMIN_STATE, payload: adminData });
    },

    setPermissions: (permissions) => {
      dispatch({ type: ActionTypes.SET_PERMISSIONS, payload: permissions });
    },

    setSettings: (settings) => {
      dispatch({ type: ActionTypes.SET_SETTINGS, payload: settings });
    },

    updateLocation: (location, nearbySpots = []) => {
      dispatch({ 
        type: ActionTypes.UPDATE_LOCATION, 
        payload: { location, nearbySpots } 
      });
    },

    completeTask: (taskId) => {
      dispatch({ type: ActionTypes.COMPLETE_TASK, payload: taskId });
      toast.success('Task completed! 🎉');
    },

    addTreasureSpot: (spot) => {
      const newSpot = {
        ...spot,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: ActionTypes.ADD_TREASURE_SPOT, payload: newSpot });
      toast.success('Treasure spot added!');
    },

    removeTreasureSpot: (spotId) => {
      dispatch({ type: ActionTypes.REMOVE_TREASURE_SPOT, payload: spotId });
      toast.success('Treasure spot removed');
    },

    resetGame: () => {
      dispatch({ type: ActionTypes.RESET_GAME });
      toast.success('Game reset successfully');
    },

    // Utility functions
    isNearTreasureSpot: (userLocation, spot, radius = 20) => {
      if (!userLocation || !spot) return false;
      
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude,
        spot.longitude
      );
      
      return distance <= radius;
    },

    getNearbySpots: (userLocation, spots, radius = 20) => {
      if (!userLocation || !spots.length) return [];
      
      return spots.filter(spot => 
        actions.isNearTreasureSpot(userLocation, spot, radius)
      );
    },
  };

  // Helper function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const value = {
    state,
    actions,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook to use the game context
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;

