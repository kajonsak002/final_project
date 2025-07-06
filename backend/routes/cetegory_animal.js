const express = require("express");
const {
  insert,
  update,
  remove,
  getAll,
} = require("../controllers/cetegory_animal");
const router = express.Router();

//CRUD API for Category
router.post("/category/insert", insert);
router.put("/category/update/:id", update);
router.delete("/category/delete/:id", remove);
router.get("/category", getAll);

module.exports = router;
