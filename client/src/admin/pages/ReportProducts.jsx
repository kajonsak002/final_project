import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function ReportProducts() {
  const [farmList, setFarmList] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getFarm = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "all_farms");
      setFarmList(res.data);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลฟาร์ม");
    }
  };

  useEffect(() => {
    getFarm();
  }, []);

  const handleFarmChange = (e) => {
    setSelectedFarm(e.target.value);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "report/product",
        { farm_id: selectedFarm },
        { responseType: "blob" }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการสร้างรายงาน");
      toast.error("ไม่พบข้อมูลสินค้าของฟาร์ม");
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
              <span className="text-black">รายงานสินค้า</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4 flex items-center">
            รายงานสินค้า
          </h2>

          <form onSubmit={handleGenerateReport}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
              {/* ส่วนเลือกฟาร์ม */}
              <div className="lg:col-span-2">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="mb-2 label-text text-gray-700 font-semibold flex items-center text-base">
                      เลือกฟาร์ม
                    </span>
                  </label>
                  <select
                    name="farm"
                    className="select select-bordered w-full focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base h-12"
                    value={selectedFarm}
                    onChange={handleFarmChange}>
                    <option value="">
                      -- เลือกฟาร์มที่ต้องการสร้างรายงาน (ทุกฟาร์ม) --
                    </option>
                    {farmList.map((farm) => (
                      <option key={farm.farmer_id} value={farm.farmer_id}>
                        {farm.farm_name}
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
              <p className="text-blue-700 mt-1 ml-7">
                หากไม่เลือกฟาร์ม ระบบจะสร้างรายงานสินค้าของทุกฟาร์ม
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportProducts;
