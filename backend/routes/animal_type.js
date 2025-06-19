const express = require("express");
const {
  insert,
  update,
  remove,
  getAll,
  getWaitApproval,
  request,
  manageRequest,
} = require("../controllers/animal_type");
const router = express.Router();

// Get all animal types
router.get("/animal_type", getAll);

//Req. Add Animal Type
router.get("/animal_type/get-req", getWaitApproval);
router.post("/animal_type/req", request);
router.post("/animal_type/manage-req", manageRequest);

// CRUD API for Animal Type
router.post("/animal_type/insert", insert);
router.put("/animal_type/update/:id", update);
router.delete("/animal_type/delete/:id", remove);

module.exports = router;
