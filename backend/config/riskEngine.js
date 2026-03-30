/**
 * RiskMirror - Financial Risk Engine
 * Calculates financial risk score and generates profiles
 */

const calculateRisk = (data) => {
  const {
    monthly_income,
    monthly_expenses,
    monthly_savings,
    total_debt,
    monthly_emi,
    emergency_fund,
    investment_monthly,
    income_type,
    income_stability,
    dependents,
    has_health_insurance,
    has_life_insurance,
  } = data;

  const income = parseFloat(monthly_income) || 0;
  const expenses = parseFloat(monthly_expenses) || 0;
  const savings = parseFloat(monthly_savings) || 0;
  const debt = parseFloat(total_debt) || 0;
  const emi = parseFloat(monthly_emi) || 0;
  const emergency = parseFloat(emergency_fund) || 0;
  const investment = parseFloat(investment_monthly) || 0;

  const factors = [];
  const recommendations = [];
  let totalScore = 0;

  // ─── 1. Savings Ratio (20 points) ───────────────────────────────────────
  const savingsRatio = income > 0 ? (savings / income) * 100 : 0;
  let savingsScore = 0;
  if (savingsRatio >= 20) {
    savingsScore = 20;
  } else if (savingsRatio >= 15) {
    savingsScore = 16;
    factors.push({ label: 'Savings ratio slightly below optimal', severity: 'low', value: savingsRatio.toFixed(1) + '%' });
  } else if (savingsRatio >= 10) {
    savingsScore = 12;
    factors.push({ label: 'Below recommended savings rate (20%)', severity: 'medium', value: savingsRatio.toFixed(1) + '%' });
    recommendations.push('Aim to save at least 20% of monthly income');
  } else if (savingsRatio >= 5) {
    savingsScore = 6;
    factors.push({ label: 'Very low savings rate – financial vulnerability high', severity: 'high', value: savingsRatio.toFixed(1) + '%' });
    recommendations.push('Increase savings rate to at least 10% immediately');
  } else {
    savingsScore = 0;
    factors.push({ label: 'Critical: Little to no savings', severity: 'critical', value: savingsRatio.toFixed(1) + '%' });
    recommendations.push('Begin emergency savings plan as top priority');
  }
  totalScore += savingsScore;

  // ─── 2. Expense Ratio (15 points) ────────────────────────────────────────
  const expenseRatio = income > 0 ? (expenses / income) * 100 : 100;
  let expenseScore = 0;
  if (expenseRatio <= 50) {
    expenseScore = 15;
  } else if (expenseRatio <= 60) {
    expenseScore = 12;
  } else if (expenseRatio <= 70) {
    expenseScore = 8;
    factors.push({ label: 'Expenses consume over 70% of income', severity: 'medium', value: expenseRatio.toFixed(1) + '%' });
    recommendations.push('Track and reduce discretionary spending');
  } else if (expenseRatio <= 85) {
    expenseScore = 4;
    factors.push({ label: 'High expense ratio – limited financial buffer', severity: 'high', value: expenseRatio.toFixed(1) + '%' });
    recommendations.push('Cut non-essential expenses to below 70% of income');
  } else {
    expenseScore = 0;
    factors.push({ label: 'Over-spending: Expenses exceed income capacity', severity: 'critical', value: expenseRatio.toFixed(1) + '%' });
    recommendations.push('Urgently restructure budget – expenses are unsustainable');
  }
  totalScore += expenseScore;

  // ─── 3. Debt-to-Income Ratio (20 points) ────────────────────────────────
  const debtToIncome = income > 0 ? (debt / (income * 12)) * 100 : 0;
  let debtScore = 0;
  if (debtToIncome === 0) {
    debtScore = 20;
  } else if (debtToIncome <= 15) {
    debtScore = 17;
  } else if (debtToIncome <= 30) {
    debtScore = 13;
    factors.push({ label: 'Moderate debt level relative to income', severity: 'low', value: debtToIncome.toFixed(1) + '%' });
  } else if (debtToIncome <= 50) {
    debtScore = 7;
    factors.push({ label: 'High total debt – above 30% of annual income', severity: 'high', value: debtToIncome.toFixed(1) + '%' });
    recommendations.push('Prioritize debt repayment using avalanche or snowball method');
  } else {
    debtScore = 0;
    factors.push({ label: 'Critical debt level – over 50% of annual income', severity: 'critical', value: debtToIncome.toFixed(1) + '%' });
    recommendations.push('Consider debt consolidation or financial counseling');
  }
  totalScore += debtScore;

  // ─── 4. EMI-to-Income Ratio (15 points) ─────────────────────────────────
  const emiRatio = income > 0 ? (emi / income) * 100 : 0;
  let emiScore = 0;
  if (emiRatio === 0) {
    emiScore = 15;
  } else if (emiRatio <= 20) {
    emiScore = 13;
  } else if (emiRatio <= 30) {
    emiScore = 9;
    factors.push({ label: 'EMI obligations exceed 20% of income', severity: 'medium', value: emiRatio.toFixed(1) + '%' });
  } else if (emiRatio <= 40) {
    emiScore = 4;
    factors.push({ label: 'Heavy EMI burden – over 30% of income committed', severity: 'high', value: emiRatio.toFixed(1) + '%' });
    recommendations.push('Avoid taking new loans; focus on clearing existing EMIs');
  } else {
    emiScore = 0;
    factors.push({ label: 'EMI overload – over 40% of income in repayments', severity: 'critical', value: emiRatio.toFixed(1) + '%' });
    recommendations.push('Refinance loans for lower EMI or extend tenure');
  }
  totalScore += emiScore;

  // ─── 5. Emergency Fund (15 points) ──────────────────────────────────────
  const emergencyMonths = expenses > 0 ? emergency / expenses : 0;
  let emergencyScore = 0;
  if (emergencyMonths >= 6) {
    emergencyScore = 15;
  } else if (emergencyMonths >= 4) {
    emergencyScore = 11;
  } else if (emergencyMonths >= 2) {
    emergencyScore = 7;
    factors.push({ label: 'Emergency fund below 4 months of expenses', severity: 'medium', value: emergencyMonths.toFixed(1) + ' months' });
    recommendations.push('Build emergency fund to cover at least 6 months of expenses');
  } else if (emergencyMonths >= 1) {
    emergencyScore = 3;
    factors.push({ label: 'Insufficient emergency fund (< 2 months)', severity: 'high', value: emergencyMonths.toFixed(1) + ' months' });
    recommendations.push('Urgently grow emergency fund – start with 3 months coverage');
  } else {
    emergencyScore = 0;
    factors.push({ label: 'No emergency fund – severe financial fragility', severity: 'critical', value: '0 months' });
    recommendations.push('Open a dedicated emergency savings account immediately');
  }
  totalScore += emergencyScore;

  // ─── 6. Investment Habit (10 points) ────────────────────────────────────
  const investmentRatio = income > 0 ? (investment / income) * 100 : 0;
  let investmentScore = 0;
  if (investmentRatio >= 15) {
    investmentScore = 10;
  } else if (investmentRatio >= 10) {
    investmentScore = 8;
  } else if (investmentRatio >= 5) {
    investmentScore = 5;
    factors.push({ label: 'Low investment allocation (< 10% of income)', severity: 'low', value: investmentRatio.toFixed(1) + '%' });
    recommendations.push('Increase monthly investments to build long-term wealth');
  } else if (investmentRatio > 0) {
    investmentScore = 2;
    factors.push({ label: 'Minimal investment activity', severity: 'medium', value: investmentRatio.toFixed(1) + '%' });
    recommendations.push('Start SIPs or index funds with at least 5% of income');
  } else {
    investmentScore = 0;
    factors.push({ label: 'No investment activity detected', severity: 'high', value: '0%' });
    recommendations.push('Begin investing even small amounts to build the habit');
  }
  totalScore += investmentScore;

  // ─── 7. Income Stability (5 points) ─────────────────────────────────────
  const stabilityMap = { very_stable: 5, stable: 4, moderate: 3, unstable: 1, very_unstable: 0 };
  const stabilityScore = stabilityMap[income_stability] ?? 3;
  if (stabilityScore <= 1) {
    factors.push({ label: 'Unstable income source increases financial risk', severity: 'high', value: income_stability });
    recommendations.push('Build larger emergency fund to offset income instability');
  } else if (stabilityScore === 3) {
    factors.push({ label: 'Moderate income stability – some uncertainty exists', severity: 'low', value: income_stability });
  }
  totalScore += stabilityScore;

  // ─── 8. Insurance Coverage (bonus adjustments) ──────────────────────────
  if (!has_health_insurance) {
    totalScore = Math.max(0, totalScore - 3);
    factors.push({ label: 'No health insurance – medical risk unmitigated', severity: 'medium', value: 'Uninsured' });
    recommendations.push('Get health insurance to protect against medical emergencies');
  }
  if (!has_life_insurance && dependents > 0) {
    totalScore = Math.max(0, totalScore - 2);
    factors.push({ label: 'No life insurance with financial dependents', severity: 'high', value: `${dependents} dependent(s)` });
    recommendations.push('Purchase term life insurance to protect dependents');
  }

  // ─── Final Category ──────────────────────────────────────────────────────
  let risk_category;
  if (totalScore >= 75) {
    risk_category = 'Low Risk';
  } else if (totalScore >= 45) {
    risk_category = 'Moderate Risk';
  } else {
    risk_category = 'High Risk';
  }

  return {
    risk_category,
    overall_score: Math.min(100, Math.max(0, totalScore)),
    savings_ratio: parseFloat(savingsRatio.toFixed(2)),
    debt_to_income_ratio: parseFloat(debtToIncome.toFixed(2)),
    expense_ratio: parseFloat(expenseRatio.toFixed(2)),
    emi_to_income_ratio: parseFloat(emiRatio.toFixed(2)),
    emergency_fund_months: parseFloat(emergencyMonths.toFixed(2)),
    investment_ratio: parseFloat(investmentRatio.toFixed(2)),
    risk_factors: factors,
    recommendations: [...new Set(recommendations)],
    score_breakdown: {
      savings: savingsScore,
      expenses: expenseScore,
      debt: debtScore,
      emi: emiScore,
      emergency: emergencyScore,
      investment: investmentScore,
      stability: stabilityScore,
    },
  };
};

module.exports = { calculateRisk };
