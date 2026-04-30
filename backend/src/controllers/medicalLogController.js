const MedicalLog = require("../models/MedicalLog");
const User = require("../models/User");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const { createMedicalLogSchema } = require("../validations/medicalLogSchema");
const { Op } = require("sequelize");

/*------------------ PATIENT POV ------------------*/

/*------------------ Log today's feeling ------------------*/
const createMedicalLog = async (req, res) => {
  try {
    const validatedData = createMedicalLogSchema.parse(req.body);
    const userId = req.user.userId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingLog = await MedicalLog.findOne({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
    });

    if (existingLog) {
      existingLog.feelingScore = validatedData.feelingScore;
      await existingLog.save();

      return res.status(200).json({
        message: "Today's feeling updated successfully",
        log: existingLog,
      });
    }

    const log = await MedicalLog.create({
      userId: userId,
      feelingScore: validatedData.feelingScore,
    });

    res.status(201).json({
      message: "Feeling logged successfully",
      log: log,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors,
      });
    }
    console.error("Error creating medical log:", error);
    res.status(500).json({ error: "Failed to log feeling" });
  }
};

/*------------------ Get my logs (last N days) ------------------*/
const getMyLogs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const days = parseInt(req.query.days) || 7; // Default 7 days

    if (days < 1 || days > 30) {
      return res.status(400).json({
        error: "Days must be between 1 and 30",
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const logs = await MedicalLog.findAll({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "feelingScore", "createdAt"],
    });

    res.status(200).json({
      days: days,
      count: logs.length,
      logs: logs,
    });
  } catch (error) {
    console.error("Error fetching medical logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

/*------------------ CAREGIVER POV ------------------*/

/*------------------ View patient's latest log ------------------*/
const getPatientLatestLog = async (req, res) => {
  try {
    const caregiverId = req.user.userId;
    const patientId = parseInt(req.params.patientId, 10);

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
        error: "You do not have access to this patient's logs",
      });
    }

    const latestLog = await MedicalLog.findOne({
      where: { userId: patientId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName"],
        },
      ],
    });

    if (!latestLog) {
      return res.status(404).json({
        message: "No logs found for this patient",
      });
    }

    res.status(200).json(latestLog);
  } catch (error) {
    console.error("Error fetching patient's latest log:", error);
    res.status(500).json({ error: "Failed to fetch patient's log" });
  }
};

/*------------------ View patient's log history ------------------*/
const getPatientLogs = async (req, res) => {
  try {
    const caregiverId = req.user.userId;
    const patientId = parseInt(req.params.patientId, 10);
    const days = parseInt(req.query.days) || 7;

    if (isNaN(patientId)) {
      return res.status(400).json({ error: "Invalid patient ID format" });
    }

    if (days < 1 || days > 30) {
      return res.status(400).json({
        error: "Days must be between 1 and 30",
      });
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
        error: "You do not have access to this patient's logs",
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const logs = await MedicalLog.findAll({
      where: {
        userId: patientId,
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "fullName"],
        },
      ],
    });

    res.status(200).json({
      patientId: patientId,
      days: days,
      count: logs.length,
      logs: logs,
    });
  } catch (error) {
    console.error("Error fetching patient logs:", error);
    res.status(500).json({ error: "Failed to fetch patient logs" });
  }
};

module.exports = {
  // Patient actions
  createMedicalLog,
  getMyLogs,

  // Caregiver actions
  getPatientLatestLog,
  getPatientLogs,
};
