const express = require("express");
const router = express.Router();
const supportController = require("../controllers/supportController");
const verifyToken = require("../middleware/verifyToken");

router.use(verifyToken);

router.post("/", supportController.createSupportRequest);
router.get("/", supportController.getMySupportRequests);
router.get("/:id", supportController.getSupportRequestById);
router.put("/:id", supportController.updateSupportRequest);
router.delete("/:id", supportController.deleteSupportRequest);

router.get("/assigned", supportController.getAssignedSupportRequests);
router.patch("/:id/respond", supportController.respondToSupportRequest);
router.patch("/:id/complete", supportController.completeSupportRequest);

module.exports = router;
