const express = require("express");
const {
  addComment,
  reportComment,
  getComment,
  manageComment,
  hideComment,
  showComment,
  getCommentReport,
  getReportRecive,
  getReportSend,
  getCommentAdmin,
  getCommentReportHistory,
} = require("../controllers/comment");
const { hidePost, showPost } = require("../controllers/posts");
const router = express.Router();

router.get("/comment/get-comment/admin/:id", getCommentAdmin);
router.get("/comment/get-comment/:id", getComment);
router.post("/comment/add", addComment);
router.post("/comment/hide-comment", hideComment);
router.post("/comment/show-comment", showComment);
router.post("/post/hide-post", hidePost);
router.post("/post/show-post", showPost);

// Process Report comment
router.post("/comment/report-comment", reportComment);
router.post("/comment/get-comment-report", getCommentReport);
router.get("/comment/get-comment-report/history", getCommentReportHistory);
router.post("/comment/manage-comment", manageComment);

// history report comment
router.get("/reports/comment/received/:id", getReportRecive);
router.get("/reports/comment/sent/:id", getReportSend);

module.exports = router;
