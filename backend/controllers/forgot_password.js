const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.verifyEmail = async (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM farmer WHERE email = ?", [email]);

    if (rows.length === 0) {
      res.status(400).json({ message: "ไม่พบข้อมูลผู้ใช้นี้ในระบบ" });
    }
    res.status(200).json({ step: 2 });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

exports.resetPassword = async (req, res) => {
  //   console.log(req.body);
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [rows] = await db
      .promise()
      .query("UPDATE farmer SET password =  ? WHERE email = ? ", [
        hashedPassword,
        email,
      ]);

    if (rows.length === 0) {
      res.status(400).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
    }

    res.status(200).json({ message: "เปลี่ยนรหัสผ่านเรียบร้อยเเล้ว", step: 3 });
    // console.log(hashedPassword);
  } catch (err) {
    console.log("Error : ", err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
