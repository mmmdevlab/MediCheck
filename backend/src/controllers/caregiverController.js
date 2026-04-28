const User = require("../models/User");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const Appointment = require("../models/Appointment");
const { grantAccessSchema } = require("../validations/caregiverSchema");

// PATIENT POV - Managing who has access to their data
const grantCaregiverAccess = async (req, res) => {
  try {
    // Validate input
    const validatedData = grantAccessSchema.parse(req.body);
    const { caregiver_email } = validatedData;

    const patientId = req.user.userId;

    const caregiver = await User.findOne({
      where: {
        email: caregiver_email,
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
        patient_id: patientId,
        caregiver_id: caregiver.id,
        is_active: true,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({
        error: "This caregiver already has access",
      });
    }

    const assignment = await CaregiverAssignment.create({
      patient_id: patientId,
      caregiver_id: caregiver.id,
      is_active: true,
    });

    res.status(201).json({
      message: "Caregiver access granted successfully",
      assignment: {
        id: assignment.id,
        caregiver_id: caregiver.id,
        caregiver_name: caregiver.full_name,
        caregiver_email: caregiver.email,
        granted_at: assignment.access_granted_at,
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
        patient_id: patientId,
        is_active: true,
      },
      include: [
        {
          model: User,
          as: "caregiver",
          attributes: ["id", "full_name", "email", "phone"],
        },
      ],
      order: [["access_granted_at", "DESC"]],
    });

    const caregivers = assignments.map((a) => ({
      assignment_id: a.id,
      caregiver_id: a.caregiver.id,
      name: a.caregiver.full_name,
      email: a.caregiver.email,
      phone: a.caregiver.phone,
      granted_at: a.access_granted_at,
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
        patient_id: patientId,
        is_active: true,
      },
    });

    if (!assignment) {
      return res.status(404).json({
        error: "Assignment not found or already revoked",
      });
    }

    assignment.is_active = false;
    assignment.revoked_at = new Date();
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
        caregiver_id: caregiverId,
        is_active: true,
      },
      include: [
        {
          model: User,
          as: "patient",
          attributes: ["id", "full_name", "email", "phone"],
        },
      ],
      order: [["access_granted_at", "DESC"]],
    });

    const patients = assignments.map((a) => ({
      patient_id: a.patient.id,
      name: a.patient.full_name,
      email: a.patient.email,
      phone: a.patient.phone,
      access_granted_at: a.access_granted_at,
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
        patient_id: patientId,
        caregiver_id: caregiverId,
        is_active: true,
      },
    });

    if (!assignment) {
      return res.status(403).json({
        error: "Forbidden - You do not have access to this patient's data",
      });
    }

    const appointments = await Appointment.findAll({
      where: { user_id: patientId },
      order: [["appointment_date", "ASC"]],
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
