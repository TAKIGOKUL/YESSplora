# YESSplora25 Deployment Guide - Main Branch Only

## 🚀 Deployment Strategy

**Main Branch Only** - No feature branches, no pull requests. All development and deployment happens directly on the main branch for simplicity and immediate deployment.

## 📋 Quick Deployment Steps

### 1. Ensure You're on Main Branch
```bash
git checkout main
git pull origin main
```

### 2. Deploy Using Script
```bash
./deploy.sh
```

### 3. Manual Deployment
```bash
npm run build
# Upload build/ folder to your hosting platform
```

## 🌐 Hosting Platform Setup

### Netlify (Recommended)
1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Branch Settings**: Set to deploy from `main` branch only
3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: 18
4. **Environment Variables**:
   - `REACT_APP_GOOGLE_SHEETS_API_KEY`
   - `REACT_APP_GOOGLE_SHEETS_ID`
5. **Custom Domain**: Set up HTTPS (required for camera/location)

### Vercel
1. **Import Project**: Connect GitHub repository
2. **Framework**: Create React App
3. **Root Directory**: Leave as default
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`
6. **Environment Variables**: Add in Vercel dashboard

### AWS S3 + CloudFront
1. **Create S3 Bucket**: Enable static website hosting
2. **Upload Build**: Upload contents of `build/` folder
3. **CloudFront**: Set up CDN with HTTPS
4. **Custom Domain**: Configure SSL certificate

### Firebase Hosting
1. **Install CLI**: `npm install -g firebase-tools`
2. **Initialize**: `firebase init hosting`
3. **Build**: `npm run build`
4. **Deploy**: `firebase deploy`

## 🔧 Environment Variables

Set these in your hosting platform:

```env
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_GOOGLE_SHEETS_ID=1_SVgTT2Fsv2AKGyUfPtQCJiHddvm7keC_yeDBDCEgAE
REACT_APP_APP_NAME=YESSplora25
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

## 📱 PWA Requirements

### HTTPS Required
- Camera access requires HTTPS
- Location access requires HTTPS
- Service worker requires HTTPS

### Headers Configuration
```nginx
# Service Worker
/sw.js: Cache-Control: public, max-age=0, must-revalidate

# Static Assets
/static/*: Cache-Control: public, max-age=31536000, immutable

# SPA Routing
/*: Fallback to /index.html
```

## 🎯 Main Branch Workflow

### Development Process
1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd YESSplora25
   ```

2. **Make Changes**
   - Edit files directly
   - Test locally with `npm start`

3. **Commit to Main**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

4. **Auto-Deploy**
   - Hosting platform automatically deploys from main
   - No manual deployment needed

### No Branching Strategy
- ❌ No feature branches
- ❌ No pull requests
- ❌ No merge conflicts
- ✅ Direct commits to main
- ✅ Immediate deployment
- ✅ Simple workflow

## 🔍 Testing Deployment

### Local Testing
```bash
npm start          # Development server
npm run build      # Production build
npx serve build    # Test production build locally
```

### Production Testing
1. **PWA Installation**: Test "Add to Home Screen"
2. **Camera Access**: Verify camera permissions
3. **Location Access**: Test GPS functionality
4. **Offline Mode**: Test service worker
5. **Mobile Experience**: Test on actual devices

## 🚨 Troubleshooting

### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Issues
- Check environment variables
- Verify HTTPS is enabled
- Ensure Node.js version compatibility
- Check build logs in hosting platform

### PWA Issues
- Verify service worker registration
- Check manifest.json
- Ensure HTTPS is working
- Test on mobile devices

## 📊 Monitoring

### Performance Metrics
- Page load times
- Bundle size (387KB gzipped)
- PWA installation rate
- User engagement metrics

### Error Tracking
- Console errors
- Network failures
- Camera/location permission issues
- Service worker errors

## 🎉 Success Checklist

- [ ] HTTPS enabled
- [ ] PWA installable
- [ ] Camera access working
- [ ] Location tracking functional
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] Offline capabilities
- [ ] Performance optimized

---

**Remember**: This project uses main branch only for simplicity and immediate deployment. All changes go directly to production! 🚀
