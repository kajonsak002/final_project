// ข้อมูลฟาร์มตัวอย่าง 10 รายการ
const sampleFarmData = [
  {
    id: 1,
    farm_name: "ฟาร์มข้าวหอมมะลิธรรมชาติ",
    province: "นครราชสีมา",
    amphure: "ปากช่อง",
    tambon: "วังไผ่",
    farm_img:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop",
    view_count: 1245,
    description: "ฟาร์มผลิตข้าวหอมมะลิออร์แกนิกคุณภาพสูง",
    area: "150 ไร่",
    owner: "นายสมชาย ใจดี",
  },
  {
    id: 2,
    farm_name: "ฟาร์มผักปลอดสารพิษเขียวใส",
    province: "เชียงใหม่",
    amphure: "สันทราย",
    tambon: "หนองแหย่ง",
    farm_img:
      "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&h=300&fit=crop",
    view_count: 892,
    description: "ฟาร์มผักใบเขียวปลอดสารเคมี ปลูกด้วยระบบไฮโดรโปนิกส์",
    area: "85 ไร่",
    owner: "นางสาวมาลี สีเขียว",
  },
  {
    id: 3,
    farm_name: "ฟาร์มมันสำปะหลังอินทรีย์",
    province: "ระยong",
    amphure: "เมืองระยอง",
    tambon: "เนินพระ",
    farm_img:
      "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?w=400&h=300&fit=crop",
    view_count: 567,
    description: "ฟาร์มปลูกมันสำปะหลังด้วยวิธีการเกษตรอินทรีย์",
    area: "200 ไร่",
    owner: "นายประสงค์ ดีงาม",
  },
  {
    id: 4,
    farm_name: "ฟาร์มส้มโอน้ำผึ้งพรีเมี่ยม",
    province: "นครปฐม",
    amphure: "สามพราน",
    tambon: "ตลาดพลู",
    farm_img:
      "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop",
    view_count: 2134,
    description: "ฟาร์มส้มโอคุณภาพเยี่ยม หวานฉ่ำ ได้มาตรฐาน GAP",
    area: "120 ไร่",
    owner: "นางสุดา หวานใจ",
  },
  {
    id: 5,
    farm_name: "ฟาร์มเห็ดนางฟ้าออร์แกนิก",
    province: "กาญจนบุรี",
    amphure: "ไทรโยค",
    tambon: "ลุมสุ่ม",
    farm_img:
      "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=400&h=300&fit=crop",
    view_count: 723,
    description: "ฟาร์มเพาะเห็ดนางฟ้าในสภาพแวดล้อมที่เหมาะสม",
    area: "45 ไร่",
    owner: "นายวิชัย เห็ดดี",
  },
  {
    id: 6,
    farm_name: "ฟาร์มปลาดุกแอฟริกันคุณภาพ",
    province: "สุพรรณบุรี",
    amphure: "เมืองสุพรรณบุรี",
    tambon: "รั้วใหญ่",
    farm_img:
      "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
    view_count: 1456,
    description: "ฟาร์มเลี้ยงปลาดุกแอฟริกันในบ่อขนาดใหญ่",
    area: "75 ไร่",
    owner: "นายสมศักดิ์ ปลาดี",
  },
  {
    id: 7,
    farm_name: "ฟาร์มข้าวโพดหวานไฮบริด",
    province: "ลพบุรี",
    amphure: "เมืองลพบุรี",
    tambon: "ท่าศาลา",
    farm_img:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop",
    view_count: 945,
    description: "ฟาร์มปลูกข้าวโพดหวานคุณภาพสูง หวานกรอบ",
    area: "165 ไร่",
    owner: "นายรุ่งโรจน์ หวานหวาน",
  },
  {
    id: 8,
    farm_name: "ฟาร์มไก่ไข่อินทรีย์ฟรีเรนจ์",
    province: "นครนายก",
    amphure: "เมืองนครนายก",
    tambon: "บ้านใหญ่",
    farm_img:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=300&fit=crop",
    view_count: 1789,
    description: "ฟาร์มเลี้ยงไก่ไข่แบบปล่อยอิสระ ไข่คุณภาพสูง",
    area: "95 ไร่",
    owner: "นางพิมพ์ใจ ไข่งาม",
  },
  {
    id: 9,
    farm_name: "ฟาร์มทุเรียนมอนทองพรีเมี่ยม",
    province: "จันทบุรี",
    amphure: "ท่าใหม่",
    tambon: "เทพนิมิต",
    farm_img:
      "https://images.unsplash.com/photo-1597714026720-8f74c62310ba?w=400&h=300&fit=crop",
    view_count: 3245,
    description: "ฟาร์มทุเรียนมอนทองเกรดเอ หนังบาง เนื้อหนา",
    area: "180 ไร่",
    owner: "นายสมพงษ์ หอมหวาน",
  },
  {
    id: 10,
    farm_name: "ฟาร์มผึ้งน้ำผึ้งป่าธรรมชาติ",
    province: "ตาก",
    amphure: "อุ้มผาง",
    tambon: "แม่ตื่น",
    farm_img:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
    view_count: 1067,
    description: "ฟาร์มเลี้ยงผึ้งและผลิตน้ำผึ้งป่าแท้ 100%",
    area: "60 ไร่",
    owner: "นายอนุชา ผึ้งทอง",
  },
];

// ตัวอย่างการใช้งานใน component
export default sampleFarmData;

// หรือถ้าต้องการใช้ใน useState
// const [farms, setFarms] = useState(sampleFarmData);
