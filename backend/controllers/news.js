const db = require("../config/db");

exports.getNews = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        n.*, 
        CASE 
          WHEN n.owner_type = 'admin' THEN a.full_name
          WHEN n.owner_type = 'farmer' THEN f.farm_name
          ELSE NULL
        END AS owner_name
      FROM news n
      LEFT JOIN admin a ON n.owner_type = 'admin' AND n.owner_id = a.admin_id
      LEFT JOIN farmer f ON n.owner_type = 'farmer' AND n.owner_id = f.farmer_id
      ORDER BY n.created_at DESC
    `);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลข่าวสาร" });
    }

    return res.status(200).json({ msg: "success", data: rows });
  } catch (err) {
    console.log("Error get news : ", err);
    res.status(500).json({ msg: "Error get news" });
  }
};

exports.getNewsDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        n.*, 
        CASE 
          WHEN n.owner_type = 'admin' THEN a.full_name
          WHEN n.owner_type = 'farmer' THEN f.farm_name
          ELSE NULL
        END AS owner_name
      FROM news n
      LEFT JOIN admin a ON n.owner_type = 'admin' AND n.owner_id = a.admin_id
      LEFT JOIN farmer f ON n.owner_type = 'farmer' AND n.owner_id = f.farmer_id
      WHERE news_id = ?
      ORDER BY n.created_at DESC
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลข่าวสาร" });
    }

    return res.status(200).json({ msg: "success", data: rows });
  } catch (err) {
    console.log("Error get news : ", err);
    res.status(500).json({ msg: "Error get news" });
  }
};

exports.insertNews = async (req, res) => {
  const { newsTitle, owner_id, content, owner_type, sourceRef } = req.body;
  try {
    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(news_id) as next_id FROM news");

    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO news (news_id , owner_id , owner_type ,  title , content , source_ref ) VALUES (?,?,?,?,?,?)",
        [next_id + 1, owner_id, owner_type, newsTitle, content, sourceRef]
      );

    if (rows.affectedRows === 0) {
      return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการเพิ่มข่าวสาร" });
    }

    return res.status(200).json({ msg: "เพิ่มข้อมูลข่าวสารสำเร็จ" });
  } catch (err) {
    console.log("Error insert news : ", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการเพิ่มข่าวสาร" });
  }
};

exports.updateNews = async (req, res) => {
  const { id } = req.params;
  const { newsTitle, content, sourceRef } = req.body;

  try {
    const [rows] = await db.promise().query(
      `UPDATE news 
         SET title = ?, content = ?, source_ref = ?, updated_at = NOW()
         WHERE news_id = ?`,
      [newsTitle, content, sourceRef, id]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ msg: "ไม่พบข่าวสารที่จะแก้ไข" });
    }

    return res.status(200).json({ msg: "แก้ไขข่าวสารสำเร็จ" });
  } catch (err) {
    console.log("Error update news:", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการแก้ไขข่าวสาร" });
  }
};

exports.deleteNews = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db
      .promise()
      .query("DELETE FROM news WHERE news_id = ?", [id]);

    if (rows.affectedRows === 0) {
      return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการลบข่าวสาร" });
    }

    return res.status(200).json({ msg: "ดำเนินการลบข่าวสารเรียบร้อยเเล้ว" });
  } catch (err) {
    console.log("Error Delete news ", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการลบข่าวสาร" });
  }
};

exports.getMyNews = async (req, res) => {
  const { owner_id, owner_type } = req.params;
  try {
    const [rows] = await db.promise().query(
      `
      SELECT 
        n.*, 
        CASE 
          WHEN n.owner_type = 'admin' THEN a.full_name
          WHEN n.owner_type = 'farmer' THEN f.farm_name
          ELSE NULL
        END AS owner_name
      FROM news n
      LEFT JOIN admin a ON n.owner_type = 'admin' AND n.owner_id = a.admin_id
      LEFT JOIN farmer f ON n.owner_type = 'farmer' AND n.owner_id = f.farmer_id
      WHERE n.owner_id = ? AND n.owner_type = ?
      ORDER BY n.created_at DESC
    `,
      [owner_id, owner_type]
    );

    return res.status(200).json({ msg: "success", data: rows });
  } catch (err) {
    console.log("Error get my news : ", err);
    res.status(500).json({ msg: "Error get my news" });
  }
};
