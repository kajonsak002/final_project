const express = require("express");
const {
  getNews,
  insertNews,
  getNewsgetNewsDetail,
} = require("../controllers/news");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadToNews = upload("news");

router.get("/news", getNews);
router.get("/news/detail/:id", getNewsgetNewsDetail);
router.post("/news", insertNews);
router.post("/news/upload", uploadToNews.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.headers.host}/public/news/${req.file.filename}`;

  return res.status(200).json({ imageUrl });
});

module.exports = router;
