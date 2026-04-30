const SupportRequest = require("../models/SupportRequest");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const User = require("../models/User");
const Appointment = require("../models/Appointment");
const {
  createSupportRequestSchema,
  updateSupportRequestSchema,
} = require("../validations/supportSchema");

/*------------------ PATIENT POV ------------------*/

/*------------------Create a new request------------------*/
const createSupportRequest = async (req, res) => {
  try {
    const validatedData = createSupportRequestSchema.parse(req.body);
    const patientId = req.user.userId;

    if (validatedData.appointmentId) {
      const appointment = await Appointment.findOne({
        where: {
          id: validatedData.appointmentId,
          userId: patientId,
        },
      });

      if (!appointment) {
        return res.status(404).json({
          error: "Appointment not found or you don't have access to it",
        });
      }
    }

    if (validatedData.caregiverId) {
      const assignment = await CaregiverAssignment.findOne({
        where: {
          patientId: patientId,
          caregiverId: validatedData.caregiverId,
          isActive: true,
        },
      });

      if (!assignment) {
        return res.status(403).json({
          error: "This caregiver does not have access to your account",
        });
      }
    }

    const supportRequest = await SupportRequest.create({
      patientId: patientId,
      ...validatedData,
      status: "pending",
    });

    const createdRequest = await SupportRequest.findByPk(supportRequest.id, {
      include: [
        {
          model: User,
          as: "caregiver",
          attributes: ["id", "fullName", "email"],
        },
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
        },
      ],
    });

    res.status(201).json({
      message: "Support request created successfully",
      supportRequest: createdRequest,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Error creating support request:", error);
    res.status(500).json({ error: "Failed to create support request" });
  }
};

/*------------------Get all requests created by the patient------------------*/
const getMySupportRequests = async (req, res) => {
  try {
    const patientId = req.user.userId;

    const requests = await SupportRequest.findAll({
      where: { patientId: patientId },
      include: [
        {
          model: User,
          as: "caregiver",
          attributes: ["id", "fullName", "email", "phone"],
        },
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching support requests:", error);
    res.status(500).json({ error: "Failed to fetch support requests" });
  }
};

/*------------------Get a one request by ID (patient must own it)------------------*/
const getSupportRequestById = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const patientId = req.user.userId;

    if (isNaN(requestId)) {
      return res.status(400).json({ error: "Invalid request ID format" });
    }

    const supportRequest = await SupportRequest.findOne({
      where: {
        id: requestId,
        patientId: patientId,
      },
      include: [
        {
          model: User,
          as: "caregiver",
          attributes: ["id", "fullName", "email", "phone"],
        },
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
        },
      ],
    });

    if (!supportRequest) {
      return res.status(404).json({ error: "Support request not found" });
    }

    res.status(200).json(supportRequest);
  } catch (error) {
    console.error("Error fetching support request:", error);
    res.status(500).json({ error: "Failed to fetch support request" });
  }
};

/*------------------Update a request (only update message)------------------*/
const updateSupportRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const patientId = req.user.userId;
    const validatedData = updateSupportRequestSchema.parse(req.body);

    if (isNaN(requestId)) {
      return res.status(400).json({ error: "Invalid request ID format" });
    }

    const supportRequest = await SupportRequest.findOne({
      where: {
        id: requestId,
        patientId: patientId,
      },
    });

    if (!supportRequest) {
      return res.status(404).json({ error: "Support request not found" });
    }

    if (supportRequest.status !== "pending") {
      return res.status(400).json({
        error: `Cannot update request with status: ${supportRequest.status}`,
      });
    }

    await supportRequest.update({
      message: validatedData.message,
    });

    const updatedRequest = await SupportRequest.findByPk(supportRequest.id, {
      include: [
        {
          model: User,
          as: "caregiver",
          attributes: ["id", "fullName", "email"],
        },
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
        },
      ],
    });

    res.status(200).json({
      message: "Support request updated successfully",
      supportRequest: updatedRequest,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }

    console.error("Error updating support request:", error);
    res.status(500).json({ error: "Failed to update support request" });
  }
};

