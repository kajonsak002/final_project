const express = require("express");
const {
  getAll,
  insert,
  remove,
  insertPostImg,
  getPostsWaitApproval,
  approvalPost,
  reportPost,
  update_post_image,
  editPost,
  getPostByFarmerid,
  getPostReport,
  manageReportPost,
  getReportRecive,
  getDetailPost,
  getReportSend,
  getPostReportHistory,
  hidePost,
  showPost,
  getAllPostsForAdmin,
} = require("../controllers/posts");
const router = express.Router();
const uploadTo = require("../middleware/upload");
const uploadImgPost = uploadTo("post_images");

const auth_Token = require("../middleware/auth_token");

router.post("/post", getAll);
router.get("/post/:id", getDetailPost);
router.post("/post-history", getPostByFarmerid);
router.get("/post-wait-approval", getPostsWaitApproval);
router.get("/post/get-all-posts/admin", getAllPostsForAdmin);

// Route to CRUD posts
router.post(
  "/post/insert-post-img",
  uploadImgPost.single("image"),
  auth_Token,
  insertPostImg
);
router.post("/post/insert", auth_Token, insert);
router.post(
  "/post/edit/:id",
  uploadImgPost.single("image"),
  auth_Token,
  editPost
);

router.post("/post/delete/:id", remove);

// Route to approval posts
router.post("/post/approval-post/:id", approvalPost);

//Route to report and manage posts
router.post("/post/report-post", reportPost);

router.post("/post/get-post-report", getPostReport);
router.get("/post/get-post-report/history", getPostReportHistory);
router.post("/post/manage-report-post", manageReportPost);

// toggle post visibility
router.post("/post/hide-post", hidePost);
router.post("/post/show-post", showPost);

// history report post
router.get("/reports/post/received/:id", getReportRecive);
router.get("/reports/post/sent/:id", getReportSend);

module.exports = router;
