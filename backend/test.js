const doc = new PDFDocument();
const fontDir = path.join(__dirname, "./fonts");
doc.registerFont("THSarabunNew", path.join(fontDir, "THSarabunNew.ttf"));
doc.registerFont(
  "THSarabunNew-Bold",
  path.join(fontDir, "THSarabunNew Bold.ttf")
);
doc.font("THSarabunNew");

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

doc.fontSize(20).text("Hello PDFKit!", { align: "center" });
doc.moveDown();
doc
  .fontSize(14)
  .text("นี่คือ PDF ตัวอย่างที่สร้างด้วย pdfkit", { align: "left" });

doc.end();
