# 🌐 Vercel Frontend Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Update Frontend Environment
1. In your local project, open `frontend/.env.production`
2. Replace `YOUR_BACKEND_URL` with your backend deployment URL:

```bash
# Example for Railway backend
VITE_BACKEND_URL=https://riskmirror-backend.railway.app/api

# Example for Render backend
VITE_BACKEND_URL=https://riskmirror-backend.onrender.com/api
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Update backend URL for production deployment"
git push
```

### Step 3: Import to Vercel (if not already done)
1. Go to https://vercel.com/
2. Click "New Project"
3. Select your GitHub repository
4. Framework: React
5. Root directory: `frontend`
6. Click "Deploy"

### Step 4: Add Vercel Environment Variables
1. After deployment, go to **Project Settings**
2. Click **Environment Variables**
3. Add variable:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: `https://your-backend-url.com/api`
   - Check: Production, Preview, Development

### Step 5: Verify & Link Backend
1. Go to your backend deployment (Railway/Render/Heroku)
2. Add environment variable in backend:
   - **Name**: `FRONTEND_URL`
   - **Value**: Your Vercel URL (e.g., `https://riskmirror.vercel.app`)

### Step 6: Test
1. Go to your Vercel URL
2. Register a new account
3. Complete a financial assessment
4. Try "Get AI Insights"
5. Try AI chat

---

## If You Still Get 404 Errors

### Verify These:

**1. Backend is Running**
```bash
curl https://your-backend-url/
# Should show: 🚀 RiskMirror Backend is Running
```

**2. Environment Variables Set in Vercel**
- Go to Vercel project → Settings → Environment Variables
- Confirm `VITE_BACKEND_URL` is set
- Make sure deployment reflects new vars (redeploy if needed)

**3. No Typos in URLs**
- Check for extra spaces or slashes
- URL should be: `https://your-domain.com/api` (with /api)
- Not just: `https://your-domain.com`

**4. CORS Configuration**
- Backend's `FRONTEND_URL` env var should match your Vercel URL exactly
- Should be: `https://your-app.vercel.app` (without path)

**5. Redeploy Frontend**
- Vercel settings → Deployments
- Click "Redeploy" on latest deployment
- Wait for new deployment to complete

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on `/api/auth/register` | Backend URL not set or incorrect in VITE_BACKEND_URL |
| CORS errors | FRONTEND_URL not set in backend environment |
| Blank page | Check for JavaScript errors (F12 console) |
| Slow responses | Check backend logs for database connection issues |
| Still doesn't work? | Check browser DevTools Network tab, copy exact error |

---

## Helpful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Project**: Go to Vercel → click your project
- **Deployments**: Vercel → Deployments tab
- **Logs**: Click on a deployment deployment

---

## Redeployment (After Backend Updates)

If you make changes to the backend and deploy them:

1. **Verify** backend deployment succeeded
2. **Go to Vercel** → Your project
3. **Click Deployments**
4. **Click Redeploy** on the latest frontend deployment
5. **Wait** for completion (usually 1-2 minutes)

---

## Environment Variable Quick Reference

Your Vercel environment should have:

```
VITE_BACKEND_URL=https://your-backend-url.com/api
```

That's it! The rest of the configuration is in your backend.

---

Good luck! Your app should now be fully deployed 🚀
