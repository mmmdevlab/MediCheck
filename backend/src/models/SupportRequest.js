const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const SupportRequest = sequelize.define(
  "SupportRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caregiver_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    request_type: {
      type: DataTypes.ENUM(
        "transport",
        "notes",
        "pickup",
        "meal_prep",
        "recovery_care",
        "other",
      ),
      allowNull: false,
      defaultValue: "transport",
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined", "completed"),
      allowNull: false,
      defaultValue: "pending",
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    responded_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "support_requests",
    timestamps: true,
    underscored: true,
  },
);

module.exports = SupportRequest;
