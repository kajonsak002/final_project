const db = require("../config/db");
const fs = require("fs");
const dayjs = require("dayjs");
const formatted = dayjs().format("YYYY-MM-DD HH:mm:ss");

const deleteImage = (imagePath) => {
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error("ลบไฟล์ไม่สำเร็จ:", err);
    } else {
      console.log("ลบไฟล์เรียบร้อย:", imagePath);
    }
  });
};

// CRUD API for Posts
exports.insertPostImg = async (req, res) => {
  const { content } = req.body;
  const { farmer_id } = req.user.id;
  const image = req.file;
  //   console.log(image);
  if (!content) {
    deleteImage(image.path);
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  try {
    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(post_id) as next_id FROM posts");
    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO posts (post_id ,farmer_id, content, image_post , create_at) VALUES ( ? ,?, ?, ? , ?)",
        [next_id + 1, farmer_id, content, image.path, formatted]
      );
    if (rows.affectedRows === 0) {
      deleteImage(image.path);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
    }

    return res.status(201).json({ message: "เพิ่มโพสต์สำเร็จ" });
  } catch (err) {
    deleteImage(image.path);
    console.log(err);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
  }
};

exports.insert = async (req, res) => {
  const { content } = req.body;
  const farmer_id = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }
  try {
    const [[{ next_id }]] = await db
      .promise()
      .query("SELECT MAX(post_id) as next_id FROM posts");
    const [rows] = await db
      .promise()
      .query(
        "INSERT INTO posts (post_id ,farmer_id, content , create_at) VALUES ( ? ,?, ? , ?)",
        [next_id + 1, farmer_id, content, formatted]
      );
    if (rows.affectedRows === 0) {
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
    }
    return res.status(201).json({ message: "เพิ่มโพสต์สำเร็จ" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
  }
};

exports.update = async (req, res) => {
  res.status(200).json({
    message: "Update post API",
    post_id: req.params.id,
    data: req.body,
  });
};

exports.remove = async (req, res) => {
  const farmer_id = req.user.id;
  const postId = req.params.id;
  const [[post]] = await db
    .promise()
    .query("SELECT * FROM posts WHERE post_id = ?", [postId]);

  if (!post) {
    return res.status(404).json({ message: "โพสต์ไม่พบ" });
  }

  if (post.farmer_id !== farmer_id) {
    return res.status(403).json({ message: "คุณไม่มีสิทธิ์ลบโพสต์นี้" });
  }

  await db.promise().query("DELETE FROM posts WHERE post_id = ?", [postId]);

  if (post.image_post) {
    deleteImage(post.image_post);
  }

  res.status(200).json({
    message: "ลบโพสต์เรียบร้อยเเล้ว",
  });
};

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM posts WHERE status = 'อนุมัติ' AND is_visible != 'ซ่อน' ORDER BY create_at DESC"
      );
    res
      .status(200)
      .json({ message: "Posts fetched successfully", posts: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPostsWaitApproval = async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query("SELECT * FROM posts WHERE status = 'รออนุมัติ'");
    res
      .status(200)
      .json({ message: "Posts fetched successfully", posts: rows });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.approvalPost = async (req, res) => {
  const postId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "กรุณาระบุสถานะ" });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE posts SET status = ? , approval_date = ? WHERE post_id = ?",
        [status, formatted, postId]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "โพสต์ไม่พบ" });
    }

    res.status(200).json({ message: `โพสต์ได้รับการ ${status} เรียบร้อยแล้ว` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอนุมัติโพสต์" });
  }
};
