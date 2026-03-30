const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const { analyzeRisk, chatWithAI, getQuickInsights } = require('../controllers/aiController');

/**
 * POST /api/ai/analyze
 * Get AI explanation and personalized recommendations
 * Authentication: Required
 */
router.post('/analyze', authMiddleware, async (req, res) => {
  await analyzeRisk(req, res);
});

/**
 * POST /api/ai/chat
 * Chat with AI assistant
 * Authentication: Required
 * Body: { question: string }
 */
router.post(
  '/chat',
  authMiddleware,
  [body('question').notEmpty().trim().isLength({ min: 5, max: 500 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Question must be between 5-500 characters',
        errors: errors.array(),
      });
    }

    await chatWithAI(req, res);
  }
);

/**
 * GET /api/ai/insights
 * Get quick financial insights (rule-based, no AI)
 * Authentication: Required
 */
router.get('/insights', authMiddleware, async (req, res) => {
  await getQuickInsights(req, res);
});

module.exports = router;
