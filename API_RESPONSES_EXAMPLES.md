# RiskMirror AI - Example API Responses

This document provides complete example API responses for all AI endpoints.

## Example User Profile Data

### User Input
```json
{
  "monthly_income": 50000,
  "monthly_expenses": 25000,
  "monthly_savings": 6250,
  "total_debt": 200000,
  "monthly_emi": 0,
  "emergency_fund": 10000,
  "investment_monthly": 2000,
  "income_type": "salaried",
  "income_stability": "stable",
  "dependents": 3,
  "has_health_insurance": true,
  "has_life_insurance": false
}
```

### Financial Ratios Calculated
- Monthly Income: ₹50,000
- Monthly Expenses: ₹25,000 (50% of income)
- Monthly Savings: ₹6,250 (12.5% of income)
- Total Debt: ₹200,000 (40% of annual income)
- Monthly EMI: ₹0 (0% of income)
- Emergency Fund: ₹10,000 (0.4 months of expenses)
- Monthly Investments: ₹2,000 (4% of income)
- Risk Score: **74/100** (Moderate Risk)

---

## Example 1: POST /api/ai/analyze

### Request
```bash
curl -X POST http://localhost:5000/api/ai/analyze \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "analysis": {
    "explanation": "Your financial profile shows good income stability with solid savings habits, giving you a risk score of 74/100. You're managing your income-to-expense ratio well at 50%, and your monthly savings of ₹6,250 demonstrates financial discipline. However, your main vulnerability is an insufficient emergency fund—currently covering only 0.4 months of expenses against the recommended 6-month buffer. Additionally, with 3 dependents but no life insurance, you should prioritize coverage to protect your family. Addressing these two areas would significantly strengthen your financial resilience.",
    "recommendations": [
      "Build emergency fund from ₹10,000 to ₹150,000 (6 months of expenses) by increasing monthly emergency savings by ₹3,500 alongside your existing ₹6,250 savings", 
      "Secure term life insurance coverage of at least ₹50-75 lakh to protect 3 dependents—currently uninsured despite having 40% debt-to-income ratio",
      "Increase monthly investments from ₹2,000 to ₹5,000-7,500 (10-15% of income) to build long-term wealth through SIPs and diversified mutual funds"
    ],
    "topRiskFactors": [
      {
        "factor": "Insufficient Emergency Fund",
        "current": "0.4 months",
        "target": "6 months",
        "impact": "high"
      },
      {
        "factor": "No Life Insurance with Financial Dependents",
        "current": "3 dependent(s)",
        "target": "Coverage needed",
        "impact": "high"
      }
    ],
    "riskScore": 74,
    "riskCategory": "Moderate Risk"
  }
}
```

### Response (Error - No Assessment - 404)
```json
{
  "success": false,
  "message": "No assessment found. Please complete an assessment first."
}
```

### Response (Error - Unauthorized - 401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Response (Error - Server Error - 500)
```json
{
  "success": false,
  "message": "Error analyzing risk",
  "error": "OpenAI API temporarily unavailable"
}
```

---

## Example 2: POST /api/ai/chat

### Request 1: How can I improve my score?
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How can I improve my score?"
  }'
```

### Response 1
```json
{
  "success": true,
  "message": "Your current score of 74 is solid, but you have clear opportunities to reach 85+. The most impactful step is building your emergency fund from ₹10,000 to ₹150,000—this alone could add 8-10 points. With your ₹6,250 monthly savings, you could reach this in 22 months. Second, getting life insurance (usually ₹200-500/month for ₹50 lakh coverage) would add 3-5 points by protecting your family. Third, increase investments from ₹2,000 to ₹5,000/month. These three actions together could boost your score to 85-90 within 12 months."
}
```

### Request 2: Can I afford a new car loan?
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Can I afford a new car loan of 15 lakhs?"
  }'
```

### Response 2
```json
{
  "success": true,
  "message": "A ₹15 lakh car loan would likely have an EMI around ₹30,000-35,000 over 60 months. With your ₹50,000 income, this would consume 60-70% just toward that EMI along with your current obligations—dangerously high. I'd recommend waiting 12-18 months to: (1) build your emergency fund to ₹150,000 to absorb any income shock, (2) increase income if possible, or (3) look at a more affordable ₹8-10 lakh vehicle with ₹18,000-22,000 EMI, which would be 36-44% of income—still manageable. Your score would improve significantly before taking on major debt."
}
```

