const express = require("express");
const { reportAnimal, reportProduct } = require("../controllers/CreateReport");
const router = express.Router();
const PDFDocument = require("pdfkit");
const path = require("path");

router.post("/report/animal", reportAnimal);
router.post("/report/product", reportProduct);

router.get("/export/pdf", (req, res) => {
  const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 10 });
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 10;

  // โหลดฟอนต์
  const fontDir = path.join(__dirname, "../fonts");
  doc.registerFont("THSarabunNew", path.join(fontDir, "THSarabunNew.ttf"));
  doc.registerFont(
    "THSarabunNew-Bold",
    path.join(fontDir, "THSarabunNew Bold.ttf")
  );
  doc.font("THSarabunNew");

  // เก็บ PDF chunk
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

  // เขียนหัวข้อ
  doc
    .fontSize(20)
    .font("THSarabunNew-Bold")
    .text("รายงานข้อมูลสัตว์", { align: "center" });
  doc.moveDown();
  doc
    .fontSize(14)
    .font("THSarabunNew")
    .text("นี่คือ PDF ตัวอย่างที่สร้างด้วย pdfkit", { align: "left" });

  // ข้อมูลตัวอย่าง
  const headers = ["ชื่อสัตว์", "ประเภท", "จำนวน"];
  const data = [
    { name: "ไก่", type: "ไข่", quantity: 50 },
    { name: "หมู", type: "เนื้อ", quantity: 30 },
    { name: "เป็ด", type: "เนื้อ", quantity: 20 },
  ];

  // กำหนด width ตารางเต็มหน้า
  const tableWidth = pageWidth - margin * 2;
  const colCount = headers.length;
  const colWidths = Array(colCount).fill(tableWidth / colCount);

  let y = 100;

  // วาด header
  let x = margin;
  headers.forEach((text, i) => {
    doc.rect(x, y, colWidths[i], 25).stroke();
    doc
      .font("THSarabunNew-Bold")
      .fontSize(12)
      .text(text, x + 5, y + 7);
    x += colWidths[i];
  });
  y += 25;

  // วาดข้อมูล
  data.forEach((row) => {
    x = margin;
    const values = [row.name, row.type, row.quantity];
    values.forEach((val, i) => {
      doc.rect(x, y, colWidths[i], 25).stroke();
      doc
        .font("THSarabunNew")
        .fontSize(12)
        .text(val.toString(), x + 5, y + 7);
      x += colWidths[i];
    });
    y += 25;

    // ถ้าเกินหน้า -> addPage + reset y
    if (y + 25 > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  });

  doc.end();
});

module.exports = router;
