-- RiskMirror Database Schema
-- Run this file to initialize the database

CREATE DATABASE IF NOT EXISTS riskmirror;
USE riskmirror;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Financial profiles table
CREATE TABLE IF NOT EXISTS financial_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  monthly_income DECIMAL(12,2) NOT NULL,
  monthly_expenses DECIMAL(12,2) NOT NULL,
  monthly_savings DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_debt DECIMAL(12,2) NOT NULL DEFAULT 0,
  monthly_emi DECIMAL(12,2) NOT NULL DEFAULT 0,
  emergency_fund DECIMAL(12,2) NOT NULL DEFAULT 0,
  investment_monthly DECIMAL(12,2) NOT NULL DEFAULT 0,
  income_type ENUM('salaried','self-employed','business','freelance','retired') NOT NULL DEFAULT 'salaried',
  income_stability ENUM('very_stable','stable','moderate','unstable','very_unstable') NOT NULL DEFAULT 'stable',
  dependents INT NOT NULL DEFAULT 0,
  has_health_insurance BOOLEAN DEFAULT FALSE,
  has_life_insurance BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Risk assessments table
CREATE TABLE IF NOT EXISTS risk_assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  profile_id INT NOT NULL,
  risk_category ENUM('Low Risk','Moderate Risk','High Risk') NOT NULL,
  overall_score DECIMAL(5,2) NOT NULL,
  savings_ratio DECIMAL(5,2),
  debt_to_income_ratio DECIMAL(5,2),
  expense_ratio DECIMAL(5,2),
  emi_to_income_ratio DECIMAL(5,2),
  emergency_fund_months DECIMAL(5,2),
  investment_ratio DECIMAL(5,2),
  risk_factors JSON,
  recommendations JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (profile_id) REFERENCES financial_profiles(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_financial_profiles_user_id ON financial_profiles(user_id);
CREATE INDEX idx_risk_assessments_user_id ON risk_assessments(user_id);
CREATE INDEX idx_risk_assessments_created_at ON risk_assessments(created_at);
