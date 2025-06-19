const db = require("../config/db");
const send_email = require("../send_email");

exports.getWaitingApproval = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;

  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM farmer WHERE status = 'รออนุมัติ' ");

    if (rows.length === 0) {
      return res
        .status(400)
        .json({ message: "ไม่พบข้อมูลฟาร์มที่รอการอนุมัติ" });
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
    console.log("Error fetch Farmer waiting Approval : ", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.processApproval = async (req, res) => {
  const { farmer_id, approved_date, status, email, farm_name } = req.body;

  try {
    const [rows] = await db
      .promise()
      .execute(
        "UPDATE farmer SET status = ?, approved_date = ? WHERE farmer_id = ?",
        [status, approved_date, farmer_id]
      );

    if (rows.affectedRows === 0) {
      return res.status(400).json({
        message:
          status === "อนุมัติ"
            ? "เกิดข้อผิดพลาดในการอนุมัติ"
            : "เกิดข้อผิดพลาดในการปฏิเสธการสมัครสมาชิก",
      });
    }

    await send_email(
      farm_name,
      email,
      status === "อนุมัติ" ? "approved" : "rejected"
    );

    return res.status(200).json({
      message:
        status === "อนุมัติ"
          ? "อนุมัติการสมัครสมาชิกเรียบร้อยเเล้ว"
          : "ปฏิเสธการสมัครสมาชิกเรียบร้อยเเล้ว",
    });
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการอนุมัติการลงทะเบียน:", err);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการอนุมัติการลงทะเบียน",
    });
  }
};
