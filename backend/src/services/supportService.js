const AppError = require("../utils/AppError");
const SupportRequest = require("../models/SupportRequest");
const Appointment = require("../models/Appointment");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const supportRequestInclude = require("../utils/supportRequestInclude");
const {
  createSupportRequestSchema,
  updateSupportRequestSchema,
} = require("../validations/supportSchema");

const VALID_STATUSES = ["pending", "accepted", "declined", "completed"];

const buildStatusWhere = (status) => {
  if (!status) return {};
  if (!VALID_STATUSES.includes(status)) throw new AppError("Invalid status filter", 400);
  return { status };
};

const create = async (patientId, payload) => {
  const validatedData = createSupportRequestSchema.parse(payload);

  if (validatedData.appointmentId) {
    const appointment = await Appointment.findOne({
      where: { id: validatedData.appointmentId, userId: patientId },
    });
    if (!appointment) throw new AppError("Appointment not found", 404);
  }

  if (validatedData.caregiverId) {
    const assignment = await CaregiverAssignment.findOne({
      where: {
        patientId,
        caregiverId: validatedData.caregiverId,
        isActive: true,
      },
    });
    if (!assignment) throw new AppError("Unauthorized caregiver", 403);
  }

  const supportRequest = await SupportRequest.create({
    patientId,
    ...validatedData,
    status: "pending",
  });

  return SupportRequest.findByPk(supportRequest.id, {
    include: supportRequestInclude,
  });
};

const update = async (patientId, requestId, payload) => {
  const validatedData = updateSupportRequestSchema.parse(payload);

  if (!Number.isInteger(requestId)) {
    throw new AppError("Invalid request ID", 400);
  }

  const supportRequest = await SupportRequest.findOne({
    where: { id: requestId, patientId },
  });

  if (!supportRequest) throw new AppError("Support request not found", 404);

  if (supportRequest.status !== "pending") {
    throw new AppError(
      `Cannot update request with status: ${supportRequest.status}`,
      400,
    );
  }

  const updateData = {};
  if (validatedData.message !== undefined) {
    updateData.message = validatedData.message;
  }

  await supportRequest.update(updateData);

  return SupportRequest.findByPk(requestId, {
    include: supportRequestInclude,
  });
};

const respond = async (caregiverId, requestId, payload) => {
  const { status } = payload;

  if (!Number.isInteger(requestId)) {
    throw new AppError("Invalid request ID", 400);
  }

  if (!["accepted", "declined", "pending"].includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const supportRequest = await SupportRequest.findOne({
    where: { id: requestId, caregiverId },
  });

  if (!supportRequest) {
    throw new AppError("Not found or not assigned", 404);
  }

  await supportRequest.update({
    status,
    respondedAt: status === "pending" ? null : new Date(),
  });

  return SupportRequest.findByPk(requestId, {
    include: supportRequestInclude,
  });
};

const complete = async (caregiverId, requestId) => {
  if (!Number.isInteger(requestId)) {
    throw new AppError("Invalid request ID", 400);
  }

  const supportRequest = await SupportRequest.findOne({
    where: { id: requestId, caregiverId },
  });

  if (!supportRequest) {
    throw new AppError("Not found or not assigned", 404);
  }

  if (supportRequest.status !== "accepted") {
    throw new AppError("Can only complete accepted requests", 400);
  }

  await supportRequest.update({ status: "completed" });

  return SupportRequest.findByPk(requestId, {
    include: supportRequestInclude,
  });
};

const remove = async (patientId, requestId) => {
  if (!Number.isInteger(requestId)) throw new AppError("Invalid request ID", 400);

  const supportRequest = await SupportRequest.findOne({
    where: { id: requestId, patientId },
  });

  if (!supportRequest) throw new AppError("Support request not found", 404);

  if (supportRequest.status !== "pending") {
    throw new AppError(`Cannot delete request with status: ${supportRequest.status}`, 400);
  }

  await supportRequest.destroy();
  return supportRequest;
};

const getMyRequests = async (patientId, { status } = {}) => {
  const where = { patientId, ...buildStatusWhere(status) };

  return SupportRequest.findAll({
    where,
    include: supportRequestInclude,
    order: [["createdAt", "DESC"]],
  });
};

const getById = async (patientId, requestId) => {
  if (!Number.isInteger(requestId)) throw new AppError("Invalid request ID", 400);

  const supportRequest = await SupportRequest.findOne({
    where: { id: requestId, patientId },
    include: supportRequestInclude,
  });

  if (!supportRequest) throw new AppError("Support request not found", 404);

  return supportRequest;
};

const getAssigned = async (caregiverId, { status } = {}) => {
  const where = { caregiverId, ...buildStatusWhere(status) };

  return SupportRequest.findAll({
    where,
    include: supportRequestInclude,
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  create,
  update,
  remove,
  respond,
  complete,
  getMyRequests,
  getById,
  getAssigned,
};
