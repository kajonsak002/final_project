const express = require("express");
const {
  getGuildBook,
  updateGuildBook,
  insertGuildBook,
  deleteGuildBook,
} = require("../controllers/guild_book");
const router = express.Router();
const upload = require("../middleware/upload");
const uploadToGuildBook = upload("guildbook");

router.get("/guildbook", getGuildBook);
router.post("/guildbook", uploadToGuildBook.single("image"), insertGuildBook);
router.patch(
  "/guildbook/:id",
  uploadToGuildBook.single("image"),
  updateGuildBook
);
router.delete("/guildbook/:id", deleteGuildBook);

router.post(
  "/guildbook/upload",
  uploadToGuildBook.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.headers.host}/public/guildbook/${req.file.filename}`;

    return res.status(200).json({ imageUrl });
  }
);

module.exports = router;
