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
  Hash,
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
  const [animals, setAnimals] = useState([]);
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

  const getAnimalsFarm = async () => {
    const id = localStorage.getItem("farmer_id");
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `animal/${id}`
      );
      const data = res.data.data;

      // แปลงข้อมูลให้รวม animal_name + type_name + จำนวน + lot
      const formatted = data.map((item) => ({
        id: item.farm_animal_id,
        type: `${item.animal_name} (${item.type_name})`, // ชื่อสัตว์ + ประเภท
        count: item.quantity,
        lot: item.lot_code,
        created_at: item.created_at,
        updated_at: item.updated_at,
        // description: `จำนวนรับเข้า: ${item.quantity_received}, รหัสล๊อต: ${item.lot_code}`,
        description: `รหัสล๊อต: ${item.lot_code}`,
        quantity_received: item.quantity_received,
        image: `/images/${item.animal_name}.jpg`, // หรือใช้ URL จริงจาก API
      }));

      setAnimals(formatted);
    } catch (err) {
      console.log("Error fetching animals", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getFarmData();
      await getProductFarm();
      await getAnimalsFarm();
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

        {/* Modal with DaisyUI dialog */}
        <dialog id="editFarmModal" className="modal" open={modalShowProfile}>
          <div className="modal-box w-11/12 max-w-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                แก้ไขข้อมูลฟาร์ม
              </h3>
              <form method="dialog">
                <button
                  type="button"
                  onClick={() => setModalShowProfile(false)}
                  className="btn btn-sm btn-circle btn-ghost">
                  ✕
                </button>
              </form>
            </div>

            {/* Content */}
            <div className="py-4 overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      ชื่อฟาร์ม
                    </label>
                    <input
                      type="text"
                      name="farm_name"
                      value={editProfile.farm_name}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="กรอกชื่อฟาร์ม"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        เบอร์โทร
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editProfile.phone}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="0xx-xxx-xxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        อีเมล
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={editProfile.email}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">ที่อยู่</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">รูปภาพ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Farm Image */}
                    <div>
                      <label className="block text-xs mb-2">รูปฟาร์ม</label>
                      <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                        {editProfile.farm_img ? (
                          <img
                            src={
                              typeof editProfile.farm_img === "string"
                                ? editProfile.farm_img
                                : URL.createObjectURL(editProfile.farm_img)
                            }
                            alt="Farm preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">ยังไม่มีรูป</span>
                        )}
                      </div>
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
                        className="file-input file-input-bordered w-full mt-2"
                      />
                    </div>

                    {/* Banner Image */}
                    <div>
                      <label className="block text-xs mb-2">
                        แบนเนอร์ฟาร์ม
                      </label>
                      <div className="w-full h-32 border-2 border-dashed rounded-lg flex items-center justify-center overflow-hidden">
                        {editProfile.farm_banner ? (
                          <img
                            src={
                              typeof editProfile.farm_banner === "string"
                                ? editProfile.farm_banner
                                : URL.createObjectURL(editProfile.farm_banner)
                            }
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">ยังไม่มีรูป</span>
                        )}
                      </div>
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
                        className="file-input file-input-bordered w-full mt-2"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setModalShowProfile(false)}
                className="btn">
                ยกเลิก
              </button>
              <button
                type="submit"
                onClick={handleSave}
                className="btn bg-green-500 hover:bg-green-600 text-white">
                บันทึก
              </button>
            </div>
          </div>
        </dialog>

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
                สัตว์เลี้ยง ({animals.length})
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
                  <SwiperSlide key={product.id} className="mb-3">
                    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow h-full">
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

          {activeTab === "animals" && (
            <div className="max-w-7xl w-full mx-auto px-4">
              {/* Enhanced Swiper */}
              <Swiper
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                className="mySwiper">
                {animals.map((animal) => (
                  <SwiperSlide key={animal.id} className="mb-3">
                    <div className="group relative bg-white rounded-2xl shadow hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                      {/* Enhanced Header */}
                      <div
                        className={`bg-gradient-to-br ${
                          animal.color || "from-green-400 to-green-600"
                        } p-6 text-white relative overflow-hidden`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12"></div>
                          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
                        </div>

                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-4">
                            {/* <div className="text-4xl transform group-hover:scale-110 ">
                              {animal.icon || "🐾"}
                            </div> */}
                            {/* <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                              <span className="font-bold text-lg">
                                {animal.count} ตัว
                              </span>
                            </div> */}
                          </div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-2xl mb-2">
                              {animal.type}
                            </h3>

                            <span className="font-bold text-lg">
                              {animal.count} ตัว
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className="p-6 space-y-4">
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="hover:bg-blue-50 rounded-lg p-3 transition-colors group/item">
                            <div className="flex items-center space-x-2">
                              <Hash className="w-4 h-4 text-blue-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">
                                  รหัสล๊อต
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {animal.lot}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="hover:bg-green-50 rounded-lg p-3 transition-colors group/item">
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-green-500" />
                              <div>
                                <p className="text-xs text-gray-500 font-medium uppercase">
                                  จำนวน
                                </p>
                                <p className="font-semibold text-gray-800">
                                  {animal.quantity_received}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Location */}
                        {animal.location && (
                          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {animal.location}
                            </span>
                          </div>
                        )}

                        {/* Timeline */}
                        <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            <span className="font-medium">สร้างเมื่อ:</span>
                            <span>
                              {new Date(animal.created_at).toLocaleDateString(
                                "th-TH"
                              )}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            <span className="font-medium">อัปเดตล่าสุด:</span>
                            <span>
                              {new Date(animal.updated_at).toLocaleDateString(
                                "th-TH"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 transition-all duration-500 pointer-events-none"></div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
