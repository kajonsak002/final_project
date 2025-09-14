const express = require("express");
const {
  reportAnimal,
  reportProduct,
  reportFarm,
} = require("../controllers/CreateReport");
const router = express.Router();
const PDFDocument = require("pdfkit");
const path = require("path");
const db = require("../config/db");

router.post("/report/animal", reportAnimal);
router.post("/report/product", reportProduct);
router.post("/report/farm", reportFarm);

router.get("/animals", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT animal_id, name FROM animals ORDER BY name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

router.get("/animal-types", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT type_id, type_name FROM animal_types ORDER BY type_name");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

router.get("/animal-types/:animal_id", async (req, res) => {
  try {
    const { animal_id } = req.params;
    const [rows] = await db
      .promise()
      .query(
        "SELECT type_id, type_name FROM animal_types WHERE animal_id = ? ORDER BY type_name",
        [animal_id]
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

// Routes for location data
router.get("/provinces", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT id, name_th FROM provinces ORDER BY name_th");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

router.get("/amphures/:province_id", async (req, res) => {
  try {
    const { province_id } = req.params;
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, name_th FROM amphures WHERE province_id = ? ORDER BY name_th",
        [province_id]
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

router.get("/tambons/:amphure_id", async (req, res) => {
  try {
    const { amphure_id } = req.params;
    const [rows] = await db
      .promise()
      .query(
        "SELECT id, name_th FROM tambons WHERE amphure_id = ? ORDER BY name_th",
        [amphure_id]
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});

module.exports = router;
