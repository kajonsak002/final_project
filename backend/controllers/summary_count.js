const db = require("../config/db");

exports.get_summary_count = async (req, res) => {
  try {
    const [[counts]] = await db.promise().query(`
      SELECT
        COUNT(CASE WHEN status = 'อนุมัติ' THEN 1 END) AS total_farm,
        COUNT(CASE WHEN status = 'รออนุมัติ' THEN 1 END) AS total_farm_waiting,
        (SELECT COUNT(*) FROM posts WHERE status = 'รออนุมัติ') AS total_post_waiting,
        (SELECT COUNT(*) FROM post_report WHERE status = 'รอดำเนินการ') AS total_report_post_waiting
      FROM farmer
    `);

    res.status(200).json(counts);
  } catch (err) {
    console.error("Error get summary count:", err);
    res.status(500).json({ message: `เกิดข้อผิดพลาด ${err}` });
  }
};
