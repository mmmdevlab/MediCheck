const AppError = require("../utils/AppError");
const MedicalLog = require("../models/MedicalLog");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const User = require("../models/User");
const { Op } = require("sequelize");

const getDateRange = (days) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  return startDate;
};

const calculateTrend = (logs) => {
  if (logs.length < 3) return null;

  const sorted = [...logs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const mid = Math.floor(sorted.length / 2);
  const older = sorted.slice(0, mid);
  const recent = sorted.slice(mid);

  const avg = (arr) => arr.reduce((sum, l) => sum + l.feelingScore, 0) / arr.length;
  const delta = avg(recent) - avg(older);

  if (delta > 0.5) return "improving";
  if (delta < -0.5) return "declining";
  return "stable";
};

const calculateStats = (logs) => {
  if (!logs || logs.length === 0) {
    return {
      averageScore: null,
      trend: null,
      latestAlert: null,
      alertCount: 0,
    };
  }

  const total = logs.reduce((sum, l) => sum + l.feelingScore, 0);
  const averageScore = Math.round(total / logs.length);

  const alertLogs = logs.filter((l) => l.feelingScore <= 2);
  const latestAlert = alertLogs.length
    ? alertLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
    : null;

  return {
    averageScore,
    trend: calculateTrend(logs),
    latestAlert,
    alertCount: alertLogs.length,
  };
};

const createMedicalLog = async (userId, feelingScore) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existingLog = await MedicalLog.findOne({
    where: {
      userId,
      createdAt: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    },
  });

  if (existingLog) {
    await existingLog.destroy();
  }

  const log = await MedicalLog.create({
    userId,
    feelingScore,
  });

  return {
    message: existingLog
      ? "Today's feeling updated successfully"
      : "Feeling logged successfully",
    log,
  };
};

const getUserLogs = async (userId, days) => {
  const startDate = getDateRange(days);

  const logs = await MedicalLog.findAll({
    where: {
      userId,
      createdAt: { [Op.gte]: startDate },
    },
    order: [["createdAt", "DESC"]],
    attributes: ["id", "feelingScore", "createdAt"],
  });

  return logs;
};

const getUserLogStats = async (userId, days) => {
  const logs = await getUserLogs(userId, days);
  const stats = calculateStats(logs);

  return {
    logs,
    stats,
  };
};

const verifyAccess = async (caregiverId, patientId) => {
  const assignment = await CaregiverAssignment.findOne({
    where: {
      patientId,
      caregiverId,
      isActive: true,
    },
  });

  if (!assignment) {
    throw new AppError("Access denied", 403);
  }
};

const getPatientLogs = async (caregiverId, patientId, days) => {
  await verifyAccess(caregiverId, patientId);

  const startDate = getDateRange(days);

  const logs = await MedicalLog.findAll({
    where: {
      userId: patientId,
      createdAt: { [Op.gte]: startDate },
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

  return logs;
};

const getPatientLatestLog = async (caregiverId, patientId) => {
  await verifyAccess(caregiverId, patientId);

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

  return latestLog;
};

module.exports = {
  createMedicalLog,
  getUserLogs,
  getUserLogStats,
  getPatientLogs,
  getPatientLatestLog,
};
