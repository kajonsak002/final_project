import { LocateFixed } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/markers/marker-icon-2x.png",
  iconUrl: "/markers/marker-icon.png",
  shadowUrl: "/markers/marker-shadow.png",
});

function MapEvents({ onLocationSelected }) {
  useMapEvents({
    click: (e) => {
      onLocationSelected(e.latlng);
    },
  });
  return null;
}

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    farm_name: "",
    tambon: "",
    amphures: "",
    province: "",
    latitude: "",
    longitude: "",
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [files, setFiles] = useState({
    farm_img: null,
    farm_banner: null,
  });
  const mapRef = useRef();

  // New state for location data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tambons, setTambons] = useState([]);

  // Fetch provinces when component mounts
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_URL_API + "provinces"
        );
        const data = await response.json();
        if (data.provinces) {
          setProvinces(data.provinces);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (formData.province) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_URL_API + `districts/${formData.province}`
          );
          const data = await response.json();
          if (data.districts) {
            setDistricts(data.districts);
          }
          // Reset dependent fields
          setFormData((prev) => ({
            ...prev,
            amphures: "",
            tambon: "",
          }));
          setTambons([]);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      };
      fetchDistricts();
    }
  }, [formData.province]);

  // Fetch tambons when district changes
  useEffect(() => {
    if (formData.amphures) {
      const fetchTambons = async () => {
        try {
          const response = await fetch(
            import.meta.env.VITE_URL_API + `tambons/${formData.amphures}`
          );
          const data = await response.json();
          if (data.tambons) {
            setTambons(data.tambons);
          }
          // Reset dependent field
          setFormData((prev) => ({
            ...prev,
            tambon: "",
          }));
        } catch (error) {
          console.error("Error fetching tambons:", error);
        }
      };
      fetchTambons();
    }
  }, [formData.amphures]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
    setFormData({
      ...formData,
      latitude: latlng.lat.toString(),
      longitude: latlng.lng.toString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.farm_img || !files.farm_banner) {
      toast.error("กรุณาเลือกรูปภาพให้ครบ");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append("farm_img", files.farm_img);
    formDataToSend.append("farm_banner", files.farm_banner);

    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error registering:", err);
      toast.error(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก"
      );
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="card bg-base-100 shadow-sm max-w-5xl mx-auto">
            <div className="card-body">
              <h2 className="card-title flex justify-center text-2xl mb-6">
                ลงทะเบียน
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black font-medium">
                        ชื่อฟาร์ม *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="farm_name"
                      value={formData.farm_name}
                      onChange={handleInputChange}
                      placeholder="กรอกชื่อฟาร์ม"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black font-medium">
                        อีเมล์ *
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="กรอกอีเมล์"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black font-medium">
                        เบอร์โทรศัพท์ *
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="กรอกเบอร์โทรศัพท์"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black font-medium">
                        รหัสผ่าน *
                      </span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="กรอกรหัสผ่าน"
                      className="input input-bordered w-full"
                      required
                    />
                  </div>{" "}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black font-medium">
                        จังหวัด *
                      </span>
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required>
                      <option value="">เลือกจังหวัด</option>
                      {provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name_th}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black font-medium">
                        อำเภอ *
                      </span>
                    </label>
                    <select
                      name="amphures"
                      value={formData.amphures}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                      disabled={!formData.province}>
                      <option value="">เลือกอำเภอ</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name_th}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-black font-medium">
                        ตำบล *
                      </span>
                    </label>
                    <select
                      name="tambon"
                      value={formData.tambon}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                      disabled={!formData.amphures}>
                      <option value="">เลือกตำบล</option>
                      {tambons.map((tambon) => (
                        <option key={tambon.id} value={tambon.id}>
                          {tambon.name_th}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text text-black font-medium">
                      รูปภาพหน้าปกฟาร์ม *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="farm_banner"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text text-black font-medium">
                      รูปโปรไฟล์ฟาร์ม *
                    </span>
                  </label>
                  <input
                    type="file"
                    name="farm_img"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control w-full mt-4">
                  <label className="label">
                    <span className="label-text text-black font-medium">
                      เลือกที่ตั้งฟาร์มจากแผนที่ *
                    </span>
                  </label>
                  <div className="h-[400px] w-full mb-4 relative">
                    <MapContainer
                      center={[13.7563, 100.5018]}
                      zoom={13}
                      className="h-full w-full"
                      whenCreated={(map) => {
                        mapRef.current = map;
                      }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {selectedLocation && (
                        <Marker
                          position={[
                            selectedLocation.lat,
                            selectedLocation.lng,
                          ]}
                        />
                      )}
                      <MapEvents onLocationSelected={handleLocationSelect} />
                    </MapContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-black font-medium">
                          ละติจูด
                        </span>
                      </label>
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        readOnly
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-black font-medium">
                          ลองจิจูด
                        </span>
                      </label>
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="btn bg-[#16A34A] text-white w-full rounded-xl hover:bg-[#15803D]">
                    ลงทะเบียน
                  </button>
                </div>
              </form>

              <div className="flex justify-end mt-4">
                <span className="text-blue-500 underline hover:text-blue-700">
                  <Link to="/login">มีบัญชีอยู่แล้ว?</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
