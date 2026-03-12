# Fitness Tracker - Render Deployment Guide

## Your Deployed URLs
- **Backend**: https://fitnesstracker-backend-m43k.onrender.com
- **Frontend**: https://fitnesstracker-frontend-e4t7.onrender.com

## Backend Deployment (Render)

1. **Create a MongoDB Atlas Database**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string

2. **Deploy Backend to Render**
   - Connect your GitHub repository to Render
   - Select the `server` folder as the root directory

## Backend Configuration (Render)

### Environment Variables to Set in Render Dashboard:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://fitnesstracker-frontend-e4t7.onrender.com
```

### Backend Settings:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18.x or higher

## Frontend Deployment (Render)

1. **Update vite.config.js**
   - Make sure the proxy points to your Render backend URL

2. **Deploy Frontend to Render**
   - Connect your GitHub repository to Render
   - Select the `client` folder as the root directory
   - Set environment variable:
     ```
     VITE_API_URL=https://fitnesstracker-backend-m43k.onrender.com
     ```

## Frontend Configuration (Render)

### Frontend Settings:
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Node Version**: 18.x or higher

## Current Configuration Status 

Your configuration has been updated with:
- Backend CORS configured for your frontend URL
- Frontend proxy configured for your backend URL
- Production-ready API configuration

## Next Steps

1. **Set Environment Variables in Render Backend**:
   - Go to your backend dashboard on Render
   - Add the environment variables above
   - Restart the backend service

2. **Test Your Application**:
   - Visit: https://fitnesstracker-frontend-e4t7.onrender.com
   - Test registration and login
   - Test workout logging and goal creation

3. **If Issues Occur**:
   - Check Render logs for both services
   - Verify MongoDB connection string
   - Ensure CORS settings are correct

## Post-Deployment Steps

1. **Update CORS Settings**
   - Add your frontend URL to backend CORS origins
   - Restart backend service

2. **Test the Application**
   - Test login/registration
   - Test workout logging
   - Test goal creation

3. **Set Up Custom Domain** (Optional)
   - Configure custom domains in Render dashboard
   - Update CORS settings if needed

## Important Notes

- Make sure MongoDB Atlas allows connections from Render's IP ranges
- Use strong JWT secrets in production
- Enable SSL certificates (Render does this automatically)
- Monitor logs in Render dashboard for debugging
- Your frontend is already configured to proxy API calls to your backend
- The backend CORS is set to accept requests from your frontend URL
- Make sure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or specifically from Render's IP ranges
