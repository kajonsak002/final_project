# PDFHelper - คู่มือการใช้งาน

PDFHelper เป็นคลาสช่วยสำหรับสร้าง PDF รายงานในระบบ โดยมีฟีเจอร์ครบครันสำหรับการสร้างตาราง หัวรายงาน และการจัดการหน้า

## การติดตั้ง

```javascript
const PDFHelper = require("../helpers/PDFHelper");
```

## วิธีการใช้งาน

### 1. การสร้าง PDF แบบง่าย (แนะนำ)

```javascript
PDFHelper.createPDF(res, "filename.pdf", (pdfHelper, doc) => {
  // โค้ดสร้าง PDF ของคุณ
  const headers = ["ลำดับ", "ชื่อ", "จำนวน"];
  const widths = [50, 200, 100];
  const data = [
    ["สินค้า A", "10"],
    ["สินค้า B", "20"],
  ];

  let y = 100;
  y = pdfHelper.drawTable(y, headers, widths, data);
  pdfHelper.drawAllPageHeaders("รายงานสินค้า");
});
```

### 2. การสร้าง PDF แบบเต็ม

```javascript
const PDFDocument = require("pdfkit");
const doc = new PDFDocument({ size: "A4", margin: 30, bufferPages: true });
const pdfHelper = new PDFHelper(doc, 30, 60);

// สร้างตาราง
const headers = ["ลำดับ", "ชื่อ", "จำนวน"];
const widths = [50, 200, 100];
const data = [
  ["สินค้า A", "10"],
  ["สินค้า B", "20"],
];

let y = 100;
y = pdfHelper.drawTable(y, headers, widths, data);
pdfHelper.drawAllPageHeaders("รายงานสินค้า");

doc.end();
```

## API Reference

### Constructor

```javascript
new PDFHelper(doc, (margin = 30), (headerHeight = 60));
```

**พารามิเตอร์:**

- `doc` - PDFDocument instance
- `margin` - ระยะขอบ (default: 30)
- `headerHeight` - ความสูงของหัวรายงาน (default: 60)

### Static Methods

#### `PDFHelper.createPDF(res, filename, callback)`

สร้าง PDF แบบง่ายพร้อมจัดการ response

**พารามิเตอร์:**

- `res` - Express response object
- `filename` - ชื่อไฟล์ PDF
- `callback` - ฟังก์ชัน callback ที่รับ (pdfHelper, doc)

**ตัวอย่าง:**

```javascript
PDFHelper.createPDF(res, "report.pdf", (pdfHelper, doc) => {
  // โค้ดสร้าง PDF
});
```

### Instance Methods

#### `drawTable(startY, headers, widths, data, rowHeight = 28)`

สร้างตารางทั้งหมดพร้อมหัวตารางและข้อมูล

**พารามิเตอร์:**

- `startY` - ตำแหน่ง Y เริ่มต้น
- `headers` - Array ของหัวตาราง
- `widths` - Array ของความกว้างคอลัมน์
- `data` - Array ของข้อมูล (แต่ละแถวเป็น array)
- `rowHeight` - ความสูงของแถว (default: 28)

**คืนค่า:** ตำแหน่ง Y หลังจากตาราง

**ตัวอย่าง:**

```javascript
const headers = ["ลำดับ", "ชื่อสินค้า", "ราคา"];
const widths = [50, 200, 100];
const data = [
  ["สินค้า A", "100"],
  ["สินค้า B", "200"],
];
let y = 100;
y = pdfHelper.drawTable(y, headers, widths, data);
```

#### `drawTableHeader(y, headers, widths, rowHeight = 28)`

สร้างหัวตาราง

**พารามิเตอร์:**

- `y` - ตำแหน่ง Y
- `headers` - Array ของหัวตาราง
- `widths` - Array ของความกว้างคอลัมน์
- `rowHeight` - ความสูงของแถว

**คืนค่า:** ตำแหน่ง Y หลังจากหัวตาราง

#### `drawTableRow(y, values, widths, rowHeight = 28)`

สร้างแถวข้อมูลในตาราง

**พารามิเตอร์:**

- `y` - ตำแหน่ง Y
- `values` - Array ของข้อมูลในแถว
- `widths` - Array ของความกว้างคอลัมน์
- `rowHeight` - ความสูงของแถว

**คืนค่า:** ตำแหน่ง Y หลังจากแถว

#### `drawAllPageHeaders(title)`

วาดหัวรายงานและเลขหน้าสำหรับทุกหน้า

**พารามิเตอร์:**

- `title` - ชื่อรายงาน

**ตัวอย่าง:**

```javascript
pdfHelper.drawAllPageHeaders("รายงานสินค้าทั้งหมด");
```

