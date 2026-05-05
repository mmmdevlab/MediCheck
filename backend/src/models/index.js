const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const User = require("./User");
const Appointment = require("./Appointment");
const CaregiverAssignment = require("./CaregiverAssignment");
const SupportRequest = require("./SupportRequest");
const MedicalLog = require("./MedicalLog");
const Task = require("./Task");

User.hasMany(Appointment, {
  foreignKey: "userId",
  as: "appointments",
  onDelete: "CASCADE",
});

Appointment.belongsTo(User, {
  foreignKey: "userId",
  as: "patient",
});

User.hasMany(MedicalLog, {
  foreignKey: "userId",
  as: "medicalLogs",
  onDelete: "CASCADE",
});

MedicalLog.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(CaregiverAssignment, {
  foreignKey: "patientId",
  as: "caregiverAssignments",
  onDelete: "CASCADE",
});

CaregiverAssignment.belongsTo(User, {
  foreignKey: "patientId",
  as: "patient",
});

User.hasMany(CaregiverAssignment, {
  foreignKey: "caregiverId",
  as: "patientAssignments",
  onDelete: "CASCADE",
});

CaregiverAssignment.belongsTo(User, {
  foreignKey: "caregiverId",
  as: "caregiver",
});

User.hasMany(SupportRequest, {
  foreignKey: "patientId",
  as: "createdSupportRequests",
  onDelete: "CASCADE",
});

SupportRequest.belongsTo(User, {
  foreignKey: "patientId",
  as: "patient",
});

User.hasMany(SupportRequest, {
  foreignKey: "caregiverId",
  as: "assignedSupportRequests",
  onDelete: "SET NULL",
});

SupportRequest.belongsTo(User, {
  foreignKey: "caregiverId",
  as: "caregiver",
});

Appointment.hasMany(SupportRequest, {
  foreignKey: "appointmentId",
  as: "supportRequests",
  onDelete: "SET NULL",
});

SupportRequest.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

Appointment.hasMany(Task, {
  foreignKey: "appointmentId",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

User.hasMany(Task, {
  foreignKey: "patientId",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: "patientId",
  as: "patient",
});

module.exports = {
  User,
  Appointment,
  CaregiverAssignment,
  SupportRequest,
  MedicalLog,
  Task,
};
