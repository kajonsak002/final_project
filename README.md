# 🥬 Organic Farm Management Platform

เว็บแอปสำหรับบริหารจัดการฟาร์มเกษตรอินทรีย์ ช่วยให้เกษตรกรสามารถนำเสนอข้อมูลฟาร์ม ผลิตภัณฑ์ สัตว์เลี้ยง แลกเปลี่ยนความรู้ในชุมชน และมีระบบหลังบ้านสำหรับแอดมินในการดูแลจัดการข้อมูลต่างๆ

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

### สำหรับผู้ใช้ทั่วไป/เกษตรกร

- 🏡 **หน้าแรก**: ข้อมูลเกษตรอินทรีย์, ประโยชน์, ข่าวสาร
- 📚 **คู่มือการเลี้ยงสัตว์**: บทความ/แนวทางการเลี้ยงสัตว์แบบอินทรีย์
- 💰 **ข้อมูลราคากลาง**: ราคากลางของสินค้าเกษตร
- 🐄 **ฟาร์มในระบบ**: รายชื่อฟาร์ม, โปรไฟล์ฟาร์ม, ผลิตภัณฑ์, สัตว์เลี้ยง
- 📰 **ข่าวสาร**: ข่าวสารและกิจกรรมในวงการเกษตร
- 👥 **ระบบชุมชน**: แลกเปลี่ยนข้อมูล/โพสต์/คอมเมนต์
- 🔐 **ระบบสมัครสมาชิก/เข้าสู่ระบบ**: สำหรับเกษตรกร

### สำหรับเกษตรกร (หลังเข้าสู่ระบบ)

- 📝 **จัดการโปรไฟล์ฟาร์ม**
- 🐮 **จัดการสัตว์เลี้ยง** (เพิ่ม/แก้ไข/ส่งคำร้องขอเพิ่มชนิดสัตว์)
- 📦 **จัดการสินค้า**
- 🗣️ **เข้าร่วมชุมชน/โพสต์/คอมเมนต์**
- 📰 **ดูข่าวสาร**
- 📖 **บันทึกเหตุการณ์สัตว์**

### สำหรับแอดมิน

- 📊 **Dashboard**: สรุปข้อมูลภาพรวม
- 👤 **จัดการผู้ใช้/เกษตรกร**
- 📚 **จัดการคู่มือการเลี้ยงสัตว์**
- 🐄 **จัดการหมวดหมู่/ชนิด/ประเภทสัตว์**
- 📝 **อนุมัติโพสต์/รายงานโพสต์/รายงานคอมเมนต์**
- 📰 **จัดการข่าวสาร**
- 🐮 **อนุมัติคำร้องขอเพิ่มสัตว์/ประเภทสัตว์**

---

## Tech Stack

- **Frontend**: React, React Router, TailwindCSS, DaisyUI, Axios, Swiper, Leaflet (แผนที่)
- **Backend**: Node.js, Express, MySQL, JWT, Multer, Puppeteer, Nodemailer
- **Dev Tools**: Vite, ESLint, Morgan, dotenv

---

## Project Structure

```
Project/
  backend/         # Node.js + Express API
    controllers/   # Logic ของแต่ละ resource
    routes/        # Routing ของ API
    public/        # รูปภาพ/ไฟล์อัปโหลด
    config/        # การเชื่อมต่อฐานข้อมูล
    middleware/    # Auth, Upload
    server.js      # Entry point
    package.json
  client/          # React Frontend
    src/
      pages/       # หน้าเพจหลัก
      admin/       # หน้าแอดมิน
      Farm/        # หน้าเกษตรกร
      components/  # UI Components
      Layout/      # Layout หลัก
      assets/      # รูปภาพ ไอคอน
    public/        # รูปภาพสาธารณะ
    package.json
  project.sql      # ไฟล์สร้างฐานข้อมูล
  README.md
```

---

## Getting Started

### 1. Clone Project

```bash
git clone <repo-url>
cd Project
```

### 2. ติดตั้ง Dependencies

**Backend**

```bash
cd backend
npm install
```

**Frontend**

```bash
cd ../client
npm install
```

### 3. สร้างฐานข้อมูล

- Import ไฟล์ `project.sql` ลง MySQL

### 4. ตั้งค่า Environment Variables

- สร้างไฟล์ `.env` ใน `backend/` (ตัวอย่าง)
  ```
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=yourpassword
  DB_NAME=project
  JWT_SECRET=your_jwt_secret
  ```

### 5. Start Development

**Backend**

```bash
npm run dev
```

**Frontend**

```bash
npm run dev
```

---

## API Endpoints

- `/api/animal` - จัดการข้อมูลสัตว์
- `/api/animal_type` - จัดการประเภทสัตว์
- `/api/product_farm` - จัดการสินค้า
- `/api/posts` - โพสต์ในชุมชน
- `/api/comment` - คอมเมนต์
- `/api/farm` - ข้อมูลฟาร์ม
- `/api/auth` - สมัคร/เข้าสู่ระบบ
- `/api/forgot_password` - ลืมรหัสผ่าน
- `/api/location` - ข้อมูลที่ตั้ง
- `/api/price` - ราคากลาง
- `/api/summary_count` - ข้อมูลสรุป
- `/api/approve_farm_request` - อนุมัติฟาร์ม

---

## Database Schema

ดูรายละเอียดในไฟล์ `project.sql`  
ประกอบด้วยตารางหลัก เช่น `admin`, `farmer`, `animal_categories`, `animal_requests`, `posts`, `product_farm` ฯลฯ

---

## Screenshots

> (แนะนำให้เพิ่มภาพหน้าจอแต่ละฟีเจอร์ที่สำคัญ)

---

## License

This project is licensed under the MIT License.

---

**หมายเหตุ:**

- หากต้องการ deploy จริง ควรตั้งค่าความปลอดภัยและ environment ให้เหมาะสม
- สามารถปรับแต่ง README.md เพิ่มเติมได้ตาม branding หรือรายละเอียดเฉพาะของโปรเจกต์
