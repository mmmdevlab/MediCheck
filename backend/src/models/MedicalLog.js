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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    feelingScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      field: "feeling_score",
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
