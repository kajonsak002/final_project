const db = require("../config/db");
const fs = require("fs");
const dayjs = require("dayjs");
require("dayjs/locale/th");
dayjs.locale("th");

const getFormattedNow = () => dayjs().format("YYYY-MM-DD HH:mm:ss");

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
  const farmer_id = req.user.id;
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
        [next_id + 1, farmer_id, content, image.path, getFormattedNow()]
      );
    if (rows.affectedRows === 0) {
      deleteImage(image.path);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
    }

    return res
      .status(201)
      .json({ message: "เพิ่มโพสต์สำเร็จรอการอนุมัติโพสต์จากผู้ดูแลระบบ" });
  } catch (err) {
    deleteImage(image.path);
    console.log(err);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
  }
};

exports.insert = async (req, res) => {
  // return res.status(200).json({
  //   message: "Insert post API",
  //   data: req.body,
  //   user: req.user,
  // });
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
        [next_id + 1, farmer_id, content, getFormattedNow()]
      );
    if (rows.affectedRows === 0) {
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
    }
    return res
      .status(201)
      .json({ message: "เพิ่มโพสต์สำเร็จรอการอนุมัติโพสต์จากผู้ดูแลระบบ" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดในการเพิ่มโพสต" });
  }
};

exports.editPost = async (req, res) => {
  const postId = req.params.id;
  const { content, remove_image } = req.body;
  const farmer_id = req.user.id;
  const image = req.file;

  try {
    const [[post]] = await db
      .promise()
      .query("SELECT * FROM posts WHERE post_id = ?", [postId]);

    if (!post) {
      if (image) deleteImage(image.path);
      return res.status(404).json({ message: "โพสต์ไม่พบ" });
    }

    if (post.farmer_id !== farmer_id) {
      if (image) deleteImage(image.path);
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์แก้ไขโพสต์นี้" });
    }

    let newImagePath = post.image_post;

    // ถ้าต้องการลบรูปภาพเดิม
    if (remove_image === "true" || remove_image === true) {
      if (post.image_post) {
        deleteImage(post.image_post);
      }
      newImagePath = null;
    }

    // ถ้ามีการอัปโหลดรูปใหม่
    if (image) {
      if (post.image_post) {
        deleteImage(post.image_post);
      }
      newImagePath = image.path;
    }

    const [result] = await db
      .promise()
      .query("UPDATE posts SET content = ?, image_post = ? WHERE post_id = ?", [
        content || post.content,
        newImagePath,
        postId,
      ]);

    if (result.affectedRows === 0) {
      if (image) deleteImage(image.path);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการแก้ไขโพสต์" });
    }

    res.status(200).json({ message: "แก้ไขโพสต์สำเร็จ" });
  } catch (err) {
    if (req.file) deleteImage(req.file.path);
    console.log(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการแก้ไขโพสต์" });
  }
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
    const { farmer_id } = req.body;
    const [rows] = await db.promise().query(
      `SELECT t1.* , t2.farm_name , t2.farm_img FROM posts as t1 
      JOIN farmer as t2 ON t1.farmer_id = t2.farmer_id 
      WHERE t1.status = 'อนุมัติ' AND t1.is_visible != 'ซ่อน' 
      AND t1.farmer_id != ?
      ORDER BY t1.create_at DESC`,
      [farmer_id]
    );
    const host = req.headers.host;
    const protocol = req.protocol;
    const posts = rows.map((post) => ({
      ...post,
      image_post: post.image_post
        ? `${protocol}://${host}/${post.image_post.replace(/^\\+/, "")}`
        : null,
      farm_img: post.farm_img
        ? `${protocol}://${host}/${post.farm_img.replace(/^\\+/, "")}`
        : null,
    }));
    res
      .status(200)
      .json({ message: "Posts fetched successfully", posts, host, protocol });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPostByFarmerid = async (req, res) => {
  try {
    const { farmer_id } = req.body;
    // console.log(req.body);
    const [rows] = await db.promise().query(
      `SELECT t1.* , t2.farm_name , t2.farm_img FROM posts as t1 
      JOIN farmer as t2 ON t1.farmer_id = t2.farmer_id 
      WHERE t1.status = 'อนุมัติ' AND t1.is_visible != 'ซ่อน' 
      AND t1.farmer_id = ?
      ORDER BY t1.create_at DESC`,
      [farmer_id]
    );
    const host = req.headers.host;
    const protocol = req.protocol;
    const posts = rows.map((post) => ({
      ...post,
      image_post: post.image_post
        ? `${protocol}://${host}/${post.image_post.replace(/^\\+/, "")}`
        : null,
      farm_img: post.farm_img
        ? `${protocol}://${host}/${post.farm_img.replace(/^\\+/, "")}`
        : null,
    }));
    res
      .status(200)
      .json({ message: "Posts fetched successfully", posts, host, protocol });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getPostsWaitApproval = async (req, res) => {
  try {
    const [rows] = await db.promise()
      .query(`SELECT t1.* , t2.farm_name , t2.farm_img FROM posts as t1 
              JOIN farmer t2 ON t1.farmer_id = t2.farmer_id
              WHERE t1.status = "รออนุมัติ" AND t1.status != "ปฏิเสธ"
            `);
    const host = req.headers.host;
    const protocol = req.protocol;
    const posts = rows.map((post) => ({
      ...post,
      image_post: post.image_post
        ? `${protocol}://${host}/${post.image_post.replace(/^\\+/, "")}`
        : null,
      farm_img: post.farm_img
        ? `${protocol}://${host}/${post.farm_img.replace(/^\\+/, "")}`
        : null,
    }));
    res.status(200).json({ message: "Posts fetched successfully", posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.approvalPost = async (req, res) => {
  const postId = req.params.id;
  const { status } = req.body;
  // return res.json({
  //   status,
  //   postId,
  //   date: formatted,
  // });

  if (!status) {
    return res.status(400).json({ message: "กรุณาระบุสถานะ" });
  }

  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE posts SET status = ? , approval_date = ? WHERE post_id = ?",
        [status, getFormattedNow(), postId]
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

exports.reportPost = async (req, res) => {
  const { post_id, reason, farmer_id } = req.body;
  if (!post_id || !reason || !farmer_id) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }
  try {
    await db
      .promise()
      .query(
        "INSERT INTO post_report (post_id, farmer_id, reason, report_date) VALUES (?, ?, ?, ?)",
        [post_id, farmer_id, reason, getFormattedNow()]
      );
    res.status(201).json({ message: "รายงานโพสต์สำเร็จ" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการรายงานโพสต์" });
  }
};
