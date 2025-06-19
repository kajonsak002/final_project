import React, { useState } from "react";

function News() {
  const [news, setNews] = useState([
    {
      id: 1,
      title: "โรคระบาดร้ายแรงในไก่",
      des: "พบการระบาดของโรคไข้หวัดนกในหลายพื้นที่ เกษตรกรควรเฝ้าระวังและฉีดวัคซีนป้องกัน",
      date: "19 เมษายน 2568",
    },
    {
      id: 2,
      title: "เทคนิคการเลี้ยงหมูแบบประหยัดต้นทุน",
      des: "เรียนรู้วิธีการจัดการอาหารและที่อยู่อาศัยเพื่อลดต้นทุนการเลี้ยงหมู",
      date: "31 เมษายน 2568",
    },
    {
      id: 3,
      title: "การปรับปรุงพันธุ์วัวนมเพื่อเพิ่มผลผลิต",
      des: "เทคนิคการคัดเลือกและผสมพันธุ์วัวนมเพื่อเพิ่มปริมาณน้ำนม",
      date: "22 เมษายน 2568",
    },
    {
      id: 4,
      title: "การจัดการฟาร์มแบบออแกนิก",
      des: "แนวทางการทำฟาร์มแบบธรรมชาติ ไม่ใช้สารเคมี เพื่อผลผลิตที่ปลอดภัย",
      date: "19 มกราคม 2568",
    },
    {
      id: 5,
      title: "การตลาดออนไลน์สำหรับเกษตรกร",
      des: "วิธีการใช้ช่องทางออนไลน์ในการขายผลผลิตทางการเกษตร",
      date: "8 เมษายน 2568",
    },
    {
      id: 6,
      title: "การจัดการน้ำในฟาร์ม",
      des: "เทคนิคการประหยัดน้ำและระบบการให้น้ำที่เหมาะสมสำหรับสัตว์เลี้ยง",
      date: "5 เมษายน 2568",
    },
  ]);
  return (
    <>
      <div className="w-full">
        <div className="breadcrumbs text-md">
          <ul>
            <li>หน้าเเรก</li>
            <li>ข่าวสาร</li>
          </ul>
        </div>
        <div className="card w-full bg-base-100">
          <div className="card-body">
            <div className="flex flex-col justify-between items-center sm:flex-row gap-2">
              <h1 className="font-bold text-lg">ค้นหา</h1>
              <button
                className="btn btn-primary w-full sm:w-auto "
                onClick={() => document.getElementById("add_news").showModal()}>
                เพิ่มข่าวสาร
              </button>
            </div>
            <input
              type="text"
              className="input w-full"
              placeholder="ค้นหาข้อมูลข่าวสารจากชื่อข่าว , เนื้อหา"
            />
          </div>
        </div>

        {news.map((item, index) => (
          <>
            <div className="card card-side bg-base-100 shadow-sm w-full h-[150px] my-2">
              <div className="card-body">
                <div className="flex justify-between">
                  <div>
                    <h2 className="card-title text-green-800">{item.title}</h2>
                  </div>
                  <div className="card-date text-green-500">{item.date}</div>
                </div>
                <p className="text-gray-600 text-sm">{item.des}</p>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`${item.id}`).showModal();
                  }}
                  className="relative inline-block text-sm text-green-600 font-medium transition-all duration-300 hover:text-green-800 hover:underline">
                  อ่านเพิ่มเติม →
                </a>
              </div>
            </div>

            {/* Modal Section */}
            <dialog id={item.id} className="modal modal-bottom sm:modal-middle">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg text-green-800">
                  {item.title}
                </h3>
                <p className="py-4">{item.des}</p>
              </div>
            </dialog>
          </>
        ))}

        {/* Modal Add News */}
        <dialog id="add_news" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">เพิ่มข่าวสาร</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </>
  );
}

export default News;
