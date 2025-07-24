const db = require("../config/db");

exports.get_summary_count = async (req, res) => {
  try {
    // ฟาร์ม
    const [[farmCounts]] = await db.promise().query(`
      SELECT
        COUNT(*) AS total_farm,
        COUNT(CASE WHEN status = 'รออนุมัติ' THEN 1 END) AS total_farm_waiting
      FROM farmer
    `);

    // โพสต์
    const [[postCounts]] = await db.promise().query(`
      SELECT
        COUNT(*) AS total_post,
        COUNT(CASE WHEN status = 'รออนุมัติ' THEN 1 END) AS total_post_waiting
      FROM posts
    `);

    // รายงานโพสต์
    const [[reportPostCounts]] = await db.promise().query(`
      SELECT COUNT(*) AS total_report_post_waiting
      FROM post_report
      WHERE status = 'รอดำเนินการ'
    `);

    // รายงานความคิดเห็น
    const [[commentReportCounts]] = await db.promise().query(`
      SELECT COUNT(*) AS total_comment_report_waiting
      FROM comment_report
      WHERE status = 'รอดำเนินการ'
    `);

    // คำร้องขอเพิ่มรายการสัตว์
    const [[animalRequestCounts]] = await db.promise().query(`
      SELECT COUNT(*) AS total_animal_request_waiting
      FROM animal_requests
      WHERE status = 'รออนุมัติ'
    `);

    // คำร้องขอเพิ่มประเภทสัตว์
    const [[animalTypeRequestCounts]] = await db.promise().query(`
      SELECT COUNT(*) AS total_animal_type_request_waiting
      FROM animal_type_requests
      WHERE status = 'รออนุมัติ'
    `);

    return res.json({
      total_farm: farmCounts.total_farm,
      total_farm_waiting: farmCounts.total_farm_waiting,
      total_post_waiting: postCounts.total_post_waiting,
      total_report_post_waiting: reportPostCounts.total_report_post_waiting,
      total_comment_report_waiting:
        commentReportCounts.total_comment_report_waiting,
      total_animal_request_waiting:
        animalRequestCounts.total_animal_request_waiting,
      total_animal_type_request_waiting:
        animalTypeRequestCounts.total_animal_type_request_waiting,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
