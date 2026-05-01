const express = require("express");
const { initializeDatabase } = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Import routers
const authRouter = require("./controllers/authController");
const appointmentsRouter = require("./routes/appointmentsRoutes");
const caregiverRouter = require("./routes/caregiverRoutes");
const patientRouter = require("./routes/patientRoutes");
const supportRouter = require("./routes/supportRoutes");
const medicalLogRouter = require("./routes/medicalLogRoutes");
const taskRouter = require("./routes/taskRoutes");
const requestLogger = require("./middleware/requestLogger");

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
      task: "/api/task",
    },
  });
});

// Route mounting
app.use("/api/auth", authRouter);
app.use("/api/appointments", appointmentsRouter);
app.use("/api/caregivers", caregiverRouter);
app.use("/api/patients", patientRouter);
app.use("/api/support", supportRouter);
app.use("/api/logs", medicalLogRouter);
app.use("/api/task", taskRouter);

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

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeDatabase();

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
