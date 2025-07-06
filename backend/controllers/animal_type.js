const db = require("../config/db");
const dayjs = require("dayjs");

// ดึงประเภทสัตว์ทั้งหมด
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM animal_types");

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลประเภทสัตว์" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error Get AnimalType : ", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงประเภทสัตว์" });
  }
};

// ดึงคำร้องประเภทสัตว์ที่รออนุมัติ
exports.getWaitApproval = async (req, res) => {
  try {
    const sql = `
      SELECT 
        t1.request_id, 
        t2.farm_name, 
        t1.name AS type_name, 
        t1.status, 
        t1.create_at,
        a.name AS animal_name
      FROM animal_type_requests AS t1
      JOIN farmer AS t2 ON t1.farmer_id = t2.farmer_id
      JOIN animals AS a ON t1.animal_id = a.animal_id
      WHERE t1.status = 'รออนุมัติ'
    `;
    const [rows] = await db.promise().query(sql);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบคำร้องขอเพิ่มประเภทสัตว์" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error fetch Animal Type Requests: ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงคำร้อง" });
  }
};

// ส่งคำร้องประเภทสัตว์
exports.request = async (req, res) => {
  try {
    const { animal_id, name } = req.body;
    const { id } = req.user;

    if (!name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อประเภทสัตว์" });
    }

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO animal_type_requests (farmer_id, animal_id, name, status, create_at) VALUES (?, ?, ?, 'รออนุมัติ', NOW())",
        [id, animal_id, name]
      );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "เกิดข้อผิดพลาดในการส่งคำร้อง" });
    }

    return res
      .status(201)
      .json({ message: "ส่งคำร้องขอเพิ่มประเภทสัตว์สำเร็จ" });
  } catch (err) {
    console.log("Error Request Animal Type : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการส่งคำร้อง" });
  }
};

// อนุมัติ/ปฏิเสธคำร้องประเภทสัตว์
exports.manageRequest = async (req, res) => {
  try {
    const { request_id, status, reason } = req.body;

    if (!request_id || !status) {
      return res.status(400).json({ message: "กรุณาเลือกคำร้อง" });
    }

    const [rows] = await db
      .promise()
      .query("SELECT * FROM animal_type_requests WHERE request_id = ?", [
        request_id,
      ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบคำร้องนี้ในระบบ" });
    }

    const approved_date = dayjs().format("YYYY-MM-DD HH:mm:ss");

    const [updateResult] = await db.promise().execute(
      `UPDATE animal_type_requests
       SET status = ?, approved_date = ?, reason = ?
       WHERE request_id = ?`,
      [status, approved_date, reason || null, request_id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ message: "ไม่สามารถอัปเดตสถานะคำร้องได้" });
    }

    if (status === "อนุมัติ") {
      const [[{ name, animal_id }]] = await db
        .promise()
        .query(
          "SELECT name, animal_id FROM animal_type_requests WHERE request_id = ?",
          [request_id]
        );

      await db
        .promise()
        .query(
          "INSERT INTO animal_types (type_name, animal_id) VALUES (?, ?)",
          [name, animal_id]
        );
    }

    return res.status(200).json({ message: `${status}คำร้องสำเร็จ` });
  } catch (err) {
    console.error("Error Approval Animal Type:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการจัดการคำร้อง" });
  }
};

// เพิ่มประเภทสัตว์
exports.insert = async (req, res) => {
  try {
    const { name, animal_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อประเภทสัตว์" });
    }

    const [result] = await db
      .promise()
      .query("INSERT INTO animal_types (type_name, animal_id) VALUES (?, ?)", [
        name,
        animal_id || null,
      ]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: "ไม่สามารถเพิ่มประเภทสัตว์ได้" });
    }

    return res.status(201).json({ message: "เพิ่มประเภทสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    console.log("Error Insert AnimalType : ", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเพิ่มประเภทสัตว์" });
  }
};

// แก้ไขประเภทสัตว์
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
      return res.status(400).json({ message: "กรุณาระบุข้อมูลให้ครบ" });
    }

    const [result] = await db
      .promise()
      .query("UPDATE animal_types SET type_name = ? WHERE type_id = ?", [
        name,
        id,
      ]);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "ไม่พบหรือไม่สามารถอัปเดตข้อมูลได้" });
    }

    return res.status(200).json({ message: "อัปเดตข้อมูลเรียบร้อยแล้ว" });
  } catch (err) {
    console.log("Error Update AnimalType : ", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการอัปเดตประเภทสัตว์" });
  }
};

// ลบประเภทสัตว์
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "กรุณาระบุรหัสประเภทสัตว์" });
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM animal_types WHERE type_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "ไม่สามารถลบข้อมูลได้" });
    }

    return res.status(200).json({ message: "ลบประเภทสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    console.log("Error DELETE AnimalType : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};

// ประวัติคำร้องประเภทสัตว์ของฟาร์มเมอร์
exports.getHistory = async (req, res) => {
  try {
    const { id } = req.user;

    const sql = `
      SELECT t1.request_id, t2.farm_name, t1.name, t1.status, t1.create_at, t1.approved_date, t1.reason
      FROM animal_type_requests AS t1
      JOIN farmer AS t2 ON t1.farmer_id = t2.farmer_id
      WHERE t1.farmer_id = ?
      ORDER BY t1.create_at DESC
    `;
    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบประวัติคำร้องประเภทสัตว์" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error Get History AnimalType : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงประวัติ" });
  }
};
