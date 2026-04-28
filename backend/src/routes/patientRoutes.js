const express = require("express");
const router = express.Router();
const caregiverController = require("../controllers/caregiverController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.get("/", caregiverController.getMyPatients);
router.get("/:id/appointments", caregiverController.getPatientAppointments);

module.exports = router;
