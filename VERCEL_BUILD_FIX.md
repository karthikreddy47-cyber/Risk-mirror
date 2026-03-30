# 🚀 Vercel Deployment Setup Instructions

## Important: Fix Build Error

If you're getting "Publish directory build does not exist" error, follow these exact steps:

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click your RiskMirror project
3. Go to **Settings** tab

### Step 2: Set Root Directory
1. In Settings, find **Build & Development Settings**
2. Click **Edit**
3. Set **Root Directory** to: `frontend`
4. Click **Save**

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click the three dots (...) on latest deployment
3. Click **Redeploy**
4. Wait for build to complete

---

## Alternative: Manual Configuration

If Step 2 doesn't work, do this:

### In Vercel Dashboard:

**Settings → Build & Development Settings**

- **Framework Preset**: React
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `frontend` ← THIS IS CRITICAL

---

## Environment Variables in Vercel

Make sure these are set:

1. Go to **Settings → Environment Variables**
2. Add:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: `https://your-backend-url.com/api`
   - Check: Production, Preview, Development
3. Click **Save**

---

## Backend URL Configuration

Before redeploying, make sure:

1. ✅ Backend is deployed (Railway/Render/Heroku)
2. ✅ Backend URL format: `https://your-domain.com/api`
3. ✅ Set in Vercel as `VITE_BACKEND_URL`
4. ✅ Backend has `FRONTEND_URL` env variable

---

## Full Deployment Checklist

### Backend (if not deployed yet)
- [ ] Deploy to Railway, Render, or Heroku
- [ ] Get backend URL
- [ ] Set `FRONTEND_URL` env variable in backend
- [ ] Add `@riskmirror` user to MySQL if needed
- [ ] Run database schema initialization

### Frontend (Vercel)
- [ ] Import GitHub repo
- [ ] Set Root Directory to `frontend`
- [ ] Add `VITE_BACKEND_URL` env variable
- [ ] Ensure build settings are correct
- [ ] Redeploy

### Testing
- [ ] Open deployed URL
- [ ] Register new account
- [ ] Complete financial assessment
- [ ] Click "Get AI Insights"
- [ ] No 404 errors ✅

---

## Troubleshooting

### "Publish directory build does not exist"
- **Solution**: Set Root Directory to `frontend` in Vercel Settings
- Check: Settings → Build & Development Settings → Root Directory

### Build succeeds but frontend blank
- Check browser console (F12) for errors
- Verify `VITE_BACKEND_URL` is set correctly
- Check backend is accessible

### Still getting 404 on API calls
- Verify `VITE_BACKEND_URL` value is correct
- Check backend deployment is working
- Test backend directly: `curl https://your-backend-url/`

### CORS errors
- Backend has `FRONTEND_URL` env variable set
- Backend `FRONTEND_URL` matches Vercel URL exactly
- Backend CORS is configured in server.js

---

## After Fixing Build Error

1. Vercel will automatically redeploy
2. Or manually click "Redeploy" in Deployments
3. Wait 2-3 minutes for build
4. Check Deployments tab for "Ready" status
5. Click your domain to open live app

---

## Need Help?

**Build failing?**
- Check Vercel Deployment logs (click deployment → Logs tab)

**App not working?**
- Check browser console (DevTools F12)
- Test backend: `curl https://backend-url/`

**Environment variable issue?**
- Go to Settings → Environment Variables
- Verify ALL variables are set
- Redeploy after adding/changing variables

---

Good luck! Your app should be live soon 🚀
