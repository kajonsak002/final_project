const db = require("../config/db");
const dayjs = require("dayjs");

// ดึงข้อมูลสัตว์ทั้งหมด พร้อม join ชื่อ category
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT a.animal_id, a.name, c.category_name  , c.category_id
      FROM animals a 
      LEFT JOIN animal_categories c ON a.category_id = c.category_id
    `);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสัตว์" });
    }

    res.status(200).json(rows);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching animals", error: err.message });
  }
};

// ดึงคำร้องขอเพิ่มสัตว์ที่ยังรออนุมัติ
exports.getWaitApproval = async (req, res) => {
  try {
    const sql = `
      SELECT t1.request_id, t2.farm_name, t1.name as animal_name, c.category_name, t1.status, t1.create_at 
      FROM animal_requests t1 
      JOIN farmer t2 ON t1.farmer_id = t2.farmer_id
      LEFT JOIN animal_categories c ON t1.category_id = c.category_id
      WHERE t1.status = "รออนุมัติ"
    `;
    const [rows] = await db.promise().query(sql);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบคำร้องขอเพิ่มรายการสัตว์" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error fetch Animal Request:", err);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลคำร้องเพิ่มรายการสัตว์" });
  }
};

// ส่งคำร้องขอเพิ่มสัตว์ (ต้องระบุ category_id)
exports.request = async (req, res) => {
  try {
    const { animal_name, category_id } = req.body;
    const { id } = req.user;

    if (!animal_name || !category_id) {
      return res
        .status(400)
        .json({ message: "กรุณาระบุชื่อสัตว์และหมวดหมู่ (category_id)" });
    }

    const [result] = await db.promise().query(
      `INSERT INTO animal_requests (farmer_id, name, category_id, status, create_at)
       VALUES (?, ?, ?, 'รออนุมัติ', NOW())`,
      [id, animal_name, category_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการส่งคำร้องเพิ่มรายการสัตว์" });
    }

    return res
      .status(201)
      .json({ message: "ส่งคำร้องขอเพิ่มรายการสัตว์สำเร็จ" });
  } catch (err) {
    console.error("Error Request add animal:", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการส่งคำร้องเพิ่มรายการสัตว์" });
  }
};

// จัดการคำร้อง (อนุมัติ/ปฏิเสธ) พร้อมเพิ่มข้อมูลสัตว์ถ้าอนุมัติ
exports.manageRequest = async (req, res) => {
  try {
    const { request_id, status, reason } = req.body;

    if (!request_id || !status) {
      return res.status(400).json({ message: "กรุณาระบุคำร้องและสถานะ" });
    }

    const formatted = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const updateSql = `
      UPDATE animal_requests
      SET status = ?, approved_date = ?, reason = ?
      WHERE request_id = ?
    `;
    const updateParams = [status, formatted, reason || null, request_id];

    const [updateResult] = await db.promise().execute(updateSql, updateParams);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        message: `เกิดข้อผิดพลาดในการ${
          status === "อนุมัติ" ? "อนุมัติ" : "ปฏิเสธ"
        }คำร้อง`,
      });
    }

    if (status === "อนุมัติ") {
      const [[requestData]] = await db
        .promise()
        .query(
          "SELECT name, category_id FROM animal_requests WHERE request_id = ?",
          [request_id]
        );

      const { name: animal_name, category_id } = requestData;

      await db
        .promise()
        .query("INSERT INTO animals (name, category_id) VALUES (?, ?)", [
          animal_name,
          category_id,
        ]);
    }

    return res.status(200).json({ message: `${status}คำร้องสำเร็จ` });
  } catch (err) {
    console.error("Error Approval Animal:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการจัดการคำร้อง" });
  }
};

// เพิ่มข้อมูลสัตว์ (CRUD - Create)
exports.insert = async (req, res) => {
  try {
    const { animal_name, category_id } = req.body;

    if (!animal_name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อสัตว์" });
    }

    const [result] = await db
      .promise()
      .query("INSERT INTO animals (name, category_id) VALUES (?, ?)", [
        animal_name,
        category_id || null,
      ]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "ไม่สามารถเพิ่มข้อมูลสัตว์ได้" });
    }

    res.status(201).json({ message: "เพิ่มข้อมูลสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error inserting animal", error: err.message });
  }
};

// แก้ไขข้อมูลสัตว์ (CRUD - Update)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { animal_name, category_id } = req.body;

    if (!animal_name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อสัตว์" });
    }

    const [rows] = await db
      .promise()
      .query("SELECT * FROM animals WHERE animal_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสัตว์ที่ระบุ" });
    }

    const [result] = await db
      .promise()
      .query(
        "UPDATE animals SET name = ?, category_id = ? WHERE animal_id = ?",
        [animal_name, category_id || null, id]
      );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "ไม่สามารถอัพเดทข้อมูลสัตว์ได้" });
    }

    return res.status(200).json({ message: "อัพเดทข้อมูลสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating animal", error: err.message });
  }
};

// ลบข้อมูลสัตว์ (CRUD - Delete)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db
      .promise()
      .query("SELECT * FROM animals WHERE animal_id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสัตว์ที่ระบุ" });
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM animals WHERE animal_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "ไม่สามารถลบข้อมูลสัตว์ได้" });
    }

    return res.status(200).json({ message: "ลบข้อมูลสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    console.log("Error Delete Animal :", err);
    return res.status(500).json({ message: "Error deleting animal" });
  }
};

// ดึงประวัติคำร้องของฟาร์มเมอร์ที่ login
exports.getHistory = async (req, res) => {
  const { id } = req.user;
  try {
    const sql = `
      SELECT t1.request_id, t2.farm_name, t1.name as animal_name, c.category_name, t1.status, t1.create_at, t1.approved_date, t1.reason
      FROM animal_requests t1
      JOIN farmer t2 ON t1.farmer_id = t2.farmer_id
      LEFT JOIN animal_categories c ON t1.category_id = c.category_id
      WHERE t1.farmer_id = ?
      ORDER BY t1.create_at DESC
    `;
    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "ไม่พบประวัติคำร้องขอเพิ่มรายการสัตว์" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error fetch Animal History:", err);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลประวัติคำร้องเพิ่มรายการสัตว์",
    });
  }
};
