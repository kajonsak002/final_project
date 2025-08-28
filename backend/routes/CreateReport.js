const express = require("express");
const { reportAnimal, reportProduct } = require("../controllers/CreateReport");
const router = express.Router();

router.post("/report/animal", reportAnimal);
router.post("/report/product", reportProduct);

module.exports = router;
