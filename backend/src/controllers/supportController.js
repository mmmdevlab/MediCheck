const supportService = require("../services/supportService");
const catchAsync = require("../utils/catchAsync");

const parseRequestId = (value) => Number.parseInt(value, 10);

const handleZodError = (res, error) =>
  res.status(400).json({
    error: "Validation failed",
    details: error.errors,
  });

const createSupportRequest = catchAsync(async (req, res, next) => {
  const data = await supportService.create(req.user.userId, req.body);
  res.status(201).json({
    data,
    message: "Support request created successfully",
  });
});

const getMySupportRequests = async (req, res, next) => {
  try {
    const requests = await supportService.getMyRequests(
      req.user.userId,
      req.query,
    );
    res.status(200).json({ data: requests });
  } catch (error) {
    next(error);
  }
};

const getSupportRequestById = async (req, res, next) => {
  try {
    const data = await supportService.getById(
      req.user.userId,
      parseRequestId(req.params.id),
    );
    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
};

const updateSupportRequest = catchAsync(async (req, res, next) => {
  const data = await supportService.update(
    req.user.userId,
    parseRequestId(req.params.id),
    req.body,
  );
  res.status(200).json({
    data,
    message: "Support request updated successfully",
  });
});

const deleteSupportRequest = async (req, res, next) => {
  try {
    const data = await supportService.remove(
      req.user.userId,
      parseRequestId(req.params.id),
    );
    res
      .status(200)
      .json({ data, message: "Support request deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const getAssignedSupportRequests = async (req, res, next) => {
  try {
    const requests = await supportService.getAssigned(
      req.user.userId,
      req.query,
    );
    res.status(200).json({ data: requests });
  } catch (error) {
    next(error);
  }
};

const respondToSupportRequest = catchAsync(async (req, res, next) => {
  const data = await supportService.respond(
    req.user.userId,
    parseRequestId(req.params.id),
    req.body,
  );
  res.status(200).json({
    data,
    message: `Support request ${data.status} successfully`,
  });
});

const completeSupportRequest = catchAsync(async (req, res, next) => {
  const data = await supportService.complete(
    req.user.userId,
    parseRequestId(req.params.id),
  );
  res.status(200).json({
    data,
    message: "Support request marked as completed",
  });
});

module.exports = {
  createSupportRequest,
  getMySupportRequests,
  getSupportRequestById,
  updateSupportRequest,
  deleteSupportRequest,
  getAssignedSupportRequests,
  respondToSupportRequest,
  completeSupportRequest,
};
