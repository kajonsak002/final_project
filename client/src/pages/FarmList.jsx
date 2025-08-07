import { Search, MapPin, Eye, ArrowRight, Sprout } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../admin/components/SearchBar";
import axios from "axios";
import Pagination from "../admin/components/Pagination";
import sampleFarmData from "./sampleFarmData";

function FarmPage() {
  const [farms, setFarms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [tambons, setTambons] = useState([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [tambon, setTambon] = useState("");

  const fetchFarms = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "all_farms");
      setFarms(res.data);
    } catch (err) {
      console.error("Error fetching farms:", err);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "provinces");
      setProvinces(res.data.provinces);
      console.log("Provinces:", res.data.provinces);
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL_API}districts/${provinceId}`
      );
      setDistricts(res.data.districts);
      console.log("Districts:", res.data.districts);
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  const fetchTambons = async (districtId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL_API}tambons/${districtId}`
      );
      setTambons(res.data.tambons);
      console.log("Tambons:", res.data.tambons);
    } catch (err) {
      console.error("Error fetching tambons:", err);
    }
  };

  const filteredData = farms.filter((item) => {
    const matchesName = item.farm_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesProvince = province
      ? item.province.toLowerCase() === province.toLowerCase()
      : true;
    const matchesDistrict = district
      ? item.amphure.toLowerCase() === district.toLowerCase()
      : true;
    const matchesTambon = tambon
      ? item.tambon.toLowerCase() === tambon.toLowerCase()
      : true;
    return matchesName && matchesProvince && matchesDistrict && matchesTambon;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, province, district, tambon]);

  useEffect(() => {
    fetchFarms();
    fetchProvinces();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex items-center mb-4">
            <Search className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-800">ค้นหาฟาร์ม</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาจากชื่อฟาร์ม..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="mt-3">
            {/* <pre>{JSON.stringify({ province, district, tambon }, null, 2)}</pre> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <legend className="">จังหวัด</legend>{" "}
                <select
                  onChange={(e) => {
                    if (!e.target.value) {
                      setProvince("");
                      setDistrict("");
                      setTambon("");
                      setDistricts([]);
                      setTambons([]);
                      return;
                    }
                    const { id, name } = JSON.parse(e.target.value);
                    fetchDistricts(id);
                    setProvince(name);
                    setDistrict("");
                    setTambon("");
                  }}
                  className="select w-full">
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map((p) => (
                    <option
                      key={p.id}
                      value={JSON.stringify({ id: p.id, name: p.name_th })}>
                      {p.name_th}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <legend>อำเภอ</legend>{" "}
                <select
                  onChange={(e) => {
                    if (!e.target.value) {
                      setDistrict("");
                      setTambon("");
                      setTambons([]);
                      return;
                    }
                    const { id, name } = JSON.parse(e.target.value);
                    fetchTambons(id);
                    setDistrict(name);
                    setTambon("");
                  }}
                  disabled={!districts.length}
                  className="select w-full">
                  <option value="">เลือกอำเภอ</option>
                  {districts.map((d) => (
                    <option
                      key={d.id}
                      value={JSON.stringify({ id: d.id, name: d.name_th })}>
                      {d.name_th}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <legend>ตำบล</legend>{" "}
                <select
                  onChange={(e) => {
                    if (!e.target.value) {
                      setTambon("");
                      return;
                    }
                    const { name } = JSON.parse(e.target.value);
                    setTambon(name);
                  }}
                  disabled={!tambons.length}
                  className="select w-full">
                  <option value="">เลือกตำบล</option>
                  {tambons.map((t) => (
                    <option
                      key={t.id}
                      value={JSON.stringify({
                        id: t.id,
                        name: t.name_th,
                      })}>
                      {t.name_th}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          {pageData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pageData.map((farm, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                  {/* Farm Image */}
                  <div className="relative overflow-hidden h-48 md:h-52">
                    <img
                      src={farm.farm_img}
                      alt={farm.farm_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Farm Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {farm.farm_name}
                    </h3>

                    {/* Location */}
                    <div className="flex items-start mb-3 text-gray-600">
                      <MapPin className="w-4 h-4 mt-1 mr-2 text-green-600 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">
                        จังหวัด{farm.province} อำเภอ{farm.amphure} ตำบล
                        {farm.tambon}
                      </span>
                    </div>

                    {/* View Count */}
                    {/* <div className="flex items-center mb-4 text-gray-500">
                      <Eye className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm">
                        เข้าชม {farm.view_count?.toLocaleString() || 0} ครั้ง
                      </span>
                    </div> */}

                    {/* Action Button */}
                    <Link
                      to={`/farm/${farm.farmer_id}`}
                      state={{ farm: { farmer_id: farm.farmer_id } }}>
                      <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center group/btn">
                        <span>ดูรายละเอียด</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                ไม่พบข้อมูลที่ค้นหา
              </h3>
              <p className="text-gray-500">
                ลองเปลี่ยนคำค้นหาหรือล้างตัวกรองเพื่อดูฟาร์มทั้งหมด
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmPage;
