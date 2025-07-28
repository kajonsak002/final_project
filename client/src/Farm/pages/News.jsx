import React, { useState } from "react";
import TinyEditor from "../../components/TinyEditor";
import { Link } from "react-router-dom";

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
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a
                  href="/profile"
                  className="text-blue-600 hover:text-blue-800">
                  หน้าแรก
                </a>
              </li>
              <li>
                <a className="text-gray-500">ข่าวสาร</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card w-full bg-base-100">
          <div className="card-body">
            <div className="flex flex-col justify-between items-center sm:flex-row gap-2">
              <h1 className="font-bold text-lg">ค้นหา</h1>
              <Link to={"insert"}>
                <button className="btn btn-primary w-full sm:w-auto ">
                  เพิ่มข่าวสาร
                </button>
              </Link>
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
                  className="relative inline-block text-sm text-green-600 font-medium transition-all duration-300 hover:text-green-800 hover:underline">
                  อ่านเพิ่มเติม →
                </a>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default News;
