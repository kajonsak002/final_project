import { CircleDollarSign, Earth, Heart, Info, Users } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [data, setData] = useState([
    {
      id: 1,
      name: "ฟาร์มรักษ์บ้านสวน",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 1",
      location: "ตำบลสันทราย อำเภอเมืองเชียงใหม่ จังหวัดเชียงใหม่ 50000",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
      view: 90,
    },
    {
      id: 2,
      name: "นายหนวดฟาร์มหมู",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 2",
      location: "ตำบลบ้านโพธิ์ อำเภอเมืองนครราชสีมา จังหวัดนครราชสีมา 30000",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
      view: 50,
    },
    {
      id: 3,
      name: "ตะวันฟาร์มไก่หนวด",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 3",
      location: "ตำบลสบป้าด อำเภอแม่เมาะ จังหวัดลำปาง 52000",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
      view: 40,
    },
    {
      id: 4,
      name: "ฟาร์มหมูของตะวัน",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 4",
      location: "ตำบลในเมือง อำเภอเมืองขอนแก่น จังหวัดขอนแก่น 40000",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
      view: 35,
    },
    {
      id: 5,
      name: "ฟาร์มควายเขาค้อ",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 5",
      location: "ตำบลเขาค้อ อำเภอเขาค้อ จังหวัดเพชรบูรณ์ 67270",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
      view: 33,
    },
    {
      id: 6,
      name: "ฟาร์มตะวันป่ายาง",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 6",
      location: "ตำบลวังยาง อำเภอเมืองสุพรรณบุรี จังหวัดสุพรรณบุรี 72000",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
      view: 30,
    },
  ]);

  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

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
    <div className="bg-[#F9FAFB]">
      {/* Hero Section with Banner Image */}
      <div
        className="hero h-[500px]"
        style={{
          backgroundImage: "url('bg.jpg')",
        }}>
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="">
            <h1 className="mb-2 text-3xl font-bold">
              เเนวทางการเลี้ยงสัตว์เเบบเกษตรอินทรีย์
            </h1>
            <p className="mb-5">
              เว็บที่ให้ข้อมูลเกี่ยวกับเเนวทางการเลี้ยงสัตว์แบบเกษตรอินทรีย์
              พร้อมทั้งยังมีชุมชนไว้เเลกเปลี่ยนข้อมูลสำหรับเกษตรกร
            </p>
          </div>
        </div>
      </div>

      {/* เกษตร Section */}
      <div className="container mx-auto my-16 px-4">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:w-1/2">
            <img
              src="/banner.jpg"
              alt="เกษตรกร"
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-green-800">
              เกษตรอินทรีย์คืออะไร?
            </h2>
            <p className="text-green-600 leading-relaxed">
              เกษตรอินทรีย์คือวิธีการเลี้ยงสัตว์และปลูกพืชที่เน้นความสมดุลของธรรมชาติ
              โดยหลีกเลี่ยงการใช้สารเคมีสังเคราะห์
              เพื่อสุขภาพที่ดีของทั้งผู้บริโภคและสิ่งแวดล้อม
              ด้วยวิธีการที่ยั่งยืน
              คุณสามารถสร้างผลผลิตที่มีคุณภาพและเป็นมิตรต่อโลก
            </p>
          </div>
        </div>
      </div>

      {/* ฟาร์มทั้งหมด */}
      <div className="relative bg-white mx-2 rounded-xl shadow my-10 p-5">
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="text-2xl font-bold text-green-800">
            ฟาร์มทั้งหมด <span className="text-green-600">{data.length}</span>{" "}
            ฟาร์ม
          </h1>
        </div>

        {/* ปุ่มเลื่อน */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-green-100 z-10">
          ◀
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-green-100 z-10">
          ▶
        </button>

        {/* Carousel */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto space-x-4 scroll-smooth pb-4 pt-2">
          {data.map((farm, index) => (
            <div
              key={index}
              className="min-w-[75%] sm:min-w-[50%] md:min-w-[33%] lg:min-w-[25%]">
              <div className="bg-white shadow-md rounded-md overflow-hidden h-full flex flex-col">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="h-48 w-full object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-green-800 text-lg font-semibold mb-1">
                      {farm.name}
                    </h2>
                    <p className="text-green-600 text-sm">{farm.location}</p>
                  </div>
                  <div className="mt-3">
                    <Link to={`farm?id=${farm.id}`} state={{ farm }}>
                      <button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white w-full py-2 rounded-md">
                        อ่านเพิ่มเติม
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ประโยชน์ */}
      <div className="container mx-auto my-20 px-4 animate-on-scroll">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
          ประโยชน์ของเกษตรอินทรีย์
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card bg-white shadow-xl ">
            <div className="card-body items-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="card-title text-xl font-semibold mt-2 text-green-800">
                สุขภาพที่ดี
              </h3>
              <p className="text-gray-600 text-center">
                ปลอดภัยจากสารเคมีตกค้าง
                ส่งผลดีต่อสุขภาพของทั้งผู้ผลิตและผู้บริโภค
              </p>
            </div>
          </div>
          <div className="card bg-white shadow-xl ">
            <div className="card-body items-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                {/* <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 hover:shadow-2xl transition-all duration-300 border border-green-100 transform hover:-translate-y-2"> */}
                <Earth className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="card-title text-xl font-semibold mt-2 text-green-800">
                รักษาสิ่งแวดล้อม
              </h3>
              <p className="text-gray-600 text-center">
                ช่วยฟื้นฟูระบบนิเวศ ลดมลพิษและสร้างความสมดุลให้ธรรมชาติ
              </p>
            </div>
          </div>
          <div className="card bg-white shadow-xl ">
            <div className="card-body items-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CircleDollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="card-title text-xl font-semibold mt-2 text-green-800">
                เพิ่มมูลค่าผลผลิต
              </h3>
              <p className="text-gray-600 text-center">
                ผลิตภัณฑ์เกษตรอินทรีย์เป็นที่ต้องการของตลาดและสร้างรายได้มั่นคง
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* News section */}
      <div className="w-full bg-white p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-green-800">
          ข่าวสารต่างๆ
        </h2>
        <p className="text-green-800 font-bold text-xl">การเเจ้งเตือนข่าวสาร</p>
        <p className="text-gray-600 mb-5">
          ข่าวสารต่างๆจากปศุสัตว์ เเละฟาร์มในระบบของเรา
        </p>
        {news.map((item, index) => (
          <div key={index}>
            <div
              className="card card-side bg-base-100 shadow-sm w-full h-[150px] my-2"
              key={index}>
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
            <dialog id={item.id} className="modal">
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
          </div>
        ))}
      </div>

      {/* ฟีเจอร์ของระบบ */}
      <div className="container mx-auto my-20 px-4 animate-on-scroll">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-800">
          ฟีเจอร์ของระบบ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="card bg-gradient-to-br from-white to-green-50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="card-body items-center text-center p-8">
              <Info className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="card-title text-xl font-semibold mt-2 text-green-800">
                ข้อมูลการเลี้ยงสัตว์
              </h3>
              <p className="text-gray-600 text-center">
                ให้ข้อมูลแนะนำการเลี้ยงสัตว์แบบเกษตรอินทรีย์เพื่อเป็นแนวทางสำหรับเกษตรกร
              </p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full opacity-30"></div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-white to-green-50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="card-body items-center text-center p-8">
              <CircleDollarSign className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="card-title text-xl font-semibold mt-2 text-green-800">
                ข้อมูลราคากลางเนื้อสัตว์
              </h3>
              <p className="text-gray-600 text-center">
                ให้ข้อมูลราคากลางเนื้อสัตว์ ณ วันที่ปัจจุบัน
              </p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full opacity-30"></div>
            </div>
          </div>
          <div className="card bg-gradient-to-br from-white to-green-50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="card-body items-center text-center p-8">
              <Users className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="card-title text-xl font-semibold mt-2 text-green-800">
                ระบบชุมชน
              </h3>
              <p className="text-gray-600 text-center">
                ชุมชนสำหรับแลกเปลี่ยนข้อมูลความรู้ต่างๆ สำหรับสมาชิกที่ลงทะเบียน
              </p>
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
