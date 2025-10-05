const db = require("../config/db");
const dayjs = require("dayjs");
require("dayjs/locale/th");
dayjs.locale("th");

const getFormattedNow = () => dayjs().format("YYYY-MM-DD HH:mm:ss");
// 1. ดึงรายการสัตว์ในฟาร์ม
exports.getAnimalFarm = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const query = `
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
    const [[lastLot]] = await db
      .promise()
      .query(
        "SELECT lot_code FROM farm_animals WHERE farmer_id = ? ORDER BY id DESC LIMIT 1",
        [farmer_id]
      );

    let lotCode = lastLot
      ? String(parseInt(lastLot.lot_code) + 1).padStart(3, "0")
      : "001";

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

// 3. บันทึกการใช้สัตว์ (ไม่ใช้ transaction)
exports.addAnimalUsage = async (req, res) => {
  try {
    const { usage_date, description, details } = req.body;

    if (!usage_date || !details || details.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: "กรุณากรอกข้อมูลให้ครบ" });
    }

    const usage_code = "USG-" + dayjs().format("DDMMYYYYHHmmss");

    const [result] = await db.promise().query(
      `INSERT INTO animal_usage (usage_code, usage_date)
       VALUES (?, ?)`,
      [usage_code, usage_date]
    );

    const usageId = result.insertId;

    // insert details
    for (const d of details) {
      await db.promise().query(
        `INSERT INTO animal_usage_detail (usage_id, lot_id, quantity_used, action, remark)
         VALUES (?, ?, ?, ?, ?)`,
        [usageId, d.lot_id, d.quantity_used, d.action, d.remark || null]
      );
    }

    return res.status(201).json({
      success: true,
      msg: "บันทึกการใช้สัตว์สำเร็จ",
      usage_id: usageId,
      usage_code,
    });
  } catch (err) {
    console.error("Error adding animal usage:", err);
    return res
      .status(500)
      .json({ success: false, msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// 4. ดึงข้อมูลการใช้สัตว์ของฟาร์ม
exports.getAnimalUsageByFarm = async (req, res) => {
  const { farm_id } = req.params;
  try {
    const query = `
    SELECT 
      u.usage_id, u.usage_date, u.usage_code , 
      d.detail_id, d.quantity_used, d.action, d.remark,
      f.id AS farm_animal_id, f.lot_code,
      a.animal_id, a.name AS animal_name,
      t.type_id, t.type_name
    FROM animal_usage u
    JOIN animal_usage_detail d ON u.usage_id = d.usage_id
    JOIN farm_animals f ON d.lot_id = f.id
    JOIN animals a ON f.animal_id = a.animal_id
    LEFT JOIN animal_types t ON f.type_id = t.type_id
    WHERE f.farmer_id = ?
    ORDER BY u.usage_date DESC 
    `;
    const [rows] = await db.promise().query(query, [farm_id]);

    const usageMap = {};
    rows.forEach((r) => {
      if (!usageMap[r.usage_id]) {
        usageMap[r.usage_id] = {
          usage_id: r.usage_id,
          usage_code: r.usage_code,
          usage_date: r.usage_date,
          description: r.description,
          details: [],
        };
      }
      usageMap[r.usage_id].details.push({
        detail_id: r.detail_id,
        lot_id: r.farm_animal_id,
        lot_code: r.lot_code,
        animal_id: r.animal_id,
        animal_name: r.animal_name,
        type_id: r.type_id,
        type_name: r.type_name,
        quantity_used: r.quantity_used,
        action: r.action,
        remark: r.remark,
      });
    });

    return res.json({ success: true, data: Object.values(usageMap) });
  } catch (err) {
    console.error("Error fetching animal usage:", err);
    return res
      .status(500)
      .json({ success: false, msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
