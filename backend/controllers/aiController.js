const { pool } = require('../config/database');
const {
  generateAIAnalysis,
  generateChatResponse,
} = require('../services/aiService');

/**
 * POST /api/ai/analyze
 * Get AI explanation and recommendations for latest assessment
 */
const analyzeRisk = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch latest assessment and profile data
    const [assessments] = await pool.execute(
      `SELECT ra.*, fp.* FROM risk_assessments ra
       JOIN financial_profiles fp ON ra.profile_id = fp.id
       WHERE ra.user_id = ? ORDER BY ra.created_at DESC LIMIT 1`,
      [userId]
    );

    if (assessments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found. Please complete an assessment first.',
      });
    }

    const assessment = assessments[0];

    // Prepare profile data for analysis
    const profileData = {
      monthly_income: assessment.monthly_income,
      monthly_expenses: assessment.monthly_expenses,
      monthly_savings: assessment.monthly_savings,
      total_debt: assessment.total_debt,
      monthly_emi: assessment.monthly_emi,
      emergency_fund: assessment.emergency_fund,
      investment_monthly: assessment.investment_monthly,
      income_type: assessment.income_type,
      income_stability: assessment.income_stability,
      dependents: assessment.dependents,
      has_health_insurance: assessment.has_health_insurance,
      has_life_insurance: assessment.has_life_insurance,
    };

    // Generate AI analysis (hybrid rule-based + AI)
    const analysis = await generateAIAnalysis(profileData, assessment.overall_score);

    if (!analysis.success) {
      return res.status(500).json({
        success: false,
        message: 'Error generating AI analysis',
        error: analysis.error,
      });
    }

    res.json({
      success: true,
      analysis: {
        explanation: analysis.explanation,
        recommendations: analysis.recommendations,
        topRiskFactors: analysis.topRiskFactors,
        riskScore: assessment.overall_score,
        riskCategory: assessment.risk_category,
      },
    });
  } catch (error) {
    console.error('analyzeRisk error:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing risk',
      error: error.message,
    });
  }
};

/**
 * POST /api/ai/chat
 * Chat with AI assistant about finances
 */
const chatWithAI = async (req, res) => {
  try {
    const { question } = req.body;
    const userId = req.user.id;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Question cannot be empty',
      });
    }

    // Fetch latest assessment
    const [assessments] = await pool.execute(
      `SELECT ra.overall_score, fp.* FROM risk_assessments ra
       JOIN financial_profiles fp ON ra.profile_id = fp.id
       WHERE ra.user_id = ? ORDER BY ra.created_at DESC LIMIT 1`,
      [userId]
    );

    if (assessments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found. Please complete an assessment first.',
      });
    }

    const assessment = assessments[0];

    // Prepare profile data
    const profileData = {
      monthly_income: assessment.monthly_income,
      monthly_expenses: assessment.monthly_expenses,
      monthly_savings: assessment.monthly_savings,
      total_debt: assessment.total_debt,
      monthly_emi: assessment.monthly_emi,
      emergency_fund: assessment.emergency_fund,
      investment_monthly: assessment.investment_monthly,
      income_type: assessment.income_type,
      income_stability: assessment.income_stability,
      dependents: assessment.dependents,
      has_health_insurance: assessment.has_health_insurance,
      has_life_insurance: assessment.has_life_insurance,
    };

    // Generate AI response
    const response = await generateChatResponse(
      question,
      profileData,
      assessment.overall_score
    );

    res.json({
      success: true,
      message: response,
    });
  } catch (error) {
    console.error('chatWithAI error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing your question',
      error: error.message,
    });
  }
};

/**
 * GET /api/ai/insights
 * Get quick financial insights based on rules only (no AI)
 */
const getQuickInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const { analyzeRulesOnly } = require('../services/aiService');

    // Fetch latest assessment
    const [assessments] = await pool.execute(
      `SELECT fp.* FROM risk_assessments ra
       JOIN financial_profiles fp ON ra.profile_id = fp.id
       WHERE ra.user_id = ? ORDER BY ra.created_at DESC LIMIT 1`,
      [userId]
    );

    if (assessments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No assessment found.',
      });
    }

    const profileData = assessments[0];

    // Generate rule-based insights (fast, no AI)
    const riskFactors = analyzeRulesOnly(profileData);

    res.json({
      success: true,
      insights: {
        topRiskFactors: riskFactors.slice(0, 3),
        allRiskFactors: riskFactors,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('getQuickInsights error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insights',
      error: error.message,
    });
  }
};

module.exports = {
  analyzeRisk,
  chatWithAI,
  getQuickInsights,
};
