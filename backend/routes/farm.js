const express = require("express");
const {
  getAllFarms,
  getFarmProfile,
  getFarmsData,
} = require("../controllers/farm");
const router = express.Router();
const authToken = require("../middleware/auth_token");

router.get("/all_farms", getAllFarms);
router.get("/allFarms", getFarmsData);
router.get("/profile", authToken, getFarmProfile);
router.get("/profile/:id", getFarmProfile);

module.exports = router;
