const db = require("../config/db");

exports.insert = async (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อหมวดหมู่สัตว์" });
    }

    const [result] = await db
      .promise()
      .query("INSERT INTO animal_categories (category_name) VALUES (?)", [
        category_name,
      ]);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "ไม่สามารถเพิ่มข้อมูลหมวดหมู่สัตว์ได้" });
    }

    return res
      .status(201)
      .json({ message: "เพิ่มข้อมูลหมวดหมู่สัตว์เรียบร้อยแล้ว" });
  } catch (error) {
    console.log("Error Insert Category : ", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อหมวดหมู่สัตว์" });
    }

    const [result] = await db
      .promise()
      .query(
        "UPDATE animal_categories SET category_name = ? WHERE category_id = ?",
        [category_name, id]
      );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "ไม่สามารถอัพเดทข้อมูลหมวดหมู่สัตว์ได้" });
    }

    return res
      .status(200)
      .json({ message: "อัพเดทข้อมูลหมวดหมู่สัตว์เรียบร้อยแล้ว" });
  } catch (error) {
    console.log("Error Update Category : ", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db
      .promise()
      .query("DELETE FROM animal_categories WHERE category_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "ไม่สามารถลบข้อมูลหมวดหมู่สัตว์ได้" });
    }

    return res
      .status(200)
      .json({ message: "ลบข้อมูลหมวดหมู่สัตว์เรียบร้อยแล้ว" });
  } catch (error) {
    console.log("Error Remove Category : ", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM animal_categories");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories" });
  }
};
