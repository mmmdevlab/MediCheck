const Appointment = require("../models/Appointment");
const { SupportRequest, User } = require("../models");
const {
  appointmentSchema,
  appointmentUpdateSchema,
} = require("../validations/appointmentSchemas");
const catchAsync = require("../utils/catchAsync");

const getAllAppointments = catchAsync(async (req, res, next) => {
  const appointments = await Appointment.findAll({
    where: { userId: req.user.userId },
    include: [
      {
        model: SupportRequest,
        as: "supportRequests",
        required: false,
        include: [
          {
            model: User,
            as: "caregiver",
            attributes: ["id", "fullName", "email"],
          },
        ],
      },
    ],
    order: [["appointmentDate", "ASC"]],
  });

  const result = appointments.map((apt) => {
    const data = apt.toJSON();
    data.supportRequest =
      (data.supportRequests || []).find(
        (r) => r.status === "pending" || r.status === "accepted",
      ) || null;
    delete data.supportRequests;
    return data;
  });

  res.status(200).json({ appointments: result });
});

const getAppointmentById = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID format" });
  }
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  if (appointment.userId !== req.user.userId) {
    return res.status(403).json({ error: "Forbidden - not your appointment" });
  }
  res.status(200).json(appointment);
});

const createAppointment = catchAsync(async (req, res, next) => {
  const validatedData = appointmentSchema.parse(req.body);
  const appointment = await Appointment.create({
    ...validatedData,
    userId: req.user.userId,
  });
  res.status(201).json(appointment);
});

const updateAppointment = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID format" });
  }
  const validatedData = appointmentUpdateSchema.parse(req.body);
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  if (appointment.userId !== req.user.userId) {
    return res.status(403).json({ error: "Forbidden - not your appointment" });
  }
  await appointment.update(validatedData);
  res.status(200).json(appointment);
});

const deleteAppointment = catchAsync(async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid appointment ID format" });
  }
  const appointment = await Appointment.findByPk(id);
  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  if (appointment.userId !== req.user.userId) {
    return res.status(403).json({ error: "Forbidden - not your appointment" });
  }
  await appointment.destroy();
  res.status(204).send();
});

const markComplete = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findOne({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });
  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  await appointment.update({ status: "completed" });
  return res.json({ appointment });
});

const undoComplete = catchAsync(async (req, res, next) => {
  const appointment = await Appointment.findOne({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });
  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  if (appointment.status !== "completed") {
    return res.status(400).json({
      error: "Can only undo completed appointments",
    });
  }
  await appointment.update({ status: "scheduled" });
  return res.json({
    message: "Appointment status reverted to scheduled",
    appointment,
  });
});

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  markComplete,
  undoComplete,
};
