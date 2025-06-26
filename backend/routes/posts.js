const express = require("express");
const {
  getAll,
  insert,
  update,
  remove,
  insertPostImg,
  getPostsWaitApproval,
  approvalPost,
} = require("../controllers/posts");
const router = express.Router();
const uploadTo = require("../middleware/upload");
const uploadImgPost = uploadTo("post_images");

const auth_Token = require("../middleware/auth_token");

router.get("/post", getAll);
router.get("/post-wait-approval", getPostsWaitApproval);

// Route to CRUD posts
router.post(
  "/post/insert-post-img",
  uploadImgPost.single("image"),
  auth_Token,
  insertPostImg
);
router.post("/post/insert", auth_Token, insert);
router.post("/post/update/:id", auth_Token, update);
router.post("/post/delete/:id", auth_Token, remove);

// Route to approval posts
router.post("/post/approval-post/:id", approvalPost);

module.exports = router;
