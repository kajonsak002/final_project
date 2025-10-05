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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;
  const farmId = localStorage.getItem("farmer_id");

  const getUsageHistory = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `animal/usage/${farmId}`
      );

      setUsageHistory(res.data.data);
    } catch (err) {
      console.log("Error Get Usage History");
    }
  };

  useEffect(() => {
    getUsageHistory();
  }, []);

  const openModal = (usage) => {
    setSelectedUsage(usage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUsage(null);
    setIsModalOpen(false);
  };

  const pageData = usageHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/profile" className="text-blue-600 hover:text-blue-800">
                หน้าแรก
              </a>
            </li>
            <li>
              <a className="text-black">บันทึกการใช้สัตว์</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="card bg-base-100 w-full shadow-md mt-3 rounded-xl">
        <div className="card-body">
          <h3 className="text-xl font-bold">ประวัติการใช้สัตว์</h3>
        </div>
      </div>

      <div className="mt-3 w-full">
        {usageHistory.length > 0 ? (
          <>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md p-2">
              <table className="table w-full text-sm">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-center">ลำดับ</th>
                    <th>รหัส</th>
                    <th>วันที่ใช้งาน</th>
                    <th>จำนวนรายการ</th>
                    <th className="text-center">การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.length > 0 ? (
                    pageData.map((usage, index) => (
                      <tr key={usage.usage_id} className="hover:bg-gray-50">
                        <td className="text-center">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td>{usage.usage_code}</td>
                        <td>
                          {dayjs(usage.usage_date).format("DD MMMM YYYY")}
                        </td>
                        <td>
                          <span className="badge badge-info badge-sm">
                            {usage.details.length} รายการ
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => openModal(usage)}
                            className="btn btn-sm btn-outline btn-primary">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            ดูรายละเอียด
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center py-4">
                        ไม่พบข้อมูล
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(usageHistory.length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </div>
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

      {/* Modal */}
      {isModalOpen && selectedUsage && (
        <dialog open className="modal">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  รายละเอียดการใช้สัตว์
                </h2>
                <p className="text-sm text-gray-600">
                  วันที่:{" "}
                  {dayjs(selectedUsage.usage_date).format("DD MMMM YYYY")}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle btn-ghost">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="overflow-x-auto">
                <table className="table w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="text-left">ล๊อต</th>
                      <th className="text-left">ชื่อสัตว์</th>
                      <th className="text-left">ประเภท</th>
                      <th className="text-left">จำนวนที่ใช้</th>
                      <th className="text-center">ประเภทการใช้งาน</th>
                      <th className="text-left">หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUsage.details.map((detail) => (
                      <tr key={detail.detail_id} className="hover:bg-gray-50">
                        <td>{detail.lot_code}</td>
                        <td>{detail.animal_name}</td>
                        <td>{detail.type_name || "-"}</td>
                        <td>
                          <span className="font-medium">
                            {detail.quantity_used}
                          </span>
                        </td>
                        <td className="text-center">
                          <span
                            className={`badge badge-sm ${
                              detail.action === "ขาย"
                                ? "badge-success"
                                : detail.action === "เชือด"
                                ? "badge-warning"
                                : detail.action === "ตาย"
                                ? "badge-error"
                                : "badge-info"
                            }`}>
                            {detail.action}
                          </span>
                        </td>
                        <td>{detail.remark || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button onClick={closeModal} className="btn btn-primary">
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
