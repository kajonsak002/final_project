const db = require("../config/db");

exports.getProvinces = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT id , name_th FROM provinces");
    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลจังหวัด" });
    }
    return res.status(200).json({
      message: "ดึงข้อมูลจังหวัดสำเร็จ",
      provinces: rows,
    });
  } catch (err) {
    console.log("Error fetching provinces:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลจังหวัด" });
  }
};

exports.getDistricts = async (req, res) => {
  const { provinceId } = req.params;

  if (!provinceId) {
    return res.status(400).json({ message: "กรุณาระบุรหัสจังหวัด" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT id, name_th FROM amphures WHERE province_id = ?", [
        provinceId,
      ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลเขต/อำเภอ" });
    }

    return res.status(200).json({
      message: "ดึงข้อมูลเขต/อำเภอสำเร็จ",
      districts: rows,
    });
  } catch (err) {
    console.log("Error fetching districts:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลเขต/อำเภอ" });
  }
};

exports.getTambons = async (req, res) => {
  const { districtId } = req.params;

  if (!districtId) {
    return res.status(400).json({ message: "กรุณาระบุรหัสเขต/อำเภอ" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT id, name_th FROM tambons WHERE amphure_id = ?", [
        districtId,
      ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลตำบล" });
    }

    return res.status(200).json({
      message: "ดึงข้อมูลตำบลสำเร็จ",
      tambons: rows,
    });
  } catch (err) {
    console.log("Error fetching tambons:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลตำบล" });
  }
};
