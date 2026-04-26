import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1); // Exit if DB fails
  }
};

export { sequelize, testConnection };
