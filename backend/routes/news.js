const express = require("express");
const {
  getNews,
  insertNews,
  getNewsDetail,
  updateNews,
  deleteNews,
  getMyNews,
} = require("../controllers/news");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadToNews = upload("news");

router.get("/news", getNews);
router.get("/news/detail/:id", getNewsDetail);
router.get("/news/my-news/:owner_id/:owner_type", getMyNews);
router.post("/news", insertNews);
router.patch("/news/:id", updateNews);
router.delete("/news/:id", deleteNews);

// Upload img to server
router.post("/news/upload", uploadToNews.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const imageUrl = `${req.protocol}://${req.headers.host}/public/news/${req.file.filename}`;

  return res.status(200).json({ imageUrl });
});

module.exports = router;
