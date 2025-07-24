const express = require("express");
const {
  getProductFarm,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product_farm");
const router = express.Router();
const uploadTo = require("../middleware/upload");
const uploadImgProduct = uploadTo("product_images");

router.get("/farm-products/:id", getProductFarm);
router.post("/farm-products/:id", uploadImgProduct.single("image"), addProduct);
router.put(
  "/farm-products/:id",
  uploadImgProduct.single("image"),
  updateProduct
);
router.delete("/farm-products/:id", deleteProduct);

module.exports = router;
