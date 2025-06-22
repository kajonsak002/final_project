const express = require("express");
const {
  getAll,
  insert,
  update,
  remove,
  insertPostImg,
} = require("../controllers/posts");
const router = express.Router();
const uploadTo = require("../middleware/upload");

const uploadImgPost = uploadTo("post_images");

router.get("/post", getAll);
router.post(
  "/post/insert-post-img",
  uploadImgPost.single("image"),
  insertPostImg
);
router.post("/post/insert", insert);

router.post("/test", (req, res) => {
  res.send("Hello World");
});

router.post("/post/update/:id", update);
router.post("/post/delete/:id", remove);

module.exports = router;
