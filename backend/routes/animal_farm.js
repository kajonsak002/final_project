const express = require("express");
const {
  addAnimal,
  getAnimalFarm,
  addAnimalUsage,
  getAnimalUsageByFarm,
} = require("../controllers/animal_farm");
const router = express.Router();

router.get("/animal/:farm_id", getAnimalFarm);
router.post("/animal", addAnimal);
router.post("/animal/use", addAnimalUsage);
router.get("/animal/usage/:farm_id", getAnimalUsageByFarm);

module.exports = router;
