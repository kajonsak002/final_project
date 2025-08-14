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
  // full request api
  getWaitApprovalFull,
  requestFull,
  manageRequestFull,
  getHistoryFull,
} = require("../controllers/animal");
const authToken = require("../middleware/auth_token");
const router = express.Router();

//Get all animals
router.get("/animal", getAll);

//Req. Add Animal Type
router.get("/animal/get-req", getWaitApproval);
router.post("/animal/req", authToken, request);
router.post("/animal/manage-req", manageRequest);

//CRUD API for Animal
router.post("/animal/insert", insert);
router.put("/animal/update/:id", update);
router.delete("/animal/delete/:id", remove);

// Get all history req
router.get("/animal/history", authToken, getHistory);

// Unified Full Request (Animal + Type)
router.get("/animal/full/get-req", getWaitApprovalFull);
router.post("/animal/full/req", authToken, requestFull);
router.post("/animal/full/manage-req", manageRequestFull);
router.get("/animal/full/history", authToken, getHistoryFull);

module.exports = router;
