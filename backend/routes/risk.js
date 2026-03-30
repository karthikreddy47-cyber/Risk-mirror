const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const authMiddleware = require('../middleware/auth');
const { calculateRisk } = require('../config/riskEngine');

// POST /api/risk/assess - Submit financial data & get risk profile
router.post('/assess', authMiddleware, [
  body('monthly_income').isFloat({ min: 0 }).withMessage('Valid monthly income required'),
  body('monthly_expenses').isFloat({ min: 0 }).withMessage('Valid monthly expenses required'),
  body('monthly_savings').isFloat({ min: 0 }).optional(),
  body('total_debt').isFloat({ min: 0 }).optional(),
  body('monthly_emi').isFloat({ min: 0 }).optional(),
  body('emergency_fund').isFloat({ min: 0 }).optional(),
  body('investment_monthly').isFloat({ min: 0 }).optional(),
  body('income_type').isIn(['salaried', 'self-employed', 'business', 'freelance', 'retired']).optional(),
  body('income_stability').isIn(['very_stable', 'stable', 'moderate', 'unstable', 'very_unstable']).optional(),
  body('dependents').isInt({ min: 0 }).optional(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const profileData = {
    monthly_income: parseFloat(req.body.monthly_income) || 0,
    monthly_expenses: parseFloat(req.body.monthly_expenses) || 0,
    monthly_savings: parseFloat(req.body.monthly_savings) || 0,
    total_debt: parseFloat(req.body.total_debt) || 0,
    monthly_emi: parseFloat(req.body.monthly_emi) || 0,
    emergency_fund: parseFloat(req.body.emergency_fund) || 0,
    investment_monthly: parseFloat(req.body.investment_monthly) || 0,
    income_type: req.body.income_type || 'salaried',
    income_stability: req.body.income_stability || 'stable',
    dependents: parseInt(req.body.dependents) || 0,
    has_health_insurance: req.body.has_health_insurance === true || req.body.has_health_insurance === 'true',
    has_life_insurance: req.body.has_life_insurance === true || req.body.has_life_insurance === 'true',
  };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Save financial profile
    const profileResult = await client.query(
      `INSERT INTO financial_profiles 
        (user_id, monthly_income, monthly_expenses, monthly_savings, total_debt, monthly_emi,
         emergency_fund, investment_monthly, income_type, income_stability, dependents,
         has_health_insurance, has_life_insurance)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING id`,
      [
        req.user.id,
        profileData.monthly_income,
        profileData.monthly_expenses,
        profileData.monthly_savings,
        profileData.total_debt,
        profileData.monthly_emi,
        profileData.emergency_fund,
        profileData.investment_monthly,
        profileData.income_type,
        profileData.income_stability,
        profileData.dependents,
        profileData.has_health_insurance,
        profileData.has_life_insurance,
      ]
    );

    const profileId = profileResult.rows[0].id;

    // Run risk engine
    const riskResult = calculateRisk(profileData);

    // Save risk assessment
    const assessmentResult = await client.query(
      `INSERT INTO risk_assessments 
        (user_id, profile_id, risk_category, overall_score, savings_ratio,
         debt_to_income_ratio, expense_ratio, emi_to_income_ratio,
         emergency_fund_months, investment_ratio, risk_factors, recommendations)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        req.user.id,
        profileId,
        riskResult.risk_category,
        riskResult.overall_score,
        riskResult.savings_ratio,
        riskResult.debt_to_income_ratio,
        riskResult.expense_ratio,
        riskResult.emi_to_income_ratio,
        riskResult.emergency_fund_months,
        riskResult.investment_ratio,
        JSON.stringify(riskResult.risk_factors),
        JSON.stringify(riskResult.recommendations),
      ]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Risk assessment completed',
      assessment: {
        id: assessmentResult.rows[0].id,
        profile_id: profileId,
        ...riskResult,
        input: profileData,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Assessment error:', error);
    res.status(500).json({ success: false, message: 'Error processing risk assessment' });
  } finally {
    client.release();
  }
});

// GET /api/risk/history - Get user's past assessments
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const assessments = await pool.query(
      `SELECT ra.id, ra.risk_category, ra.overall_score, ra.savings_ratio,
              ra.debt_to_income_ratio, ra.expense_ratio, ra.emi_to_income_ratio,
              ra.emergency_fund_months, ra.investment_ratio, ra.risk_factors,
              ra.recommendations, ra.created_at,
              fp.monthly_income, fp.monthly_expenses, fp.monthly_savings,
              fp.total_debt, fp.monthly_emi, fp.emergency_fund, fp.investment_monthly,
              fp.income_type, fp.income_stability, fp.dependents,
              fp.has_health_insurance, fp.has_life_insurance
       FROM risk_assessments ra
       JOIN financial_profiles fp ON ra.profile_id = fp.id
       WHERE ra.user_id = $1
       ORDER BY ra.created_at DESC
       LIMIT $2`,
      [req.user.id, limit]
    );

    const parsed = assessments.rows.map(a => ({
      ...a,
      risk_factors: typeof a.risk_factors === 'string' ? JSON.parse(a.risk_factors) : a.risk_factors,
      recommendations: typeof a.recommendations === 'string' ? JSON.parse(a.recommendations) : a.recommendations,
    }));

    res.json({ success: true, assessments: parsed, total: parsed.length });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ success: false, message: 'Error fetching assessment history' });
  }
});

// GET /api/risk/latest - Get user's latest assessment
router.get('/latest', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT ra.*, fp.monthly_income, fp.monthly_expenses, fp.monthly_savings,
              fp.total_debt, fp.monthly_emi, fp.emergency_fund, fp.investment_monthly,
              fp.income_type, fp.income_stability, fp.dependents,
              fp.has_health_insurance, fp.has_life_insurance
       FROM risk_assessments ra
       JOIN financial_profiles fp ON ra.profile_id = fp.id
       WHERE ra.user_id = ?
       ORDER BY ra.created_at DESC
       LIMIT 1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.json({ success: true, assessment: null });
    }

    const a = rows[0];
    res.json({
      success: true,
      assessment: {
        ...a,
        risk_factors: typeof a.risk_factors === 'string' ? JSON.parse(a.risk_factors) : a.risk_factors,
        recommendations: typeof a.recommendations === 'string' ? JSON.parse(a.recommendations) : a.recommendations,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching latest assessment' });
  }
});

// GET /api/risk/stats - Summary statistics for dashboard
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
         COUNT(*) as total_assessments,
         AVG(overall_score) as avg_score,
         MAX(overall_score) as best_score,
         MIN(overall_score) as worst_score,
         SUM(CASE WHEN risk_category = 'Low Risk' THEN 1 ELSE 0 END) as low_risk_count,
         SUM(CASE WHEN risk_category = 'Moderate Risk' THEN 1 ELSE 0 END) as moderate_risk_count,
         SUM(CASE WHEN risk_category = 'High Risk' THEN 1 ELSE 0 END) as high_risk_count
       FROM risk_assessments
       WHERE user_id = ?`,
      [req.user.id]
    );

    res.json({ success: true, stats: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
});

module.exports = router;
