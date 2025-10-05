const db = require("../config/db");
const PDFHelper = require("../helpers/PDFHelper");

exports.reportAnimal = async (req, res) => {
  const { farm_id, animal_id, type_id } = req.body;
  try {
    // สร้าง query และ parameters
    let query = `
      SELECT fa.id as farm_animal_id, fa.quantity,
        a.animal_id, a.name as animal_name, t.type_id, t.type_name, f.farm_name
      FROM farm_animals fa
      JOIN animals a ON fa.animal_id = a.animal_id
      JOIN animal_types t ON fa.type_id = t.type_id
      JOIN farmer f ON fa.farmer_id = f.farmer_id
    `;

    const params = [];
    const whereConditions = [];
    if (farm_id) whereConditions.push("fa.farmer_id = ?"), params.push(farm_id);
    if (animal_id)
      whereConditions.push("fa.animal_id = ?"), params.push(animal_id);
    if (type_id) whereConditions.push("fa.type_id = ?"), params.push(type_id);
    if (whereConditions.length > 0)
      query += " WHERE " + whereConditions.join(" AND ");
    query += " ORDER BY fa.farmer_id, a.name, t.type_name";

    const [rows] = await db.promise().query(query, params);

    // จัดกลุ่มข้อมูล
    const result = farm_id
      ? [{ farm_name: "ฟาร์มที่เลือก", animals: rows }]
      : Object.entries(
          rows.reduce((acc, row) => {
            if (!acc[row.farm_name]) acc[row.farm_name] = [];
            acc[row.farm_name].push(row);
            return acc;
          }, {})
        ).map(([farm_name, animals]) => ({ farm_name, animals }));

    // สร้างหัวข้อรายงาน
    let reportTitle = "รายงานสัตว์";
    if (farm_id) reportTitle += " ของฟาร์มที่เลือก";
    else if (animal_id || type_id) reportTitle += " ตามเงื่อนไข";
    else reportTitle += " ทั้งหมด";

    // สร้าง PDF
    PDFHelper.createPDF(res, "report_animal.pdf", (pdfHelper, doc) => {
      const margin = 30;
      const headerHeight = 60;
      const usableWidth = doc.page.width - margin * 2;
      const headers = [
        "ลำดับ",
        "ชื่อฟาร์ม",
        "ชื่อสัตว์",
        "ประเภทสัตว์",
        "จำนวน",
      ];
      const widths = [
        Math.max(50, Math.floor(usableWidth * 0.08)),
        Math.floor(usableWidth * 0.25),
        Math.floor(usableWidth * 0.25),
        Math.floor(usableWidth * 0.22),
        Math.max(80, Math.floor(usableWidth * 0.2)),
      ];

      let y = margin + headerHeight;
      result.forEach((farm) => {
        if (result.length > 1) {
          doc
            .font("THSarabunNew-Bold")
            .fontSize(16)
            .text(`ชื่อฟาร์ม: ${farm.farm_name}`, margin, y);
          y += 26;
        }
        const tableData = farm.animals.map((item) => [
          item.farm_name,
          item.animal_name,
          item.type_name,
          item.quantity.toLocaleString("th-TH"),
        ]);
        y = pdfHelper.drawTable(y, headers, widths, tableData);
      });
      pdfHelper.drawAllPageHeaders(reportTitle);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.reportFarm = async (req, res) => {
  const { province_id, amphure_id, tambon_id } = req.body;
  try {
    // สร้าง query และ parameters
    let query = `
      SELECT f.farmer_id, f.farm_name, f.tambon, f.amphure, f.province, f.phone,
             p.name_th as province_name, a.name_th as amphure_name, t.name_th as tambon_name
      FROM farmer f
      LEFT JOIN provinces p ON f.province = p.id
      LEFT JOIN amphures a ON f.amphure = a.id  
      LEFT JOIN tambons t ON f.tambon = t.id
    `;

    const params = [];
    const whereConditions = [];
    if (province_id)
      whereConditions.push("f.province = ?"), params.push(province_id);
    if (amphure_id)
      whereConditions.push("f.amphure = ?"), params.push(amphure_id);
    if (tambon_id) whereConditions.push("f.tambon = ?"), params.push(tambon_id);
    if (whereConditions.length > 0)
      query += " WHERE " + whereConditions.join(" AND ");

    // จัดเรียงเพื่อจัดกลุ่มตั้งแต่คิวรี่
    if (!province_id && !amphure_id && !tambon_id) {
      query += " ORDER BY p.name_th, a.name_th, t.name_th, f.farm_name";
    } else if (province_id && !amphure_id && !tambon_id) {
      query += " ORDER BY a.name_th, t.name_th, f.farm_name";
    } else if (province_id && amphure_id && !tambon_id) {
      query += " ORDER BY t.name_th, f.farm_name";
    } else {
      query += " ORDER BY f.farm_name";
    }

    const [rows] = await db.promise().query(query, params);

    // สร้างหัวข้อรายงาน
    let reportTitle = "รายงานข้อมูลฟาร์ม";
    let locationParts = "";

    if (province_id) {
      const [provinceRows] = await db
        .promise()
        .query("SELECT name_th FROM provinces WHERE id = ?", [province_id]);
      locationParts += ` จังหวัด${provinceRows[0].name_th}`;
    }

    if (amphure_id) {
      const [amphureRows] = await db
        .promise()
        .query("SELECT name_th FROM amphures WHERE id = ?", [amphure_id]);
      locationParts += ` อำเภอ${amphureRows[0].name_th}`;
    }

    if (tambon_id) {
      const [tambonRows] = await db
        .promise()
        .query("SELECT name_th FROM tambons WHERE id = ?", [tambon_id]);
      locationParts += ` ตำบล${tambonRows[0].name_th}`;
    }

    if (!province_id && !amphure_id && !tambon_id) {
      locationParts += " ทั้งหมด";
    }

    // สร้าง PDF
    PDFHelper.createPDF(res, "report_farm.pdf", (pdfHelper, doc) => {
      const margin = 30;
      const usableWidth = doc.page.width - margin * 2;

      // เลือกหัวตารางตามตัวกรองที่ส่งมา
      const hasProvince = Boolean(province_id);
      const hasAmphure = Boolean(amphure_id);
      const hasTambon = Boolean(tambon_id);

      /**
       * คอลัมน์ที่ต้องการแสดงผลตามเงื่อนไข
       */
      let headers = ["ลำดับ", "ชื่อฟาร์ม", "ที่อยู่", "เบอร์โทรติดต่อ"];

      let widths = [
        usableWidth * 0.1,
        usableWidth * 0.25,
        usableWidth * 0.4,
        usableWidth * 0.25,
      ];

      let y = margin + 80;
      if (rows.length > 0) {
        const tableData = rows.map((item) => [
          item.farm_name || "-",
          "จังหวัด" +
            item.province_name +
            " ตำบล" +
            item.amphure_name +
            " อำเภอ" +
            item.tambon_name,
          item.phone || "-",
        ]);

        // === วาดตาราง ===
        y = pdfHelper.drawTable(y + 20, headers, widths, tableData);

        // === นับจำนวนฟาร์มตามจังหวัดจาก rows ที่ได้มา ===
        const farmCountByProvince = rows.reduce((acc, item) => {
          const province = item.province_name || "-";
          acc[province] = (acc[province] || 0) + 1;
          return acc;
        }, {});

        // === แสดงสรุป ===
        // y += 30;
        // doc
        //   .font("THSarabunNew-Bold")
        //   .fontSize(16)
        //   .text("สรุปจำนวนฟาร์มแต่ละจังหวัด", margin, y);

        // y += 25;
        // let totalFarms = 0;
        // Object.entries(farmCountByProvince).forEach(
        //   ([province, total], index) => {
        //     doc
        //       .font("THSarabunNew")
        //       .fontSize(16)
        //       .text(
        //         `${index + 1}. จังหวัด${province} = ${total} ฟาร์ม`,
        //         margin,
        //         y
        //       );
        //     y += 20;
        //     totalFarms += total;
        //   }
        // );

        // // รวมทั้งหมด
        // y += 10;
        // doc
        //   .font("THSarabunNew-Bold")
        //   .fontSize(16)
        //   .text(`รวมทั้งหมด = ${totalFarms} ฟาร์ม`, margin, y);
      } else {
        doc
          .font("THSarabunNew")
          .fontSize(16)
          .text("ไม่พบข้อมูลฟาร์มตามเงื่อนไขที่เลือก", margin, y, {
            align: "center",
          });
      }

      // หัวกระดาษ
      pdfHelper.drawAllPageHeaders(reportTitle);
      doc
        .font("THSarabunNew-Bold")
        .fontSize(18)
        .text(locationParts, 20, 55, {
          width: doc.page.width - 20 * 2,
          align: "center",
        });
    });
  } catch (err) {
    console.error("Error generating farm report:", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.reportProduct = async (req, res) => {
  const { farm_id } = req.body;
  try {
    // สร้าง query และ parameters
    let query = `SELECT p.product_id, p.farmer_id, p.product_name, p.price, p.unit, p.image, f.farm_name
                 FROM products p
                 JOIN farmer f ON p.farmer_id = f.farmer_id`;
    const params = [];
    if (farm_id) (query += " WHERE p.farmer_id = ?"), params.push(farm_id);
    query += " ORDER BY p.farmer_id, p.product_name";

    const [rows] = await db.promise().query(query, params);

    // จัดกลุ่มข้อมูล
    const result = farm_id
      ? { farm_name: rows[0]?.farm_name || "ไม่พบข้อมูล", products: rows }
      : Object.values(
          rows.reduce((acc, row) => {
            if (!acc[row.farmer_id])
              acc[row.farmer_id] = { farm_name: row.farm_name, products: [] };
            acc[row.farmer_id].products.push(row);
            return acc;
          }, {})
        );

    if (!result || (Array.isArray(result) && result.length === 0)) {
      return res.status(404).json({ msg: "ไม่พบข้อมูลสินค้า" });
    }

    // สร้างหัวข้อรายงาน
    const reportTitle = `รายงานสินค้า ${
      farm_id ? "ของฟาร์มที่เลือก" : "ทั้งหมด"
    }`;

    // สร้าง PDF
    PDFHelper.createPDF(res, "report_product.pdf", (pdfHelper, doc) => {
      const margin = 30;
      const usableWidth = doc.page.width - margin * 2;
      const headers = [
        "ลำดับ",
        "ชื่อฟาร์ม",
        "ชื่อสินค้า",
        "หน่วย",
        "ราคาต่อหน่วย",
      ];
      const widths = [
        Math.max(50, Math.floor(usableWidth * 0.08)),
        Math.floor(usableWidth * 0.25),
        Math.floor(usableWidth * 0.3),
        Math.max(80, Math.floor(usableWidth * 0.12)),
        Math.floor(usableWidth * 0.25),
      ];

      let y = margin + 60;
      if (Array.isArray(result)) {
        result.forEach((farm) => {
          if (result.length > 1) {
            doc
              .font("THSarabunNew-Bold")
              .fontSize(16)
              .text(`ชื่อฟาร์ม: ${farm.farm_name}`, margin, y);
            y += 26;
          }
          const tableData = farm.products.map((prod) => [
            farm.farm_name,
            prod.product_name,
            prod.unit || "-",
            Number(prod.price).toLocaleString("th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          ]);
          y = pdfHelper.drawTable(y, headers, widths, tableData);
        });
      } else {
        const tableData = result.products.map((prod) => [
          result.farm_name,
          prod.product_name,
          prod.unit || "-",
          Number(prod.price).toLocaleString("th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
        ]);
        y = pdfHelper.drawTable(y, headers, widths, tableData);
      }
      pdfHelper.drawAllPageHeaders(reportTitle);
    });
  } catch (err) {
    console.error("Error generating product report:", err);
    return res.status(500).json({ msg: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
