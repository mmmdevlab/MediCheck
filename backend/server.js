const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { sequelize } = require("./src/config/database");

// Import routers
const authRoutes = require("./src/routes/authRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const caregiverRoutes = require("./src/routes/caregiverRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const supportRoutes = require("./src/routes/supportRoutes");
const medicalLogRoutes = require("./src/routes/medicalLogRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const requestLogger = require("./src/middleware/requestLogger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "MediCheck API is running",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/api/auth",
      appointments: "/api/appointments",
      caregivers: "/api/caregivers",
      patients: "/api/patients",
      support: "/api/support",
      logs: "/api/logs",
      task: "/api/tasks",
    },
  });
});

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/caregivers", caregiverRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/logs", medicalLogRoutes);
app.use("/api/tasks", taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  const message =
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : error.message;

  res.status(error.status || 500).json({ error: message });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`,
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

startServer();
