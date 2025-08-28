const db = require("../config/db");
const PDFDocument = require("pdfkit");
const path = require("path");

exports.reportAnimal = async (req, res) => {
  return res.send("Report Animal Api");
};

exports.reportProduct = async (req, res) => {
  const { farm_id } = req.body;
  try {
    // ดึงข้อมูลสินค้า
    let query = `SELECT p.product_id, p.farmer_id, p.product_name, p.price, p.unit, p.image, f.farm_name
                 FROM products p
                 JOIN farmer f ON p.farmer_id = f.farmer_id`;
    let params = [];

    if (farm_id && farm_id !== "") {
      query += " WHERE p.farmer_id = ?";
      params.push(farm_id);
    }

    query += " ORDER BY p.farmer_id, p.product_name";
    const [rows] = await db.promise().query(query, params);

    let result = [];
    let reportHeader = "ทั้งหมด"; // default

    if (!farm_id || farm_id === "") {
      const farmMap = {};
      rows.forEach((row) => {
        if (!farmMap[row.farmer_id]) {
          farmMap[row.farmer_id] = { farm_name: row.farm_name, products: [] };
        }
        farmMap[row.farmer_id].products.push({
          product_id: row.product_id,
          product_name: row.product_name,
          price: row.price,
          unit: row.unit,
          image: row.image,
        });
      });
      result = Object.values(farmMap);
    } else {
      if (rows.length > 0) {
        reportHeader = rows[0].farm_name;
        result = {
          farm_name: rows[0].farm_name,
          products: rows.map((row) => ({
            product_id: row.product_id,
            product_name: row.product_name,
            price: row.price,
            unit: row.unit,
            image: row.image,
          })),
        };
      } else {
        result = null;
        reportHeader = "ไม่พบข้อมูลฟาร์มที่เลือก";
      }
    }

    if (result != null) {
      // สร้าง PDF
      const margin = 10; // ระยะขอบ 10 px
      const doc = new PDFDocument({ size: "A4", margin });
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": "inline; filename=report.pdf",
        });
        res.send(pdfData);
      });

      const fontDir = path.join(__dirname, "../fonts");
      doc.registerFont("THSarabunNew", path.join(fontDir, "THSarabunNew.ttf"));
      doc.registerFont(
        "THSarabunNew-Bold",
        path.join(fontDir, "THSarabunNew Bold.ttf")
      );
      doc.font("THSarabunNew");

      // Header PDF
      doc
        .fontSize(20)
        .font("THSarabunNew-Bold")
        .text(`รายงานสินค้า ฟาร์ม ${reportHeader}`, { align: "center" });
      doc.moveDown(1);

      if (!result || (Array.isArray(result) && result.length === 0)) {
        doc.fontSize(16).text("ไม่พบข้อมูลสินค้า", { align: "center" });
        doc.end();
        return;
      }

      // ฟังก์ชันวาดตารางเต็มหน้ากระดาษ
      function drawTableFullWidth(farm, startY) {
        const tableTop = startY;
        const itemHeight = 25;
        const pageWidth = doc.page.width - margin * 2; // ใช้เต็มหน้ากระดาษ
        const colWidths = {
          product: pageWidth * 0.6, // 60%
          price: pageWidth * 0.2, // 20%
          unit: pageWidth * 0.2, // 20%
        };
        let y = tableTop;

        // ชื่อฟาร์ม
        doc
          .fontSize(16)
          .font("THSarabunNew-Bold")
          .text(`ชื่อฟาร์ม: ${farm.farm_name}`, margin, y);
        y += 20;

        // Header ตาราง
        const headers = ["ชื่อสินค้า", "ราคา", "หน่วย"];
        const cols = ["product", "price", "unit"];
        let x = margin;
        headers.forEach((text, i) => {
          doc
            .rect(x, y, colWidths[cols[i]], itemHeight)
            .stroke()
            .font("THSarabunNew-Bold")
            .fontSize(14)
            .text(text, x + 5, y + 7, {
              width: colWidths[cols[i]] - 10,
              align: "left",
            });
          x += colWidths[cols[i]];
        });
        y += itemHeight;

        // ข้อมูลสินค้า
        farm.products.forEach((prod) => {
          if (y > doc.page.height - 50) {
            doc.addPage();
            y = 50;
          }
          x = margin;
          const values = [prod.product_name, String(prod.price), prod.unit];
          values.forEach((val, i) => {
            doc
              .rect(x, y, colWidths[cols[i]], itemHeight)
              .stroke()
              .font("THSarabunNew")
              .fontSize(12)
              .text(val, x + 5, y + 7, {
                width: colWidths[cols[i]] - 10,
                align: "left",
              });
            x += colWidths[cols[i]];
          });
          y += itemHeight;
        });

        return y + 10;
      }

      // วาดทุกฟาร์ม
      let currentY = doc.y;
      if (Array.isArray(result)) {
        result.forEach((farm) => {
          currentY = drawTableFullWidth(farm, currentY);
        });
      } else {
        currentY = drawTableFullWidth(result, currentY);
      }

      doc.end();
    } else {
      return res.status(404).json({ msg: "ไม่พบข้อมูลฟาร์มที่เลือก" });
    }
  } catch (err) {
    console.error("Error generating product report:", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
