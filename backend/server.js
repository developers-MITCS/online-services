const express = require("express");
const cors = require("cors");
require("dotenv").config();

// routes
const departmentRoutes = require("./src/routes/department.routes");
const employeeRoutes = require("./src/routes/employee.routes");
const authRoutes = require("./src/routes/auth.routes");

// middleware (API logger)
const apiLogger = require("./src/middleware/apiLogger.middleware");

const app = express();

/**
 * =========================
 * GLOBAL MIDDLEWARES
 * =========================
 */
app.use(cors());
app.use(express.json());

// log every request
app.use(apiLogger);

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: " API Running 🚀",
  });
});

/**
 * =========================
 * API ROUTES
 * =========================
 */
app.use("/departments", departmentRoutes);
app.use("/members", employeeRoutes);

app.use("/auth", authRoutes);

/**
 * =========================
 * HANDLE 404
 * =========================
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: "NOT_FOUND",
  });
});

/**
 * =========================
 * START SERVER
 * =========================
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
