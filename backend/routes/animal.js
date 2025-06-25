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

module.exports = router;
