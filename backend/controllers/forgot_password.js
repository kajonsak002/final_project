const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kasetinsri.app@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
});

exports.verifyEmail = async (req, res) => {
  const { email, table } = req.body;

  const sql =
    table === "admin"
      ? "SELECT * FROM admin WHERE username = ?"
      : "SELECT * FROM farmer WHERE email = ?";

  try {
    const [rows] = await db.promise().query(sql, [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "ไม่พบผู้ใช้งานนี้" });
    }

    const token = jwt.sign({ email, table }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const longUrl = `http://localhost:8888/reset-password/${token}`;

    const shortUrlRes = await axios.get(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
    );
    const shortUrl = shortUrlRes.data;

    const mailOptions = {
      from: "kasetinsri.app@gmail.com",
      to: email,
      subject: "คำร้องขอลิงค์สำหรับรีเซ็ตรหัสผ่าน",
      text: `คลิกลิงก์เพื่อตั้งรหัสผ่านใหม่: ${shortUrl}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ step: 2, message: "ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql =
      decoded.table === "admin"
        ? "UPDATE admin SET password = ? WHERE username = ?"
        : "UPDATE farmer SET password = ? WHERE email = ?";

    await db.promise().query(sql, [hashedPassword, decoded.email]);

    res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "ลิงก์ไม่ถูกต้องหรือหมดอายุ" });
  }
};
