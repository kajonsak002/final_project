import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../components/Pagination";

import dayjs from "dayjs";
import "dayjs/locale/th";
import { Eye, X, Check } from "lucide-react";
import { useSummaryCount } from "../components/SummaryCountContext";

dayjs.locale("th");

function CommentReport() {
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isReportModal, setIsReportModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showRejectInput, setShowRejectInput] = useState(false);
  const itemsPerPage = 12;

  const { fetchSummary } = useSummaryCount();

  const getReportData = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "comment/get-comment-report"
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

  const handleViewReportDetail = (reportData) => {
    setSelectedReport(reportData);
    setIsReportModal(true);
    setReviewText("");
    setShowRejectInput(false);
  };

  const handleCancelReject = () => {
    setShowRejectInput(false);
    setReviewText("");
  };

  const handleProcessReport = async (action) => {
    if (!selectedReport) return;
    setIsProcessing(true);
    try {
      await axios.post(
        import.meta.env.VITE_URL_API + "comment/manage-comment",
        {
          report_id: selectedReport.report_id,
          comment_id: selectedReport.comment_id,
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
      setSelectedReport(null);
      setIsReportModal(false);
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

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
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
              <a className="text-black">จัดการรายงานความคิดเห็น</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 w-full">
        <h2 className="text-xl font-bold mb-2">จัดการรายงานความคิดเห็น</h2>
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>เนื้อหาความคิดเห็น</th>
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
                  <td>{item.content}</td>
                  <td>{item.reason}</td>
                  <td>{dayjs(item.report_date).format("D MMMM YYYY")}</td>
                  <td>{item.farm_name}</td>
                  <td className="flex justify-center">
                    <Eye
                      className="cursor-pointer"
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

        {isReportModal && selectedReport && (
          <dialog open className="modal">
            <div className="modal-box max-w-2xl">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setSelectedReport(null);
                  setIsReportModal(false);
                }}>
                ✕
              </button>

              <h3 className="font-bold text-lg mb-4">
                รายละเอียดการรายงานความคิดเห็น
              </h3>

              <div className="space-y-4">
                {/* Post Content */}
                <div className="flex flex-row">
                  <div className="flex-1">
                    <h4 className="font-semibold text-md mb-2">
                      เนื้อหาความคิดเห็น:
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedReport.content}
                    </p>
                  </div>
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

                  {/* {selectedReport.reporter_id && (
                    <div>
                      <label className="font-semibold text-sm">
                        ID ผู้รายงาน:
                      </label>
                      <p className="text-gray-700 mt-1">
                        {selectedReport.reporter_id}
                      </p>
                    </div>
                  )} */}

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

                  {/* {selectedReport.create_at && (
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
                  )} */}
                </div>

                {/* {selectedReport.additional_details && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">
                      รายละเอียดเพิ่มเติม:
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {selectedReport.additional_details} 
                    </p>
                  </div>
                )} */}

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
                  className="btn bg-red-500 text-white"
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

export default CommentReport;
