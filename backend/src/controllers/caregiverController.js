const User = require("../models/User");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const Appointment = require("../models/Appointment");
const { grantAccessSchema } = require("../validations/caregiverSchema");

// PATIENT POV - Managing who has access to their data
const grantCaregiverAccess = async (req, res) => {
  try {
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
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Error granting caregiver access:", error);
    res.status(500).json({ error: "Failed to grant caregiver access" });
  }
};

const getMyCaregivers = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching caregivers:", error);
    res.status(500).json({ error: "Failed to fetch caregivers" });
  }
};

const revokeCaregiverAccess = async (req, res) => {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const patientId = req.user.userId;

    if (isNaN(assignmentId)) {
      return res.status(400).json({ error: "Invalid assignment ID format" });
    }

    const assignment = await CaregiverAssignment.findOne({
      where: {
        id: assignmentId,
        patientId: patientId,
        isActive: true,
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
  } catch (error) {
    console.error("Error revoking caregiver access:", error);
    res.status(500).json({ error: "Failed to revoke caregiver access" });
  }
};

// CAREGIVER Pov - Viewing patients they caring for
const getMyPatients = async (req, res) => {
  try {
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
      patientId: a.patient.id,
      name: a.patient.fullName,
      email: a.patient.email,
      phone: a.patient.phone,
      accessGrantedAt: a.grantedAt,
    }));

    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
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
        error: "Forbidden - You do not have access to this patient's data",
      });
    }

    const appointments = await Appointment.findAll({
      where: { userId: patientId },
      order: [["appointmentDate", "ASC"]],
    });

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

module.exports = {
  // Patient actions
  grantCaregiverAccess,
  getMyCaregivers,
  revokeCaregiverAccess,

  // Caregiver actions
  getMyPatients,
  getPatientAppointments,
};
