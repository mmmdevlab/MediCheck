const User = require("./User");
const Appointment = require("./Appointment");
const CaregiverAssignment = require("./CaregiverAssignment");
const SupportRequest = require("./SupportRequest");
const MedicalLog = require("./MedicalLog");
const Task = require("./Task");

/*-------User Appointments one to Many-------*/

User.hasMany(Appointment, {
  foreignKey: "userId",
  as: "appointments",
  onDelete: "CASCADE",
});

Appointment.belongsTo(User, {
  foreignKey: "userId",
  as: "patient",
});

/*-------User medial logs one to Many-------*/

User.hasMany(MedicalLog, {
  foreignKey: "userId",
  as: "medicalLogs",
  onDelete: "CASCADE",
});

MedicalLog.belongsTo(User, {
  foreignKey: "userId",
  as: "patient",
});

/*-------Caregiver assignment Many to Many-------*/

/*Patient side*/
User.hasMany(CaregiverAssignment, {
  foreignKey: "patientId",
  as: "caregiverAssignments",
  onDelete: "CASCADE",
});

CaregiverAssignment.belongsTo(User, {
  foreignKey: "patientId",
  as: "patient",
});

/*Caregiver side*/
User.hasMany(CaregiverAssignment, {
  foreignKey: "caregiverId",
  as: "patientAssignments",
  onDelete: "CASCADE",
});

CaregiverAssignment.belongsTo(User, {
  foreignKey: "caregiverId",
  as: "caregiver",
});

/*------- support request Many to One -------*/

/*Patient side*/
User.hasMany(SupportRequest, {
  foreignKey: "patientId",
  as: "createdSupportRequests",
  onDelete: "CASCADE",
});

SupportRequest.belongsTo(User, {
  foreignKey: "patientId",
  as: "patient",
});

/*Caregiver side*/
User.hasMany(SupportRequest, {
  foreignKey: "caregiverId",
  as: "assignedSupportRequests",
  onDelete: "SET NULL",
});

SupportRequest.belongsTo(User, {
  foreignKey: "caregiverId",
  as: "caregiver",
});

/*appointment*/

Appointment.hasMany(SupportRequest, {
  foreignKey: "appointmentId",
  as: "supportRequests",
  onDelete: "SET NULL",
});

SupportRequest.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

/*------- Task Many to One -------*/

/*Appointment*/
Appointment.hasMany(Task, {
  foreignKey: "appointmentId",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(Appointment, {
  foreignKey: "appointmentId",
  as: "appointment",
});

/*Patient*/
User.hasMany(Task, {
  foreignKey: "patientId",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: "patientId",
  as: "patient",
});

/*------- Medical Logs -------*/
MedicalLog.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(MedicalLog, {
  foreignKey: "userId",
  as: "medicalLogs",
});

module.exports = {
  User,
  Appointment,
  CaregiverAssignment,
  SupportRequest,
  MedicalLog,
  Task,
};
