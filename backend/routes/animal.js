const express = require("express");
const {
  insert,
  update,
  remove,
  getAll,
  getWaitApproval,
  request,
  manageRequest,
} = require("../controllers/animal");
const router = express.Router();

//Get all animals
router.get("/animal", getAll);

//Req. Add Animal Type
router.get("/animal/get-req", getWaitApproval);
router.post("/animal/req", request);
router.post("/animal/manage-req", manageRequest);

//CRUD API for Animal
router.post("/animal/insert", insert);
router.put("/animal/update/:id", update);
router.delete("/animal/delete/:id", remove);

module.exports = router;
