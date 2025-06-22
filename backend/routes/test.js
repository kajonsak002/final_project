const express = require("express");
const router = express.Router();

router.post("/test/asd", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
