const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize, testConnection } = require("./config/database");

dotenv.config();

const app = express();
const authRouter = require("./controllers/authController");
const verifyToken = require("./middleware/verifyToken");
const User = require("./models/User");

// --Middleware--
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --Routes--
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
