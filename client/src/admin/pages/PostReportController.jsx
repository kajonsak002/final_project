import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../components/Pagination";

import dayjs from "dayjs";
import "dayjs/locale/th";
import { Eye, Check, X } from "lucide-react";
import { useSummaryCount } from "../components/SummaryCountContext";

dayjs.locale("th");

function PostReportController() {
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectReport] = useState(null);
  const [IsreportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const itemsPerPage = 12;
  const { fetchSummary } = useSummaryCount();

  const getReportData = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "post/get-post-report"
      );
      setReportData(res.data.data);
    } catch (err) {
      console.error("Error fetching report data:", err);
    }
  };

  useEffect(() => {
    getReportData();
  }, []);

  const totalPages = Math.ceil(reportData.length / itemsPerPage);

  const pageData = reportData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleViewReportDetail = (post) => {
    setSelectReport(post);
    setIsReportModalOpen(true);
    setReviewText("");
    setShowRejectInput(false);
  };

  const handleProcessReport = async (action) => {
    if (!selectedReport) return;
    setIsProcessing(true);
    try {
      await axios.post(
        import.meta.env.VITE_URL_API + "post/manage-report-post",
        {
          report_id: selectedReport.report_id,
          post_id: selectedReport.post_id,
          action,
          report_review: action === "reject" ? reviewText : undefined,
        }
      );
      toast.success(
        action === "approve"
          ? "อนุมัติการรายงานเรียบร้อย"
          : "ปฏิเสธการรายงานเรียบร้อย"
      );
      await fetchSummary();
      await getReportData();
      setSelectReport(null);
      setIsReportModalOpen(false);
      setShowRejectInput(false);
      setReviewText("");
    } catch (err) {
      toast.error(
        action === "approve"
          ? "เกิดข้อผิดพลาดในการอนุมัติการรายงาน"
          : "เกิดข้อผิดพลาดในการปฏิเสธการรายงาน"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectReport = () => {
    setShowRejectInput(true);
  };

  const handleCancelReject = () => {
    setShowRejectInput(false);
    setReviewText("");
  };

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <a>หน้าเเรก</a>
          </li>
          <li>จัดการรายงานโพสต์</li>
        </ul>
      </div>

      <div className="card bg-base-100 w-full shadow-sm mt-4">
        <div className="card-body">
          <div className="flex justify-between items-center flex-wrap gap-4"></div>
          {/* <SearchBar value={searchTerm} onChange={setSearchTerm} /> */}
        </div>
      </div>

      <div className="mt-3 w-full">
        <h2 className="text-xl font-bold mb-2">จัดการรายงานโพสต์</h2>
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>รายละเอียดโพสต์</th>
              <th>เหตุผล</th>
              <th>วันที่รายงาน</th>
              <th>ผู้แจ้งรายงาน</th>
              <th className="text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.report_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>
                    <div className="max-w-xs truncate">{item.content}</div>
                  </td>
                  <td>{item.reason}</td>
                  <td>{dayjs(item.report_date).format("D MMMM YYYY")}</td>
                  <td>{item.farm_name}</td>
                  <td className="flex justify-center">
                    <Eye
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => handleViewReportDetail(item)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  ไม่พบข้อมูลรายงาน
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {IsreportModalOpen && selectedReport && (
          <dialog open className="modal">
            <div className="modal-box max-w-2xl">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setSelectReport(null);
                  setIsReportModalOpen(false);
                }}>
                ✕
              </button>

              <h3 className="font-bold text-lg mb-4">
                รายละเอียดการรายงานโพสต์
              </h3>

              <div className="space-y-4">
                {/* Post Content */}
                <div className="flex flex-row">
                  <div className="flex-1">
                    <h4 className="font-semibold text-md mb-2">
                      เนื้อหาโพสต์:
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedReport.content}
                    </p>
                  </div>
                  {selectedReport.image_post && (
                    <div className="flex-1 ml-4">
                      <img
                        src={selectedReport.image_post}
                        alt="Post image"
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-sm">
                      เหตุผลการรายงาน:
                    </label>
                    <p className="text-gray-700 mt-1">
                      {selectedReport.reason}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-sm">
                      วันที่รายงาน:
                    </label>
                    <p className="text-gray-700 mt-1">
                      {dayjs(selectedReport.report_date).format(
                        "D MMMM YYYY HH:mm"
                      )}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-sm">
                      ผู้แจ้งรายงาน:
                    </label>
                    <p className="text-gray-700 mt-1">
                      {selectedReport.farm_name}
                    </p>
                  </div>

                  {selectedReport.reporter_id && (
                    <div>
                      <label className="font-semibold text-sm">
                        ID ผู้รายงาน:
                      </label>
                      <p className="text-gray-700 mt-1">
                        {selectedReport.reporter_id}
                      </p>
                    </div>
                  )}

                  {selectedReport.post_author && (
                    <div>
                      <label className="font-semibold text-sm">
                        เจ้าของโพสต์:
                      </label>
                      <p className="text-gray-700 mt-1">
                        {selectedReport.post_author}
                      </p>
                    </div>
                  )}

                  {selectedReport.post_date && (
                    <div>
                      <label className="font-semibold text-sm">
                        วันที่โพสต์:
                      </label>
                      <p className="text-gray-700 mt-1">
                        {dayjs(selectedReport.post_date).format(
                          "D MMMM YYYY HH:mm"
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {selectedReport.additional_details && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      รายละเอียดเพิ่มเติม:
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {selectedReport.additional_details}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    className="btn btn-outline btn-error"
                    onClick={() => setShowRejectInput(true)}
                    disabled={isProcessing}>
                    <X size={16} />
                    {isProcessing ? "กำลังประมวลผล..." : "ปฏิเสธการรายงาน"}
                  </button>
                  <button
                    className="btn bg-green-500 text-white"
                    onClick={() => handleProcessReport("approve")}
                    disabled={isProcessing}>
                    <Check size={16} />
                    {isProcessing ? "กำลังประมวลผล..." : "อนุมัติการรายงาน"}
                  </button>
                </div>
              </div>
            </div>
          </dialog>
        )}

        {showRejectInput && (
          <dialog open className="modal">
            <div className="modal-box w-full max-w-md">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleCancelReject}
                disabled={isProcessing}>
                ✕
              </button>
              <h4 className="font-semibold mb-2 text-lg text-red-600">
                ระบุเหตุผลการปฏิเสธรายงาน
              </h4>
              <textarea
                className="textarea textarea-bordered w-full mb-4"
                rows={3}
                placeholder="ระบุหมายเหตุหรือรายละเอียดการดำเนินการ (ถ้ามี)"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                disabled={isProcessing}
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="btn btn-outline"
                  onClick={handleCancelReject}
                  disabled={isProcessing}>
                  ยกเลิก
                </button>
                <button
                  className="btn btn-error text-white"
                  onClick={() => handleProcessReport("reject")}
                  disabled={isProcessing || !reviewText.trim()}>
                  ยืนยันปฏิเสธ
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default PostReportController;
