const express = require("express");
const {
  insert,
  update,
  remove,
  getAll,
  getWaitApproval,
  request,
  manageRequest,
  getHistory,
  getById,
} = require("../controllers/animal_type");
const router = express.Router();
const auth_token = require("../middleware/auth_token");

// Get all animal types
router.get("/animal_type", getAll);
router.get("/animal_type/:id", getById);

//Req. Add Animal Type
router.get("/animal_type/get-req", getWaitApproval);
router.post("/animal_type/req", auth_token, request);
router.post("/animal_type/manage-req", manageRequest);

// CRUD API for Animal Type
router.post("/animal_type/insert", insert);
router.put("/animal_type/update/:id", update);
router.delete("/animal_type/delete/:id", remove);

//Get Histoty Add Animal Type
router.get("/animal_type/history", auth_token, getHistory);

module.exports = router;
