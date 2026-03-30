const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Rule-based financial analysis
 * Identifies key risk factors without AI
 */
const analyzeRulesOnly = (profileData) => {
  const {
    monthly_income,
    monthly_expenses,
    monthly_savings,
    total_debt,
    monthly_emi,
    emergency_fund,
    income_stability,
    dependents,
  } = profileData;

  const income = parseFloat(monthly_income) || 0;
  const expenses = parseFloat(monthly_expenses) || 0;
  const savings = parseFloat(monthly_savings) || 0;
  const emi = parseFloat(monthly_emi) || 0;

  const factors = [];

  // Check savings rate
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  if (savingsRate < 10) {
    factors.push({
      factor: 'Low Savings Rate',
      current: `${savingsRate.toFixed(1)}%`,
      target: '15-20%',
      impact: 'high',
    });
  }

  // Check expense ratio
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 100;
  if (expenseRatio > 70) {
    factors.push({
      factor: 'High Expense Ratio',
      current: `${expenseRatio.toFixed(1)}%`,
      target: '50-60%',
      impact: 'high',
    });
  }

  // Check EMI burden
  const emiBurden = income > 0 ? (emi / income) * 100 : 0;
  if (emiBurden > 30) {
    factors.push({
      factor: 'High EMI Burden',
      current: `${emiBurden.toFixed(1)}%`,
      target: '<20%',
      impact: 'high',
    });
  }

  // Check emergency fund
  const emergencyMonths = expenses > 0 ? emergency_fund / expenses : 0;
  if (emergencyMonths < 3) {
    factors.push({
      factor: 'Insufficient Emergency Fund',
      current: `${emergencyMonths.toFixed(1)} months`,
      target: '6 months',
      impact: 'medium',
    });
  }

  // Check income stability with dependents
  if (income_stability === 'unstable' && dependents > 2) {
    factors.push({
      factor: 'Unstable Income with Dependents',
      current: `${dependents} dependents`,
      target: 'Build safety net',
      impact: 'high',
    });
  }

  // Check debt level
  const debtToIncome = income > 0 ? (total_debt / (income * 12)) * 100 : 0;
  if (debtToIncome > 50) {
    factors.push({
      factor: 'High Debt-to-Income Ratio',
      current: `${debtToIncome.toFixed(1)}%`,
      target: '<30%',
      impact: 'critical',
    });
  }

  return factors.sort((a, b) => {
    const impactOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return impactOrder[a.impact] - impactOrder[b.impact];
  });
};

/**
 * Generate AI explanation using OpenAI
 * Uses GPT model to create personalized financial insights
 */
const generateAIExplanation = async (profileData, riskScore, topFactors) => {
  const {
    monthly_income,
    monthly_expenses,
    monthly_savings,
    total_debt,
    monthly_emi,
    emergency_fund,
    income_type,
    income_stability,
    dependents,
    has_health_insurance,
    has_life_insurance,
  } = profileData;

  const income = parseFloat(monthly_income) || 0;
  const expenses = parseFloat(monthly_expenses) || 0;
  const savings = parseFloat(monthly_savings) || 0;

  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
  const expenseRatio = income > 0 ? ((expenses / income) * 100).toFixed(1) : 0;

  const prompt = `You are a financial advisor analyzing a user's financial profile. Provide a clear, empathetic explanation of their risk score in 2-3 sentences.

Financial Profile:
- Risk Score: ${riskScore}/100
- Monthly Income: ₹${income.toLocaleString('en-IN')}
- Savings Rate: ${savingsRate}%
- Expense Ratio: ${expenseRatio}%
- EMI/Loan Payments: ₹${parseFloat(monthly_emi).toLocaleString('en-IN')}
- Total Debt: ₹${parseFloat(total_debt).toLocaleString('en-IN')}
- Emergency Fund: ₹${parseFloat(emergency_fund).toLocaleString('en-IN')}
- Income Type: ${income_type}
- Income Stability: ${income_stability}
- Dependents: ${dependents}
- Health Insurance: ${has_health_insurance ? 'Yes' : 'No'}
- Life Insurance: ${has_life_insurance ? 'Yes' : 'No'}

Top Risk Factors:
${topFactors.map((f, i) => `${i + 1}. ${f.factor} (Current: ${f.current})`).join('\n')}

Provide a brief, encouraging explanation of their risk score. Focus on understanding their situation first, then highlight the positive aspects of their financial profile.`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful financial advisor. Be empathetic, clear, and encouraging. Avoid jargon.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    // Fallback: Generate rule-based explanation
    return generateFallbackExplanation(riskScore, topFactors);
  }
};

