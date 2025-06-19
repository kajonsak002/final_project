const express = require("express");
const {
  getProvinces,
  getDistricts,
  getTambons,
} = require("../controllers/location");
const router = express.Router();

router.get("/provinces", getProvinces);
router.get("/districts/:provinceId", getDistricts);
router.get("/tambons/:districtId", getTambons);

module.exports = router;
