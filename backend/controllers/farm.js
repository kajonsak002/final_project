const db = require("../config/db");
const send_email = require("../send_email");

const fs = require("fs");
const path = require("path");

const deleteImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("ลบไฟล์ไม่สำเร็จ:", err);
    } else {
      console.log("ลบไฟล์เรียบร้อย:", imagePath);
    }
  });
};

exports.getFarmProfile = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  const { id } = req.user || req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT t1.farm_name , t1.farm_img , t1.farmer_id ,
      t1.phone ,
      t1.email,
      t1.farm_banner,
      t1.province AS province_id,
      t1.amphure AS amphure_id,
      t1.tambon AS tambon_id,
      t2.name_th AS province, 
      t3.name_th AS amphure, 
      t4.name_th AS tambon FROM farmer as t1
      JOIN provinces AS t2 ON t1.province = t2.id
      JOIN amphures AS t3 ON t1.amphure = t3.id
      JOIN tambons AS t4 ON t1.tambon = t4.id
      WHERE farmer_id = ?
      AND status = 'อนุมัติ'`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลฟาร์ม" });
    }

    const farmer = rows[0];
    const updatedFarmer = {
      ...farmer,
      farm_img: farmer.farm_img
        ? `${protocol}://${host}/${farmer.farm_img}`
        : null,
      farm_banner: farmer.farm_banner
        ? `${protocol}://${host}/${farmer.farm_banner}`
        : null,
    };

    const [[product]] = await db
      .promise()
      .query(`SELECT * FROM products WHERE farmer_id = ?`, [id]);

    if (product) {
      const formattedProducts = {
        ...product,
        image: product.image
          ? `${req.protocol}://${req.headers.host}/${product.image}`
          : null,
      };
      return res.status(200).json({
        msg: "sucess",
        data: updatedFarmer,
        product: formattedProducts,
      });
    } else {
      return res.status(200).json({
        msg: "sucess",
        data: updatedFarmer,
        product: product,
      });
    }
  } catch (err) {
    console.error("Error fetching farm profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllFarms = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  try {
    const [rows] = await db.promise().query(`SELECT 
                                              t1.*,
                                              t2.name_th AS province, 
                                              t3.name_th AS amphure, 
                                              t4.name_th AS tambon
                                            FROM farmer AS t1
                                            JOIN provinces AS t2 ON t1.province = t2.id
                                            JOIN amphures AS t3 ON t1.amphure = t3.id
                                            JOIN tambons AS t4 ON t1.tambon = t4.id
                                            WHERE status = 'อนุมัติ' AND is_active = 'ปกติ'
                                            `);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No farms found" });
    }
    const updatedRows = rows.map((farmer) => {
      return {
        ...farmer,
        farm_img: farmer.farm_img
          ? `${protocol}://${host}/${farmer.farm_img}`
          : null,
        farm_banner: farmer.farm_banner
          ? `${protocol}://${host}/${farmer.farm_banner}`
          : null,
      };
    });
    return res.status(200).json(updatedRows);
  } catch (err) {
    console.error("Error fetching farms:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllFarmForManage = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  try {
    const [rows] = await db.promise().query(`SELECT 
                                              t1.*,
                                              t2.name_th AS province, 
                                              t3.name_th AS amphure, 
                                              t4.name_th AS tambon
                                            FROM farmer AS t1
                                            JOIN provinces AS t2 ON t1.province = t2.id
                                            JOIN amphures AS t3 ON t1.amphure = t3.id
                                            JOIN tambons AS t4 ON t1.tambon = t4.id
                                            WHERE status = 'อนุมัติ'
                                            ORDER BY t1.is_active
                                            `);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No farms found" });
    }
    const updatedRows = rows.map((farmer) => {
      return {
        ...farmer,
        farm_img: farmer.farm_img
          ? `${protocol}://${host}/${farmer.farm_img}`
          : null,
        farm_banner: farmer.farm_banner
          ? `${protocol}://${host}/${farmer.farm_banner}`
          : null,
      };
    });
    return res.status(200).json(updatedRows);
  } catch (err) {
    console.error("Error fetching farms:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFarmsData = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  try {
    const [rows] = await db.promise().query(`SELECT 
                                              t1.*,
                                              t2.name_th AS province, 
                                              t3.name_th AS amphure, 
                                              t4.name_th AS tambon
                                            FROM farmer AS t1
                                            JOIN provinces AS t2 ON t1.province = t2.id
                                            JOIN amphures AS t3 ON t1.amphure = t3.id
                                            JOIN tambons AS t4 ON t1.tambon = t4.id
                                            WHERE status = 'อนุมัติ' 
                                            `);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No farms found" });
    }
    const updatedRows = rows.map((farmer) => {
      return {
        ...farmer,
        farm_img: farmer.farm_img
          ? `${protocol}://${host}/${farmer.farm_img}`
          : null,
        farm_banner: farmer.farm_banner
          ? `${protocol}://${host}/${farmer.farm_banner}`
          : null,
      };
    });
    return res.status(200).json(updatedRows);
  } catch (err) {
    console.error("Error fetching farms:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Admin updates farmer account active status and sends email
exports.updateFarmerAccountStatus = async (req, res) => {
  const { farmer_id } = req.params;
  const { is_active, reason } = req.body;

  if (!farmer_id || !is_active) {
    return res
      .status(400)
      .json({ message: "กรุณาระบุ farmer_id และสถานะบัญชี" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT farm_name, email FROM farmer WHERE farmer_id = ?", [
        farmer_id,
      ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้งาน" });
    }

    await db
      .promise()
      .query(
        "UPDATE farmer SET is_active = ?, reason = ?, update_at = NOW() WHERE farmer_id = ?",
        [is_active, reason || null, farmer_id]
      );

    const { farm_name, email } = rows[0];
    const action = is_active === "โดนระงับ" ? "suspend" : "unsuspend";
    await send_email(farm_name || "ผู้ใช้งาน", email, action, reason || "");

    return res.status(200).json({ message: "อัปเดตสถานะบัญชีสำเร็จ" });
  } catch (err) {
    console.error("Error update account status:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.updateFarmProfile = async (req, res) => {
  const {
    farmerId,
    farmName,
    phone,
    email,
    address,
    province,
    amphure,
    tambon,
  } = req.body;

  const farm_img = req.files?.farm_img?.[0] || null;
  const farm_banner = req.files?.farm_banner?.[0] || null;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM farmer WHERE farmer_id = ?", [farmerId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลฟาร์ม" });
    }

    const currentData = rows[0];

    if (farm_img && currentData.farm_img) {
      deleteImage(currentData.farm_img);
    }

    if (farm_banner && currentData.farm_banner) {
      deleteImage(currentData.farm_banner);
    }

    const farmImgPath = farm_img ? farm_img.path : currentData.farm_img;
    const farmBannerPath = farm_banner
      ? farm_banner.path
      : currentData.farm_banner;

    const updateSql = `
      UPDATE farmer SET
        farm_name = ?,
        phone = ?,
        email = ?,
        tambon = ?,
        amphure = ?,
        province = ?,
        farm_img = ?,
        farm_banner = ?,
        update_at = NOW()
      WHERE farmer_id = ?
    `;

    await db
      .promise()
      .query(updateSql, [
        farmName,
        phone,
        email,
        tambon,
        amphure,
        province,
        farmImgPath,
        farmBannerPath,
        farmerId,
      ]);

    return res.json({ message: "อัปเดตข้อมูลฟาร์มเรียบร้อย" });
  } catch (err) {
    console.error("Error updating farm profile:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