/**
 * Fallback explanation if OpenAI fails
 */
const generateFallbackExplanation = (score, factors) => {
  if (score >= 75) {
    return `Your financial health is strong with a score of ${score}/100. You're managing your finances well. Focus on maintaining your positive habits and consider increasing investments to build long-term wealth.`;
  } else if (score >= 50) {
    return `Your financial profile shows moderate risk with a score of ${score}/100. There are opportunities to improve. The key is to address your ${factors[0]?.factor.toLowerCase() || 'primary risk factor'} and build stronger financial habits.`;
  }
  return `Your financial profile indicates high risk with a score of ${score}/100. Immediate action is recommended. Prioritize building an emergency fund and reducing your ${factors[0]?.factor.toLowerCase() || 'debt burden'}.`;
};

/**
 * Generate personalized recommendations using AI
 */
const generateAIRecommendations = async (profileData, riskScore, topFactors) => {
  const income = parseFloat(profileData.monthly_income) || 0;
  const expenses = parseFloat(profileData.monthly_expenses) || 0;
  const savings = parseFloat(profileData.monthly_savings) || 0;
  const emi = parseFloat(profileData.monthly_emi) || 0;
  const emergency = parseFloat(profileData.emergency_fund) || 0;

  const prompt = `You are a financial advisor. Based on this user's profile, suggest exactly 3 specific, actionable financial improvements ranked by impact. Format: "Action: [specific action] | Expected Benefit: [quantified benefit]"

Current Financial State:
- Monthly Income: ₹${income.toLocaleString('en-IN')}
- Monthly Expenses: ₹${expenses.toLocaleString('en-IN')}
- Monthly Savings: ₹${savings.toLocaleString('en-IN')}
- Monthly EMI: ₹${emi.toLocaleString('en-IN')}
- Emergency Fund: ₹${emergency.toLocaleString('en-IN')}

Top Issues:
${topFactors.slice(0, 2).map((f) => `- ${f.factor}: ${f.current} (Target: ${f.target})`).join('\n')}

Provide exactly 3 recommendations in this format:
1. [Action with specific ₹ or % numbers]
2. [Action with specific ₹ or % numbers]  
3. [Action with specific ₹ or % numbers]

Be practical and achievable. Focus on high-impact actions first.`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a financial advisor providing specific, actionable recommendations with quantified benefits. Be concise and practical.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const text = response.choices[0].message.content;
    const recommendations = text
      .split('\n')
      .filter((line) => line.trim().match(/^\d\./))
      .map((line) => line.replace(/^\d\.\s*/, '').trim())
      .slice(0, 3);

    return recommendations.length === 3
      ? recommendations
      : generateFallbackRecommendations(profileData, topFactors);
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return generateFallbackRecommendations(profileData, topFactors);
  }
};

/**
 * Fallback recommendations if OpenAI fails
 */