### Request 3: Should I pay off my debt or invest?
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Should I prioritize paying off my debt or investing more?"
  }'
```

### Response 3
```json
{
  "success": true,
  "message": "With your current situation—stable income, no EMI, and ₹200,000 debt but healthy savings rate—I'd suggest a phased approach: First priority (Months 1-6): Build emergency fund to ₹50,000 minimum—this protects against job loss. Second priority (Months 7-24): Accelerate debt payoff to reduce from ₹200,000 to ₹100,000, freeing up mental space and reducing risk. Third priority (Months 25+): Once debt is under ₹100,000 and emergency fund is solid, increase investments to ₹7,500/month. This balanced approach strengthens your financial foundation fastest while maintaining psychological wins from debt reduction."
}
```

### Response (Validation Error - 400)
```json
{
  "success": false,
  "message": "Question must be between 5-500 characters",
  "errors": [
    {
      "value": "help",
      "msg": "Question must be between 5-500 characters",
      "param": "question",
      "location": "body"
    }
  ]
}
```

### Response (Error - No Assessment - 404)
```json
{
  "success": false,
  "message": "No assessment found. Please complete an assessment first."
}
```

---

## Example 3: GET /api/ai/insights

### Request
```bash
curl -X GET http://localhost:5000/api/ai/insights \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Response (Success - 200 OK)
```json
{
  "success": true,
  "insights": {
    "topRiskFactors": [
      {
        "factor": "Insufficient Emergency Fund",
        "current": "0.4 months",
        "target": "6 months",
        "impact": "high"
      },
      {
        "factor": "No Life Insurance with Financial Dependents",
        "current": "3 dependent(s)",
        "target": "Coverage needed",
        "impact": "high"
      }
    ],
    "allRiskFactors": [
      {
        "factor": "Insufficient Emergency Fund",
        "current": "0.4 months",
        "target": "6 months",
        "impact": "high"
      },
      {
        "factor": "No Life Insurance with Financial Dependents",
        "current": "3 dependent(s)",
        "target": "Coverage needed",
        "impact": "high"
      },
      {
        "factor": "Low Investment Allocation (< 10% of income)",
        "current": "4%",
        "target": "10-15%",
        "impact": "medium"
      }
    ],
    "timestamp": "2024-03-30T12:45:30.123Z"
  }
}
```

---

## Different Risk Score Scenarios

### Scenario 1: High Risk Score (45/100)

**Profile:**
```json
{
  "monthly_income": 30000,
  "monthly_expenses": 28000,
  "monthly_savings": 500,
  "total_debt": 500000,
  "monthly_emi": 8000,
  "emergency_fund": 2000,
  "dependents": 2,
  "has_health_insurance": false
}
```

**Expected Explanation:**
```
"Your financial profile indicates high risk with a score of 45/100. Immediate action 
is strongly recommended. Your expenses are consuming 93% of income, leaving minimal 
buffer. You're carrying ₹500,000 in debt with ₹8,000 monthly EMI (26% of income), 
which is unsustainable. Most critically, you have virtually no emergency fund despite 
2 dependents—any unexpected expense could trigger a crisis. Without health insurance 
and with such tight cash flow, you're exposed to significant financial vulnerability."
```

**Recommendations:**
- Cut expenses by ₹5,000+ (18% reduction) to create breathing room
- Enter debt consolidation discussions to reduce EMI burden
- Build emergency fund of ₹90,000 (3 months) prioritizing over other savings

---

### Scenario 2: Low Risk Score (85/100)

**Profile:**
```json
{
  "monthly_income": 100000,
  "monthly_expenses": 45000,
  "monthly_savings": 20000,
  "total_debt": 100000,
  "monthly_emi": 3000,
  "emergency_fund": 270000,
  "investment_monthly": 8000,
  "dependents": 1,
  "has_health_insurance": true,
  "has_life_insurance": true
}
```

**Expected Explanation:**
```
"Excellent financial health with a score of 85/100. You're in a strong position with 
your 45% expense ratio and 20% savings rate. Your emergency fund of 6+ months is exemplary, 
and comprehensive insurance coverage shows forward-thinking protection. EMI burden of only 
3% of income leaves you very flexible. Your diversified financial approach—combining debt 
management, emergency fund, and regular investments—demonstrates mature financial planning."
```

