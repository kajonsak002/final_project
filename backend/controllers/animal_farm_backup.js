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

// 3. บันทึกการใช้สัตว์ (Usage) - รองรับหลายสัตว์ในครั้งเดียว
exports.useAnimal = async (req, res) => {
  const { usages, usage_type, remark } = req.body;

  if (!usages || !Array.isArray(usages) || usages.length === 0) {
    return res
      .status(400)
      .json({ success: false, msg: "กรุณากรอกข้อมูลให้ครบ" });
  }

  if (!usage_type) {
    return res
      .status(400)
      .json({ success: false, msg: "กรุณาเลือกประเภทการใช้งาน" });
  }

  try {
    try {
      // สร้าง usage_group_id สำหรับการจัดกลุ่ม
      const usageGroupId = `USG_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // เก็บข้อมูลสัตว์ที่ใช้
      const animalsData = [];
      let totalQuantityUsed = 0;

      // ตรวจสอบและอัพเดตข้อมูลสัตว์แต่ละตัว
      for (const item of usages) {
        const { farm_animal_id, quantity_used } = item;

        if (!farm_animal_id || !quantity_used) {
          throw new Error("ข้อมูลไม่ครบในบางรายการ");
        }

        // ตรวจสอบจำนวนคงเหลือ
        const [rows] = await db
          .promise()
          .query(
            "SELECT quantity, lot_code, animal_id FROM farm_animals WHERE id = ?",
            [farm_animal_id]
          );

        if (rows.length === 0) {
          throw new Error(`ไม่พบสัตว์ฟาร์ม ID ${farm_animal_id}`);
        }

        const remaining = rows[0].quantity;
        if (remaining < quantity_used) {
          throw new Error(
            `จำนวนใช้มากกว่าที่คงเหลือสำหรับสัตว์ฟาร์ม ID ${farm_animal_id}`
          );
        }

        // อัพเดต farm_animals
        await db
          .promise()
          .query(
            "UPDATE farm_animals SET quantity = quantity - ? WHERE id = ?",
            [quantity_used, farm_animal_id]
          );

        // เก็บข้อมูลสัตว์
        animalsData.push({
          farm_animal_id,
          quantity_used: parseInt(quantity_used),
          lot_code: rows[0].lot_code,
          animal_id: rows[0].animal_id,
        });

        totalQuantityUsed += parseInt(quantity_used);
      }

      // บันทึก usage ครั้งเดียว
      await db.promise().query(
        `INSERT INTO farm_animal_usage (farm_id, usage_type, remark, animals, usage_group_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          usages[0].farmer_id, // ใช้ farmer_id จากรายการแรก
          usage_type,
          remark || null,
          JSON.stringify(animalsData),
          usageGroupId,
        ]
      );

      return res.json({
        success: true,
        msg: `บันทึกการใช้สัตว์เรียบร้อย (${usages.length} ตัว รวม ${totalQuantityUsed} ตัว)`,
        data: {
          usage_group_id: usageGroupId,
          total_animals: usages.length,
          total_quantity: totalQuantityUsed,
        },
      });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.error("Error using animals:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
};

// 4. ดูประวัติการใช้สัตว์ของฟาร์ม - แสดงแบบกลุ่ม
exports.getAnimalUsageHistory = async (req, res) => {
  const { farm_id } = req.params;

  try {
    const query = `
      SELECT 
        fau.id,
        fau.usage_type,
        fau.remark,
        fau.animals,
        fau.usage_group_id,
        fau.created_at
      FROM farm_animal_usage fau
      WHERE fau.farm_id = ?
      ORDER BY fau.created_at DESC
    `;

    const [rows] = await db.promise().query(query, [farm_id]);

    const processedData = await Promise.all(
      rows.map(async (row) => {
        // แก้ไขตรงนี้: เช็คก่อนว่าเป็น string หรือ object
        const animals =
          typeof row.animals === "string"
            ? JSON.parse(row.animals)
            : row.animals;

        const animalsWithDetails = await Promise.all(
          animals.map(async (animal) => {
            const [animalInfo] = await db.promise().query(
              `SELECT a.name AS animal_name, t.type_name 
               FROM animals a 
               LEFT JOIN animal_types t ON a.animal_id = t.animal_id
               WHERE a.animal_id = ?`,
              [animal.animal_id]
            );

            return {
              ...animal,
              animal_name: animalInfo[0]?.animal_name || "ไม่ทราบ",
              type_name: animalInfo[0]?.type_name || "-",
            };
          })
        );

        return {
          ...row,
          animals: animalsWithDetails,
          total_animals: animals.length,
          total_quantity: animals.reduce(
            (sum, animal) => sum + (animal.quantity_used || 0),
            0
          ),
        };
      })
    );

    return res.json({ success: true, data: processedData });
  } catch (err) {
    console.error("Error fetching animal usage history:", err);
    return res
      .status(500)
      .json({ success: false, msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
