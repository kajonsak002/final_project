import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../../admin/components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";
import {
  Eye,
  Clock,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

dayjs.locale("th");

function HistoryPostReport() {
  const [reportRecive, setReportRecive] = useState([]);
  const [detailPost, setDetailPost] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const id = localStorage.getItem("farmer_id");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const getReportReciveData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `reports/post/received/${id}`
      );
      console.log(res.data);
      setReportRecive(res.data.rows || []);
    } catch (err) {
      setReportRecive([]);
      console.log("Error to get ReportReciveDate : ", err);
    }
  };

  const getDetailPost = async (postId) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `post/${postId}`
      );
      setDetailPost(res.data.posts[0]);
      setIsDetailModalOpen(true);
    } catch (err) {
      console.log("Error get Detail Post : ", err);
    }
  };

  useEffect(() => {
    getReportReciveData();
  }, []);

  const pageData = reportRecive.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(reportRecive.length / itemsPerPage) || 1;

  const formatDate = (dateString) => {
    return dayjs(dateString)
      .locale("th")
      .add(543, "year")
      .format("D MMMM YYYY เวลา HH:mm");
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return "-";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ดำเนินการแล้ว":
        return "text-green-600 bg-green-50";
      case "ปฏิเสธ":
        return "text-red-600 bg-red-50";
      case "รอกดำเนินการ":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "ดำเนินการแล้ว":
        return <CheckCircle className="w-4 h-4" />;
      case "ปฏิเสธ":
        return <XCircle className="w-4 h-4" />;
      case "รอดำเนินการ":
        return <AlertTriangle className="w-4 h-4" />;
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

  const closeDetailModal = () => {
    setDetailPost([]);
    setIsDetailModalOpen(false);
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
              <a className="text-black">ประวัติการถูกรายงานโพสต์</a>
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
                  <th>เนื้อหาโพสต์</th>
                  <th>เหตุผลการรายงาน</th>
                  <th>สถานะการรายงาน</th>
                  <th>สถานะโพสต์</th>
                  <th className="text-center">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {pageData.length > 0 ? (
                  pageData.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td>
                        {dayjs(item.report_date)
                          .locale("th")
                          .add(543, "year")
                          .format("D MMMM YYYY")}
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="truncate" title={item.content}>
                            {truncateText(item.content, 40)}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="truncate" title={item.reason}>
                            {truncateText(item.reason, 30)}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm gap-1 ${getStatusColor(
                            item.status || "รอการตรวจสอบ"
                          )}`}>
                          {getStatusIcon(item.status || "รอการตรวจสอบ")}
                          {item.status || "รอการตรวจสอบ"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            item.is_visible === "ลบแล้ว" ||
                            item.is_visible === "ซ่อน"
                              ? "badge-error"
                              : "badge-success"
                          }`}>
                          {item.is_visible === "ลบแล้ว" ||
                          item.is_visible === "ซ่อน"
                            ? "ซ่อน"
                            : "แสดง"}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => openModal(item)}
                          className="btn btn-sm btn-ghost text-blue-600 hover:text-blue-800"
                          title="ดูรายละเอียดรายงาน">
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* <button
                            onClick={() => getDetailPost(item.post_id)}
                            className="btn btn-sm btn-ghost text-green-600 hover:text-green-800"
                            title="ดูรายละเอียดโพสต์">
                            <FileText className="w-4 h-4" />
                          </button> */}
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

        {reportRecive.length > itemsPerPage && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Report Detail Modal */}
      {isModalOpen && selectedReport && (
        <dialog open className="modal">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                รายละเอียดรายงานโพสต์
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="space-y-6">
                {/* Basic Info */}
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
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
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      <User className="w-4 h-4 mr-1" />
                      ผู้รายงาน
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedReport.reporter_name || "ไม่ระบุ"}
                    </p>
                  </div>
                </div> */}

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-bold  mb-1">
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
                    <label className="text-sm font-bold  mb-1 block">
                      สถานะการรายงาน
                    </label>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium gap-1 ${getStatusColor(
                        selectedReport.status || "รอการตรวจสอบ"
                      )}`}>
                      {getStatusIcon(selectedReport.status || "รอการตรวจสอบ")}
                      {selectedReport.status || "รอการตรวจสอบ"}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-bold  mb-1 block">
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
                  <label className="text-sm font-bold  mb-2 block">
                    เหตุผลในการรายงาน
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedReport.reason}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <div>
                  <label className="flex items-center text-sm font-bold  mb-2">
                    <FileText className="w-4 h-4 mr-1" />
                    เนื้อหาโพสต์ที่ถูกรายงาน
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {selectedReport.content || "ไม่มีข้อมูลเนื้อหาโพสต์"}
                    </p>
                  </div>
                </div>

                {/* Review Result */}
                <div>
                  <label className="text-sm font-bold  mb-2 block">
                    ผลการตรวจสอบ
                  </label>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-900 leading-relaxed">
                      {selectedReport.report_review || "อยู่ระหว่างการตรวจสอบ"}
                    </p>
                  </div>
                </div>

                {/* View Post Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      closeModal();
                      getDetailPost(selectedReport.post_id);
                    }}
                    className="btn btn-sm btn-outline btn-primary gap-2">
                    <FileText className="w-4 h-4" />
                    ดูรายละเอียดโพสต์
                  </button>
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

      {/* Post Detail Modal */}
      {isDetailModalOpen && detailPost && (
        <dialog open className="modal">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                รายละเอียดโพสต์
              </h3>
              <button
                onClick={closeDetailModal}
                className="text-gray-400 hover:text-gray-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="space-y-6">
                {/* Farm Info */}
                <div className="flex items-start gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                      <img
                        src={detailPost?.farm_img}
                        alt="Farm"
                        className="rounded-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMVY5TDEyIDJMNCA5VjIxSDE1SDE2SDIwWiIgc3Ryb2tlPSIjOTBBNEFFIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+Cg==";
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">
                      {detailPost.farm_name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(detailPost.create_at)}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        detailPost.is_visible === "ลบแล้ว" ||
                        detailPost.is_visible === "ซ่อน"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                      สถานะ:{" "}
                      {detailPost.is_visible === "ลบแล้ว" ||
                      detailPost.is_visible === "ซ่อน"
                        ? "ซ่อน"
                        : "แสดง"}
                    </span>
                  </div>
                </div>

                {/* Post Content */}
                <div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                      {detailPost.content}
                    </p>
                  </div>
                </div>

                {/* Post Image */}
                {detailPost.image_post && (
                  <div>
                    {/* <label className="flex items-center text-sm font-bold  mb-2">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      รูปภาพโพสต์
                    </label> */}
                    <div className="rounded-lg overflow-hidden">
                      <img
                        src={detailPost.image_post}
                        alt="โพสต์"
                        className="w-full h-auto max-h-96 object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeDetailModal}
                className="btn btn-sm btn-ghost">
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default HistoryPostReport;