**Recommendations:**
- Consider reducing good debt further to <₹50,000 for total debt freedom
- Explore goal-based investing (children's education, retirement)
- Increase investment to ₹15,000/month for wealth acceleration

---

## Chat Response Examples - Different Questions

### Question: "I'm worried about my job security. What should I do?"

**Response:**
```
"Job security concerns are valid—your health depends on financial stability. Your emergency 
fund of ₹10,000 covers only 0.4 months, which is insufficient. If you lost your job tomorrow, 
you'd be in crisis mode within weeks. My immediate recommendation: (1) Before any major 
decisions, build emergency fund to ₹150,000 (6 months). (2) Simultaneously, network and 
develop skills to improve income trajectory. (3) Consider a side income stream—with 3 
dependents, having income diversification (job + freelance/consulting) would be protective. 
Your stable income status helps—use it to build this safety net over 16-20 months."
```

### Question: "How do I save for my children's education?"

**Response:**
```
"With 3 dependents and ₹6,250 monthly savings, education planning is critical. Assuming 
college starts in 10 years for your oldest, you'll need ₹15-20 lakhs per child for quality 
education. Strategy: (1) First, build emergency fund—this is prerequisite. (2) Once emergency 
fund hits ₹150,000, allocate ₹2,000-3,000/month specifically to education SIPs starting with 
ICICI Child Gift Plan or similar—this guarantees 12% returns over 13+ years. (3) Avoid lump-sum 
investments; consistent monthly SIPs work better. Starting now, you can accumulate ₹15 lakhs 
by college time while meeting other goals."
```

### Question: "My salary is going to increase by 30%. How should I use it?"

**Response:**
```
"Congratulations on the raise! Your ₹50,000 becoming ₹65,000 opens wonderful opportunities. 
My recommendation for allocation: (1) 30% (₹4,500) → Emergency fund boost until you hit 
₹150,000 target. (2) 30% (₹4,500) → Avoid lifestyle inflation by maintaining ₹25,000 expense 
target. (3) 25% (₹3,750) → Increase monthly investments for wealth building. (4) 15% (₹2,250) 
→ Insurance (life, if not already covered) and family medical checkups. This balanced approach 
builds security first, then wealth. Those with dependents should always prioritize protective 
financial instruments before aggressive investing."
```

---

## Error Response Examples

### Error 1: No Assessment
```json
{
  "success": false,
  "message": "No assessment found. Please complete an assessment first."
}
```

### Error 2: Invalid Question
```json
{
  "success": false,
  "message": "Question must be between 5-500 characters",
  "errors": [
    {
      "value": "ok",
      "msg": "Question must be between 5-500 characters",
      "param": "question",
      "location": "body"
    }
  ]
}
```

### Error 3: Unauthorized
```json
{
  "success": false,
  "message": "Invalid token."
}
```

### Error 4: API Failure (Graceful Fallback)
```json
{
  "success": true,
  "analysis": {
    "explanation": "Your financial health is strong with a score of 74/100. You're managing your finances well. Focus on maintaining your positive habits and consider increasing investments to build long-term wealth.",
    "recommendations": ["Build emergency fund", "Increase investments", "Consider additional insurance"],
    "topRiskFactors": [...],
    "riskScore": 74
  }
}
```
Note: Even if OpenAI fails, the system returns fallback responses

---

## Response Time Expectations

| Endpoint | Time | Notes |
|----------|------|-------|
| `/api/ai/analyze` | 2-4 seconds | Includes OpenAI API call |
| `/api/ai/chat` | 1-3 seconds | Per message |
| `/api/ai/insights` | 100-200ms | Rule-based only, no API |

---

## Message Format in Chat

### User Message
```json
{
  "id": 1,
  "type": "user",
  "text": "How can I improve my score?"
}
```

### Bot Message
```json
{
  "id": 2,
  "type": "bot",
  "text": "Based on your profile..."
}
```

### Error Message
```json
{
  "id": 3,
  "type": "bot",
  "text": "Sorry, I encountered an error...",
  "isError": true
}
```

---

## Integration Notes

1. **Always check `success` field** before reading data
2. **Handle timeouts** - set 5 second timeout for `/api/ai/analyze`
3. **Implement retry logic** for chat failures
4. **Show loading state** while API calls complete
5. **Cache responses** to reduce API calls when possible
6. **Rate limit chat** to 1 message per 2 seconds
7. **Log errors** for debugging and monitoring

