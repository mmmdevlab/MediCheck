const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const AppError = require("./src/utils/AppError");

dotenv.config();

const { sequelize } = require("./src/config/database");
require("./src/models");

const authRoutes = require("./src/routes/authRoutes");
const appointmentRoutes = require("./src/routes/appointmentRoutes");
const caregiverRoutes = require("./src/routes/caregiverRoutes");
const patientRoutes = require("./src/routes/patientRoutes");
const supportRoutes = require("./src/routes/supportRoutes");
const medicalLogRoutes = require("./src/routes/medicalLogRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

const errorHandler = require("./src/middleware/errorHandler");
const requestLogger = require("./src/middleware/requestLogger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://medicheck-app.netlify.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.options("*", cors());

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ status: "MediCheck API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/caregivers", caregiverRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/logs", medicalLogRoutes);
app.use("/api/tasks", taskRoutes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync();
    console.log("Models and associations loaded");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
