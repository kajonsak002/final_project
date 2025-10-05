import React, { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import Pagination from "../../admin/components/Pagination";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

function Logs() {
  const [usageHistory, setUsageHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsage, setSelectedUsage] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const itemsPerPage = 10;
  const farmId = localStorage.getItem("farmer_id");

  // ดึงประวัติการใช้สัตว์
  const getUsageHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_URL_API}animal/usage/${farmId}`
      );
      setUsageHistory(res.data.data || []);
      // toast.success("ดึงข้อมูลประวัติการใช้สัตว์สำเร็จ");
    } catch (err) {
      console.error("Error fetching usage history:", err);
      // toast.error("ไม่สามารถดึงข้อมูลประวัติการใช้สัตว์ได้");
    }
  };

  useEffect(() => {
    getUsageHistory();
  }, []);

  const pageData = usageHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (usage) => {
    setSelectedUsage(usage);
    setIsDetailOpen(true);
  };

  const closeModal = () => {
    setIsDetailOpen(false);
    setSelectedUsage(null);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/profile" className="text-blue-600 hover:text-blue-800">
                หน้าแรก
              </a>
            </li>
            <li>
              <span className="text-black">บันทึกการใช้สัตว์</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Header */}
      <div className="card bg-base-100 w-full shadow-md mt-3 rounded-xl">
        <div className="card-body">
          <h3 className="text-xl font-bold">บันทึกการใช้สัตว์</h3>
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 w-full">
        {usageHistory.length > 0 ? (
          <>
            <table className="table bg-base-100 w-full">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>ประเภทการใช้งาน</th>
                  <th>จำนวนสัตว์</th>
                  <th>จำนวนรวม</th>
                  <th>หมายเหตุ</th>
                  <th className="text-center">รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((item) => (
                  <tr key={item.id}>
                    <td>{dayjs(item.created_at).format("DD MMMM YYYY")}</td>
                    <td>
                      <span className="badge badge-outline">
                        {item.usage_type}
                      </span>
                    </td>
                    <td>{item.total_animals} ตัว</td>
                    <td>{item.total_quantity} ตัว</td>
                    <td>{item.remark || "-"}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleViewDetails(item)}>
                        ดูรายละเอียด
                      </button>
                    </td>
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
          <div className="text-center py-8 text-gray-500">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
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
        )}
      </div>

      {/* Modal รายละเอียด */}
      {isDetailOpen && selectedUsage && (
        <dialog open className="modal">
          <div className="modal-box max-w-4xl">
            <h2 className="font-bold text-lg mb-4">รายละเอียดการใช้งานสัตว์</h2>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-4">
              <div>
                <p>
                  <strong>วันที่:</strong>{" "}
                  {dayjs(selectedUsage.created_at).format("DD MMMM YYYY HH:mm")}
                </p>
                <p>
                  <strong>ประเภทการใช้งาน:</strong>{" "}
                  <span className="badge badge-outline">
                    {selectedUsage.usage_type}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <strong>จำนวนสัตว์:</strong> {selectedUsage.total_animals} ตัว
                </p>
                <p>
                  <strong>จำนวนรวม:</strong> {selectedUsage.total_quantity} ตัว
                </p>
              </div>
              {selectedUsage.remark && (
                <div className="col-span-2 mt-2">
                  <strong>หมายเหตุ:</strong> {selectedUsage.remark}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ล๊อตที่</th>
                    <th>ชื่อสัตว์</th>
                    <th>ประเภท</th>
                    <th>จำนวนที่ใช้</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedUsage.animals?.length > 0 ? (
                    selectedUsage.animals.map((animal, index) => (
                      <tr key={index}>
                        <td>{animal.lot_code || "-"}</td>
                        <td>{animal.animal_name || "ไม่ทราบ"}</td>
                        <td>{animal.type_name || "-"}</td>
                        <td>{animal.quantity_used || 0} ตัว</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">
                        ไม่มีข้อมูลสัตว์
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={closeModal}>
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Logs;
