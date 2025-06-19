const express = require("express");
const {
  verifyEmail,
  resetPassword,
} = require("../controllers/forgot_password");
const router = express.Router();

router.post("/verify_email", verifyEmail);
router.post("/reset_password", resetPassword);

module.exports = router;
