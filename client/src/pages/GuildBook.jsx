import React, { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

function GuildBook() {
  const [guildBooks] = useState([
    {
      name: "คู่มือการเลี้ยงไก่",
      description:
        "คู่มือนี้จะแนะนำวิธีการเลี้ยงไก่อย่างถูกต้อง รวมถึงการให้อาหาร การดูแลสุขภาพ และการจัดการฟาร์มไก่เบื้องต้น",
      img: "https://image.makewebeasy.net/makeweb/0/wLFHGvpEg/Content/018_Chicken02.jpg?v=202405291424",
    },
    {
      name: "คู่มือการเลี้ยงสุกร",
      description:
        "แนวทางการเลี้ยงสุกรแบบครบวงจร ตั้งแต่การเลือกพันธุ์ การให้อาหาร การจัดการฟาร์ม และการป้องกันโรค",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGO13_tlTnSyyCZTv8ZFgBv7lgXhKp6k6djQ&s",
    },
    {
      name: "คู่มือการเลี้ยงโค",
      description:
        "ข้อมูลเกี่ยวกับการเลี้ยงโคเนื้อและโคนม วิธีการจัดการฟาร์ม การให้อาหาร และการดูแลสุขภาพสัตว์",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwedd5j_c6PTFO-7_bYjc72mmljZ14Ws_TpXuypGB1d_Kw1_1bH22OihTxOjGvUnSlJS6ryR4f5hNSXUMW15DkUA",
    },
    {
      name: "คู่มือการเลี้ยงแพะ",
      description:
        "คำแนะนำในการเลี้ยงแพะเนื้อและแพะนม รวมถึงการจัดการอาหาร ที่อยู่อาศัย และการป้องกันโรคต่างๆ",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1yRHnpM3mQyLB_BYOlKDzn-3WucM-wTi5Yg&s",
    },
    {
      name: "คู่มือการเลี้ยงเป็ด",
      description:
        "แนวทางการเลี้ยงเป็ดแบบครบวงจร การเลือกพันธุ์ การให้อาหาร การดูแลที่อยู่อาศัย และการป้องกันโรคระบาด",
      img: "https://www.silpa-mag.com/wp-content/uploads/2020/11/000_Hkg8537921.jpg",
    },
    {
      name: "คู่มือการเลี้ยงปลา",
      description:
        "คู่มือการเพาะเลี้ยงปลาน้ำจืด การจัดการบ่อเลี้ยง การให้อาหาร และเทคนิคการเพิ่มผลผลิต",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmx9RQRvhvyRXAZPcbDCO6g4Do5UT_PGMMrw&s",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuildBooks = guildBooks.filter((book) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="mx-auto px-5 my-5">
      {/* Search Section */}
      <div className="card bg-base-100 w-full shadow-sm h-[150px]">
        <div className="card-body">
          <h2 className="card-title text-green-800">ค้นหาข้อมูล</h2>
          <label className="input w-full flex items-center gap-2">
            <Search size={20} color="black" />
            <input
              type="search"
              className="grow w-full"
              placeholder="ค้นหาข้อมูลคู่มือการเลี้ยงสัตว์"
              value={searchTerm}
              onChange={handleSearch}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 card bg-base-100 w-full shadow-sm mt-5 overflow-y-auto">
        {filteredGuildBooks.length > 0 ? (
          filteredGuildBooks.map((item, index) => (
            <div
              className="card bg-base-100 w-96 h-[400px] shadow-sm mx-auto my-3"
              key={index}>
              <figure>
                <img src={item.img} alt={item.name} className="w-full" />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-green-800">{item.name}</h2>
                <p className="text-gray-700">
                  {item.description.substring(0, 50)}...
                </p>
                <div className="card-actions justify-end">
                  <Link to="/book_detail" state={{ book: item }}>
                    <button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white rounded-md w-[130px] h-[40px] mt-2 mb-[-10px] flex items-center justify-center gap-2 transition-all duration-200">
                      อ่านเพิ่มเติม...
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-center p-10">
            <h2 className="text-lg text-gray-500">ไม่พบข้อมูลที่ค้นหา</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuildBook;
