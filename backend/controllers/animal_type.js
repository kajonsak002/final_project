const db = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const [row] = await db.promise().query("SELECT * FROM animal_types");

    if (row.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสัตว์ประเภทนี้" });
    }

    return res.status(200).json(row);
  } catch (err) {
    console.log("Error Get AnimalType : ", err);
    return res.status(500).json({ message: "Error Get AnimalType" });
  }
};

//Req. add AnimalType
exports.getWaitApproval = async (req, res) => {
  try {
    const sql = `SELECT t1.request_id , t2.farm_name , t1.name , t1.status , t1.create_at FROM animal_type_requests  as t1 
                 JOIN farmer as t2 ON t1.farmer_id = t2.farmer_id
                 WHERE t1.status = "รออนุมัติ"
                 `;
    const [rows] = await db.promise().query(sql);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบคำร้องขอเพิ่มรายการสัตว์" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error fetch Animal Request : ", err);
    res
      .status(500)
      .json({ message: "เกิดข้อมผิดพลาดในการดึงข้อมูลคำร้องเพิ่มรายการสัตว์" });
  }
};

exports.request = async (req, res) => {
  try {
    const { animal_id, name } = req.body;
    const { id } = req.user;

    if (!name) {
      return res
        .status(500)
        .json({ message: "กรุณาระบุชื่อประเภทที่ต้องการส่งคำร้อง" });
    }

    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(request_id) as next_id FROM animal_type_requests");

    const [row] = await db
      .promise()
      .query(
        "INSERT INTO animal_type_requests (request_id , farmer_id , animal_id , name ) VALUES (?,?,?,?)",
        [next_id + 1, id, animal_id, name]
      );

    if (row.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "เกิดข้อผิดพลาดในการส่งคำร้องเพิ่มประเภทสัตว์" });
    }

    return res
      .status(201)
      .json({ message: "ส่งคำร้องขอเพิ่มประเภทสัตว์สำเร็จ" });
  } catch (err) {
    console.log("Error Request add animel : ", err);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการส่งคำร้องเพิ่มประเภทสัตว์" });
  }
};

exports.manageRequest = async (req, res) => {
  try {
    console.log(req.body);
    const { request_id, status, approved_date } = req.body;

    if (!request_id) {
      return res.status(400).json({ message: "กรุณาเลือกคำร้องก่อนทำรายการ" });
    }

    const updateSql =
      status === "อนุมัติ"
        ? "UPDATE animal_type_requests SET status = ?, approved_date = ? WHERE request_id = ?"
        : "UPDATE animal_type_requests SET status = ? WHERE request_id = ?";
    const updateParams =
      status === "อนุมัติ"
        ? [status, approved_date, request_id]
        : [status, request_id];

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
          "SELECT name , animal_id FROM animal_type_requests WHERE request_id = ?",
          [request_id]
        );

      const [[{ maxId = 0 }]] = await db
        .promise()
        .query("SELECT MAX(type_id) AS maxId FROM animal_types");
      const nextId = String(Number(maxId) + 1).padStart(3, "0");

      await db
        .promise()
        .execute(
          "INSERT INTO animal_types (type_id, name , animal_id) VALUES (?, ? ,?)",
          [nextId, requestData.name, requestData.animal_id]
        );
    }

    return res.status(200).json({
      message: `${status === "อนุมัติ" ? "อนุมัติ" : "ปฏิเสธ"}คำร้องสำเร็จ`,
    });
  } catch (err) {
    console.error("Error Approval Animal Type:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการจัดการคำร้อง" });
  }
};

//CRUD Animal Type
exports.insert = async (req, res) => {
  try {
    const { animal_id, name } = req.body;

    if (!animal_id || !name) {
      return res.status(400).json({ message: "กรุณาระบุรหัสสัตว์เเละชื่อ" });
    }

    const [[{ maxId = 0 }]] = await db
      .promise()
      .query("SELECT MAX(type_id) AS maxId FROM animal_types");
    const nextId = String(Number(maxId) + 1).padStart(3, "0");

    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO animal_types (type_id , animal_id , name) VALUES (?,?,?)",
        [nextId, animal_id, name]
      );

    if (rows.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูลประเภทสัตว์" });
    }

    return res.status(201).json({ message: "เพิ่มประเภทสัตว์สำเร็จ" });
  } catch (err) {
    console.log("Error Insert AnimalType : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, animal_id } = req.body;

    if (!id || !name || !animal_id) {
      return res
        .status(400)
        .json({ message: "กรุณาระบุรหัสประเภทสัตว์ ชื่อ และรหัสสัตว์" });
    }

    const [row] = await db
      .promise()
      .query(
        "UPDATE animal_types SET name = ?, animal_id = ? WHERE type_id = ?",
        [name, animal_id, id]
      );

    if (row.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }

    return res.status(200).json({ message: "อัปเดตข้อมูลเรียบร้อยเเล้ว" });
  } catch (err) {
    console.log("Error Update AnimalType : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "กรุณาระบุรหัสประเภทสัตว์" });
    }

    const [row] = await db
      .promise()
      .query("DELETE FROM animal_types WHERE type_id = ?", [id]);

    if (row.affectedRows === 0) {
      return res.status(400).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }

    return res.status(200).json({ message: "ลบข้อมูลเรียบร้อยเเล้ว" });
  } catch (err) {
    console.log("Error DELETE AnimalType : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};

exports.getHistory = async (req, res) => {
  try {
    // return res.json(req.user);
    const { id } = req.user;

    const sql = `SELECT t1.request_id, t2.farm_name, t1.name, t1.status, t1.create_at 
                 FROM animal_type_requests AS t1 
                 JOIN farmer AS t2 ON t1.farmer_id = t2.farmer_id 
                 WHERE t1.farmer_id = ?`;

    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "ไม่พบประวัติคำร้องขอเพิ่มประเภทสัตว์" });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.log("Error Get History AnimalType : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงประวัติ" });
  }
};
