const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/refresh", authController.refreshTokenHandler);
router.delete("/deleteMe", verifyToken, authController.deleteAccount);
router.get("/me", verifyToken, authController.getProfile);

module.exports = router;
