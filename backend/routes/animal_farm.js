const express = require("express");
const {
  addAnimal,
  getAnimalFarm,
  useAnimal,
} = require("../controllers/animal_farm");
const router = express.Router();

router.get("/animal/:farm_id", getAnimalFarm);
router.post("/animal", addAnimal);
router.post("/animal/use", useAnimal);

module.exports = router;
