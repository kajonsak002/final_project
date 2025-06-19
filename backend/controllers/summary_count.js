const db = require("../config/db");

exports.get_summary_count = async (req, res) => {
  try {
    const [[counts]] = await db.promise().query(`
      SELECT
        COUNT(CASE WHEN status = 'อนุมัติ' THEN 1 END) AS total_farm,
        COUNT(CASE WHEN status = 'รออนุมัติ' THEN 1 END) AS total_farm_waiting
      FROM farmer
    `);

    res.status(200).json(counts);
  } catch (err) {
    console.error("Error get FarmerCount:", err);
    res.status(500).json({ message: `เกิดข้อผิดพลาด ${err}` });
  }
};
