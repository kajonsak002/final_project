const express = require("express");
const { get_summary_count } = require("../controllers/summary_count");
const router = express.Router();

router.get("/get_summary", get_summary_count);

module.exports = router;
