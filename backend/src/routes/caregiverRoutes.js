const express = require("express");
const router = express.Router();
const caregiverController = require("../controllers/caregiverController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.post("/", caregiverController.grantCaregiverAccess);
router.get("/", caregiverController.getMyCaregivers);
router.delete("/:id", caregiverController.revokeCaregiverAccess);

module.exports = router;
