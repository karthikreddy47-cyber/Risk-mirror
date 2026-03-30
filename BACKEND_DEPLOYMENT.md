# 🚀 RiskMirror Backend Deployment Guide

Your backend needs to be deployed separately from Vercel frontend. Choose one of these services:

---

## Option 1: Railway.app (RECOMMENDED - Easiest)

### Step 1: Create Railway Account
1. Go to https://railway.app/
2. Sign up with GitHub
3. Create new project

### Step 2: Connect GitHub Repository
1. Click "New" → "GitHub Repo"
2. Select your RiskMirror repository
3. Select the `backend` directory as root directory

### Step 3: Add Environment Variables
1. Go to project settings
2. Click "Variables"
3. Add these environment variables:

```
PORT=5000
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=riskmirror
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-proj-your-key
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=https://your-vercel-frontend.vercel.app
NODE_ENV=production
```

### Step 4: Deploy
- Railway auto-deploys when you push to GitHub
- Your backend URL will be: `https://your-project-backend.railway.app`

### Step 5: Update Frontend
1. Go to Vercel project settings
2. Add environment variable:
```
VITE_BACKEND_URL=https://your-project-backend.railway.app/api
```
3. Redeploy frontend

---

## Option 2: Render.com

### Step 1: Create Account
1. Go to https://render.com/
2. Sign up with GitHub

### Step 2: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Select `backend` folder

### Step 3: Configure Service
- **Name**: riskmirror-backend
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free (or starter)

### Step 4: Add Environment Variables
Go to Environment and add:

```
PORT=5000
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=riskmirror
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-proj-your-key
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=https://your-vercel-frontend.vercel.app
NODE_ENV=production
```

### Step 5: Deploy
- Click "Create Web Service"
- Render will deploy automatically
- Your backend URL: `https://riskmirror-backend.onrender.com`

---

## Option 3: Heroku (Legacy but works)

### Requirements
- Heroku CLI installed
- Account created

### Step 1: Login to Heroku
```bash
npm install -g heroku
heroku login
```

### Step 2: Create Heroku App
```bash
cd backend
heroku create your-app-name-backend
```

### Step 3: Set Environment Variables
```bash
heroku config:set DB_HOST=your-db-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_NAME=riskmirror
heroku config:set JWT_SECRET=your-secret-key
heroku config:set OPENAI_API_KEY=sk-proj-your-key
heroku config:set OPENAI_MODEL=gpt-4o-mini
heroku config:set FRONTEND_URL=https://your-vercel-frontend.vercel.app
```

### Step 4: Deploy
```bash
git push heroku main
```

Your backend URL: `https://your-app-name-backend.herokuapp.com`

---

## Important: Database Setup

### For Cloud MySQL
**Option A: MySQL on Railway**
1. Create MySQL database on Railway
2. Get connection details
3. Set DB_HOST, DB_USER, DB_PASSWORD in environment

**Option B: Use Online MySQL Service**
- https://remotemysql.com/
- https://www.db4free.net/
- https://www.freedatabase.tech/

**Option C: Deploy MySQL Separately**
- DigitalOcean managed database
- AWS RDS
- Google Cloud SQL
- Azure Database for MySQL

### Initialize Database Schema
After deployment, run the initialization:

```bash
# Connect to your remote MySQL and run:
mysql -h your_db_host -u your_user -p your_database < database/schema.sql
```

Or use the init-db.js script (already configured):
```bash
node backend/init-db.js
```

---

## Verify Backend is Working

### Test Connection
```bash
curl https://your-backend-url.com/
# Should return: 🚀 RiskMirror Backend is Running
```

### Test API
```bash
curl https://your-backend-url.com/api/test
# Should return: { "message": "API is working!" }
```

---

## Update Frontend After Backend Deployment

### 1. Get Your Backend URL
- Railway: `https://your-project-backend.railway.app`
- Render: `https://riskmirror-backend.onrender.com`
- Heroku: `https://your-app-name-backend.herokuapp.com`

### 2. Update Vercel Environment
1. Go to Vercel dashboard
2. Select your frontend project
3. Settings → Environment Variables
4. Add/Update:
```
VITE_BACKEND_URL=https://your-backend-url-here/api
```

### 3. Redeploy Frontend
- Vercel will auto-redeploy
- Or click "Redeploy"

---

## Troubleshooting

### Frontend still getting 404 errors?

**Checklist:**
- [ ] Backend is deployed and running
- [ ] Backend URL is correct in Vercel env variables
- [ ] FRONTEND_URL is set in backend env variables
- [ ] Database is connected
- [ ] API endpoints are working (test with curl)

### CORS Errors?
- Make sure `FRONTEND_URL` env variable is set in backend
- Check `allowedOrigins` in `backend/server.js`
- Backend must include your Vercel frontend URL

### Database Connection Errors?
- Verify MySQL credentials are correct
- Check if database is initialized (run schema.sql)
- Verify host/port are correct
- Check if database user has permissions

### 500 Errors on API Calls?
- Check backend logs on your deployment platform
- Verify environment variables are set
- Test API with curl: `curl https://your-backend-url/api/ai/insights`

---

## Environment Variables Checklist

**Backend (.env)**
```
✓ PORT (usually 5000 or auto-assigned)
✓ DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
✓ JWT_SECRET (use a strong random string)
✓ OPENAI_API_KEY (from https://platform.openai.com/keys)
✓ OPENAI_MODEL (gpt-4o-mini or gpt-4)
✓ FRONTEND_URL (your Vercel frontend URL)
✓ NODE_ENV=production
```

**Frontend (.env.production)**
```
✓ VITE_BACKEND_URL (your deployed backend URL + /api)
```

---

## Monitoring & Logs

### Railway
- Dashboard → Project → Logs

### Render
- Dashboard → Web Service → Logs

### Heroku
```bash
heroku logs --tail
```

---

## Next Steps

1. **Deploy Backend** → Choose one service above
2. **Get Backend URL** → Copy the deployment URL
3. **Update Frontend** → Set VITE_BACKEND_URL
4. **Redeploy Frontend** → Vercel auto-deploys
5. **Test** → Go to your Vercel URL and test features
6. **Monitor** → Watch logs for errors

---

## Questions?
- Railway Docs: https://docs.railway.app/
- Render Docs: https://render.com/docs/
- Heroku Docs: https://devcenter.heroku.com/

Good luck! 🚀
