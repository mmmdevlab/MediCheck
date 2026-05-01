const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.post("/", taskController.createTask);
router.get("/", taskController.getTasksByAppointment);

router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.patch("/:id/toggle", taskController.toggleTaskCompletion);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
