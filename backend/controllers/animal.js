const db = require("../config/db");
const dayjs = require("dayjs");
const formatted = dayjs().format("YYYY-MM-DD HH:mm:ss");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM animals");

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

//Req. add Animal
exports.getWaitApproval = async (req, res) => {
  try {
    const sql = `SELECT t1.request_id , t2.farm_name , t1.name , t1.status , t1.create_at FROM animal_requests  as t1 
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
    const { farmer_id, name } = req.body;

    if (!name) {
      return res
        .status(500)
        .json({ message: "กรุณาระบุชื่อสัตว์ที่ต้องการส่งคำร้อง" });
    }

    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(request_id) as next_id FROM animal_requests");

    const [row] = await db
      .promise()
      .query(
        "INSERT INTO animal_requests (request_id , farmer_id , name ) VALUES (?,?,?)",
        [next_id + 1, farmer_id, name]
      );

    if (row.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "เกิดข้อผิดพลาดในการส่งคำร้องเพิ่มรายการสัตว์" });
    }

    return res
      .status(201)
      .json({ message: "ส่งคำร้องขอเพิ่มรายการสัตว์สำเร็จ" });
  } catch (err) {
    console.log("Error Request add animel : ", err);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการส่งคำร้องเพิ่มรายการสัตว์" });
  }
};

exports.manageRequest = async (req, res) => {
  try {
    const { request_id, status } = req.body;

    if (!request_id) {
      return res.status(400).json({ message: "กรุณาเลือกคำร้องก่อนทำรายการ" });
    }

    const updateSql =
      status === "อนุมัติ"
        ? "UPDATE animal_requests SET status = ?, approved_date = ? WHERE request_id = ?"
        : "UPDATE animal_requests SET status = ? WHERE request_id = ?";
    const updateParams =
      status === "อนุมัติ"
        ? [status, formatted, request_id]
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
        .query("SELECT name FROM animal_requests WHERE request_id = ?", [
          request_id,
        ]);

      const animal_name = requestData?.name;
      if (!animal_name) {
        return res.status(404).json({ message: "ไม่พบชื่อสัตว์ในคำร้องนี้" });
      }

      const [[{ maxId = 0 }]] = await db
        .promise()
        .query("SELECT MAX(animal_id) AS maxId FROM animals");
      const nextId = String(Number(maxId) + 1).padStart(3, "0");

      await db
        .promise()
        .query("INSERT INTO animals (animal_id, name) VALUES (?, ?)", [
          nextId,
          animal_name,
        ]);
    }

    return res.status(200).json({
      message: `${status === "อนุมัติ" ? "อนุมัติ" : "ปฏิเสธ"}คำร้องสำเร็จ`,
    });
  } catch (err) {
    console.error("Error Approval Animal:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการจัดการคำร้อง" });
  }
};

//CRUD
exports.insert = async (req, res) => {
  try {
    const { animal_name } = req.body;

    if (!animal_name) {
      return res.status(400).json({ message: "กรุณาระบุชือสัตว์" });
    }

    const [[{ maxId = 0 }]] = await db
      .promise()
      .query("SELECT MAX(animal_id) AS maxId FROM animals");
    const nextId = String(Number(maxId) + 1).padStart(3, "0");

    const [rows] = await db
      .promise()
      .query("INSERT INTO animals (animal_id, name) VALUES (?, ?)", [
        nextId,
        animal_name,
      ]);

    if (rows.affectedRows === 0) {
      return res.status(500).json({ message: "ไม่สามารถเพิ่มข้อมูลสัตว์ได้" });
    }

    res.status(201).json({ message: "เพิ่มข้อมูลสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error inserting animal", error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { animal_name } = req.body;

    if (!animal_name) {
      return res.status(400).json({ message: "กรุณาระบุชื่อสัตว์" });
    }

    const [row] = await db
      .promise()
      .query("SELECT * FROM animals WHERE animal_id = ?", [id]);
    if (row.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสัตว์ที่ระบุ" });
    }

    const [rows] = await db
      .promise()
      .query("UPDATE animals SET name = ? WHERE animal_id = ?", [
        animal_name,
        id,
      ]);

    if (rows.affectedRows === 0) {
      return res.status(500).json({ message: "ไม่สามารถอัพเดทข้อมูลสัตว์ได้" });
    }
    return res.status(200).json({ message: "อัพเดทข้อมูลสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating animal", error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    const [row] = await db
      .promise()
      .query("SELECT * FROM animals WHERE animal_id = ?", [id]);
    if (row.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลสัตว์ที่ระบุ" });
    }

    const [rows] = await db
      .promise()
      .query("DELETE FROM animals WHERE animal_id = ?", [id]);
    if (rows.affectedRows === 0) {
      return res.status(500).json({ message: "ไม่สามารถลบข้อมูลสัตว์ได้" });
    }
    return res.status(200).json({ message: "ลบข้อมูลสัตว์เรียบร้อยแล้ว" });
  } catch (err) {
    console.log("Error Delete Animal :", err);
    return res.status(500).json({ message: "Error deleting animal" });
  }
};
