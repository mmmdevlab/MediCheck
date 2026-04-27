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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    doctor_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    clinic_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    clinic_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    appointment_date: {
      type: DataTypes.DATE,
      allowNull: false,
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
