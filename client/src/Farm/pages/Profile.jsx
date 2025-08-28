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
  Pencil,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

function Profile() {
  const [farm, setFarm] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [profile, setProfile] = useState([]);
  const [editProfile, setEditProfile] = useState(profile);
  const [modalShowProfile, setModalShowProfile] = useState(false);

  const getFarmData = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      // console.log(res.data);
      localStorage.setItem("image_profile", res.data.data.farm_img);
      localStorage.setItem("farmer_id", res.data.data.farmer_id);
      setFarm(res.data.data);
    } catch (error) {
      console.error("Error fetching farm data:", error);
    }
  };

  const getProductFarm = async () => {
    const id = localStorage.getItem("farmer_id");
    try {
      setProducts([]);
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `farm-products/${id}`
      );
      setProducts(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getFarmData();
      await getProductFarm();
    };
    fetchData();
  }, []);

  const handleCheckEditProfile = (farm) => {
    setProfile(farm);
    setEditProfile(farm);
    setModalShowProfile(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prev) => ({ ...prev, [name]: value }));
  };

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tambons, setTambons] = useState([]);

  useEffect(() => {
    if (modalShowProfile) {
      // โหลดจังหวัดทั้งหมด
      axios
        .get(import.meta.env.VITE_URL_API + "provinces")
        .then((res) => setProvinces(res.data.provinces));

      // โหลดอำเภอของ province_id เดิม
      if (profile.province_id) {
        axios
          .get(
            import.meta.env.VITE_URL_API + `districts/${profile.province_id}`
          )
          .then((res) => setDistricts(res.data.districts));
      }

      // โหลดตำบลของ amphure_id เดิม
      if (profile.amphure_id) {
        axios
          .get(import.meta.env.VITE_URL_API + `tambons/${profile.amphure_id}`)
          .then((res) => setTambons(res.data.tambons));
      }
    }
  }, [modalShowProfile]);

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setEditProfile((prev) => ({
      ...prev,
      province_id: provinceId,
      amphure_id: "",
      tambon_id: "",
    }));
    if (provinceId) {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `districts/${provinceId}`
      );
      setDistricts(res.data.districts);
      setTambons([]); // เคลียร์ตำบล
    }
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setEditProfile((prev) => ({
      ...prev,
      amphure_id: districtId,
      tambon_id: "",
    }));
    if (districtId) {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `tambons/${districtId}`
      );
      setTambons(res.data.tambons);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const profileData = new FormData();
    profileData.append("farmerId", localStorage.getItem("farmer_id"));
    profileData.append("farmName", editProfile.farm_name); // ใช้ farm_name ให้ตรง
    profileData.append("phone", editProfile.phone);
    profileData.append("email", editProfile.email);
    profileData.append("address", editProfile.address);
    profileData.append("province", editProfile.province_id);
    profileData.append("amphure", editProfile.amphure_id);
    profileData.append("tambon", editProfile.tambon_id);

    if (editProfile.farm_img instanceof File) {
      profileData.append("farm_img", editProfile.farm_img);
    }
    if (editProfile.farm_banner instanceof File) {
      profileData.append("farm_banner", editProfile.farm_banner);
    }

    try {
      const res = await axios.put(
        import.meta.env.VITE_URL_API + "edit-profile",
        profileData
      );
      toast.success("อัปเดตข้อมูลสำเร็จ");
      setModalShowProfile(false);
      getFarmData();
    } catch (err) {
      toast.error("เกิดข้อผิดพลาด");
      console.error(err);
    }
  };

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
                    {/* <div className="flex items-center text-gray-700">
                      <Eye className="w-5 h-5 mr-3 text-green-600" />
                      <span>เข้าชม {farm.view_count} ครั้ง</span>
                    </div> */}
                    <div className="flex items-center">
                      <button
                        className="btn bg-green-500 text-white"
                        onClick={() => handleCheckEditProfile(farm)}>
                        <Pencil size={18} />
                        แก้ไขข้อมูลส่วนตัว
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal show profile Data */}
        {modalShowProfile && (
          <dialog open className="modal">
            <div className="modal-box">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setModalShowProfile(false)}>
                ✕
              </button>
              <h3 className="font-bold text-lg mb-4">แก้ไขข้อมูลส่วนตัว</h3>

              <form onSubmit={handleSave} className="space-y-4">
                {/* ชื่อฟาร์ม */}
                <div>
                  <label className="block font-semibold">ชื่อฟาร์ม</label>
                  <input
                    type="text"
                    name="farm_name"
                    value={editProfile.farm_name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* เบอร์โทร */}
                <div>
                  <label className="block font-semibold">เบอร์โทร</label>
                  <input
                    type="text"
                    name="phone"
                    value={editProfile.phone}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* อีเมล์ */}
                <div>
                  <label className="block font-semibold">อีเมล์</label>
                  <input
                    type="text"
                    name="email"
                    value={editProfile.email}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </div>

                {/* จังหวัด */}
                <div>
                  <label className="block font-semibold">จังหวัด</label>
                  <select
                    name="province_id"
                    value={editProfile.province_id || ""}
                    onChange={handleProvinceChange}
                    className="select select-bordered w-full">
                    <option value="">เลือกจังหวัด</option>
                    {provinces.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name_th}
                      </option>
                    ))}
                  </select>
                </div>

                {/* อำเภอ */}
                <div>
                  <label className="block font-semibold">อำเภอ</label>
                  <select
                    name="amphure_id"
                    value={editProfile.amphure_id || ""}
                    onChange={handleDistrictChange}
                    className="select select-bordered w-full">
                    <option value="">เลือกอำเภอ</option>
                    {districts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name_th}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ตำบล */}
                <div>
                  <label className="block font-semibold">ตำบล</label>
                  <select
                    name="tambon_id"
                    value={editProfile.tambon_id || ""}
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        tambon_id: e.target.value,
                      }))
                    }
                    className="select select-bordered w-full">
                    <option value="">เลือกตำบล</option>
                    {tambons.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name_th}
                      </option>
                    ))}
                  </select>
                </div>

                {/* รูปโปรไฟล์ */}
                <div>
                  <label className="block font-semibold">รูปฟาร์ม</label>
                  <input
                    type="file"
                    name="farm_img"
                    accept="image/*"
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        farm_img: e.target.files[0],
                      }))
                    }
                    className="file-input file-input-bordered w-full"
                  />
                </div>

                {/* รูปแบนเนอร์ */}
                <div>
                  <label className="block font-semibold">แบนเนอร์ฟาร์ม</label>
                  <input
                    type="file"
                    name="farm_banner"
                    accept="image/*"
                    onChange={(e) =>
                      setEditProfile((prev) => ({
                        ...prev,
                        farm_banner: e.target.files[0],
                      }))
                    }
                    className="file-input file-input-bordered w-full"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary">
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

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
                สินค้า ({products.length})
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
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "products" && (
            <div className="max-w-7xl w-full mx-auto">
              <h2 className="text-2xl font-bold mb-6">สินค้าของเรา</h2>

              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                className="mySwiper"
                onInit={(swiper) => swiper.update()}>
                {products.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                      <img
                        src={product.image}
                        alt={product.product_name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {product.product_name}
                        </h3>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl font-bold text-green-600">
                            ฿{product.price}
                          </span>
                          <span className="text-gray-500">/{product.unit}</span>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
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
