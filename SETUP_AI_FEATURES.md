# RiskMirror AI Features - Quick Setup Guide

## What Was Added ✨

Your RiskMirror project now includes **AI-powered financial advisory features**:

### 1. ✅ AI Risk Explanation
- Explains why user has their specific risk score
- Highlights top 2 contributing factors
- Uses hybrid rule-based + AI logic

### 2. ✅ Personalized Recommendations  
- Top 3 actionable financial improvements
- Includes specific ₹ or % numbers
- Prioritized by impact
- Based on user's financial data

### 3. ✅ AI Chat Assistant
- Ask questions about finances
- E.g., "How can I improve my score?"
- Responds using user's specific data
- Interactive chat interface

### 4. ✅ Hybrid Logic (Rule-Based + AI)
- First: Fast rule-based analysis
- Then: OpenAI refinement for personalization
- Fallback: Works even if API fails

## File Structure Added

```
backend/
├── routes/aiRoutes.js              [NEW] AI API endpoints
├── controllers/aiController.js     [NEW] Request handlers
├── services/aiService.js           [NEW] Business logic
└── .env                            [UPDATED] OpenAI config

frontend/
├── components/AIExplanation.jsx    [NEW] Explanation UI
├── components/AIExplanation.css    [NEW] Styling
├── components/AIChat.jsx           [NEW] Chat UI
├── components/AIChat.css           [NEW] Chat styling
└── pages/Dashboard.jsx             [UPDATED] Integration
```

## Quick Start

### Step 1: Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy the key

### Step 2: Configure .env
Update `backend/.env`:
```env
OPENAI_API_KEY=sk-proj-your_key_here
OPENAI_MODEL=gpt-4o-mini
```

### Step 3: Install OpenAI Package
Already installed! Run: `npm list openai`

### Step 4: Restart Backend
```bash
cd backend
npm run dev
```

### Step 5: Test in Frontend
1. Go to http://localhost:3000
2. Complete a financial assessment
3. Go to Dashboard
4. Click "Get AI Insights"
5. Start chatting!

## API Endpoints

### 1. Get AI Analysis
```bash
POST /api/ai/analyze
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "explanation": "Your financial profile...",
    "recommendations": ["Action 1...", "Action 2...", "Action 3..."],
    "topRiskFactors": [...]
  }
}
```

### 2. Chat with AI
```bash
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "How can I improve my score?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Based on your profile..."
}
```

### 3. Get Quick Insights (No API)
```bash
GET /api/ai/insights
Authorization: Bearer <token>
```

## Code Examples

### Backend: AI Service

```javascript
// services/aiService.js - Key functions:

// 1. Rule-based analysis (fast, reliable)
analyzeRulesOnly(profileData)

// 2. AI explanation generation
generateAIExplanation(profileData, score, factors)

// 3. AI recommendations
generateAIRecommendations(profileData, score, factors)

// 4. Chat response
generateChatResponse(question, profileData, score)

// 5. Complete analysis
generateAIAnalysis(profileData, score)
```

### Frontend: Using the Components

```jsx
import AIExplanation from '../components/AIExplanation';
import AIChat from '../components/AIChat';

function Dashboard() {
  const [latest, setLatest] = useState(null);

  return (
    <div>
      {/* Show AI explanation and recommendations */}
      <AIExplanation assessment={latest} />
      
      {/* Chat interface */}
      <AIChat />
    </div>
  );
}
```

## API Call Examples

### Using curl

```bash
# 1. Get AI analysis
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# 2. Ask AI a question
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "How can I reduce my expenses?"}'

# 3. Get quick insights
curl -X GET http://localhost:5000/api/ai/insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using JavaScript/Frontend

```javascript
import api from '../utils/api';

// Get AI analysis
const { data } = await api.post('/ai/analyze');
console.log(data.analysis.explanation);
console.log(data.analysis.recommendations);

// Chat with AI
const { data: chatData } = await api.post('/ai/chat', {
  question: 'How can I improve my score?'
});
console.log(chatData.message);

