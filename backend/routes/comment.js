const express = require("express");
const {
  addComment,
  reportComment,
  getComment,
  manageComment,
  hideComment,
  getCommentReport,
  getReportRecive,
} = require("../controllers/comment");
const router = express.Router();

router.get("/comment/get-comment/:id", getComment);
router.post("/comment/add", addComment);
router.post("/comment/hide-comment", hideComment);

// Process Report comment
router.post("/comment/report-comment", reportComment);
router.post("/comment/get-comment-report", getCommentReport);
router.post("/comment/manage-comment", manageComment);

// history report comment
router.get("/reports/comment/received/:id", getReportRecive);

module.exports = router;
