# RiskMirror AI Features Documentation

## Overview

RiskMirror now includes powerful AI-powered financial advisory features that provide personalized insights, recommendations, and an interactive chat assistant.

## Features

### 1. AI Risk Explanation
Generates a clear, empathetic explanation of why the user has their specific risk score.

**How it works:**
- Uses rule-based analysis to identify top 2 risk factors
- Calls OpenAI GPT to generate personalized explanation
- Falls back to template-based explanation if API fails
- Considers user's financial context (income, expenses, dependents, etc.)

**Example Output:**
```
"Your financial health is strong with a score of 74/100. You're managing your finances well with 
a healthy savings rate. The main area for improvement is building a larger emergency fund to cover 
at least 6 months of expenses, which would significantly strengthen your financial resilience."
```

### 2. Personalized Recommendations
Provides 3 specific, actionable financial improvements ranked by impact.

**How it works:**
- Analyzes user's financial data
- Uses OpenAI to generate specific, quantified recommendations
- Each recommendation includes numbers (₹ or %)
- Focuses on high-impact actions first

**Example Output:**
```
1. Increase monthly savings by ₹12,500 to reach 20% of income
2. Cut monthly expenses by ₹8,000 (15% reduction) to improve financial flexibility
3. Build emergency fund to ₹150,000 (6 months of expenses) for security
```

### 3. AI Chat Assistant
Interactive chat that answers user questions about their finances using their specific data.

**How it works:**
- User asks questions about their financial situation
- AI analyzes question in context of user's financial profile
- Provides specific, actionable advice
- Uses real numbers from user's data

**Example Questions:**
- "How can I improve my score?"
- "Can I afford a loan?"
- "How should I manage my expenses?"
- "What should I prioritize - debt or savings?"

**Example Bot Response:**
```
"With your current monthly income of ₹50,000 and expenses of ₹25,000, you have great potential. 
I'd recommend directing extra money toward your emergency fund first (currently ₹10,000, should be ₹150,000), 
then focus on reducing expenses by 10% to free up capital for additional investments."
```

## Backend API Endpoints

### 1. POST `/api/ai/analyze`
Get AI explanation and recommendations for the latest assessment.

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

**Response (Success):**
```json
{
  "success": true,
  "analysis": {
    "explanation": "Your financial profile shows strong fundamentals...",
    "recommendations": [
      "Increase monthly savings by ₹12,500 to reach 20% of income",
      "Cut expenses by ₹8,000 (15% reduction)",
      "Build emergency fund to ₹150,000"
    ],
    "topRiskFactors": [
      {
        "factor": "Low Savings Rate",
        "current": "10%",
        "target": "15-20%",
        "impact": "high"
      },
      {
        "factor": "Insufficient Emergency Fund",
        "current": "1 months",
        "target": "6 months",
        "impact": "medium"
      }
    ],
    "riskScore": 74,
    "riskCategory": "Moderate Risk"
  }
}
```

### 2. POST `/api/ai/chat`
Chat with AI assistant about finances.

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How can I improve my score?"
  }'
```

**Request Validation:**
- `question` must be 5-500 characters
- Cannot be empty

**Response (Success):**
```json
{
  "success": true,
  "message": "Focus on two main areas: First, increase your monthly savings by at least ₹5,000 to reach a healthier 15% savings rate. Second, build your emergency fund - currently you only have 1 month covered, but 6 months is the healthy target. These two actions alone could improve your score by 10-15 points."
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Question must be between 5-500 characters",
  "errors": [
    {
      "msg": "Question must be between 5-500 characters"
    }
  ]
}
```

### 3. GET `/api/ai/insights`
Get quick financial insights (rule-based, no AI).

**Authentication:** Required (Bearer token)

**Request:**
```bash
curl -X GET http://localhost:5000/api/ai/insights \
  -H "Authorization: Bearer <token>"
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "topRiskFactors": [
      {
        "factor": "Low Savings Rate",
        "current": "10%",
        "target": "15-20%",
        "impact": "high"
      },
      {
        "factor": "Insufficient Emergency Fund",
        "current": "1 months",
        "target": "6 months",
        "impact": "medium"
      }
    ],
    "allRiskFactors": [
      // ... up to 6 factors
    ],
    "timestamp": "2024-03-30T10:30:00.000Z"
  }
}
```

## Frontend Components

### 1. AIExplanation Component
Displays AI-generated explanation and recommendations.

**Props:**
- `assessment`: The user's latest assessment object

**Usage:**
```jsx
import AIExplanation from '../components/AIExplanation';