const generateFallbackRecommendations = (profileData, factors) => {
  const income = parseFloat(profileData.monthly_income) || 0;
  const savings = parseFloat(profileData.monthly_savings) || 0;
  const expenses = parseFloat(profileData.monthly_expenses) || 0;
  const emi = parseFloat(profileData.monthly_emi) || 0;

  const recommendations = [];

  // Recommendation 1: Increase savings
  const targetSavings = (income * 0.2).toFixed(0);
  const savingsGap = (targetSavings - savings).toFixed(0);
  if (savings < income * 0.2) {
    recommendations.push(
      `Increase monthly savings by ₹${savingsGap} to reach 20% of income (₹${targetSavings})`
    );
  }

  // Recommendation 2: Reduce expenses
  const targetExpenses = (income * 0.6).toFixed(0);
  const expenseReduction = (expenses - targetExpenses).toFixed(0);
  if (expenses > income * 0.6) {
    recommendations.push(
      `Cut monthly expenses by ₹${expenseReduction} (${((expenseReduction / expenses) * 100).toFixed(0)}%) to improve financial flexibility`
    );
  }

  // Recommendation 3: EMI or Emergency fund
  if (emi > income * 0.2) {
    recommendations.push(
      `Prioritize reducing EMI obligations — currently ${((emi / income) * 100).toFixed(0)}% of income, aim for <20%`
    );
  } else {
    const emergencyMonths = expenses > 0 ? profileData.emergency_fund / expenses : 0;
    if (emergencyMonths < 6) {
      const emergencyTarget = (expenses * 6).toFixed(0);
      recommendations.push(
        `Build emergency fund to ₹${emergencyTarget} (6 months of expenses) — currently ₹${profileData.emergency_fund}`
      );
    }
  }

  return recommendations.slice(0, 3);
};

/**
 * AI Chat response for user questions
 */
const generateChatResponse = async (userQuestion, profileData, riskScore) => {
  const income = parseFloat(profileData.monthly_income) || 0;
  const expenses = parseFloat(profileData.monthly_expenses) || 0;
  const savings = parseFloat(profileData.monthly_savings) || 0;
  const debt = parseFloat(profileData.total_debt) || 0;
  const emi = parseFloat(profileData.monthly_emi) || 0;

  const prompt = `You are a helpful financial advisor answering a user's question. Use their financial data to provide specific, actionable advice.

User's Financial Data:
- Current Risk Score: ${riskScore}/100
- Monthly Income: ₹${income.toLocaleString('en-IN')}
- Monthly Expenses: ₹${expenses.toLocaleString('en-IN')}
- Monthly Savings: ₹${savings.toLocaleString('en-IN')}
- Total Debt: ₹${debt.toLocaleString('en-IN')}
- Monthly EMI: ₹${emi.toLocaleString('en-IN')}
- Income Type: ${profileData.income_type}
- Income Stability: ${profileData.income_stability}

User's Question: "${userQuestion}"

Provide a brief, helpful response (2-3 sentences) using their specific financial data. Be encouraging but realistic.`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a friendly financial advisor. Provide practical, specific advice based on the user data.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    return 'I encountered an issue processing your question. Please try again or contact support.';
  }
};

/**
 * Main function: Generate complete AI analysis
 * Combines rule-based analysis with AI insights
 */
const generateAIAnalysis = async (profileData, riskScore) => {
  try {
    // Step 1: Rule-based analysis (fast, reliable)
    const riskFactors = analyzeRulesOnly(profileData);
    const topFactors = riskFactors.slice(0, 2); // Top 2 factors

    // Step 2: AI-powered explanation
    const explanation = await generateAIExplanation(profileData, riskScore, topFactors);

    // Step 3: AI-powered recommendations
    const recommendations = await generateAIRecommendations(
      profileData,
      riskScore,
      riskFactors
    );

    return {
      success: true,
      explanation,
      recommendations,
      topRiskFactors: topFactors,
      allRiskFactors: riskFactors,
    };
  } catch (error) {
    console.error('Error in generateAIAnalysis:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  generateAIAnalysis,
  generateAIExplanation,
  generateAIRecommendations,
  generateChatResponse,
  analyzeRulesOnly,
};
