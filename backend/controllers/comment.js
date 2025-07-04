const db = require("../config/db");
const dayjs = require("dayjs");
require("dayjs/locale/th");
dayjs.locale("th");

const getFormattedNow = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

exports.getComment = async (req, res) => {
  const { id } = req.params;
  try {
    const [comments] = await db
      .promise()
      .query("SELECT * FROM comments WHERE post_id = ?", [id]);

    if (comments.length < 0) {
      res.status(400).json({ msg: "ไม่พบความคิดเห็น" });
    }

    res.status(200).json({ msg: "ดึงความคิดเห็นสำเร็จ", comments });
  } catch (err) {
    console.log("Internal Server Error ", err);
    res.status(500).json({ msg: "Error get comment" });
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

exports.reportComment = async (req, res) => {
  const { post_id, farmer_id, reason, comment_id } = req.body;
  try {
    await db
      .promise()
      .query("UPDATE comments SET status = ? WHERE comment_id = ?", [
        "ซ่อน",
        comment_id,
      ]);

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
      res.status(500).json({ msg: "เกิดข้อผิดพลาดในการรายความคิดเห็น" });
    }

    res.status(201).json({ msg: "รายงานวามคิดเห็นเเล้ว" });
  } catch (err) {
    console.log("Internal Server Error : ", err);
    res.status(500).json({ msg: "เกิดข้อผิดพลาดในการรายงานความคิดเห็น" });
  }
  res.status(200).json({ msg: "Api Report Comment", payload: req.body });
};

exports.manageComment = (req, res) => {
  res.status(200).json({ msg: "Api manage Comment" });
};