function Dashboard() {
  return (
    <AIExplanation assessment={latestAssessment} />
  );
}
```

**Features:**
- Loading state while fetching AI analysis
- Error handling with user-friendly messages
- Beautiful card layout with icons
- Recommendation cards with numbering
- Empty state when no analysis generated

### 2. AIChat Component
Interactive chat interface for asking questions.

**Props:** None (uses API context)

**Usage:**
```jsx
import AIChat from '../components/AIChat';

function Dashboard() {
  return (
    <AIChat />
  );
}
```

**Features:**
- Message history with user/bot messages
- Real-time typing indicator
- Suggested questions for quick access
- Auto-scroll to latest message
- Error handling and recovery
- Responsive design

## Configuration

### 1. Environment Variables

Create `.env` file in backend directory:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=riskmirror
JWT_SECRET=riskmirror_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

**Important:**
- Get your OpenAI API key from https://platform.openai.com/api-keys
- Never commit `.env` to git (it's already in .gitignore)
- The API key is kept secure on the backend

### 2. OpenAI Model Selection

Supported models:
- `gpt-4o-mini` (recommended) - Fast, affordable, great quality
- `gpt-4` - More capable but slower and expensive
- `gpt-3.5-turbo` - Faster but lower quality

Set in `.env`:
```env
OPENAI_MODEL=gpt-4o-mini
```

## Architecture

### Hybrid Rule-Based + AI Logic

The system uses a two-tier approach for robustness:

**Tier 1: Rule-Based Analysis (Fast, Reliable)**
- Identifies risk factors using predefined rules
- No API calls, always works
- Runs first to provide baseline analysis

**Tier 2: AI Refinement (Intelligent, Personalized)**
- Takes rule-based factors as input
- Uses OpenAI to generate personalized explanations
- Creates customized recommendations
- Falls back to rule-based if API fails

**Benefits:**
- Works even if OpenAI API is down
- Fast response time
- Cost-effective (doesn't call API for simple insights)
- Better personalization when AI is available

### File Structure

```
backend/
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── risk.js          # Risk assessment routes
│   └── aiRoutes.js      # AI feature routes (NEW)
├── controllers/
│   └── aiController.js  # AI endpoint handlers (NEW)
├── services/
│   └── aiService.js     # AI business logic (NEW)
├── config/
│   └── database.js      # Database connection
├── middleware/
│   └── auth.js          # JWT verification
└── server.js            # Express app

frontend/
├── components/
│   ├── AIExplanation.jsx # AI insights component (NEW)
│   ├── AIExplanation.css # AI styling (NEW)
│   ├── AIChat.jsx        # Chat component (NEW)
│   └── AIChat.css        # Chat styling (NEW)
├── pages/
│   └── Dashboard.jsx     # Updated with AI components
└── utils/
    └── api.js           # API client
