const db = require("../config/db");
const PDFDocument = require("pdfkit");
const path = require("path");

exports.reportAnimal = async (req, res) => {
  const { farm_id, animal_id, type_id } = req.body;
  try {
    // ดึงข้อมูลสัตว์ในฟาร์ม
    let query = `
      SELECT fa.id as farm_animal_id, fa.quantity,
        a.animal_id, a.name as animal_name, t.type_id, t.type_name, f.farm_name
      FROM farm_animals fa
      JOIN animals a ON fa.animal_id = a.animal_id
      JOIN animal_types t ON fa.type_id = t.type_id
      JOIN farmer f ON fa.farmer_id = f.farmer_id
    `;

    let params = [];
    let whereConditions = [];

    if (farm_id && farm_id !== "") {
      whereConditions.push("fa.farmer_id = ?");
      params.push(farm_id);
    }

    if (animal_id && animal_id !== "") {
      whereConditions.push("fa.animal_id = ?");
      params.push(animal_id);
    }

    if (type_id && type_id !== "") {
      whereConditions.push("fa.type_id = ?");
      params.push(type_id);
    }

    if (whereConditions.length > 0) {
      query += " WHERE " + whereConditions.join(" AND ");
    }

    query += " ORDER BY fa.farmer_id, a.name, t.type_name";
    const [rows] = await db.promise().query(query, params);

    // จัดกลุ่มตามฟาร์ม
    let result = [];
    let reportHeader = "ทั้งหมด";
    let filterInfo = [];

    // สร้างข้อความ filter
    if (farm_id && farm_id !== "") {
      const farmQuery = "SELECT farm_name FROM farmer WHERE farmer_id = ?";
      const [farmRows] = await db.promise().query(farmQuery, [farm_id]);
      if (farmRows.length > 0) {
        filterInfo.push(`ฟาร์ม: ${farmRows[0].farm_name}`);
        reportHeader = farmRows[0].farm_name;
      }
    }

    if (animal_id && animal_id !== "") {
      const animalQuery = "SELECT name FROM animals WHERE animal_id = ?";
      const [animalRows] = await db.promise().query(animalQuery, [animal_id]);
      if (animalRows.length > 0) {
        filterInfo.push(`สัตว์: ${animalRows[0].name}`);
      }
    }

    if (type_id && type_id !== "") {
      const typeQuery = "SELECT type_name FROM animal_types WHERE type_id = ?";
      const [typeRows] = await db.promise().query(typeQuery, [type_id]);
      if (typeRows.length > 0) {
        filterInfo.push(`ประเภท: ${typeRows[0].type_name}`);
      }
    }

    if (!farm_id || farm_id === "") {
      const farmMap = {};
      rows.forEach((row) => {
        if (!farmMap[row.farm_name]) farmMap[row.farm_name] = [];
        farmMap[row.farm_name].push(row);
      });
      result = Object.entries(farmMap).map(([farm_name, animals]) => ({
        farm_name,
        animals,
      }));
    } else {
      if (rows.length > 0) {
        result = [{ farm_name: reportHeader, animals: rows }];
      } else {
        result = [];
        reportHeader = "ไม่พบข้อมูลฟาร์มที่เลือก";
      }
    }

    // สร้าง PDF (เต็มหน้า พร้อมเลขหน้า/วันที่ และหัวรายงานทุกหน้า)
    const margin = 30;
    const headerHeight = 60;
    const doc = new PDFDocument({ size: "A4", margin, bufferPages: true });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=report_animal.pdf",
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

    // สร้างหัวข้อรายงาน
    let reportTitle = "รายงานสัตว์";

    if (farm_id && farm_id !== "") {
      reportTitle += ` ของฟาร์ม ${reportHeader}`;
    }

    if (animal_id && animal_id !== "") {
      const animalQuery = "SELECT name FROM animals WHERE animal_id = ?";
      const [animalRows] = await db.promise().query(animalQuery, [animal_id]);
      if (animalRows.length > 0) {
        reportTitle += ` ${animalRows[0].name}`;
      }
    }

    if (type_id && type_id !== "") {
      const typeQuery = "SELECT type_name FROM animal_types WHERE type_id = ?";
      const [typeRows] = await db.promise().query(typeQuery, [type_id]);
      if (typeRows.length > 0) {
        reportTitle += ` ประเภท ${typeRows[0].type_name}`;
      }
    }

    if (!farm_id && !animal_id && !type_id) {
      reportTitle += " ทั้งหมด";
    }

    // วันที่แสดงบนหัวรายงาน
    const dateString = new Date().toLocaleString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // ความกว้างตารางแบบเต็มหน้ากระดาษ
    const usableWidth = doc.page.width - margin * 2;
    const colWidths = {
      index: Math.max(50, Math.floor(usableWidth * 0.12)),
      animal: Math.floor(usableWidth * 0.44),
      type: Math.floor(usableWidth * 0.24),
      qty: Math.max(80, Math.floor(usableWidth * 0.2)),
    };
    const rowHeight = 24;

    // คำนวณตำแหน่งขอบล่าง (กันพื้นที่เผื่อ 20px เพิ่มเติม)
    const pageBottomY = () => doc.page.height - margin - 20;

    const drawTableHeader = (y) => {
      let x = margin;
      const headers = ["ลำดับ", "ชื่อสัตว์", "ชื่อประเภท", "จำนวนคงเหลือ"];
      const widths = [
        colWidths.index,
        colWidths.animal,
        colWidths.type,
        colWidths.qty,
      ];

      // ต้องมีพื้นที่อย่างน้อยสำหรับหัวตาราง + แถวข้อมูลถัดไป 1 แถว
      if (y + rowHeight * 2 > pageBottomY()) {
        doc.addPage();
        y = margin + headerHeight;
      }

      headers.forEach((text, i) => {
        doc.rect(x, y, widths[i], rowHeight).stroke();
        doc
          .font("THSarabunNew-Bold")
          .fontSize(14)
          .text(text, x + 5, y + 6, {
            width: widths[i] - 10,
            align: i === 3 ? "right" : "left",
          });
        x += widths[i];
      });
      return y + rowHeight;
    };

    const drawTable = (doc, startY, farm) => {
      let y = startY;
      y = drawTableHeader(y);

      let runningIndex = 1;

      // วาดข้อมูลสัตว์
      farm.animals.forEach((item) => {
        if (y + rowHeight > pageBottomY()) {
          doc.addPage();
          y = drawTableHeader(margin + headerHeight);
        }

        let x = margin;
        const values = [
          runningIndex,
          item.animal_name,
          item.type_name,
          item.quantity.toLocaleString("th-TH"),
        ];
        const widths = [
          colWidths.index,
          colWidths.animal,
          colWidths.type,
          colWidths.qty,
        ];

        values.forEach((val, i) => {
          doc.rect(x, y, widths[i], rowHeight).stroke();
          doc
            .font("THSarabunNew")
            .fontSize(12)
            .text(String(val), x + 5, y + 6, {
              width: widths[i] - 10,
              align: i === 3 ? "right" : "left",
            });
          x += widths[i];
        });
        y += rowHeight;
        runningIndex += 1;
      });

      return y;
    };

    // วาดทุกฟาร์ม (เริ่มหลังหัวรายงาน)
    let y = margin + headerHeight;
    result.forEach((farm) => {
      // กันพื้นที่ก่อนเริ่มหัวข้อฟาร์ม + หัวตาราง + แถวแรก
      const requiredForSection = 26 + rowHeight * 2;
      if (y + requiredForSection > pageBottomY()) {
        doc.addPage();
        y = margin + headerHeight;
      }

      doc
        .font("THSarabunNew-Bold")
        .fontSize(16)
        .text(`ชื่อฟาร์ม: ${farm.farm_name}`, margin, y);
      y += 26;

      y = drawTable(doc, y, farm);
    });

    // วาดหัวรายงานและเลขหน้าสำหรับทุกหน้า
    const range = doc.bufferedPageRange();
    const totalPages = range.count;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(range.start + i);
      // หัวรายงาน (ชื่อ + ตรงกลาง)
      doc
        .font("THSarabunNew-Bold")
        .fontSize(20)
        .text(reportTitle, margin, margin, {
          width: doc.page.width - margin * 2,
          align: "center",
        });

      // วันที่ซ้าย
      doc
        .font("THSarabunNew")
        .fontSize(12)
        .text(`วันที่พิมพ์: ${dateString}`, margin, margin + 28, {
          width: (doc.page.width - margin * 2) / 2,
          align: "left",
        });

      // เลขหน้าขวา (หน้า X / Y)
      doc
        .font("THSarabunNew")
        .fontSize(12)
        .text(
          `หน้า ${i + 1} / ${totalPages}`,
          doc.page.width / 2,
          margin + 28,
          {
            width: (doc.page.width - margin * 2) / 2,
            align: "right",
          }
        );
    }

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
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
      // สร้าง PDF (จัดรูปแบบเหมือนรายงานสัตว์)
      const margin = 30;
      const headerHeight = 60;
      const doc = new PDFDocument({ size: "A4", margin, bufferPages: true });
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

      // header data
      const reportTitle = `รายงานสินค้า ${
        farm_id ? `ฟาร์ม ${reportHeader}` : "ทั้งหมด"
      }`;
      const dateString = new Date().toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      if (!result || (Array.isArray(result) && result.length === 0)) {
        doc.fontSize(16).text("ไม่พบข้อมูลสินค้า", { align: "center" });
        doc.end();
        return;
      }

      // full width table layout
      const usableWidth = doc.page.width - margin * 2;
      const rowHeight = 24;
      const colWidths = {
        index: Math.max(50, Math.floor(usableWidth * 0.12)),
        product: Math.floor(usableWidth * 0.48),
        price: Math.floor(usableWidth * 0.2),
        unit: Math.max(80, Math.floor(usableWidth * 0.2)),
      };
      const pageBottomY = () => doc.page.height - margin - 20;

      const drawTableHeader = (y) => {
        // ensure space for header + one data row
        if (y + rowHeight * 2 > pageBottomY()) {
          doc.addPage();
          y = margin + headerHeight;
        }
        let x = margin;
        const headers = ["ลำดับ", "ชื่อสินค้า", "หน่วย", "ราคาต่อหน่วย"];
        const widths = [
          colWidths.index,
          colWidths.product,
          colWidths.unit,
          colWidths.price,
        ];
        headers.forEach((text, i) => {
          doc.rect(x, y, widths[i], rowHeight).stroke();
          doc
            .font("THSarabunNew-Bold")
            .fontSize(14)
            .text(text, x + 5, y + 6, {
              width: widths[i] - 10,
              align: i === 3 ? "right" : "left",
            });
          x += widths[i];
        });
        return y + rowHeight;
      };

      function drawTableForFarm(farm, startY) {
        let y = startY;
        // section head: farm name
        // ensure space for farm title + header + first row
        const requiredForSection = 26 + rowHeight * 2;
        if (y + requiredForSection > pageBottomY()) {
          doc.addPage();
          y = margin + headerHeight;
        }
        doc
          .font("THSarabunNew-Bold")
          .fontSize(16)
          .text(`ชื่อฟาร์ม: ${farm.farm_name}`, margin, y);
        y += 26;

        y = drawTableHeader(y);
        let runningIndex = 1;
        farm.products.forEach((prod) => {
          if (y + rowHeight > pageBottomY()) {
            doc.addPage();
            y = drawTableHeader(margin + headerHeight);
          }
          let x = margin;
          const values = [
            runningIndex,
            prod.product_name,
            prod.unit || "-",
            Number(prod.price).toLocaleString("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          ];
          const widths = [
            colWidths.index,
            colWidths.product,
            colWidths.unit,
            colWidths.price,
          ];
          values.forEach((val, i) => {
            doc.rect(x, y, widths[i], rowHeight).stroke();
            doc
              .font("THSarabunNew")
              .fontSize(12)
              .text(String(val), x + 5, y + 6, {
                width: widths[i] - 10,
                align: i === 3 ? "right" : "left",
              });
            x += widths[i];
          });
          y += rowHeight;
          runningIndex += 1;
        });
        return y;
      }

      // วาดทุกฟาร์ม
      let currentY = margin + headerHeight;
      if (Array.isArray(result)) {
        result.forEach((farm) => {
          currentY = drawTableForFarm(farm, currentY);
        });
      } else {
        currentY = drawTableForFarm(result, currentY);
      }

      // วาดหัวรายงานและเลขหน้าสำหรับทุกหน้า
      const range = doc.bufferedPageRange();
      const totalPages = range.count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(range.start + i);
        // title center
        doc
          .font("THSarabunNew-Bold")
          .fontSize(20)
          .text(reportTitle, margin, margin, {
            width: doc.page.width - margin * 2,
            align: "center",
          });
        // date left
        doc
          .font("THSarabunNew")
          .fontSize(12)
          .text(`วันที่พิมพ์: ${dateString}`, margin, margin + 28, {
            width: (doc.page.width - margin * 2) / 2,
            align: "left",
          });
        // page right
        doc
          .font("THSarabunNew")
          .fontSize(12)
          .text(
            `หน้า ${i + 1} / ${totalPages}`,
            doc.page.width / 2,
            margin + 28,
            { width: (doc.page.width - margin * 2) / 2, align: "right" }
          );
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
