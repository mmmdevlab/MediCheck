const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Task = sequelize.define(
  "Task",
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
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    taskType: {
      type: DataTypes.ENUM(
        "medication",
        "imaging",
        "lab_work",
        "follow_up",
        "rest",
        "lifestyle",
        "other",
      ),
      allowNull: false,
      defaultValue: "other",
      field: "task_type",
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_completed",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "due_date",
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Task;
