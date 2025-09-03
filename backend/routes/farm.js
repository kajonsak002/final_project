const express = require("express");
const {
  getAllFarms,
  getFarmProfile,
  getFarmsData,
  updateFarmProfile,
  updateFarmerAccountStatus,
} = require("../controllers/farm");
const router = express.Router();
const authToken = require("../middleware/auth_token");

const uploadTo = require("../middleware/upload");
const uploadImgFarm = uploadTo("farm_profile");

router.get("/all_farms", getAllFarms);
router.get("/allFarms", getFarmsData);
router.get("/profile", authToken, getFarmProfile);
router.get("/profile/:id", getFarmProfile);

// Update account status and notify by email
router.patch("/farmer/:farmer_id/status", updateFarmerAccountStatus);

router.put(
  "/edit-profile",
  uploadImgFarm.fields([
    { name: "farm_img", maxCount: 1 },
    { name: "farm_banner", maxCount: 1 },
  ]),
  updateFarmProfile
);

module.exports = router;
