const express = require("express");
const scrapePrices = require("../priceScraper");
const router = express.Router();

router.get("/price", async (req, res) => {
  try {
    const data = await scrapePrices();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error scraping prices:", error);
    res.status(500).json({ error: "Failed to scrape prices" });
  }
});

module.exports = router;
