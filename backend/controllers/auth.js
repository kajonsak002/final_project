const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const send_email = require("../send_email");

const deleteImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("ลบไฟล์ไม่สำเร็จ:", err);
    } else {
      console.log("ลบไฟล์เรียบร้อย:", imagePath);
    }
  });
};

exports.login = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  // console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM farmer WHERE email = ?", [email]);

    // console.log(rows);

    if (rows.length === 0) {
      return res.status(400).json({ message: "ไม่พบข้อมูลผู้ใช้นี้ในระบบ" });
    }

    if (rows[0].status == "อนุมัติ") {
      const farmer = rows[0];

      const isMatch = await bcrypt.compare(password, farmer.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง" });
      }

      const token = jwt.sign(
        {
          id: farmer.farmer_id,
          email: farmer.email,
          fullname: farmer.farm_name,
          farm_img: `${protocol}://${host}/${farmer.farm_img}`,
          farm_banner: `${protocol}://${host}/${farmer.farm_banner}`,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        message: "เข้าสู่ระบบสำเร็จ",
        token,
        data: {
          id: farmer.farmer_id,
          email: farmer.email,
          fullname: farmer.farm_name,
          farm_img: `${protocol}://${host}/${farmer.farm_img}`,
          farm_banner: `${protocol}://${host}/${farmer.farm_banner}`,
        },
      });
    } else {
      return res
        .status(400)
        .json({ message: "บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ" });
    }
  } catch (err) {
    console.error("Error : ", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.register = async (req, res) => {
  const {
    email,
    password,
    phone,
    farm_name,
    tambon,
    amphures,
    province,
    latitude,
    longitude,
  } = req.body;

  const farm_img = req.files.farm_img[0] || null;
  const farm_banner = req.files.farm_banner[0] || null;

  if (
    !email ||
    !password ||
    !phone ||
    !farm_name ||
    !tambon ||
    !amphures ||
    !province ||
    !latitude ||
    !longitude
  ) {
    deleteImage(farm_img.path);
    deleteImage(farm_banner.path);
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM farmer WHERE email = ? OR farm_name = ?", [
        email,
        farm_name,
      ]);

    if (rows.length > 0) {
      deleteImage(farm_img.path);
      deleteImage(farm_banner.path);
      return res
        .status(400)
        .json({ message: "ชื่อฟาร์มหรืออีเมลนี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [[{ maxID }]] = await db
      .promise()
      .query("SELECT MAX(farmer_id) as maxID FROM farmer");

    const [result] = await db.promise().query(
      `INSERT INTO farmer 
         (farmer_id , email, password, phone, farm_name, tambon, amphure, province, latitude, longitude, farm_img, farm_banner)
         VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        maxID + 1,
        email,
        hashedPassword,
        phone,
        farm_name,
        tambon,
        amphures,
        province,
        latitude,
        longitude,
        farm_img.path,
        farm_banner.path,
      ]
    );

    if (result.affectedRows === 1) {
      await send_email(farm_name, email, "register");
      return res.status(201).json({ message: "สมัครสมาชิกสำเร็จ" });
    } else {
      deleteImage(farm_img.path);
      deleteImage(farm_banner.path);
      return res.status(500).json({ message: "ไม่สามารถสมัครสมาชิกได้" });
    }
  } catch (err) {
    console.error("Error : ", err);
    deleteImage(farm_img.path);
    deleteImage(farm_banner.path);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.adminRegister = async (req, res) => {
  const { username, password, fullname } = req.body;

  if (!username || !password || !fullname) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM admin WHERE username = ?", [username]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้งานแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO admin (username, password , full_name) VALUES (?, ?, ?)",
        [username, hashedPassword, fullname]
      );

    if (result.affectedRows === 1) {
      return res.status(201).json({ message: "สมัครสมาชิกผู้ดูแลระบบสำเร็จ" });
    } else {
      return res
        .status(500)
        .json({ message: "ไม่สามารถสมัครสมาชิกผู้ดูแลระบบได้" });
    }
  } catch (err) {
    console.error("Error : ", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM admin WHERE username = ?", [username]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "ไม่พบข้อมูลผู้ใช้นี้ในระบบ" });
    }

    const admin = rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    //สร้าง token เเละกำหนดระยะเวลาของ token
    const token = jwt.sign(
      {
        id: admin.admin_id,
        username: admin.username,
        fullname: admin.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      data: {
        admin_id: admin.admin_id,
        username: admin.username,
        fullname: admin.full_name,
      },
    });
  } catch (err) {
    console.error("Error : ", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
  }
};

exports.check_token = (req, res) => {
  res.json({
    message: `ยินดีต้อนรับ คุณ${req.user.fullname}`,
  });
};