/*------------------Delete (only if pending)------------------*/
const deleteSupportRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const patientId = req.user.userId;

    if (isNaN(requestId)) {
      return res.status(400).json({ error: "Invalid request ID format" });
    }

    const supportRequest = await SupportRequest.findOne({
      where: {
        id: requestId,
        patientId: patientId,
      },
    });

    if (!supportRequest) {
      return res.status(404).json({ error: "Support request not found" });
    }

    if (supportRequest.status !== "pending") {
      return res.status(400).json({
        error: `Cannot delete request with status: ${supportRequest.status}`,
      });
    }

    await supportRequest.destroy();

    res.status(200).json({
      message: "Support request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting support request:", error);
    res.status(500).json({ error: "Failed to delete support request" });
  }
};

/*------------------ CAREGIVER POV ------------------*/

/*------------------Get all requests assigned to the caregiver------------------*/
const getAssignedSupportRequests = async (req, res) => {
  try {
    const caregiverId = req.user.userId;

    const requests = await SupportRequest.findAll({
      where: { caregiverId: caregiverId },
      include: [
        {
          model: User,
          as: "patient",
          attributes: ["id", "fullName", "email", "phone"],
        },
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching assigned requests:", error);
    res.status(500).json({ error: "Failed to fetch support requests" });
  }
};

/*------------------Res to request (accept/decline)------------------*/
const respondToSupportRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const caregiverId = req.user.userId;
    const { status } = req.body;

    if (isNaN(requestId)) {
      return res.status(400).json({ error: "Invalid request ID format" });
    }

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({
        error: "Invalid status. Must be 'accepted' or 'declined'",
      });
    }

    const supportRequest = await SupportRequest.findOne({
      where: {
        id: requestId,
        caregiverId: caregiverId,
      },
    });

    if (!supportRequest) {
      return res.status(404).json({
        error: "Support request not found or not assigned to you",
      });
    }

    if (supportRequest.status !== "pending") {
      return res.status(400).json({
        error: `Cannot respond to request with status: ${supportRequest.status}`,
      });
    }

    await supportRequest.update({
      status,
      respondedAt: new Date(),
    });

    const updatedRequest = await SupportRequest.findByPk(supportRequest.id, {
      include: [
        {
          model: User,
          as: "patient",
          attributes: ["id", "fullName", "email", "phone"],
        },
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
        },
      ],
    });

    res.status(200).json({
      message: `Support request ${status} successfully`,
      supportRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Error responding to support request:", error);
    res.status(500).json({ error: "Failed to respond to support request" });
  }
};

/*------------------Mark as done------------------*/
const completeSupportRequest = async (req, res) => {
  try {
    const requestId = parseInt(req.params.id, 10);
    const caregiverId = req.user.userId;

    if (isNaN(requestId)) {
      return res.status(400).json({ error: "Invalid request ID format" });
    }

    const supportRequest = await SupportRequest.findOne({
      where: {
        id: requestId,
        caregiverId: caregiverId,
      },
    });

    if (!supportRequest) {
      return res.status(404).json({
        error: "Support request not found or not assigned to you",
      });
    }

    if (supportRequest.status !== "accepted") {
      return res.status(400).json({
        error: "Can only complete accepted requests",
      });
    }

    await supportRequest.update({
      status: "completed",
    });

    const updatedRequest = await SupportRequest.findByPk(supportRequest.id, {
      include: [
        {
          model: User,
          as: "patient",
          attributes: ["id", "fullName", "email", "phone"],
        },
        {
          model: Appointment,
          as: "appointment",
          attributes: ["id", "doctorName", "clinicName", "appointmentDate"],
        },
      ],
    });

    res.status(200).json({
      message: "Support request marked as completed",
      supportRequest: updatedRequest,
    });
  } catch (error) {
    console.error("Error completing support request:", error);
    res.status(500).json({ error: "Failed to complete support request" });
  }
};

module.exports = {
  // Patient actions
  createSupportRequest,
  getMySupportRequests,
  getSupportRequestById,
  updateSupportRequest,
  deleteSupportRequest,

  // Caregiver actions
  getAssignedSupportRequests,
  respondToSupportRequest,
  completeSupportRequest,
};
