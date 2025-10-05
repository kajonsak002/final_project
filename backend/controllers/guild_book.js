const db = require("../config/db");
const fs = require("fs");
const dayjs = require("dayjs");
require("dayjs/locale/th");
dayjs.locale("th");

const getFormattedNow = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

const deleteImage = (imagePath) => {
  if (!imagePath) return;
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("ลบไฟล์ไม่สำเร็จ:", err);
    } else {
      console.log("ลบไฟล์เรียบร้อย:", imagePath);
    }
  });
};

exports.getGuildBook = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM guildbook ORDER BY created_at DESC");

    if (rows.length === 0) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลคู่่มือการเลี้ยงสัตว์" });
    }

    const formatRows = rows.map((item) => ({
      ...item,
      image: item.image
        ? `${req.protocol}://${req.headers.host}/${item.image}`
        : null,
    }));

    return res.status(200).json({ msg: "success", data: formatRows });
  } catch (err) {
    console.error("Error get guild book", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการดึงข้อมูลคู่มือ" });
  }
};

exports.getGuildBookDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM guildbook WHERE guildbook_id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลคู่่มือการเลี้ยงสัตว์" });
    }

    const item = rows[0];
    const formatted = {
      ...item,
      image: item.image
        ? `${req.protocol}://${req.headers.host}/${item.image}`
        : null,
    };

    return res.status(200).json({ msg: "success", data: formatted });
  } catch (err) {
    console.error("Error get guild book", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการดึงข้อมูลคู่มือ" });
  }
};

exports.insertGuildBook = async (req, res) => {
  const { title, content, source_refs, tags } = req.body;
  const image = req.file;

  try {
    if (!title || !content) {
      if (image) deleteImage(image.path);
      return res.status(400).json({ msg: "title and content are required!" });
    }

    const now = getFormattedNow();

    source_refs ? JSON.parse(source_refs) : [];
    tags ? JSON.parse(tags) : [];

    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(guildbook_id) as next_id FROM guildbook");

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO guildbook (guildbook_id,title, content, image, source_refs , tags , created_at, updated_at) VALUES (?, ?, ?, ?, ?, ? , ?, ?)",
        [next_id + 1, title, content, image.path, source_refs, tags, now, now]
      );

    if (result.affectedRows === 0) {
      if (image) deleteImage(image.path);
      return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการเพิ่มคู่มือ" });
    }

    return res.status(201).json({ msg: "เพิ่มข้อมูลสำเร็จ" });
  } catch (err) {
    if (image) deleteImage(image.path);
    console.error("Error Add GuildBook : ", err);
    return res.status(500).json({ msg: "Error Add GuildBook" });
  }
};

exports.updateGuildBook = async (req, res) => {
  const { id } = req.params;
  const { title, content, source_refs, tags } = req.body;
  const image = req.file;

  try {
    const [[rs]] = await db
      .promise()
      .query("SELECT * FROM guildbook WHERE guildbook_id = ?", [id]);

    if (!rs) {
      if (image) deleteImage(image.path);
      return res.status(404).json({ msg: "ไม่พบคู่มือที่ต้องการแก้ไข" });
    }

    let newImage = rs.image;

    if (image) {
      if (rs.image) {
        deleteImage(rs.image);
      }
      newImage = image.path;
    }

    const now = getFormattedNow();

    const [result] = await db
      .promise()
      .query(
        "UPDATE guildbook SET title = ?, content = ?, image = ?, source_refs = ?, tags = ?  WHERE guildbook_id = ?",
        [title, content, newImage, source_refs, tags, id]
      );

    if (result.affectedRows === 0) {
      if (image) deleteImage(image.path);
      return res.status(500).json({ msg: "เกิดข้อผิดพลาดในการแก้ไขคู่มือ" });
    }

    return res.status(200).json({ msg: "แก้ไขข้อมูลสำเร็จ" });
  } catch (err) {
    if (image) deleteImage(image.path);
    console.error("Error Update GuildBook : ", err);
    return res.status(500).json({ msg: "Error Update GuildBook" });
  }
};

exports.deleteGuildBook = async (req, res) => {
  const { id } = req.params;
  try {
    const [[row]] = await db
      .promise()
      .query("SELECT * FROM guildbook WHERE guildbook_id = ?", [id]);

    if (!row) {
      return res.status(404).json({ message: "ไม่พบคู่มือนี้ในระบบ" });
    }

    const [result] = await db
      .promise()
      .query("DELETE FROM guildbook WHERE guildbook_id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ msg: "Error for delete guild book" });
    }

    if (row.image) {
      deleteImage(row.image);
    }

    res.status(200).json({
      message: "ลบคู่มือเรียบร้อยเเล้ว",
    });
  } catch (err) {
    console.error("Error Delete GuildBook:", err);
    return res.status(500).json({ msg: "Error for delete guild book" });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const [[{ tag }]] = await db
      .promise()
      .query("SELECT JSON_ARRAYAGG(tags) AS tag FROM guildbook");

    if (tag.length < 0) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลเเท็ก" });
    }

    return res.status(200).json({ msg: "success", tag });
  } catch (err) {
    console.log("Error fecth tag : ", err);
    return res.status(500).json({ msg: "Error fetch tag" });
  }
};
