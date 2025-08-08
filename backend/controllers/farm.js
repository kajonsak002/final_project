const db = require("../config/db");

exports.getFarmProfile = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  const { id } = req.user || req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT t1.farm_name , t1.farm_img , t1.farmer_id ,
      t1.phone ,
      t1.email,
      t1.view_count,
      t1.farm_banner,
      t2.name_th AS province, 
      t3.name_th AS amphure, 
      t4.name_th AS tambon FROM farmer as t1
      JOIN provinces AS t2 ON t1.province = t2.id
      JOIN amphures AS t3 ON t1.amphure = t3.id
      JOIN tambons AS t4 ON t1.tambon = t4.id
      WHERE farmer_id = ?
      AND status = 'อนุมัติ'`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลฟาร์ม" });
    }

    const farmer = rows[0];
    const updatedFarmer = {
      ...farmer,
      farm_img: farmer.farm_img
        ? `${protocol}://${host}/${farmer.farm_img}`
        : null,
      farm_banner: farmer.farm_banner
        ? `${protocol}://${host}/${farmer.farm_banner}`
        : null,
    };

    const [[product]] = await db
      .promise()
      .query(`SELECT * FROM products WHERE farmer_id = ?`, [id]);

    if (product) {
      const formattedProducts = {
        ...product,
        image: product.image
          ? `${req.protocol}://${req.headers.host}/${product.image}`
          : null,
      };
      return res.status(200).json({
        msg: "sucess",
        data: updatedFarmer,
        product: formattedProducts,
      });
    } else {
      return res.status(200).json({
        msg: "sucess",
        data: updatedFarmer,
        product: product,
      });
    }
  } catch (err) {
    console.error("Error fetching farm profile:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllFarms = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  try {
    const [rows] = await db.promise().query(`SELECT 
                                              t1.*,
                                              t2.name_th AS province, 
                                              t3.name_th AS amphure, 
                                              t4.name_th AS tambon
                                            FROM farmer AS t1
                                            JOIN provinces AS t2 ON t1.province = t2.id
                                            JOIN amphures AS t3 ON t1.amphure = t3.id
                                            JOIN tambons AS t4 ON t1.tambon = t4.id
                                            WHERE status = 'อนุมัติ' AND is_active = 'ปกติ'
                                            `);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No farms found" });
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
    console.error("Error fetching farms:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFarmsData = async (req, res) => {
  const host = req.headers.host;
  const protocol = req.protocol;
  try {
    const [rows] = await db.promise().query(`SELECT 
                                              t1.*,
                                              t2.name_th AS province, 
                                              t3.name_th AS amphure, 
                                              t4.name_th AS tambon
                                            FROM farmer AS t1
                                            JOIN provinces AS t2 ON t1.province = t2.id
                                            JOIN amphures AS t3 ON t1.amphure = t3.id
                                            JOIN tambons AS t4 ON t1.tambon = t4.id
                                            WHERE status = 'อนุมัติ' 
                                            `);
    if (rows.length === 0) {
      return res.status(404).json({ message: "No farms found" });
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
    console.error("Error fetching farms:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
