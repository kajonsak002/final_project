import React, { useState, useEffect } from "react";
import { Search, BookOpen, Users, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function GuildBook() {
  // const [guildBooks] = useState([
  //   {
  //     id: 1,
  //     name: "คู่มือการเลี้ยงไก่",
  //     description:
  //       "คู่มือนี้จะแนะนำวิธีการเลี้ยงไก่อย่างถูกต้อง รวมถึงการให้อาหาร การดูแลสุขภาพ และการจัดการฟาร์มไก่เบื้องต้น",
  //     img: "https://image.makewebeasy.net/makeweb/0/wLFHGvpEg/Content/018_Chicken02.jpg?v=202405291424",
  //     category: "สัตว์ปีก",
  //     difficulty: "เริ่มต้น",
  //     duration: "30 นาที",
  //     rating: 4.8,
  //     views: 1250,
  //   },
  //   {
  //     id: 2,
  //     name: "คู่มือการเลี้ยงสุกร",
  //     description:
  //       "แนวทางการเลี้ยงสุกรแบบครบวงจร ตั้งแต่การเลือกพันธุ์ การให้อาหาร การจัดการฟาร์ม และการป้องกันโรค",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGO13_tlTnSyyCZTv8ZFgBv7lgXhKp6k6djQ&s",
  //     category: "สัตว์เลี้ยงลูกด้วยนม",
  //     difficulty: "กลาง",
  //     duration: "45 นาที",
  //     rating: 4.6,
  //     views: 890,
  //   },
  //   {
  //     id: 3,
  //     name: "คู่มือการเลี้ยงโค",
  //     description:
  //       "ข้อมูลเกี่ยวกับการเลี้ยงโคเนื้อและโคนม วิธีการจัดการฟาร์ม การให้อาหาร และการดูแลสุขภาพสัตว์",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwedd5j_c6PTFO-7_bYjc72mmljZ14Ws_TpXuypGB1d_Kw1_1bH22OihTxOjGvUnSlJS6ryR4f5hNSXUMW15DkUA",
  //     category: "สัตว์เลี้ยงลูกด้วยนม",
  //     difficulty: "สูง",
  //     duration: "60 นาที",
  //     rating: 4.9,
  //     views: 2100,
  //   },
  //   {
  //     id: 4,
  //     name: "คู่มือการเลี้ยงแพะ",
  //     description:
  //       "คำแนะนำในการเลี้ยงแพะเนื้อและแพะนม รวมถึงการจัดการอาหาร ที่อยู่อาศัย และการป้องกันโรคต่างๆ",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1yRHnpM3mQyLB_BYOlKDzn-3WucM-wTi5Yg&s",
  //     category: "สัตว์เลี้ยงลูกด้วยนม",
  //     difficulty: "กลาง",
  //     duration: "40 นาที",
  //     rating: 4.7,
  //     views: 670,
  //   },
  //   {
  //     id: 5,
  //     name: "คู่มือการเลี้ยงเป็ด",
  //     description:
  //       "แนวทางการเลี้ยงเป็ดแบบครบวงจร การเลือกพันธุ์ การให้อาหาร การดูแลที่อยู่อาศัย และการป้องกันโรคระบาด",
  //     img: "https://www.silpa-mag.com/wp-content/uploads/2020/11/000_Hkg8537921.jpg",
  //     category: "สัตว์ปีก",
  //     difficulty: "เริ่มต้น",
  //     duration: "35 นาที",
  //     rating: 4.5,
  //     views: 980,
  //   },
  //   {
  //     id: 6,
  //     name: "คู่มือการเลี้ยงปลา",
  //     description:
  //       "คู่มือการเพาะเลี้ยงปลาน้ำจืด การจัดการบ่อเลี้ยง การให้อาหาร และเทคนิคการเพิ่มผลผลิต",
  //     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmx9RQRvhvyRXAZPcbDCO6g4Do5UT_PGMMrw&s",
  //     category: "สัตว์น้ำ",
  //     difficulty: "กลาง",
  //     duration: "50 นาที",
  //     rating: 4.4,
  //     views: 1450,
  //   },
  // ]);

  const [guildBooks, setGuildBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuildBooks = guildBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGuildBook = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "guildbook");
      setGuildBooks(res.data.data);
    } catch (err) {
      console.log("Error to get guildBook");
    }
  };

  useEffect(() => {
    getGuildBook();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">
              ค้นหาคู่มือการเลี้ยงสัตว์
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาจากหัวข้อคู่มือ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Guild Books Grid */}
        {filteredGuildBooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredGuildBooks.map((item, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200/50 overflow-hidden transform hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {item.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."}
                  </p>

                  {/* Action Button */}
                  <Link to={`/book/${item.guildbook_id}`}>
                    <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                      เริ่มอ่านคู่มือ
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                ไม่พบคู่มือที่ค้นหา
              </h3>
              <p className="text-slate-600 mb-6">
                ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("ทั้งหมด");
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
                ดูคู่มือทั้งหมด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuildBook;
