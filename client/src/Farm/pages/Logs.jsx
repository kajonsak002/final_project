import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../admin/components/Pagination";
import axios from "axios";

function Logs() {
  const [usageHistory, setUsageHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const farmId = localStorage.getItem("farmer_id");

  const getUsageHistory = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `animal/usage/${farmId}`
      );
      setUsageHistory(res.data.data);
      toast.success("ดึงข้อมูลประวัติการใช้สัตว์สำเร็จ");
    } catch (err) {
      toast.error("ไม่สามารถดึงข้อมูลประวัติการใช้สัตว์ได้");
      console.log("Error Get Usage History");
    }
  };

  useEffect(() => {
    getUsageHistory();
  }, []);

  const pageData = usageHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/profile" className="text-blue-600 hover:text-blue-800">
                หน้าแรก
              </a>
            </li>
            <li>
              <a className="text-black">บันทึกเหตุการณ์สัตว์</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="card bg-base-100 w-full shadow-md mt-3 rounded-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="w-full lg:w-auto">
              <h3 className="text-xl font-bold">บันทึกเหตุการณ์สัตว์</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 w-full">
        {usageHistory.length > 0 ? (
          <>
            <table className="table bg-base-100 w-full">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ล๊อตที่</th>
                  <th>ชื่อสัตว์</th>
                  <th>ประเภท</th>
                  <th>จำนวนที่ใช้</th>
                  <th className="text-center">ประเภทการใช้งาน</th>
                  <th>หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {new Date(item.created_at).toLocaleDateString("th-TH")}
                    </td>
                    <td>{item.lot_code}</td>
                    <td>{item.animal_name}</td>
                    <td>{item.type_name || "-"}</td>
                    <td>{item.quantity_used}</td>
                    <td className="text-center">
                      <span>{item.usage_type}</span>
                    </td>
                    <td>{item.remark || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(usageHistory.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                ไม่มีประวัติการใช้งาน
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                ยังไม่มีการบันทึกการใช้สัตว์ในฟาร์มนี้
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Logs;