#### `drawReportHeader(title, dateString, pageNumber, totalPages)`

สร้างหัวรายงานสำหรับหน้าเดียว

**พารามิเตอร์:**

- `title` - ชื่อรายงาน
- `dateString` - ข้อความวันที่
- `pageNumber` - หมายเลขหน้า (optional)
- `totalPages` - จำนวนหน้าทั้งหมด (optional)

#### `getDateString()`

สร้างข้อความวันที่ในรูปแบบไทย

**คืนค่า:** ข้อความวันที่ เช่น "1 มกราคม 2567 14:30"

## ตัวอย่างการใช้งาน

### 1. รายงานสินค้า

```javascript
exports.reportProduct = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM products");

    PDFHelper.createPDF(res, "products.pdf", (pdfHelper, doc) => {
      const margin = 30;
      const usableWidth = doc.page.width - margin * 2;
      const headers = ["ลำดับ", "ชื่อสินค้า", "ราคา", "หน่วย"];
      const widths = [
        Math.max(50, Math.floor(usableWidth * 0.1)),
        Math.floor(usableWidth * 0.4),
        Math.floor(usableWidth * 0.25),
        Math.floor(usableWidth * 0.25),
      ];

      const tableData = rows.map((item) => [
        item.product_name,
        item.price.toLocaleString("th-TH"),
        item.unit || "-",
      ]);

      let y = margin + 60;
      y = pdfHelper.drawTable(y, headers, widths, tableData);
      pdfHelper.drawAllPageHeaders("รายงานสินค้าทั้งหมด");
    });
  } catch (err) {
    res.status(500).json({ msg: "เกิดข้อผิดพลาด" });
  }
};
```

### 2. รายงานหลายฟาร์ม

```javascript
exports.reportFarms = async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM farmer");

    PDFHelper.createPDF(res, "farms.pdf", (pdfHelper, doc) => {
      const margin = 30;
      const usableWidth = doc.page.width - margin * 2;
      const headers = ["ลำดับ", "ชื่อฟาร์ม", "จังหวัด", "อำเภอ"];
      const widths = [
        Math.max(50, Math.floor(usableWidth * 0.1)),
        Math.floor(usableWidth * 0.3),
        Math.floor(usableWidth * 0.3),
        Math.floor(usableWidth * 0.3),
      ];

      const tableData = rows.map((item) => [
        item.farm_name,
        item.province_name || "-",
        item.amphure_name || "-",
      ]);

      let y = margin + 60;
      y = pdfHelper.drawTable(y, headers, widths, tableData);
      pdfHelper.drawAllPageHeaders("รายงานฟาร์มทั้งหมด");
    });
  } catch (err) {
    res.status(500).json({ msg: "เกิดข้อผิดพลาด" });
  }
};
```

## การจัดวางตัวอักษร

PDFHelper จะจัดวางตัวอักษรอัตโนมัติ:

- **คอลัมน์แรก (ลำดับ)**: ตรงกลาง
- **คอลัมน์สุดท้าย (ตัวเลข)**: ชิดขวา
- **คอลัมน์อื่นๆ**: ชิดซ้าย

## การจัดการหน้า

PDFHelper จะจัดการการขึ้นหน้าใหม่อัตโนมัติ:

- ตรวจสอบพื้นที่ว่างก่อนสร้างตาราง
- ขึ้นหน้าใหม่เมื่อจำเป็น
- วาดหัวรายงานและเลขหน้าทุกหน้า

## ฟอนต์

PDFHelper ใช้ฟอนต์ภาษาไทย:

- **THSarabunNew** - ฟอนต์ปกติ
- **THSarabunNew-Bold** - ฟอนต์หนา

## ข้อควรระวัง

1. **ความกว้างคอลัมน์**: ต้องรวมกันให้เท่ากับความกว้างที่ใช้ได้
2. **ข้อมูล**: ต้องเป็น Array ของ Array
3. **ตำแหน่ง Y**: ต้องส่งตำแหน่ง Y ที่ถูกต้อง
4. **ชื่อไฟล์**: ควรมีนามสกุล .pdf

## การแก้ไขปัญหา

### ปัญหา: ตารางไม่แสดง

- ตรวจสอบความกว้างคอลัมน์
- ตรวจสอบข้อมูลที่ส่งเข้าไป

### ปัญหา: ฟอนต์ไม่แสดง

- ตรวจสอบไฟล์ฟอนต์ในโฟลเดอร์ fonts
- ตรวจสอบ path ของฟอนต์

### ปัญหา: หน้าไม่ขึ้น

- ตรวจสอบตำแหน่ง Y
- ตรวจสอบความสูงของแถว