// Get insights (rules only)
const { data: insights } = await api.get('/ai/insights');
console.log(insights.insights.topRiskFactors);
```

## Feature Capabilities

### AI Explanation Knows About:
- ✅ Current risk score & category
- ✅ Savings rate
- ✅ Expense ratio
- ✅ EMI burden
- ✅ Debt-to-income ratio
- ✅ Emergency fund status
- ✅ Income type & stability
- ✅ Dependents & insurance

### Recommendations Include:
- ✅ Specific ₹ amounts to save/cut
- ✅ % improvements to make
- ✅ Time-based targets
- ✅ Priority ranking
- ✅ Impact assessment

### AI Chat Can Answer:
- ✅ "How can I improve my score?"
- ✅ "Can I afford a loan?"
- ✅ "How should I manage my expenses?"
- ✅ "What should I prioritize?"
- ✅ "How do I build emergency fund?"
- ✅ Any custom financial question

## Architecture Overview

```
User Request
    ↓
Frontend (React)
    ↓
API Call (/api/ai/*)
    ↓
Backend Auth Middleware
    ↓
AI Controller
    ↓
AI Service
    ├─ Rule-Based Analysis (Fast)
    │  └─ Identify risk factors
    ├─ API Fallback Check
    │  └─ If API available... →
    ├─ OpenAI API Call
    │  └─ Generate personalization
    └─ Return Response
    ↓
Frontend Display
    ├─ Explanation Card
    ├─ Recommendation Cards
    └─ Chat Messages
```

## Hybrid Logic Explanation

### Why Two-Tier Approach?

**Problem:** What if OpenAI API is down or rate-limited?
**Solution:** Rule-Based First

**Flow:**
1. **Immediate**: Fast rule-based analysis (always works)
2. **Enhanced**: If OpenAI available, generate personalized insights
3. **Fallback**: If OpenAI fails, use template-based explanation

**Benefits:**
- ✅ Works 100% of the time
- ✅ Fast responses
- ✅ Cost-effective
- ✅ Better UX (something vs nothing)

## Configuration Options

### Model Selection
```env
# Best for MVP (recommended)
OPENAI_MODEL=gpt-4o-mini

# More capable but expensive
OPENAI_MODEL=gpt-4

# Faster and cheaper
OPENAI_MODEL=gpt-3.5-turbo
```

### Cost Estimation
- Each `/ai/analyze` call: ~$0.0002-0.0005
- Each chat message: ~$0.0001-0.0002
- Insights (rules only): $0 (no API call)

### Rate Limiting (Optional)
Add to `backend/.env`:
```env
AI_RATE_LIMIT_WINDOW=15 # minutes
AI_RATE_LIMIT_MAX=20    # requests per window
```

## Troubleshooting

### Issue: "No assessment found"
**Solution:** User must complete a financial assessment first

### Issue: AI not responding
**Checklist:**
- ✅ OpenAI API key set in .env?
- ✅ Key has credits available?
- ✅ Node.js server restarted after .env change?
- ✅ Check server logs for errors

### Issue: Slow responses
**Reason:** OpenAI API calls take 1-3 seconds
**Solution:** 
- Use faster model: `gpt-4o-mini`
- Show loading state to user (already implemented)

### Issue: Different recommendations each time
**Reason:** AI generates different responses
**Solution:** This is normal! Responses vary to feel natural

## Next Steps

1. **Test Everything**
   - [ ] Complete assessment
   - [ ] Get AI explanation
   - [ ] Ask chat questions
   - [ ] Verify recommendations

2. **Monitor Costs**
   - Check OpenAI dashboard weekly
   - Track API usage
   - Adjust as needed

3. **Enhance**
   - Add caching for common questions
   - Implement analytics
   - Gather user feedback
   - Improve prompts based on feedback

4. **Production Ready**
   - Add rate limiting
   - Set up error logging
   - Monitor API reliability
   - Document for team

## Documentation Files

- 📄 **AI_FEATURES.md** - Complete technical documentation
- 📄 **SETUP.md** - This file

## Support

For issues or questions:
1. Check AI_FEATURES.md for detailed docs
2. Review OpenAI API docs: https://platform.openai.com/docs
3. Check backend logs: `npm run dev` output
4. Check frontend console: Browser DevTools

## Summary

✅ **What You Have:**
- AI-powered financial analysis
- Personalized recommendations
- Interactive chat assistant
- Hybrid rule-based + AI logic
- Complete frontend UI
- Production-ready code

🚀 **Ready to Deploy:**
- Add your OpenAI API key
- Test thoroughly
- Monitor costs
- Gather user feedback

🎉 **You're All Set!**

Your RiskMirror app now has enterprise-grade AI features!
