# API Documentation - Post Management

## Get All Posts for Admin

### Endpoint

```
GET /api/post/get-all-posts/admin
```

### Description

ดึงข้อมูลโพสต์ทั้งหมดในระบบสำหรับแอดมินใช้งาน ใช้ในการจัดการโพสต์ทั้งหมดในหน้า AllPosts

### Response Format

#### Success Response (200 OK)

```json
{
  "message": "Posts fetched successfully",
  "posts": [
    {
      "post_id": 1,
      "farmer_id": 123,
      "content": "เนื้อหาโพสต์...",
      "image_post": "http://localhost:3000/public/post_images/image.jpg",
      "create_at": "2024-01-15 10:30:00",
      "status": "อนุมัติ",
      "is_visible": "แสดง",
      "approval_date": "2024-01-15 10:35:00",
      "farm_name": "ฟาร์มตัวอย่าง",
      "farm_img": "http://localhost:3000/public/farm_profile/avatar.jpg",
      "comment_count": 5
    }
  ]
}
```

#### Error Response (500 Internal Server Error)

```json
{
  "error": "Internal Server Error",
  "message": "เกิดข้อผิดพลาดในการดึงข้อมูลโพสต์"
}
```

### Response Fields

| Field           | Type        | Description                                |
| --------------- | ----------- | ------------------------------------------ |
| `post_id`       | Integer     | ID ของโพสต์                                |
| `farmer_id`     | Integer     | ID ของฟาร์มผู้โพสต์                        |
| `content`       | String      | เนื้อหาโพสต์                               |
| `image_post`    | String/null | URL รูปภาพโพสต์ (ถ้ามี)                    |
| `create_at`     | String      | วันที่และเวลาที่สร้างโพสต์                 |
| `status`        | String      | สถานะการอนุมัติ (อนุมัติ/รออนุมัติ/ปฏิเสธ) |
| `is_visible`    | String      | สถานะการแสดงผล (แสดง/ซ่อน)                 |
| `approval_date` | String      | วันที่และเวลาที่อนุมัติ                    |
| `farm_name`     | String      | ชื่อฟาร์ม                                  |
| `farm_img`      | String/null | URL รูปภาพโปรไฟล์ฟาร์ม                     |
| `comment_count` | Integer     | จำนวนความคิดเห็น                           |

### Features

1. **ดึงข้อมูลครบถ้วน**: รวมข้อมูลโพสต์ ฟาร์ม และจำนวนความคิดเห็น
2. **เรียงลำดับ**: เรียงตามวันที่สร้างใหม่ที่สุดก่อน
3. **URL รูปภาพ**: แปลง path เป็น full URL อัตโนมัติ
4. **นับความคิดเห็น**: นับจำนวนความคิดเห็นทั้งหมดของแต่ละโพสต์
5. **ไม่มี Filter**: แสดงโพสต์ทั้งหมดไม่ว่าจะอนุมัติหรือไม่

### Usage Example

```javascript
// Frontend usage
const fetchAllPosts = async () => {
  try {
    const response = await axios.get(
      import.meta.env.VITE_URL_API + "post/get-all-posts/admin"
    );
    setPosts(response.data.posts || []);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
```

### Related Endpoints

- `POST /api/post/hide-post` - ซ่อนโพสต์ (ต้องส่ง reason)
- `POST /api/post/show-post` - แสดงโพสต์ (ลบ reason อัตโนมัติ)
- `GET /api/post/:id` - ดึงรายละเอียดโพสต์
- `GET /api/post-wait-approval` - ดึงโพสต์รออนุมัติ

### Hide/Show Post APIs

#### Hide Post

```javascript
POST /api/post/hide-post
{
  "post_id": 123,
  "reason": "เนื้อหาไม่เหมาะสม" // ต้องระบุเหตุผล (ไม่จำกัดความยาว)
}
```

#### Show Post

```javascript
POST /api/post/show-post
{
  "post_id": 123
}
```

### Notes

- API นี้ไม่มี authentication middleware เนื่องจากใช้ในหน้าแอดมินที่อาจมี authentication แยกต่างหาก
- URL ของรูปภาพจะถูกสร้างเป็น full URL โดยอัตโนมัติ
- การนับความคิดเห็นรวมทั้งความคิดเห็นที่ซ่อนและแสดง
