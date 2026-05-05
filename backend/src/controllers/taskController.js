const Task = require("../models/Task");
const Appointment = require("../models/Appointment");
const CaregiverAssignment = require("../models/CaregiverAssignment");
const {
  createTaskSchema,
  updateTaskSchema,
} = require("../validations/taskValidation");
const catchAsync = require("../utils/catchAsync");

const createTask = catchAsync(async (req, res, next) => {
  const validatedData = createTaskSchema.parse(req.body);
  const userId = req.user.userId;
  const appointment = await Appointment.findOne({
    where: {
      id: validatedData.appointmentId,
      userId: userId,
    },
  });
  if (!appointment) {
    return res.status(403).json({
      error: "You can only add tasks to your own appointments",
    });
  }
  const task = await Task.create({
    appointmentId: validatedData.appointmentId,
    patientId: userId,
    title: validatedData.title,
    description: validatedData.description || null,
    taskType: validatedData.taskType || "other",
    dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
    isCompleted: false,
  });
  res.status(201).json({
    message: "Task created successfully",
    task,
  });
});

const getTasksByAppointment = catchAsync(async (req, res, next) => {
  const appointmentId = parseInt(req.query.appointmentId, 10);
  const userId = req.user.userId;
  if (!appointmentId || isNaN(appointmentId)) {
    return res.status(400).json({
      error: "appointmentId query parameter is required",
    });
  }
  const appointment = await Appointment.findOne({
    where: {
      id: appointmentId,
      userId: userId,
    },
  });
  if (appointment) {
    const tasks = await Task.findAll({
      where: { appointmentId: appointmentId },
      order: [["createdAt", "ASC"]],
    });
    return res.status(200).json(tasks);
  }
  const targetAppointment = await Appointment.findByPk(appointmentId);
  if (!targetAppointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  const assignment = await CaregiverAssignment.findOne({
    where: {
      patientId: targetAppointment.userId,
      caregiverId: userId,
      isActive: true,
    },
  });
  if (!assignment) {
    return res.status(403).json({
      error: "You don't have permission to view these tasks",
    });
  }
  const tasks = await Task.findAll({
    where: { appointmentId: appointmentId },
    order: [["createdAt", "ASC"]],
  });
  res.status(200).json(tasks);
});

const getTaskById = catchAsync(async (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);
  const userId = req.user.userId;
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  const task = await Task.findByPk(taskId, {
    include: [
      {
        model: Appointment,
        as: "appointment",
        attributes: ["id", "title", "appointmentDate"],
      },
    ],
  });
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  if (task.patientId === userId) {
    return res.status(200).json(task);
  }
  const assignment = await CaregiverAssignment.findOne({
    where: {
      patientId: task.patientId,
      caregiverId: userId,
      isActive: true,
    },
  });
  if (!assignment) {
    return res.status(403).json({
      error: "You don't have permission to view this task",
    });
  }
  res.status(200).json(task);
});

const toggleTaskCompletion = catchAsync(async (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);
  const userId = req.user.userId;
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }

  const task = await Task.findByPk(taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (task.patientId === userId) {
    await task.update({
      isCompleted: !task.isCompleted,
    });
    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  }
  const assignment = await CaregiverAssignment.findOne({
    where: {
      patientId: task.patientId,
      caregiverId: userId,
      isActive: true,
    },
  });

  if (!assignment) {
    return res.status(403).json({
      error: "You don't have permission to toggle this task",
    });
  }
  await task.update({
    isCompleted: !task.isCompleted,
  });
  res.status(200).json({
    message: "Task updated successfully",
    task,
  });
});

const updateTask = catchAsync(async (req, res, next) => {
  const validatedData = updateTaskSchema.parse(req.body);
  const taskId = parseInt(req.params.id, 10);
  const userId = req.user.userId;
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  const task = await Task.findByPk(taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  if (task.patientId !== userId) {
    return res.status(403).json({
      error: "You can only update your own tasks",
    });
  }
  const updateData = { ...validatedData };
  if (validatedData.dueDate) {
    updateData.dueDate = new Date(validatedData.dueDate);
  }
  await task.update(updateData);
  res.status(200).json({
    message: "Task updated successfully",
    task,
  });
});

const deleteTask = catchAsync(async (req, res, next) => {
  const taskId = parseInt(req.params.id, 10);
  const userId = req.user.userId;
  if (isNaN(taskId)) {
    return res.status(400).json({ error: "Invalid task ID format" });
  }
  const task = await Task.findByPk(taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  if (task.patientId !== userId) {
    return res.status(403).json({
      error: "You can only delete your own tasks",
    });
  }
  await task.destroy();
  res.status(200).json({
    message: "Task deleted successfully",
  });
});

module.exports = {
  createTask,
  getTasksByAppointment,
  getTaskById,
  toggleTaskCompletion,
  updateTask,
  deleteTask,
};
