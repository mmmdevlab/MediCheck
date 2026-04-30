const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Appointment = sequelize.define(
  "Appointment",
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    doctorName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "doctor_name",
    },
    clinicName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "clinic_name",
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "clinic_id",
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "appointment_date",
    },
    location: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "scheduled",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "appointments",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Appointment;
