# 🚀 Render Backend Deployment Guide

## Fix "Publish directory build does not exist" Error

This error on Render means the build process isn't configured correctly for a Node.js backend.

### Step 1: Create `render.yaml` in backend root

This file tells Render exactly how to deploy your backend. I've created this for you - it's already in the repo.

### Step 2: Configure in Render Dashboard

1. Go to https://dashboard.render.com/
2. Click your backend service
3. Go to **Settings** tab
4. Scroll to **Build & Deploy**

**Configure these:**

- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Module System**: Node

### Step 3: Set Environment Variables

In Render Dashboard → Your Service → Environment:

```
PORT=5000
DB_HOST=your-mysql-database-host
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=riskmirror
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-proj-xxxxx
OPENAI_MODEL=gpt-4o-mini
FRONTEND_URL=https://your-vercel-frontend.vercel.app
NODE_ENV=production
```

### Step 4: Connect GitHub (if not already done)

1. In Render, click **New +** → **Web Service**
2. Click **Connect Repository**
3. Select your RiskMirror repo
4. Configure:
   - **Name**: riskmirror-backend
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - Click **Create Web Service**

### Step 5: Deploy

1. Render will automatically deploy
2. Check **Logs** tab for progress
3. Wait for "Your service is live 🎉"

---

## If Still Getting Build Error

### Check These:

**1. Root Directory**
   - Go to Settings
   - Make sure **Root Directory** is set to: `backend`

**2. Build Command**
   - Should be: `npm install`
   - NOT: `npm run build` (we don't need to build, just install)

**3. Environment Variables**
   - All required vars set? 
   - Click "Add Environment Variable" for each one

**4. Check Logs**
   - Click **Logs** tab in Render dashboard
   - Look for error messages
   - Share the error here if still stuck

---

## Your Backend URL

Once deployed successfully:
```
https://riskmirror-backend.onrender.com
```

Use this as your `VITE_BACKEND_URL` in Vercel:
```
VITE_BACKEND_URL=https://riskmirror-backend.onrender.com/api
```

---

## Common Render Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check **Root Directory** is `backend` |
| Dependencies missing | Ensure `package.json` exists in backend folder |
| Port error | Leave PORT as 5000, Render assigns automatically |
| Database connection fails | Verify DB credentials and network access |
| "Service failed to build" | Check logs for specific error message |

---

## Next Steps

1. **Set Root Directory to `backend`**
2. **Add all environment variables**
3. **Click Deploy or Redeploy**
4. **Check Logs for success**
5. **Copy your URL to VITE_BACKEND_URL in Vercel**

---

Need help? Share:
- The exact error from Render Logs
- Screenshot of your Render settings
- Any messages from the build process

Let's get this working! 🚀
