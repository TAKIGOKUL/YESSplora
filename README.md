# YESSplora25 - AR Treasure Hunt Web Application

A sophisticated, smooth, and elegant web application for IEEE YESS 2025 at NIT Calicut. The app combines AR technology with geofencing to deliver an immersive treasure hunt experience across the campus venue.

## 🚀 Features

### Core Features
- **3D Interactive Robot**: Animated robot model with smooth interactions
- **AR Camera Integration**: Full-screen camera with overlay UI for treasure hunting
- **Geofencing System**: 20-meter radius detection around admin-set treasure spots
- **QR Code Scanner**: Integrated camera scanner for volunteer verification
- **Progressive Web App (PWA)**: Installable on mobile devices with offline capabilities
- **Real-time Location Tracking**: High-precision GPS with battery optimization
- **Admin Panel**: Location management and participant tracking dashboard

### User Experience
- **Smooth Animations**: Buttery smooth transitions with easing curves
- **Modern Aesthetics**: Glass morphism effects, subtle shadows, and contemporary UI
- **Mobile-First Design**: Responsive design optimized for mobile devices
- **Dark Theme**: Elegant dark color scheme with red accents
- **Accessibility**: High contrast ratios, touch-friendly targets, semantic HTML

## 🎨 Design System

### Color Palette
- **Primary Red**: `#E50914` (buttons, highlights, accents)
- **Deep Red Gradient**: `#8B0000` (hover states, secondary accents)
- **Background**: `#0A0A0A` (primary dark background)
- **Surface Cards**: `#1C1C1C` (content containers)
- **Text Primary**: `#FFFFFF` (main text)
- **Text Secondary**: `#B0B0B0` (muted labels)
- **Borders**: `#2A2A2A` (subtle divisions)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Responsive Sizing**: Fluid typography with clamp() functions
- **Weight Scale**: 300, 400, 500, 600, 700

## 🛠️ Technology Stack

### Frontend
- **React 18**: Component-based architecture with hooks
- **Three.js**: 3D robot model and animations
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing
- **CSS3**: Custom properties, Grid, Flexbox, animations

### 3D Graphics
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for Three.js

### Camera & AR
- **WebRTC**: Camera access and video streaming
- **jsQR**: QR code detection and scanning
- **Geolocation API**: Precise location tracking

### State Management
- **React Context**: Global state management
- **Local Storage**: Persistent user data

### PWA Features
- **Service Worker**: Offline capabilities
- **Web App Manifest**: Installable app experience
- **Responsive Design**: Mobile-optimized interface

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with camera and location access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd YESSplora25
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
   REACT_APP_GOOGLE_SHEETS_ID=1_SVgTT2Fsv2AKGyUfPtQCJiHddvm7keC_yeDBDCEgAE
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎮 Usage

### For Participants
1. **Access the App**: Open in mobile browser or install as PWA
2. **Enter Details**: Provide name and YESS Ticket ID
3. **Grant Permissions**: Allow camera and location access
4. **Start Hunting**: Use AR camera to find treasure spots
5. **Complete Tasks**: Follow instructions and scan QR codes
6. **Track Progress**: Monitor completion status and achievements

### For Administrators
1. **Admin Access**: Click the gear icon (⚙️) on landing page
2. **Login**: Use credentials `yessplora25` / `applejuice`
3. **Set Locations**: Click anywhere on map to add treasure spots
4. **Manage Spots**: Add descriptions, tasks, and 20m radius zones
5. **Monitor Progress**: View real-time participant tracking

## 🗺️ Game Flow

### 1. Landing Page
- 3D interactive robot with wave animations
- User registration form with validation
- Hidden admin access button

### 2. Game Introduction
- Animated welcome sequence
- Permission requests (camera, location)
- Game rules and instructions

### 3. Main Game Interface
- AR camera view with overlay UI
- Geofencing detection with visual feedback
- Task modal popups with completion tracking
- Progress monitoring and achievements

### 4. Task System
- 9 treasure spots across campus
- Location-based activation (20m radius)
- QR code scanning for verification
- Photo challenges and interactive tasks

## 🔧 Configuration

### Admin Settings
- **Default Credentials**: `yessplora25` / `applejuice`
- **Treasure Radius**: 20 meters (configurable)
- **Total Tasks**: 9 (configurable)
- **Location Accuracy**: High precision GPS

### PWA Configuration
- **Display Mode**: Standalone
- **Orientation**: Portrait primary
- **Theme Color**: `#E50914`
- **Background Color**: `#0A0A0A`

## 📊 Data Management

### Google Sheets Integration
- **Spreadsheet ID**: `1_SVgTT2Fsv2AKGyUfPtQCJiHddvm7keC_yeDBDCEgAE`
- **Columns**: User Name, Ticket ID, Tasks 1-9, Boss Level, Bonus Level, Completed, Time
- **Real-time Sync**: Automatic data synchronization
- **Privacy**: Encrypted data transmission

### Local Storage
- User authentication state
- Game progress and completed tasks
- App settings and preferences
- Offline data caching

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Hosting Options
- **Netlify**: Drag and drop build folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload build files to bucket
- **Firebase Hosting**: Deploy with Firebase CLI

### Environment Variables
Set the following in your hosting platform:
- `REACT_APP_GOOGLE_SHEETS_API_KEY`
- `REACT_APP_GOOGLE_SHEETS_ID`

## 🔒 Security & Privacy

### Data Protection
- **Location Encryption**: All location data encrypted in transit
- **User Consent**: Clear permission requests with explanations
- **Data Minimization**: Only necessary data collected
- **GDPR Compliance**: Privacy-first approach

### Admin Security
- **Secure Authentication**: Protected admin panel access
- **Session Management**: Secure session handling
- **Input Validation**: All user inputs validated and sanitized

## 📱 Mobile Optimization

### Performance
- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Optimized bundle sizes
- **Image Optimization**: Compressed assets
- **Battery Optimization**: Efficient location tracking

### User Experience
- **Touch Gestures**: Optimized for mobile interaction
- **Responsive Design**: Adapts to all screen sizes
- **Fast Loading**: Optimized for slow connections
- **Offline Support**: Core features work offline

## 🎯 Success Metrics

### Engagement
- User session duration
- Task completion rates
- Feature usage analytics
- User retention metrics

### Performance
- Page load times
- Animation frame rates
- Battery usage optimization
- Network efficiency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- IEEE YESS 2025 organizing committee
- NIT Calicut for hosting the event
- Three.js community for 3D graphics
- React community for the amazing framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**YESSplora25** - Where technology meets adventure! 🚀✨

