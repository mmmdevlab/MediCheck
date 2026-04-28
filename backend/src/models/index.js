const User = require("./User");
const Appointment = require("./Appointment");
const CaregiverAssignment = require("./CaregiverAssignment");
const SupportRequest = require("./SupportRequest");
const MedicalLog = require("./MedicalLog");
const Task = require("./Task");

User.hasMany(Appointment, {
  foreignKey: "user_id",
  as: "appointments",
  onDelete: "CASCADE",
});

Appointment.belongsTo(User, {
  foreignKey: "user_id",
  as: "patient",
});

User.hasMany(MedicalLog, {
  foreignKey: "user_id",
  as: "medicalLogs",
  onDelete: "CASCADE",
});

MedicalLog.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

User.hasMany(Task, {
  foreignKey: "patient_id",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: "patient_id",
  as: "patient",
});

User.hasMany(CaregiverAssignment, {
  foreignKey: "patient_id",
  as: "caregiverAssignments",
  onDelete: "CASCADE",
});

CaregiverAssignment.belongsTo(User, {
  foreignKey: "patient_id",
  as: "patient",
});

User.hasMany(CaregiverAssignment, {
  foreignKey: "caregiver_id",
  as: "patientAssignments",
  onDelete: "CASCADE",
});

CaregiverAssignment.belongsTo(User, {
  foreignKey: "caregiver_id",
  as: "caregiver",
});

Appointment.hasMany(Task, {
  foreignKey: "appointment_id",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});

Appointment.hasMany(SupportRequest, {
  foreignKey: "appointment_id",
  as: "supportRequests",
  onDelete: "CASCADE",
});

SupportRequest.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});

User.hasMany(SupportRequest, {
  foreignKey: "patient_id",
  as: "createdSupportRequests",
  onDelete: "CASCADE",
});

SupportRequest.belongsTo(User, {
  foreignKey: "patient_id",
  as: "patient",
});

User.hasMany(SupportRequest, {
  foreignKey: "caregiver_id",
  as: "receivedSupportRequests",
  onDelete: "SET NULL",
});

SupportRequest.belongsTo(User, {
  foreignKey: "caregiver_id",
  as: "caregiver",
});

module.exports = {
  User,
  Appointment,
  CaregiverAssignment,
  SupportRequest,
  MedicalLog,
  Task,
};
