const express = require("express");
const router = express.Router();
const medicalLogController = require("../controllers/medicalLogController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.post("/", medicalLogController.createMedicalLog);
router.get("/", medicalLogController.getMyLogs);
router.get(
  "/patients/:patientId/latest",
  medicalLogController.getPatientLatestLog,
);
router.get("/patients/:patientId", medicalLogController.getPatientLogs);

module.exports = router;
