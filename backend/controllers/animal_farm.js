const db = require("../config/db");

// 1. ดึงรายการสัตว์ในฟาร์ม
exports.getAnimalFarm = async (req, res) => {
  const { farm_id } = req.params;

  try {
    let query = `
      SELECT fa.id AS farm_animal_id, fa.quantity, fa.quantity_received,
             fa.created_at, fa.updated_at, 
             fa.lot_code,
             a.animal_id, a.name AS animal_name,
             t.type_id, t.type_name
      FROM farm_animals fa
      JOIN animals a ON fa.animal_id = a.animal_id
      LEFT JOIN animal_types t ON fa.type_id = t.type_id
      WHERE fa.farmer_id = ?
      ORDER BY fa.lot_code ASC
    `;

    const [rows] = await db.promise().query(query, [farm_id]);
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching animals:", err);
    return res
      .status(500)
      .json({ success: false, msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// 2. รับสัตว์เข้าฟาร์ม
exports.addAnimal = async (req, res) => {
  const { farmer_id, animal_id, type_id, quantity_received } = req.body;
  if (!farmer_id || !animal_id || !quantity_received) {
    return res
      .status(400)
      .json({ success: false, msg: "กรุณากรอกข้อมูลให้ครบ" });
  }

  try {
    // หา lot ล่าสุดของฟาร์มนี้
    const [[lastLot]] = await db
      .promise()
      .query(
        "SELECT lot_code FROM farm_animals WHERE farmer_id = ? ORDER BY id DESC LIMIT 1",
        [farmer_id]
      );

    let lotCode;
    if (!lastLot) {
      lotCode = "001";
    } else {
      const lastNumber = parseInt(lastLot.lot_code);
      lotCode = String(lastNumber + 1).padStart(3, "0");
    }

    // เพิ่มสัตว์
    const query = `
      INSERT INTO farm_animals (farmer_id, animal_id, type_id, quantity, quantity_received, lot_code)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      farmer_id,
      animal_id,
      type_id || null,
      quantity_received,
      quantity_received,
      lotCode,
    ];
    const [result] = await db.promise().query(query, params);

    return res.status(201).json({
      success: true,
      msg: "เพิ่มสัตว์เข้าฟาร์มเรียบร้อย",
      data: {
        farm_animal_id: result.insertId,
        farmer_id,
        animal_id,
        type_id,
        quantity_received,
        quantity: quantity_received,
        lot_code: lotCode,
      },
    });
  } catch (err) {
    console.error("Error adding animal:", err);
    return res
      .status(500)
      .json({ success: false, msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// 3. บันทึกการใช้สัตว์ (Usage)
exports.useAnimal = async (req, res) => {
  const { farm_animal_id, quantity_used, usage_type, remark } = req.body;

  if (!farm_animal_id || !quantity_used || !usage_type) {
    return res
      .status(400)
      .json({ success: false, msg: "กรุณากรอกข้อมูลให้ครบ" });
  }

  const connection = await db.promise().getConnection();
  try {
    await connection.beginTransaction();

    // ตรวจสอบจำนวนคงเหลือ
    const [rows] = await connection.query(
      "SELECT quantity FROM farm_animals WHERE id = ? FOR UPDATE",
      [farm_animal_id]
    );
    if (rows.length === 0) throw new Error("ไม่พบสัตว์ฟาร์มนี้");
    const remaining = rows[0].quantity;

    if (remaining < quantity_used) throw new Error("จำนวนใช้มากกว่าที่คงเหลือ");

    // อัพเดต farm_animals
    await connection.query(
      "UPDATE farm_animals SET quantity = quantity - ? WHERE id = ?",
      [quantity_used, farm_animal_id]
    );

    // บันทึก usage
    await connection.query(
      `INSERT INTO farm_animal_usage (farm_animal_id, quantity_used, usage_type, remark)
       VALUES (?, ?, ?, ?)`,
      [farm_animal_id, quantity_used, usage_type, remark || null]
    );

    await connection.commit();
    return res.json({ success: true, msg: "บันทึกการใช้สัตว์เรียบร้อย" });
  } catch (err) {
    await connection.rollback();
    console.error("Error using animal:", err);
    return res.status(500).json({ success: false, msg: err.message });
  } finally {
    connection.release();
  }
};
