const db = require("../config/db");
const dayjs = require("dayjs");
require("dayjs/locale/th");
dayjs.locale("th");

const getFormattedNow = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

exports.getComment = async (req, res) => {
  const { id } = req.params;
  const sql = `SELECT t1.comment_id , t2.farm_name , t1.content , t1.create_at , t2.farm_img , t1.post_id  FROM comments as t1 
               JOIN farmer as t2 ON t1.farmer_id = t2.farmer_id 
               WHERE t1.post_id = ? AND t1.status = "แสดง"`;
  try {
    const [comment] = await db.promise().query(sql, [id]);

    if (comment.length < 0) {
      res.status(400).json({ msg: "ไม่พบความคิดเห็น" });
    }
    const host = req.headers.host;
    const protocol = req.protocol;
    const comments = comment.map((cm) => ({
      ...cm,
      farm_img: cm.farm_img
        ? `${protocol}://${host}/${cm.farm_img.replace(/^\\+/, "")}`
        : null,
    }));
    return res.status(200).json({ msg: "ดึงความคิดเห็นสำเร็จ", comments });
  } catch (err) {
    console.log("Internal Server Error ", err);
    return res.status(500).json({ msg: "Error get comment" });
  }
};

exports.addComment = async (req, res) => {
  const { post_id, farmer_id, content } = req.body;
  try {
    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(comment_id) as next_id FROM comments");

    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO comments (comment_id , post_id , farmer_id , content , create_at ) VALUE (? , ? , ? , ? ,?)",
        [next_id + 1, post_id, farmer_id, content, getFormattedNow()]
      );

    if (rows.length < 0) {
      res.status(500).json({ msg: "เกิดข้อผิดพลาดในการเพิ่มความคิดเห็น" });
    }

    res.status(201).json({ msg: "เพิ่มความคิดเห็นเเล้ว" });
  } catch (err) {
    console.log("Internal Server Error", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มความคิดเห็น" });
  }
};

exports.hideComment = async (req, res) => {
  const { comment_id } = req.body;
  try {
    await db
      .promise()
      .query("UPDATE comments SET status = ? WHERE comment_id = ?", [
        "ซ่อน",
        comment_id,
      ]);

    res.status(201).json({ msg: "ซ่อนความคิดเห็นเเล้ว" });
  } catch (err) {
    console.log("Internal Server Error : ", err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในการซ่อนความคิดเห็น" });
  }
};

exports.reportComment = async (req, res) => {
  const { post_id, farmer_id, reason, comment_id } = req.body;
  try {
    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(report_id) as next_id FROM comment_report");

    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO comment_report (report_id , post_id , farmer_id , reason , comment_id) VALUE (?,?,?,?,?)",
        [next_id + 1, post_id, farmer_id, reason, comment_id]
      );

    if (rows.length < 0) {
      return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการรายความคิดเห็น" });
    }

    return res.status(201).json({ msg: "รายงานวามคิดเห็นเเล้ว" });
  } catch (err) {
    console.log("Internal Server Error : ", err);
    return res
      .status(500)
      .json({ msg: "เกิดข้อผิดพลาดในการรายงานความคิดเห็น" });
  }
};

exports.getCommentReport = async (req, res) => {
  try {
    const [rows] = await db.promise()
      .query(`SELECT t1.report_id , t1.post_id , t1.reason , t1.status , t1.report_date , t1.comment_id , t2.farm_name , t2.farmer_id , t3.content 
FROM comment_report as t1
JOIN farmer as t2 ON t1.farmer_id = t2.farmer_id
JOIN comments as t3 ON t1.comment_id = t3.comment_id
WHERE t1.status = 'รอดำเนินการ'
`);

    if (rows.length == 0) {
      res.status(404).json({ msg: "ไม่พบข้อมูลการรายงาน" });
    }
    res.status(200).json({ msg: "success", data: rows });
  } catch (err) {
    console.log("Error getCommentReport : ", err);
  }
};

exports.manageComment = async (req, res) => {
  const { comment_id, report_id, report_review, action } = req.body;

  try {
    if (!comment_id || !report_id) {
      return res.status(500).json({ msg: "ข้อมูลไม่ครบถ้วน" });
    }

    if (action === "approve") {
      [result] = await db
        .promise()
        .execute("UPDATE comments SET status = 'ลบแล้ว' WHERE comment_id = ?", [
          comment_id,
        ]);
      await db
        .promise()
        .query(
          "UPDATE comment_report SET status = 'ดำเนินการแล้ว', report_review = ? WHERE report_id = ?",
          [
            "ทางเราได้ทำการตรวจสอบความคิดเห็นนี้แล้ว เเละมีความไม่เหมาะสมจริงจึงได้ทำการลบความคิดเห็นนี้ออกจากระบบชุมชนของเรา",
            report_id,
          ]
        );

      return res.status(200).json({ msg: "ดำเนินการสำเร็จ" });
    } else if (action === "reject") {
      await db
        .promise()
        .query(
          "UPDATE comment_report SET status = 'ดำเนินการแล้ว', report_review = ? WHERE report_id = ?",
          [report_review, report_id]
        );

      return res.status(200).json({ msg: "ดำเนินการสำเร็จ" });
    } else {
      return res.status(400).json({ msg: "action ไม่ถูกต้อง" });
    }
  } catch (err) {
    console.log("Error delete comment", err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในการลบความคิดเห็น" });
  }
};

exports.getReportRecive = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      `SELECT c.comment_id,
          c.post_id, c.content, 
          c.create_at, cr.reason,
          cr.status AS report_status,
          cr.report_date,
          f.farm_name
        FROM comment_report cr
        JOIN comments c ON cr.comment_id = c.comment_id
        JOIN farmer f ON f.farmer_id = cr.farmer_id
        WHERE c.farmer_id = ?
        ORDER BY cr.report_date ASC
        `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลการถูกรายงาน" });
    }

    return res.status(200).json({ msg: "success", rows });
  } catch (err) {
    console.log("Error get ReportRecive Post : ", err);
  }
};
