const { createMedicalLogSchema } = require("../validations/medicalLogSchema");
const medicalLogService = require("../services/medicalLogService");
const catchAsync = require("../utils/catchAsync");

const createMedicalLog = catchAsync(async (req, res, next) => {
  const validatedData = createMedicalLogSchema.parse(req.body);
  const userId = req.user.userId;
  const result = await medicalLogService.createMedicalLog(
    userId,
    validatedData.feelingScore,
  );
  res.status(201).json(result);
});

const getMyLogs = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;
  const days = parseInt(req.query.days) || 7;
  if (days < 1 || days > 30) {
    return res.status(400).json({ error: "Days must be between 1 and 30" });
  }
  const result = await medicalLogService.getUserLogStats(userId, days);
  res.status(200).json({
    days,
    count: result.logs.length,
    ...result,
  });
});

const getPatientLatestLog = catchAsync(async (req, res, next) => {
  const caregiverId = req.user.userId;
  const patientId = parseInt(req.params.patientId, 10);
  if (isNaN(patientId)) {
    return res.status(400).json({ error: "Invalid patient ID format" });
  }
  const latestLog = await medicalLogService.getPatientLatestLog(
    caregiverId,
    patientId,
  );
  if (!latestLog) {
    return res.status(404).json({
      message: "No logs found for this patient",
    });
  }
  res.status(200).json(latestLog);
});

const getPatientLogs = catchAsync(async (req, res, next) => {
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
  const logs = await medicalLogService.getPatientLogs(
    caregiverId,
    patientId,
    days,
  );
  res.status(200).json({
    patientId,
    days,
    count: logs.length,
    logs,
  });
});

module.exports = {
  createMedicalLog,
  getMyLogs,

  getPatientLatestLog,
  getPatientLogs,
};
