# RunPace Pro Deployment Guide

## Architecture Overview

This project uses a **decoupled architecture**:
- **Frontend**: React app deployed on Netlify
- **Backend**: Django API deployed on Railway/Render
- **Database**: PostgreSQL (provided by Railway/Render)

## Frontend Deployment (Netlify)

### 1. Setup Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with your GitHub account
3. Connect your repository

### 2. Deploy Frontend
1. **Push your code to GitHub**
2. **In Netlify dashboard:**
   - Click "New site from Git"
   - Choose your repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

### 3. Environment Variables
Add these in Netlify dashboard:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## Backend Deployment (Railway)

### 1. Setup Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

### 2. Deploy Backend
1. **Connect your repository**
2. **Add PostgreSQL database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will provide `DATABASE_URL`

### 3. Environment Variables
Add these in Railway dashboard:
```
SECRET_KEY=your-secret-key-here
DEBUG=False
DATABASE_URL=postgresql://... (provided by Railway)
ALLOWED_HOSTS=your-frontend-domain.netlify.app
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.netlify.app
```

### 4. Deploy Commands
Railway will automatically:
1. Install Python dependencies
2. Run `python manage.py migrate`
3. Start the server with `gunicorn`

## Alternative: Render Deployment

If you prefer Render:

### 1. Setup Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service

### 2. Deploy Settings
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn runpace_pro.wsgi:application`
- **Environment**: Python 3.10

## Local Development

### Frontend
```bash
npm install
npm start
```

### Backend
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
```

## Production Checklist

### Frontend
- [ ] Build succeeds locally
- [ ] Environment variables set
- [ ] API URL configured
- [ ] Custom domain (optional)

### Backend
- [ ] Database migrations run
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Static files collected
- [ ] SSL certificate active

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check `CORS_ALLOWED_ORIGINS` in backend
   - Ensure frontend URL is correct

2. **Database Connection**
   - Verify `DATABASE_URL` format
   - Check database is running

3. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies installed

### Support
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs) 