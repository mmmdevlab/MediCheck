import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize, testConnection } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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

// TODO: Add auth routes
// TODO: Add medication routes
// TODO: Add appointment routes

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
