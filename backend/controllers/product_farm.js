const db = require("../config/db");
const fs = require("fs");
const dayjs = require("dayjs");
require("dayjs/locale/th");
dayjs.locale("th");

const getFormattedNow = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

const deleteImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("ลบไฟล์ไม่สำเร็จ:", err);
    } else {
      console.log("ลบไฟล์เรียบร้อย:", imagePath);
    }
  });
};

exports.addProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, unit } = req.body;
  const image = req.file;

  if (!name || !price || !unit) {
    deleteImage(image.path);
    return res.status(400).json({ msg: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const [row] = await db
      .promise()
      .query(
        `INSERT INTO products (farmer_id, product_name, price, unit, image) VALUES (?, ?, ?, ?, ?)`,
        [id, name, price, unit, image.path]
      );

    if (row.affectedRows === 0) {
      deleteImage(image.path);
      return res.status(500).json({ msg: "ไม่สามารถเพิ่มสินค้าได้" });
    }

    return res.status(201).json({
      msg: "เพิ่มสินค้าเรียบร้อยเเล้ว",
    });
  } catch (err) {
    console.error("Error adding product:", err);
    deleteImage(image.path);
    return res.status(500).json({ msg: "ไม่สามารถเพิ่มสินค้าได้" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const image = req.file;
  const { name, price, unit, product_id } = req.body;

  if (!name || !price || !unit || !product_id) {
    if (image) {
      deleteImage(image.path);
    }
    return res.status(400).json({ msg: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const [[data]] = await db
      .promise()
      .query(`SELECT * FROM products WHERE farmer_id = ? AND product_id = ?`, [
        id,
        product_id,
      ]);

    if (!data) {
      if (image) {
        deleteImage(image.path);
      }
      return res.status(404).json({ msg: "ไม่พบสินค้าดังกล่าว" });
    }

    let newImagePath = data.image;

    if (image) {
      deleteImage(data.image);
      newImagePath = image.path;
    }

    const [row] = await db
      .promise()
      .query(
        `UPDATE products SET product_name = ?, price = ?, unit = ?, image = ? WHERE farmer_id = ? AND product_id = ?`,
        [name, price, unit, newImagePath, id, product_id]
      );

    if (row.affectedRows === 0) {
      if (image) {
        deleteImage(image.path);
      }
      return res.status(500).json({ msg: "ไม่สามารถอัปเดตสินค้าได้" });
    }

    return res.status(200).json({
      msg: "อัปเดตสินค้าเรียบร้อยเเล้ว",
    });
    // res.json({ msg: "Get product data successfully", data });
  } catch (err) {
    console.error("Error updating product:", err);
    if (image) {
      deleteImage(image.path);
    }
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการอัปเดตสินค้า" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ msg: "กรุณาระบุรหัสสินค้า" });
  }

  try {
    const [[data]] = await db
      .promise()
      .query(`SELECT * FROM products WHERE farmer_id = ? AND product_id = ?`, [
        id,
        product_id,
      ]);

    if (!data) {
      return res.status(404).json({ msg: "ไม่พบสินค้าดังกล่าว" });
    }

    if (data.image) {
      deleteImage(data.image);
    }

    const [row] = await db
      .promise()
      .query(`DELETE FROM products WHERE farmer_id = ? AND product_id = ?`, [
        id,
        product_id,
      ]);

    if (row.affectedRows === 0) {
      return res.status(404).json({ msg: "ไม่พบสินค้าดังกล่าว" });
    }

    return res.status(200).json({
      msg: "ลบสินค้าเรียบร้อยเเล้ว",
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการลบสินค้า" });
  }
};
