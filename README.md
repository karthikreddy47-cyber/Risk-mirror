# 🪞 RiskMirror – Personal Financial Risk Profiling System

> A full-stack web application that analyzes your financial data and generates a personalized risk profile, categorized as **Low Risk**, **Moderate Risk**, or **High Risk**.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Risk Engine Logic](#risk-engine-logic)
- [Screenshots](#screenshots)

---

## Project Overview

RiskMirror helps users understand their personal financial vulnerability by analyzing:

- Monthly income, expenses, and savings
- Debt levels and EMI obligations
- Emergency fund adequacy
- Investment habits
- Income stability
- Insurance coverage

The system generates a **0–100 risk score** and categorizes users into risk tiers, along with specific risk factors and actionable recommendations.

---

## Tech Stack

| Layer      | Technology                             |
|------------|----------------------------------------|
| Frontend   | React 18, React Router v6, Recharts    |
| Backend    | Node.js, Express.js                    |
| Database   | MySQL 8.x                              |
| Auth       | JWT (JSON Web Tokens) + bcryptjs       |
| Build Tool | Vite                                   |

---

## Features

- 🔐 **Secure Authentication** — Register/login with JWT-based sessions
- 📊 **Multi-step Assessment Form** — Guided 4-step financial data entry
- 🧠 **Risk Engine** — Rule-based scoring across 7 financial dimensions
- 📈 **Visual Dashboard** — Risk gauge, ratio bars, factor cards
- 📋 **Assessment History** — Track risk score changes over time with trend chart
- 💡 **Personalized Recommendations** — Actionable financial advice based on your profile
- 📱 **Responsive Design** — Works on desktop and mobile

---

## Project Structure

```
riskmirror/
├── backend/
│   ├── config/
│   │   ├── database.js       # MySQL connection pool
│   │   └── riskEngine.js     # Core risk calculation logic
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js           # /api/auth/* endpoints
│   │   └── risk.js           # /api/risk/* endpoints
│   ├── server.js             # Express app entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx      # Sidebar + navigation
│   │   │   ├── RiskGauge.jsx   # Animated SVG gauge
│   │   │   ├── RatioBar.jsx    # Financial ratio indicator
│   │   │   └── AssessResult.jsx # Post-assessment result view
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx   # Main overview
│   │   │   ├── Assess.jsx      # 4-step form
│   │   │   └── History.jsx     # Past assessments + chart
│   │   ├── hooks/
│   │   │   └── useAuth.jsx     # Auth context & provider
│   │   ├── utils/
│   │   │   └── api.js          # Axios instance with interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── database/
    └── schema.sql             # MySQL schema
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- MySQL 8.x
- npm or yarn

---

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema
source /path/to/riskmirror/database/schema.sql

# Or:
mysql -u root -p < database/schema.sql
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your MySQL credentials
nano .env
```

**.env configuration:**
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=riskmirror
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=7d
```

```bash
# Start the backend
npm run dev     # development (with nodemon)
# or
npm start       # production
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint              | Description           | Auth Required |
|--------|-----------------------|-----------------------|---------------|
| POST   | `/api/auth/register`  | Create new account    | No            |
| POST   | `/api/auth/login`     | Login & get token     | No            |
| GET    | `/api/auth/me`        | Get current user      | Yes           |

**POST /api/auth/register**
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "securepassword"
}
```

**POST /api/auth/login**
```json
{
  "email": "arjun@example.com",
  "password": "securepassword"
}
```

---

### Risk Assessment Endpoints

| Method | Endpoint            | Description                   | Auth Required |
|--------|---------------------|-------------------------------|---------------|
| POST   | `/api/risk/assess`  | Submit data & get risk profile| Yes           |
| GET    | `/api/risk/history` | Get past assessments          | Yes           |
| GET    | `/api/risk/latest`  | Get most recent assessment    | Yes           |
| GET    | `/api/risk/stats`   | Get aggregate stats           | Yes           |

**POST /api/risk/assess** — Request body:
```json
{
  "monthly_income": 75000,
  "monthly_expenses": 45000,
  "monthly_savings": 10000,
  "total_debt": 300000,
  "monthly_emi": 8000,
  "emergency_fund": 60000,
  "investment_monthly": 5000,
  "income_type": "salaried",
  "income_stability": "stable",
  "dependents": 2,
  "has_health_insurance": true,
  "has_life_insurance": false
}
```

**Response:**
```json
{
  "success": true,
  "assessment": {
    "id": 1,
    "risk_category": "Moderate Risk",
    "overall_score": 58.5,
    "savings_ratio": 13.33,
    "expense_ratio": 60.0,
    "emi_to_income_ratio": 10.67,
    "debt_to_income_ratio": 33.33,
    "emergency_fund_months": 1.33,
    "investment_ratio": 6.67,
    "risk_factors": [...],
    "recommendations": [...]
  }
}
```

---

## Risk Engine Logic

The risk engine scores 7 dimensions, totaling 100 points:

| Dimension          | Max Score | Description                                  |
|--------------------|-----------|----------------------------------------------|
| Savings Rate       | 20        | Monthly savings / income ratio               |
| Expense Ratio      | 15        | Monthly expenses / income ratio              |
| Debt-to-Income     | 20        | Total debt / annual income                   |
| EMI Burden         | 15        | Monthly EMI / income ratio                   |
| Emergency Fund     | 15        | Fund / monthly expenses (months coverage)    |
| Investment Habit   | 10        | Monthly investments / income ratio           |
| Income Stability   | 5         | Stability of income source                   |

**Bonus adjustments:**
- No health insurance: −3 points
- No life insurance with dependents: −2 points

**Risk Categories:**
- **Low Risk**: Score ≥ 75
- **Moderate Risk**: Score 45–74
- **High Risk**: Score < 45

---

## License

MIT License — Free to use and modify for educational and personal projects.
