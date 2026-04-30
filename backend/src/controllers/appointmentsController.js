const Appointment = require("../models/Appointment");
const {
  appointmentSchema,
  appointmentUpdateSchema,
} = require("../validations/appointmentSchemas");

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.user.userId },
      order: [["appointmentDate", "ASC"]],
    });
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid appointment ID format" });
    }
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Forbidden - not your appointment" });
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error fetching appointment:", error);
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};

const createAppointment = async (req, res) => {
  try {
    const validatedData = appointmentSchema.parse(req.body);

    const appointment = await Appointment.create({
      ...validatedData,
      userId: req.user.userId,
    });

    res.status(201).json(appointment);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

const updateAppointment = async (req, res) => {
  try {
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
      return res
        .status(403)
        .json({ error: "Forbidden - not your appointment" });
    }

    await appointment.update(validatedData);
    res.status(200).json(appointment);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Error updating appointment:", error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid appointment ID format" });
    }
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (appointment.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Forbidden - not your appointment" });
    }

    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
