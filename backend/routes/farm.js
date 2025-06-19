const express = require("express");
const { getAllFarms, getFarmProfile } = require("../controllers/farm");
const router = express.Router();

router.get("/all_farms", getAllFarms);
router.get("/profile/:id", getFarmProfile);

module.exports = router;
