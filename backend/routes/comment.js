const express = require("express");
const {
  addComment,
  reportComment,
  getComment,
  manageComment,
  hideComment,
} = require("../controllers/comment");
const router = express.Router();

router.get("/comment/get-comment/:id", getComment);

router.post("/comment/add", addComment);
router.post("/comment/hide-comment", hideComment);
router.post("/comment/report-comment", reportComment);
router.post("/comment/manage-comment", manageComment);

module.exports = router;