```

## User Example Data Flow

Given a user with:
```json
{
  "monthly_income": 50000,
  "monthly_expenses": 25000,
  "monthly_savings": 6250,
  "income_type": "salaried",
  "income_stability": "stable",
  "emergency_fund": 10000,
  "total_debt": 200000,
  "monthly_emi": 0,
  "dependents": 3,
  "has_health_insurance": true,
  "has_life_insurance": false
}
```

**Process:**

1. **Rule-Based Analysis** (aiService.js)
   ```
   - Savings Rate: 12.5% (Low, target: 15-20%)
   - Expense Ratio: 50% (Healthy)
   - Emergency Fund: 0.4 months (Critical, target: 6 months)
   - Dependents: 3 with no life insurance (Risk)
   ```

2. **AI Generation** (OpenAI API)
   ```
   Processes rule-based factors + user profile
   → Generates empathetic explanation
   → Creates 3 specific recommendations
   ```

3. **Output to Frontend**
   ```json
   {
     "explanation": "You're managing...",
     "recommendations": [
       "Increase savings...",
       "Build emergency fund...",
       "Get life insurance..."
     ]
   }
   ```

## Cost & Rate Limiting

### OpenAI Costs
- `gpt-4o-mini`: ~$0.0001-0.0003 per request
- Average cost per analysis: $0.0002-0.0005
- Chat message: $0.0001-0.0002

### Optimization Tips
1. Use `gpt-4o-mini` instead of `gpt-4`
2. Implement caching for common questions
3. Batch API calls when possible
4. Monitor usage on OpenAI dashboard

### Rate Limiting Recommendation
Consider adding rate limiting to prevent abuse:
```javascript
const rateLimit = require('express-rate-limit');

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per user
  message: 'Too many AI requests, please try again later'
});

router.post('/analyze', aiLimiter, authMiddleware, analyzeRisk);
```

## Error Handling

### Graceful Degradation
If OpenAI API fails:
- Returns fallback template-based explanation
- System continues to work
- User sees meaningful message
- Error logged for monitoring

### Common Issues

**1. API Key Invalid**
```
Error: 401 Unauthorized - Check your OpenAI API key
```
Fix: Update `OPENAI_API_KEY` in .env

**2. API Rate Limited**
```
Error: 429 Too Many Requests
```
Fix: Implement backoff strategy or upgrade OpenAI plan

**3. No Assessment Found**
```json
{
  "success": false,
  "message": "No assessment found. Please complete an assessment first."
}
```
Fix: User must complete a financial assessment first

## Testing the AI Features

### 1. Test `/api/ai/analyze`
```bash
# Register and login first to get token
TOKEN="your_jwt_token"

# Get AI analysis
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

### 2. Test `/api/ai/chat`
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "How can I improve my score?"}'
```

### 3. Test via Frontend
1. Register and login at http://localhost:3000
2. Complete a financial assessment
3. Go to Dashboard
4. Click "Get AI Insights" button
5. Use the chat interface to ask questions

## Advanced Usage

### Custom Prompts

You can customize the AI prompts in `aiService.js`:

**For explanations**, modify the `generateAIExplanation` function:
```javascript
const prompt = `... your custom prompt ...`;
```

**For recommendations**, modify the `generateAIRecommendations` function:
```javascript
const prompt = `... your custom prompt ...`;
```

**For chat**, modify the `generateChatResponse` function:
```javascript
const prompt = `... your custom prompt ...`;
```

### Adding Context
To add more context to AI responses, expand the profiles data sent to OpenAI:
```javascript
// Add more fields to the prompt
- Employment tenure
- Investment portfolio
- Risk tolerance
- Financial goals
```

## Future Enhancements

1. **Caching**: Store AI responses to reduce API calls
2. **Historical Tracking**: Track how recommendations improve over time
3. **Goals Integration**: Tailor advice based on user goals
4. **Multi-language**: Support for Indian languages
5. **Analytics**: Track which recommendations users implement
6. **A/B Testing**: Test different prompt styles

## Support & Troubleshooting

### Common Questions

**Q: Why isn't the AI generating responses?**
A: Check if OpenAI API key is set correctly in .env and ensure your account has credits.

**Q: Can I use a different AI provider?**
A: Yes, the service layer is abstracted. Replace OpenAI calls with your provider's API.

**Q: How do I reduce API costs?**
A: Use `gpt-4o-mini`, implement caching, or generate insights less frequently.

## Security Notes

1. **API Key Security**: Never expose OpenAI API key in frontend
2. **Rate Limiting**: Implement to prevent abuse
3. **Input Validation**: All user inputs are validated
4. **Authentication**: All AI endpoints require JWT token
5. **CORS**: Only allow requests from your frontend

## References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
