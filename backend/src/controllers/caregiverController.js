const { Op } = require("sequelize");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const { grantAccessSchema } = require("../validations/caregiverSchema");
const catchAsync = require("../utils/catchAsync");

const grantCaregiverAccess = catchAsync(async (req, res, next) => {
  const validatedData = grantAccessSchema.parse(req.body);
  const { caregiverEmail } = validatedData;
  const patientId = req.user.userId;
  const caregiver = await User.findOne({
    where: {
      email: caregiverEmail,
      role: "caregiver",
    },
  });
  if (!caregiver) {
    return res.status(404).json({
      error: "Caregiver not found. Make sure they have a caregiver account.",
    });
  }
  if (caregiver.id === patientId) {
    return res.status(400).json({
      error: "You cannot assign yourself as a caregiver",
    });
  }
  const existingAssignment = await CaregiverAssignment.findOne({
    where: {
      patientId: patientId,
      caregiverId: caregiver.id,
      isActive: true,
    },
  });
  if (existingAssignment) {
    return res.status(400).json({
      error: "This caregiver already has access",
    });
  }
  const assignment = await CaregiverAssignment.create({
    patientId: patientId,
    caregiverId: caregiver.id,
    isActive: true,
  });
  res.status(201).json({
    message: "Caregiver access granted successfully",
    assignment: {
      id: assignment.id,
      caregiverId: caregiver.id,
      caregiverName: caregiver.fullName,
      caregiverEmail: caregiver.email,
      grantedAt: assignment.grantedAt,
    },
  });
});

const getMyCaregivers = catchAsync(async (req, res, next) => {
  const patientId = req.user.userId;
  const assignments = await CaregiverAssignment.findAll({
    where: {
      patientId: patientId,
      isActive: true,
    },
    include: [
      {
        model: User,
        as: "caregiver",
        attributes: ["id", "fullName", "email", "phone"],
      },
    ],
    order: [["grantedAt", "DESC"]],
  });

  const caregivers = assignments.map((a) => ({
    assignmentId: a.id,
    caregiverId: a.caregiver.id,
    name: a.caregiver.fullName,
    email: a.caregiver.email,
    phone: a.caregiver.phone,
    grantedAt: a.grantedAt,
  }));
  res.status(200).json(caregivers);
});

const revokeCaregiverAccess = catchAsync(async (req, res, next) => {
  const assignmentId = parseInt(req.params.id, 10);
  if (isNaN(assignmentId)) {
    return res.status(400).json({ error: "Invalid assignment ID format" });
  }
  const assignment = await CaregiverAssignment.findOne({
    where: {
      id: assignmentId,
      isActive: true,
      [Op.or]: [
        { patientId: req.user.userId },
        { caregiverId: req.user.userId },
      ],
    },
  });
  if (!assignment) {
    return res.status(404).json({
      error: "Assignment not found or already revoked",
    });
  }
  assignment.isActive = false;
  assignment.revokedAt = new Date();
  await assignment.save();

  res.status(200).json({
    message: "Caregiver access revoked successfully",
  });
});

const getMyPatients = catchAsync(async (req, res, next) => {
  const caregiverId = req.user.userId;
  const assignments = await CaregiverAssignment.findAll({
    where: {
      caregiverId: caregiverId,
      isActive: true,
    },
    include: [
      {
        model: User,
        as: "patient",
        attributes: ["id", "fullName", "email", "phone"],
      },
    ],
    order: [["grantedAt", "DESC"]],
  });
  const patients = assignments.map((a) => ({
    assignmentId: a.id,
    patientId: a.patient.id,
    name: a.patient.fullName,
    email: a.patient.email,
    phone: a.patient.phone,
    accessGrantedAt: a.grantedAt,
  }));
  res.status(200).json(patients);
});

const getPatientAppointments = catchAsync(async (req, res, next) => {
  const patientId = parseInt(req.params.id, 10);
  const caregiverId = req.user.userId;
  if (isNaN(patientId)) {
    return res.status(400).json({ error: "Invalid patient ID format" });
  }
  const assignment = await CaregiverAssignment.findOne({
    where: {
      patientId: patientId,
      caregiverId: caregiverId,
      isActive: true,
    },
  });
  if (!assignment) {
    return res.status(403).json({
      error: "Forbidden",
    });
  }
  const appointments = await Appointment.findAll({
    where: { userId: patientId },
    order: [["appointmentDate", "ASC"]],
  });
  res.status(200).json(appointments);
});

module.exports = {
  grantCaregiverAccess,
  getMyCaregivers,
  revokeCaregiverAccess,

  getMyPatients,
  getPatientAppointments,
};
