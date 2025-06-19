import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

function FarmProfile() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const farm = location.state?.farm;

  console.log(location.state.farm);

  const [data, setData] = useState([
    {
      id: 1,
      name: "ฟาร์มรักษ์บ้านสวน",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 1",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
    },
    {
      id: 2,
      name: "นายหนวดฟาร์มหมู",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 2",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
    },
    {
      id: 3,
      name: "ตะวันฟาร์มไก่หนวด",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 3",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
    },
    {
      id: 4,
      name: "ฟาร์มหมูของตะวัน",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 4",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
    },
    {
      id: 5,
      name: "ฟาร์มควายเขาค้อ",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 4",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
    },
    {
      id: 6,
      name: "ฟาร์มตะวันป่ายาง",
      description: "รายละเอียดเกี่ยวกับฟาร์มที่ 4",
      image:
        "https://image.makewebeasy.net/makeweb/0/si08IWcIs/attachfile/pig02.jpg?v=202405291424",
    },
  ]);

  const carouselRefProduct = useRef(null);
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

  const scrollLeftProduct = () => {
    if (carouselRefProduct.current) {
      carouselRefProduct.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRightProduct = () => {
    if (carouselRefProduct.current) {
      carouselRefProduct.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div>
      <div
        className="relative w-full h-[300px] bg-cover bg-center mb-8"
        style={{ backgroundImage: `url(${farm.image})` }}>
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[900px] h-[300px] bg-white rounded-xl shadow-lg flex overflow-hidden">
          <div className="w-1/2 h-full">
            <img
              src={farm.image}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-1/2 p-6 flex flex-col justify-center text-gray-800">
            <h2 className="text-2xl font-bold mb-2 text-green-800">
              {farm.name}
            </h2>
            <p className="text-green-800 font-bold">ที่อยู่:</p>
            <p className="">{farm.location}</p>
            {/* <p className="mt-3 text-green-800 font-bold">ช่องทางติดต่อ:</p>
            <p className="text-sm">091-234-5678</p>
            <p className="text-sm">somchai@email.com</p> */}
          </div>
        </div>
      </div>

      <div className="mt-5">
        {/* สัตว์ทั้งหมด */}
        <div className="relative mx-2 mt-25 p-5">
          <div className="flex justify-between items-center mb-4 px-2">
            <h1 className="text-2xl font-bold text-green-800">
              สัตว์ในฟาร์มทั้งหมด {"  "}
              <span className="text-green-600">{data.length}</span> {"  "}
              ตัว
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
                      <p className="text-green-600 text-sm">
                        {farm.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* สินค้าทั้งหมด */}
        <div className="relative mx-2  my-10 p-5">
          <div className="flex justify-between items-center mb-4 px-2">
            <h1 className="text-2xl font-bold text-green-800">
              สินค้าของฟาร์ม {"  "}
              <span className="text-green-600">{data.length}</span> {"  "}
              สินค้า
            </h1>
          </div>

          {/* ปุ่มเลื่อน */}
          <button
            onClick={scrollLeftProduct}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-green-100 z-10">
            ◀
          </button>
          <button
            onClick={scrollRightProduct}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-green-100 z-10">
            ▶
          </button>

          {/* Carousel */}
          <div
            ref={carouselRefProduct}
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
                      <p className="text-green-600 text-sm">
                        {farm.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* แกลอรี่ */}
        <div className="w-full my-5 p-5">
          <div className="flex justify-center item-center">
            <p className="font-bold text-3xl text-center text-green-800">
              บรรยากาศของฟาร์ม
            </p>
          </div>
          <div className="p-5 rounded-lg shadow-md bg-white">
            {/* รูปภาพหลัก */}
            <div className="h-[350px] m-2 flex items-center justify-center overflow-hidden rounded">
              <img
                src="./bg.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            {/* แกลอรี่ย่อย */}
            <div className="m-2">
              <div className="h-[150px] m-2">
                <div className="flex flex-wrap gap-3 h-full">
                  <div className="flex-1 min-w-[120px] flex items-center justify-center bg-gray-100 ">
                    <img
                      src="./bg.jpg"
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px] flex items-center justify-center bg-gray-100">
                    <img
                      src="./bg.jpg"
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px] flex items-center justify-center bg-gray-100">
                    <img
                      src="./bg.jpg"
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-[120px] flex items-center justify-center bg-gray-100">
                    <img
                      src="./bg.jpg"
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmProfile;
