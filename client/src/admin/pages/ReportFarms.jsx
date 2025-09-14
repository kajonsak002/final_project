import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ReportFarms() {
  const [provinces, setProvinces] = useState([]);
  const [amphures, setAmphures] = useState([]);
  const [tambons, setTambons] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedAmphure, setSelectedAmphure] = useState("");
  const [selectedTambon, setSelectedTambon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getProvinces = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "provinces");
      setProvinces(res.data);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลจังหวัด");
    }
  };

  const getAmphures = async (provinceId) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `amphures/${provinceId}`
      );
      setAmphures(res.data);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลอำเภอ");
    }
  };

  const getTambons = async (amphureId) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `tambons/${amphureId}`
      );
      setTambons(res.data);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลตำบล");
    }
  };

  useEffect(() => {
    getProvinces();
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedAmphure("");
    setSelectedTambon("");
    setAmphures([]);
    setTambons([]);

    if (provinceId) {
      getAmphures(provinceId);
    }
  };

  const handleAmphureChange = (e) => {
    const amphureId = e.target.value;
    setSelectedAmphure(amphureId);
    setSelectedTambon("");
    setTambons([]);

    if (amphureId) {
      getTambons(amphureId);
    }
  };

  const handleTambonChange = (e) => {
    setSelectedTambon(e.target.value);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "report/farm",
        {
          province_id: selectedProvince,
          amphure_id: selectedAmphure,
          tambon_id: selectedTambon,
        },
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการสร้างรายงาน");
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a
                href="/admin/dashboard"
                className="text-blue-600 hover:text-blue-800">
                หน้าแรก
              </a>
            </li>
            <li>
              <span className="text-black">รายงานข้อมูลฟาร์ม</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4 flex items-center">
            รายงานข้อมูลฟาร์ม
          </h2>

          <form onSubmit={handleGenerateReport}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
              {/* ส่วนเลือกจังหวัด */}
              <div className="lg:col-span-1">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="mb-2 label-text text-gray-700 font-semibold flex items-center text-base">
                      เลือกจังหวัด
                    </span>
                  </label>
                  <select
                    name="province"
                    className="select select-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base h-12"
                    value={selectedProvince}
                    onChange={handleProvinceChange}>
                    <option value="">-- ทุกจังหวัด --</option>
                    {provinces.map((province) => (
                      <option key={province.id} value={province.id}>
                        {province.name_th}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ส่วนเลือกอำเภอ */}
              <div className="lg:col-span-1">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="mb-2 label-text text-gray-700 font-semibold flex items-center text-base">
                      เลือกอำเภอ
                    </span>
                  </label>
                  <select
                    name="amphure"
                    className="select select-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base h-12"
                    value={selectedAmphure}
                    onChange={handleAmphureChange}
                    disabled={!selectedProvince}>
                    <option value="">-- เลือกอำเภอ --</option>
                    {amphures.map((amphure) => (
                      <option key={amphure.id} value={amphure.id}>
                        {amphure.name_th}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ส่วนเลือกตำบล */}
              <div className="lg:col-span-1">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="mb-2 label-text text-gray-700 font-semibold flex items-center text-base">
                      เลือกตำบล
                    </span>
                  </label>
                  <select
                    name="tambon"
                    className="select select-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base h-12"
                    value={selectedTambon}
                    onChange={handleTambonChange}
                    disabled={!selectedAmphure}>
                    <option value="">-- เลือกตำบล --</option>
                    {tambons.map((tambon) => (
                      <option key={tambon.id} value={tambon.id}>
                        {tambon.name_th}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ส่วนปุ่มสร้างรายงาน */}
              <div className="lg:col-span-1">
                <button
                  type="submit"
                  className={`btn btn-lg w-full bg-gradient-to-r from-green-500 to-green-600 text-white ${
                    loading ? "loading" : ""
                  }`}>
                  <span className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    สร้างรายงาน
                  </span>
                </button>
              </div>
            </div>

            {/* แสดงข้อผิดพลาดถ้ามี */}
            {error && (
              <div className="alert alert-error shadow-lg mt-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* ข้อมูลเพิ่มเติม */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-blue-800 font-medium">หมายเหตุ:</span>
              </div>
              <ul className="text-blue-700 mt-1 ml-7 space-y-1">
                <li>• หากไม่เลือกจังหวัด ระบบจะสร้างรายงานฟาร์มทุกจังหวัด</li>
                <li>• สามารถเลือกเงื่อนไขหลายอย่างพร้อมกันเพื่อกรองข้อมูล</li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportFarms;
