const path = require("path");

// ฟังก์ชันช่วยสำหรับสร้าง PDF
class PDFHelper {
  constructor(doc, margin = 30, headerHeight = 60) {
    this.doc = doc;
    this.margin = margin;
    this.headerHeight = headerHeight;
    this.fontDir = path.join(__dirname, "../fonts");
    this.setupFonts();
  }

  setupFonts() {
    this.doc.registerFont(
      "THSarabunNew",
      path.join(this.fontDir, "THSarabunNew.ttf")
    );
    this.doc.registerFont(
      "THSarabunNew-Bold",
      path.join(this.fontDir, "THSarabunNew Bold.ttf")
    );
    this.doc.font("THSarabunNew");
  }

  // สร้างหัวรายงาน
  drawReportHeader(title, dateString, pageNumber = null, totalPages = null) {
    // หัวรายงาน (ชื่อ + ตรงกลาง)
    this.doc
      .font("THSarabunNew-Bold")
      .fontSize(20)
      .text(title, this.margin, this.margin, {
        width: this.doc.page.width - this.margin * 2,
        align: "center",
      });

    // วันที่ซ้าย
    this.doc
      .font("THSarabunNew")
      .fontSize(12)
      .text(`วันที่พิมพ์: ${dateString}`, this.margin, this.margin + 28, {
        width: (this.doc.page.width - this.margin * 2) / 2,
        align: "left",
      });

    // เลขหน้าขวา (หน้า X / Y)
    if (pageNumber && totalPages) {
      this.doc
        .font("THSarabunNew")
        .fontSize(12)
        .text(
          `หน้า ${pageNumber} / ${totalPages}`,
          this.doc.page.width / 2,
          this.margin + 28,
          {
            width: (this.doc.page.width - this.margin * 2) / 2,
            align: "right",
          }
        );
    }
  }

  // สร้างหัวตาราง
  drawTableHeader(y, headers, widths, rowHeight = 28) {
    let x = this.margin;
    const pageBottomY = () => this.doc.page.height - this.margin - 20;

    // ต้องมีพื้นที่อย่างน้อยสำหรับหัวตาราง + แถวข้อมูลถัดไป 1 แถว
    if (y + rowHeight * 2 > pageBottomY()) {
      this.doc.addPage();
      y = this.margin + this.headerHeight;
    }

    headers.forEach((text, i) => {
      this.doc.rect(x, y, widths[i], rowHeight).stroke();
      this.doc
        .font("THSarabunNew-Bold")
        .fontSize(14)
        .text(text, x + 8, y + 8, {
          width: widths[i] - 16,
          align:
            i === 0 ? "center" : i === widths.length - 1 ? "right" : "left",
        });
      x += widths[i];
    });
    return y + rowHeight;
  }

  // สร้างแถวข้อมูลในตาราง
  drawTableRow(y, values, widths, rowHeight = 28) {
    let x = this.margin;
    const pageBottomY = () => this.doc.page.height - this.margin - 20;

    if (y + rowHeight > pageBottomY()) {
      this.doc.addPage();
      y = this.margin + this.headerHeight;
    }

    values.forEach((val, i) => {
      this.doc.rect(x, y, widths[i], rowHeight).stroke();
      this.doc
        .font("THSarabunNew")
        .fontSize(12)
        .text(String(val), x + 8, y + 8, {
          width: widths[i] - 16,
          align:
            i === 0 ? "center" : i === widths.length - 1 ? "right" : "left",
        });
      x += widths[i];
    });
    return y + rowHeight;
  }

  // สร้างตารางทั้งหมด
  drawTable(startY, headers, widths, data, rowHeight = 28) {
    let y = startY;
    y = this.drawTableHeader(y, headers, widths, rowHeight);

    let runningIndex = 1;
    data.forEach((item) => {
      const values = [runningIndex, ...item];
      y = this.drawTableRow(y, values, widths, rowHeight);
      runningIndex += 1;
    });

    return y;
  }

  // วาดหัวรายงานและเลขหน้าสำหรับทุกหน้า
  drawAllPageHeaders(title) {
    const dateString = this.getDateString();
    const range = this.doc.bufferedPageRange();
    const totalPages = range.count;

    for (let i = 0; i < totalPages; i++) {
      this.doc.switchToPage(range.start + i);
      this.drawReportHeader(title, dateString, i + 1, totalPages);
    }
  }

  // สร้างข้อความวันที่
  getDateString() {
    return new Date().toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // สร้าง PDF อย่างง่าย
  static createPDF(res, filename, callback) {
    const margin = 30;
    const headerHeight = 60;
    const doc = new (require("pdfkit"))({
      size: "A4",
      margin,
      bufferPages: true,
    });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${filename}`,
      });
      res.send(pdfData);
    });

    const pdfHelper = new PDFHelper(doc, margin, headerHeight);
    callback(pdfHelper, doc);
    doc.end();
  }
}

module.exports = PDFHelper;
