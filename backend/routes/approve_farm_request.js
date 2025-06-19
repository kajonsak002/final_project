const express = require("express");
const {
  getWaitingApproval,
  processApproval,
} = require("../controllers/approve_farm_request");
const router = express.Router();

router.get("/farmer/waiting-approval", getWaitingApproval);
router.post("/farmer/manage-approval", processApproval);

module.exports = router;
