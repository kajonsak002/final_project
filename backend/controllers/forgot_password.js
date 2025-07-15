const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.verifyEmail = async (req, res) => {
  // console.log(req.body);
  const { email, table } = req.body;

  const sql =
    table == "admin"
      ? "SELECT * FROM admin WHERE username = ? "
      : "SELECT * FROM farmer WHERE email = ?";

  try {
    const [rows] = await db.promise().query(sql, [email]);

    if (rows.length === 0) {
      res.status(400).json({ message: "ไม่พบข้อมูลผู้ใช้นี้ในระบบ" });
    }
    res.status(200).json({ step: 2 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

exports.resetPassword = async (req, res) => {
  //   console.log(req.body);
  const { email, newPassword, table } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql =
      table == "admin"
        ? "UPDATE admin SET password =  ? WHERE username = ?"
        : "UPDATE ${table} SET password =  ? WHERE email = ?";

    const [rows] = await db.promise().query(sql, [hashedPassword, email]);

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
