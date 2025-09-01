const express = require("express");
const {
  addAnimal,
  getAnimalFarm,
  useAnimal,
  getAnimalUsageHistory,
} = require("../controllers/animal_farm");
const router = express.Router();

router.get("/animal/:farm_id", getAnimalFarm);
router.post("/animal", addAnimal);
router.post("/animal/use", useAnimal);
router.get("/animal/usage/:farm_id", getAnimalUsageHistory);

module.exports = router;
