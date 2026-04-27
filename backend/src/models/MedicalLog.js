const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const MedicalLog = sequelize.define(
  "MedicalLog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    feeling_score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
  },
  {
    tableName: "medical_logs",
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

module.exports = MedicalLog;
