import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../../admin/components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";
import {
  Eye,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

dayjs.locale("th");

function MyPostReports() {
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 15;
  const farmerId = localStorage.getItem("farmer_id");

  const getReports = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `reports/post/sent/${farmerId}`
      );
      setReports(res.data.rows || []);
    } catch (err) {
      setReports([]);
      console.log("Error get my post reports : ", err);
    }
  };

  useEffect(() => {
    getReports();
  }, []);

  const pageData = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(reports.length / itemsPerPage) || 1;

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ดำเนินการแล้ว":
        return "text-green-600 bg-green-50";
      // case "ปฏิเสธ":
      //   return "text-red-600 bg-red-50";
      case "รอดำเนินการ":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ดำเนินการแล้ว":
        return <CheckCircle className="w-4 h-4" />;
      // case "ปฏิเสธ":
      //   return <XCircle className="w-4 h-4" />;
      case "รอดำเนินการ":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

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
              <a className="text-black">ประวัติการแจ้งรายงานโพสต์ของฉัน</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 w-full">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table bg-base-100 w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>วันที่รายงาน</th>
                  <th>เหตุผล</th>
                  <th>สถานะการรายงาน</th>
                  <th className="text-center">สถานะโพสต์</th>
                  <th className="text-center">เจ้าของโพสต์</th>
                  <th className="text-center">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ? (
                  pageData.map((item, index) => (
                    <tr key={index}>
                      {/* <td>{JSON.stringify(item, null, 2)}</td> */}
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>
                        {dayjs(item.report_date)
                          .locale("th")
                          .add(543, "year")
                          .format("D MMMM YYYY")}
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="truncate" title={item.reason}>
                            {truncateText(item.reason, 40)}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm gap-1 ${getStatusColor(
                            item.report_status
                          )}`}>
                          {getStatusIcon(item.report_status)}
                          {item.report_status}
                        </span>
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge badge-sm ${
                            item.is_visible === "ซ่อน"
                              ? "badge-error"
                              : "badge-success"
                          }`}>
                          {item.is_visible === "ซ่อน" ? "ซ่อน" : "แสดง"}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="max-w-xs">
                          <p className="truncate" title={item.post_owner_name}>
                            {item.post_owner_name}
                          </p>
                        </div>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => openModal(item)}
                          className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4 mr-1" />
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-2" />
                        <p>ไม่พบข้อมูล</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {reports.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedReport && (
        <dialog open className="modal">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                รายละเอียดการรายงานโพสต์
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* <pre>{JSON.stringify(selectedReport, null, 2)}</pre> */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-bold black mb-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      วันที่รายงาน
                    </label>
                    <p className="text-sm text-gray-900">
                      {dayjs(selectedReport.report_date)
                        .locale("th")
                        .add(543, "year")
                        .format("D MMMM YYYY")}
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold black mb-1">
                      <User className="w-4 h-4 mr-1" />
                      เจ้าของโพสต์
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReport.post_owner_name}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold black mb-1 block">
                      สถานะการรายงาน
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1 ${getStatusColor(
                        selectedReport.report_status
                      )}`}>
                      {getStatusIcon(selectedReport.report_status)}
                      {selectedReport.report_status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-bold black mb-1 block">
                      สถานะโพสต์
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedReport.is_visible === "ลบแล้ว" ||
                        selectedReport.is_visible === "ซ่อน"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                      {selectedReport.is_visible === "ลบแล้ว" ||
                      selectedReport.is_visible === "ซ่อน"
                        ? "ซ่อน"
                        : "แสดง"}
                    </span>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-sm font-bold black mb-2 block">
                    เหตุผลในการรายงาน
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedReport.reason}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                {selectedReport.content && (
                  <div>
                    <label className="flex items-center text-sm font-bold black mb-2">
                      <FileText className="w-4 h-4 mr-1" />
                      เนื้อหาโพสต์ที่ถูกรายงาน
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-900 leading-relaxed">
                        {selectedReport.content || "ไม่มีข้อมูลเนื้อหาโพสต์"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Review Result */}
                <div>
                  <label className="text-sm font-bold black mb-2 block">
                    ผลการตรวจสอบ
                  </label>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-900 leading-relaxed">
                      {selectedReport.report_review || "อยู่ระหว่างการตรวจสอบ"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button onClick={closeModal} className="btn btn-sm btn-ghost">
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default MyPostReports;
