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
    appointmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "appointment_id",
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "patient_id",
    },
    caregiverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "caregiver_id",
    },
    requestType: {
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
      field: "request_type",
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
    respondedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "responded_at",
    },
  },
  {
    tableName: "support_requests",
    timestamps: true,
    underscored: true,
  },
);

module.exports = SupportRequest;
