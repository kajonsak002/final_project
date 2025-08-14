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

// ดึงคำร้องแบบรวม (สัตว์ + ประเภท) ที่รออนุมัติ
exports.getWaitApprovalFull = async (req, res) => {
  try {
    const sql = `
      SELECT 
        r.request_id,
        f.farm_name,
        r.animal_name,
        r.type_name,
        r.status,
        r.create_at
      FROM animal_full_requests r
      JOIN farmer f ON r.farmer_id = f.farmer_id
      WHERE r.status = 'รออนุมัติ'
      ORDER BY r.create_at ASC
    `;
    const [rows] = await db.promise().query(sql);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบคำร้องแบบรวม" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error fetch Full Animal Request:", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงคำร้องแบบรวม" });
  }
};

// ส่งคำร้องแบบรวม (เพิ่มสัตว์พร้อมประเภท)
exports.requestFull = async (req, res) => {
  try {
    const { animal_name, type_name, category_id } = req.body;
    const { id } = req.user;

    if (!animal_name || !type_name) {
      return res
        .status(400)
        .json({ message: "กรุณาระบุชื่อสัตว์และประเภทสัตว์" });
    }

    // ตรวจสอบชื่อประเภทซ้ำ (เฉพาะในสัตว์ตัวเดียวกัน)
    const [[dupType]] = await db.promise().query(
      `SELECT at.type_id 
         FROM animal_types at 
         JOIN animals a ON at.animal_id = a.animal_id 
         WHERE a.name = ? AND at.type_name = ?`,
      [animal_name, type_name]
    );
    if (dupType) {
      return res
        .status(400)
        .json({ message: "มีประเภทนี้สำหรับสัตว์ตัวนี้แล้ว" });
    }

    // ตรวจสอบซ้ำในคำร้องที่รอดำเนินการ
    const [[dupReq]] = await db
      .promise()
      .query(
        "SELECT request_id FROM animal_full_requests WHERE animal_name = ? AND type_name = ? AND status = 'รออนุมัติ'",
        [animal_name, type_name]
      );
    if (dupReq) {
      return res
        .status(400)
        .json({ message: "มีคำร้องนี้อยู่ระหว่างรออนุมัติ" });
    }

    // บันทึกคำร้องแบบรวม
    const [insertResult] = await db.promise().query(
      `INSERT INTO animal_full_requests (farmer_id, animal_name, type_name, status, create_at, category_id)
       VALUES (?, ?, ?, 'รออนุมัติ', NOW(), ?)`,
      [id, animal_name, type_name, category_id || null]
    );

    if (insertResult.affectedRows === 0) {
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการส่งคำร้อง" });
    }

    return res
      .status(201)
      .json({ message: "ส่งคำร้องเพิ่มรายการสัตว์พร้อมประเภทสำเร็จ" });
  } catch (err) {
    console.error("Error Request Full add animal:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการส่งคำร้อง" });
  }
};

// จัดการคำร้องแบบรวม (อนุมัติ/ปฏิเสธ)
exports.manageRequestFull = async (req, res) => {
  try {
    const { request_id, status, reason } = req.body;

    if (!request_id || !status) {
      return res.status(400).json({ message: "กรุณาระบุคำร้องและสถานะ" });
    }

    const formatted = dayjs().format("YYYY-MM-DD HH:mm:ss");

    // อัปเดตสถานะคำร้อง
    const [updateResult] = await db.promise().execute(
      `UPDATE animal_full_requests
         SET status = ?, approved_date = ?, reason = ?
         WHERE request_id = ?`,
      [status, formatted, reason || null, request_id]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({
        message: `เกิดข้อผิดพลาดในการ${
          status === "อนุมัติ" ? "อนุมัติ" : "ปฏิเสธ"
        }คำร้อง`,
      });
    }

    if (status === "อนุมัติ") {
      // ดึงข้อมูลคำร้อง
      const [[requestData]] = await db
        .promise()
        .query(
          "SELECT animal_name, type_name, category_id FROM animal_full_requests WHERE request_id = ?",
          [request_id]
        );

      const { animal_name, type_name, category_id } = requestData;

      // ตรวจสอบซ้ำอีกครั้งก่อนเพิ่มข้อมูลจริง
      const [[dupType]] = await db.promise().query(
        `SELECT at.type_id 
           FROM animal_types at 
           JOIN animals a ON at.animal_id = a.animal_id 
           WHERE a.name = ? AND at.type_name = ?`,
        [animal_name, type_name]
      );
      if (dupType) {
        return res
          .status(400)
          .json({ message: "มีประเภทนี้สำหรับสัตว์ตัวนี้แล้ว" });
      }

      // ตรวจสอบว่ามีสัตว์นี้อยู่แล้วหรือไม่
      let [[existingAnimal]] = await db
        .promise()
        .query("SELECT animal_id FROM animals WHERE name = ?", [animal_name]);

      let animalId;

      if (existingAnimal) {
        // ใช้สัตว์ที่มีอยู่แล้ว
        animalId = existingAnimal.animal_id;
      } else {
        // สร้างสัตว์ใหม่
        const [animalInsert] = await db
          .promise()
          .query("INSERT INTO animals (name, category_id) VALUES (?, ?)", [
            animal_name,
            category_id || null,
          ]);
        animalId = animalInsert.insertId;
      }

      // เพิ่มประเภทสัตว์
      await db
        .promise()
        .query(
          "INSERT INTO animal_types (type_name, animal_id) VALUES (?, ?)",
          [type_name, animalId]
        );
    }

    return res.status(200).json({ message: `${status}คำร้องสำเร็จ` });
  } catch (err) {
    console.error("Error Approval Full Animal:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการจัดการคำร้อง" });
  }
};

// ประวัติคำร้องแบบรวมของฟาร์มเมอร์ที่ login
exports.getHistoryFull = async (req, res) => {
  try {
    const { id } = req.user;
    const sql = `
      SELECT request_id, animal_name, type_name, status, create_at, approved_date, reason
      FROM animal_full_requests
      WHERE farmer_id = ?
      ORDER BY create_at DESC
    `;
    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบประวัติคำร้องแบบรวม" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error fetch Full Animal History:", err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงประวัติคำร้องแบบรวม" });
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
      ORDER BY t1.create_at ASC
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
