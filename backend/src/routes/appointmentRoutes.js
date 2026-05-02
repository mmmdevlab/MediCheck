const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.get("/", appointmentsController.getAllAppointments);
router.post("/", appointmentsController.createAppointment);
router.get("/:id", appointmentsController.getAppointmentById);
router.put("/:id", appointmentsController.updateAppointment);
router.delete("/:id", appointmentsController.deleteAppointment);
router.patch("/:id/complete", appointmentsController.markComplete);

module.exports = router;
