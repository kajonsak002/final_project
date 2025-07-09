import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Eye,
  Calendar,
  Star,
  Users,
  Package,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axios from "axios";

function Profile() {
  const [farm, setFarm] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  const getFarmData = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      // console.log(res.data);
      localStorage.setItem("image_profile", res.data.farm_img);
      localStorage.setItem("farmer_id", res.data.farmer_id);
      setFarm(res.data);
    } catch (error) {
      console.error("Error fetching farm data:", error);
    }
  };

  useEffect(() => {
    getFarmData();
  }, []);
  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={farm.farm_banner}
            alt="Farm Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Card Section */}
        <div className="px-8 -mt-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left Side - Profile Image */}
                <div className="md:w-1/3 p-6  flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-60 h-50 mx-auto  rounded-lg overflow-hidden shadow-lg  ">
                      <img
                        src={farm.farm_img}
                        alt="Farm Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side - Farm Information */}
                <div className="md:w-2/3 p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {farm.farm_name}
                  </h1>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-green-600" />
                      <span>
                        จังหวัด{farm.province} อำเภอ{farm.amphure} ตำบล
                        {farm.tambon}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 mr-3 text-green-600" />
                      <span>{farm.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-3 text-green-600" />
                      <span>{farm.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Eye className="w-5 h-5 mr-3 text-green-600" />
                      <span>เข้าชม {farm.view_count} ครั้ง</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="pt-8"></div>

        {/* Tabs Section */}
        <div className="border-b border-gray-200">
          <div className="w-full px-10">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "products"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                <Package className="w-4 h-4 inline mr-1" />
                สินค้า (0)
              </button>
              <button
                onClick={() => setActiveTab("animals")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "animals"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                <Users className="w-4 h-4 inline mr-1" />
                สัตว์เลี้ยง (0)
              </button>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full mx-auto px-20 py-8">
          {activeTab === "products" && (
            // <div>
            //   <h2 className="text-2xl font-bold mb-6">สินค้าจากฟาร์ม</h2>
            //   <Swiper
            //     modules={[Autoplay, Pagination, Navigation]}
            //     spaceBetween={24}
            //     slidesPerView={1}
            //     breakpoints={{
            //       640: { slidesPerView: 1 },
            //       768: { slidesPerView: 2 },
            //       1024: { slidesPerView: 3 },
            //       1280: { slidesPerView: 4 },
            //     }}
            //     autoplay={{ delay: 1000, disableOnInteraction: false }}
            //     pagination={{ clickable: true }}
            //     navigation
            //     className="mySwiper">
            //     {products.map((product) => (
            //       <SwiperSlide key={product.id}>
            //         <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            //           <img
            //             src={product.image}
            //             alt={product.name}
            //             className="w-full h-48 object-cover"
            //           />
            //           <div className="p-4">
            //             <h3 className="font-semibold text-lg mb-2">
            //               {product.name}
            //             </h3>
            //             <div className="flex justify-between items-center mb-2">
            //               <span className="text-2xl font-bold text-green-600">
            //                 ฿{product.price}
            //               </span>
            //               <span className="text-gray-500">/{product.unit}</span>
            //             </div>
            //           </div>
            //         </div>
            //       </SwiperSlide>
            //     ))}
            //   </Swiper>
            // </div>
            <p>อยู่ระหว่างการพัฒนา</p>
          )}

          {/* Animals Farm */}
          {activeTab === "animals" && (
            // <div>
            //   <h2 className="text-2xl font-bold mb-6">สัตว์เลี้ยงในฟาร์ม</h2>
            //   <Swiper
            //     modules={[Autoplay, Pagination, Navigation]}
            //     spaceBetween={24}
            //     slidesPerView={1}
            //     breakpoints={{
            //       640: { slidesPerView: 1 },
            //       768: { slidesPerView: 2 },
            //       1024: { slidesPerView: 3 },
            //     }}
            //     autoplay={{ delay: 2500, disableOnInteraction: false }}
            //     pagination={{ clickable: true }}
            //     navigation
            //     className="mySwiper">
            //     {[
            //       {
            //         id: 1,
            //         type: "ไก่",
            //         count: 150,
            //         image:
            //           "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=300&h=200&fit=crop",
            //         description: "ไก่พื้นเมืองเลี้ยงแบบธรรมชาติ",
            //       },
            //     ].map((animal) => (
            //       <SwiperSlide key={animal.id}>
            //         <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            //           <img
            //             src={animal.image}
            //             alt={animal.type}
            //             className="w-full h-48 object-cover"
            //           />
            //           <div className="p-4">
            //             <div className="flex justify-between items-center mb-2">
            //               <h3 className="font-semibold text-xl">
            //                 {animal.type}
            //               </h3>
            //               <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            //                 {animal.count} ตัว
            //               </span>
            //             </div>
            //             <p className="text-gray-600 text-sm">
            //               {animal.description}
            //             </p>
            //           </div>
            //         </div>
            //       </SwiperSlide>
            //     ))}
            //   </Swiper>
            // </div>
            <p>อยู่ระหว่างการพัฒนา</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
