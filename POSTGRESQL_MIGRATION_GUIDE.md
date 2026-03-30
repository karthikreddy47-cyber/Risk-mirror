# PostgreSQL Migration Guide - RiskMirror

## Overview
Your RiskMirror project has been migrated from MySQL to **PostgreSQL**, which is Render's managed database solution. This guide explains the changes and how to deploy to Render.

---

## ✅ What Changed

### 1. **Database Driver Updated**
- **Before**: `mysql2/promise`
- **After**: `pg` (PostgreSQL native driver)

### 2. **Files Modified**

#### `backend/package.json`
```json
// Removed: "mysql2": "^3.6.5"
// Added: "pg": "^8.11.3"
```

#### `backend/config/database.js`
- Now uses PostgreSQL `Pool` from `pg` library
- Configuration updated for PostgreSQL (port 5432 instead of 3306)
- SSL support added for Render (uses `rejectUnauthorized: false`)

#### `backend/init-db.js`
- Upgraded to use PostgreSQL `Client`
- Better error handling with SSL option for cloud deployment
- Handles "already exists" errors for idempotent schema creation

#### `backend/routes/auth.js`
- Query syntax: `?` → `$1, $2, $3...` (PostgreSQL parameterized queries)
- Result access: `rows.length` → `rows` array structure
- Insert ID retrieval: `result.insertId` → `RETURNING id` clause

#### `backend/routes/risk.js`
- Transaction handling: `conn.execute()` → `client.query()`
- Parameterized queries updated to PostgreSQL syntax
- Results now accessed via `.rows` property
- Applied `RETURNING id` for insert operations

#### `backend/controllers/aiController.js`
- All queries converted to PostgreSQL syntax
- Results structure updated (`.rows` instead of direct array)

#### `database/schema.sql`
**Key SQL Changes:**
- `INT AUTO_INCREMENT PRIMARY KEY` → `SERIAL PRIMARY KEY`
- `ENUM('val1','val2')` → PostgreSQL ENUM types with `CREATE TYPE`
- Removed `IF NOT EXISTS` from database creation (Render manages this)
- Removed `USE riskmirror` (not needed in Render)
- `ON UPDATE CURRENT_TIMESTAMP` removed (PostgreSQL uses triggers)
- `JSON` → `JSONB` (binary JSON, faster queries)
- Backticks removed (PostgreSQL uses double quotes for identifiers)

#### `backend/.env`
```env
# Updated for PostgreSQL
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false  # Will be true on Render
```

---

## 🚀 Deployment Steps

### Step 1: Update Dependencies Locally
```bash
cd backend
npm install
```
This removes mysql2 and installs pg.

### Step 2: Test Locally with PostgreSQL

**Option A: Using Docker (Recommended)**
```bash
# Start PostgreSQL container
docker run --name postgres-riskmirror -e POSTGRES_DB=riskmirror -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Update .env to use localhost
# DB_HOST=localhost
# DB_PASSWORD=password

# Initialize schema
node init-db.js

# Start backend
npm start
```

**Option B: Using Local PostgreSQL Installation**
```bash
# Create database and user
createdb riskmirror
psql -d riskmirror -f ../database/schema.sql

# Update .env with your PostgreSQL credentials
# Then start: npm start
```

### Step 3: Deploy to Render

#### 3.1 Create PostgreSQL Database on Render
1. Go to [render.com](https://render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Database Name**: `riskmirror`
   - **Username**: `admin`
   - **Region**: Choose closest to your users
   - **PostgreSQL Version**: 15
   - **Pricing**: Free Tier (if available) or Starter

4. **Copy the connection details** once database is created

#### 3.2 Create Web Service for Backend
1. Go to Render Dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `riskmirror-backend`
   - **Region**: Same as database
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`

#### 3.3 Add Environment Variables to Backend
In Render dashboard, go to your Web Service → **Environment**

Add these variables (get connection details from PostgreSQL database page):
```
PORT=5000
DB_HOST=YOUR_RENDER_DB_HOST (e.g., oregon-postgres.render.com)
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=YOUR_RENDER_DB_PASSWORD
DB_NAME=riskmirror
DB_SSL=true
JWT_SECRET=riskmirror_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
OPENAI_MODEL=gpt-4o-mini
```

**Find these values in Render PostgreSQL Database page:**
- **Host**: "external_database_host" field
- **User**: "admin" (you set this)
- **Password**: Shown when credentials created
- **Database**: "riskmirror"

#### 3.4 Update Frontend Environment for Backend URL
Once backend deploys, copy the URL (e.g., `https://riskmirror-backend.onrender.com`)

In Vercel (Frontend) → **Settings** → **Environment Variables**:
```
VITE_BACKEND_URL=https://riskmirror-backend.onrender.com
```

Redeploy frontend to apply changes.

---

## 🔍 Troubleshooting

### Connection Error: "Error: connect ECONNREFUSED"
**Cause**: Database not running or wrong credentials
**Fix**: 
- Verify PostgreSQL is running
- Check `.env` has correct DB_HOST, DB_PORT, DB_USER, DB_PASSWORD
- Run `node init-db.js` to initialize schema

### Error: "FATAL: Ident authentication failed"
**Cause**: Username or password incorrect
**Fix**: Double-check credentials match Render database settings

### Error: "SSL: CERTIFICATE_VERIFY_FAILED"
**Cause**: SSL certificate validation on Render failing
**Fix**: Set `DB_SSL=true` in environment variables (already done in code)

### Render database slower than expected
**Cause**: Free tier has limited resources
**Fix**: Upgrade to Starter plan for production use

---

## 📝 Local Testing Checklist

After migration, test these locally:

- [ ] `npm install` completes without errors
- [ ] `node init-db.js` creates schema successfully
- [ ] Backend starts: `npm start` (should log "✅ PostgreSQL connected")
- [ ] Can register user: `POST /api/auth/register`
- [ ] Can login: `POST /api/auth/login`
- [ ] Can submit assessment: `POST /api/risk/assess`
- [ ] Can fetch history: `GET /api/risk/history`
- [ ] AI endpoints work: `POST /api/ai/analyze`, `/api/ai/chat`

---

## 🐳 Docker Testing (Recommended)

Replace local PostgreSQL with Docker for exact Render simulation:

```bash
# Start container
docker run --name riskmirror-postgres \
  -e POSTGRES_DB=riskmirror \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Initialize
cd backend
node init-db.js

# Start backend
npm start

# Stop when done
docker stop riskmirror-postgres
docker rm riskmirror-postgres
```

---

## 🔄 Rollback to MySQL (If Needed)

To revert these changes:
1. Restore original files from git: `git checkout HEAD -- backend/`
2. Restore MySQL driver: `npm install mysql2`
3. Restore MySQL database setup

---

## 📞 Support

If you encounter issues:
1. Check Render logs: Dashboard → Web Service → **Logs**
2. Verify database connection: Render PostgreSQL page → **Connection Info**
3. Review error messages in terminal output
4. Check `init-db.js` output for schema creation errors

---

**Database Migration Complete! ✅**
Your application is now ready for production deployment on Render with PostgreSQL.
