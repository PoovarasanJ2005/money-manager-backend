# Money Manager - Deployment Guide

This guide will help you deploy both the frontend and backend of the Money Manager application.

## Prerequisites

- GitHub account
- MongoDB Atlas account (for database)
- Vercel/Netlify account (for frontend)
- Render/Railway/Heroku account (for backend)

## Backend Deployment

### Option 1: Deploy to Render

1. **Prepare your backend**:
   - Ensure all code is committed to GitHub
   - Repository: `money-manager-backend`

2. **Create MongoDB Atlas Database**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Create a database user
   - Whitelist all IPs (0.0.0.0/0) for development
   - Get your connection string

3. **Deploy on Render**:
   - Go to [Render](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `money-manager-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add Environment Variables:
     ```
     PORT=5000
     MONGODB_URI=your-mongodb-atlas-connection-string
     JWT_SECRET=your-super-secret-jwt-key
     NODE_ENV=production
     ```
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://money-manager-api.onrender.com`)

### Option 2: Deploy to Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `money-manager-backend`
4. Add environment variables (same as above)
5. Deploy

## Frontend Deployment

### Option 1: Deploy to Vercel

1. **Update Environment Variables**:
   - Edit `.env` in frontend:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```

2. **Deploy on Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your `money-manager-frontend` repository
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Click "Deploy"
   - Wait for deployment
   - Your app will be live at `https://your-app.vercel.app`

### Option 2: Deploy to Netlify

1. **Build the project locally**:
   ```bash
   cd money-manager-frontend
   npm run build
   ```

2. **Deploy on Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect GitHub repository
   - Add environment variables in Site Settings
   - Deploy

## Post-Deployment Steps

### 1. Update CORS Settings

In your backend `server.js`, update CORS to allow your frontend domain:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

### 2. Test the Application

1. Visit your frontend URL
2. Register a new account
3. Add some transactions
4. Test all features:
   - Dashboard charts
   - Transaction filtering
   - Edit/delete within 12 hours
   - Category management

### 3. MongoDB Atlas Security

1. Create a dedicated database user for production
2. Use strong passwords
3. Limit IP whitelist to your backend server IP (if possible)
4. Enable MongoDB encryption at rest

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/money-manager
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## Submission Checklist

Create a text file with the following information:

```
Money Manager Application - Submission

Frontend:
- GitHub Repository: https://github.com/yourusername/money-manager-frontend
- Live URL: https://your-app.vercel.app
- Last Commit Hash: abc123def456

Backend:
- GitHub Repository: https://github.com/yourusername/money-manager-backend
- Live URL: https://your-api.onrender.com
- Last Commit Hash: xyz789uvw012

Database:
- MongoDB Atlas Cluster: [cluster-name]

Notes:
- All features implemented and tested
- Responsive design works on mobile, tablet, and desktop
- 12-hour edit restriction working correctly
```

## Getting Last Commit Hash

```bash
# In each repository
git log -1 --format="%H"
```

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Failed**:
   - Check connection string
   - Verify IP whitelist
   - Check database user credentials

2. **API Not Responding**:
   - Check Render/Railway logs
   - Verify environment variables
   - Check if service is running

### Frontend Issues

1. **API Calls Failing**:
   - Check CORS settings
   - Verify VITE_API_URL is correct
   - Check browser console for errors

2. **Build Errors**:
   - Clear node_modules and reinstall
   - Check for missing dependencies
   - Verify all imports are correct

## Performance Optimization

### Backend
- Enable MongoDB indexes (already configured)
- Use compression middleware
- Implement rate limiting
- Add caching for dashboard data

### Frontend
- Images are optimized
- Code splitting is automatic with Vite
- Lazy load routes if needed
- Enable Vercel/Netlify CDN

## Security Best Practices

1. **Never commit .env files**
2. **Use strong JWT secrets**
3. **Implement rate limiting on API**
4. **Validate all user inputs**
5. **Use HTTPS only**
6. **Keep dependencies updated**

## Monitoring

### Backend
- Use Render/Railway built-in monitoring
- Set up error tracking (e.g., Sentry)
- Monitor MongoDB Atlas metrics

### Frontend
- Use Vercel Analytics
- Monitor Core Web Vitals
- Track user errors

## Support

For issues during deployment:
1. Check application logs
2. Verify all environment variables
3. Test API endpoints with Postman
4. Check browser console for frontend errors

Good luck with your deployment! 🚀
