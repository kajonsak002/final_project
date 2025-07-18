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
} = require("../controllers/posts");
const router = express.Router();
const uploadTo = require("../middleware/upload");
const uploadImgPost = uploadTo("post_images");

const auth_Token = require("../middleware/auth_token");

router.post("/post", getAll);
router.post("/post-history", getPostByFarmerid);
router.get("/post-wait-approval", getPostsWaitApproval);

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

router.post("/post/delete/:id", auth_Token, remove);

// Route to approval posts
router.post("/post/approval-post/:id", approvalPost);

//Route to report and manage posts
router.post("/post/report-post", reportPost);

router.post("/post/get-post-report", getPostReport);
router.post("/post/manage-report-post", manageReportPost);

module.exports = router;
