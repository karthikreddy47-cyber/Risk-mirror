const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { testConnection } = require("./config/database");
const authRoutes = require("./routes/auth");
const riskRoutes = require("./routes/risk");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route (IMPORTANT for localhost)
app.get("/", (req, res) => {
  res.send("🚀 RiskMirror Backend is Running");
});

// Example API route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/risk", riskRoutes);
app.use("/api/ai", aiRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 RiskMirror API running on http://localhost:${PORT}`);
  testConnection();
});