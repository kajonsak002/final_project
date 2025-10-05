import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import Pagination from "../components/Pagination";

import dayjs from "dayjs";
import "dayjs/locale/th";
import { Eye, X, Check } from "lucide-react";
import { useSummaryCount } from "../components/SummaryCountContext";
import Swal from "sweetalert2";

dayjs.locale("th");

function CommentReport() {
  const [reportData, setReportData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // pending | done
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

  const getHistoryData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "comment/get-comment-report/history"
      );
      setHistoryData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching report history:", err);
    }
  };

  useEffect(() => {
    getReportData();
    getHistoryData();
  }, []);

  const dataset = activeTab === "pending" ? reportData : historyData;
  const totalPages = Math.ceil(dataset.length / itemsPerPage);

  const pageData = dataset.slice(
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

  const handleProcessReport = async (action, manageAll = false) => {
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
          manageAll,
        }
      );
      toast.success(
        action === "approve"
          ? "อนุมัติการรายงานเรียบร้อย"
          : "ปฏิเสธการรายงานเรียบร้อย"
      );
      await fetchSummary();
      await getReportData();
      await getHistoryData();
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

  const toggleCommentVisibility = async (comment_id, nextStatus) => {
    const confirmMessage =
      nextStatus === "ซ่อน"
        ? "คุณต้องการซ่อนความคิดเห็นนี้หรือไม่?"
        : "คุณต้องการแสดงความคิดเห็นนี้หรือไม่?";

    const result = await Swal.fire({
      title: "ยืนยันการทำรายการ",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return; // ถ้ากดยกเลิก

    try {
      if (nextStatus === "ซ่อน") {
        await axios.post(
          import.meta.env.VITE_URL_API + "comment/hide-comment",
          {
            comment_id,
          }
        );
        Swal.fire("ซ่อนเรียบร้อย!", "", "success");
      } else {
        await axios.post(
          import.meta.env.VITE_URL_API + "comment/show-comment",
          {
            comment_id,
          }
        );
        Swal.fire("อัปเดตสถานะความคิดเห็นเรียบร้อย!", "", "success");
      }
      await getHistoryData();
    } catch (err) {
      Swal.fire(
        "เกิดข้อผิดพลาด!",
        "ไม่สามารถอัปเดตสถานะความคิดเห็นได้",
        "error"
      );
    }
  };

  return (
    <div>
      <div></div>
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

        {/* <div role="tablist" className="tabs tabs-boxed mb-4 gap-2">
          <button
            role="tab"
            className={`tab ${
              activeTab === "pending"
                ? "tab-active bg-green-500 text-white"
                : "bg-gray-200"
            } rounded-md`}
            onClick={() => {
              setActiveTab("pending");
              setCurrentPage(1);
            }}>
            รอดำเนินการ
          </button>

          <button
            role="tab"
            className={`tab ${
              activeTab === "done"
                ? "tab-active bg-green-500 text-white"
                : "bg-gray-200"
            } rounded-md`}
            onClick={() => {
              setActiveTab("done");
              setCurrentPage(1);
            }}>
            ดำเนินการแล้ว
          </button>
        </div> */}

        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>วันที่รายงาน</th>
              <th>เนื้อหาความคิดเห็น</th>
              <th>เหตุผล</th>
              <th>ผู้แจ้งรายงาน</th>
              {/* {activeTab === "done" && (
                <>
                  <th className="text-center">สถานะคอมเมนต์</th>
                  <th className="text-center">จัดการ</th>
                </>
              )} */}
              <th className="text-center">การดำเนินการ</th>
            </tr>
          </thead>

          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.report_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>
                    {dayjs(item.report_date)
                      .locale("th")
                      .add(543, "year")
                      .format("D MMMM YYYY")}
                  </td>
                  <td className="max-w-xs truncate">{item.content}</td>
                  <td className="max-w-xs truncate">{item.reason}</td>
                  <td>{item.farm_name}</td>

                  {activeTab === "done" && (
                    <>
                      <td className="text-center">
                        <span
                          className={`text-white text-xs px-2 py-1 rounded-full ${
                            item.comment_status === "แสดง"
                              ? "bg-green-500"
                              : item.comment_status === "ซ่อน"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}>
                          {item.comment_status}
                        </span>
                      </td>

                      {/* ✅ ปุ่มจัดการ ซ่อน/แสดง */}
                      <td className="text-center">
                        <button
                          className={`btn btn-xs ${
                            item.comment_status === "แสดง"
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                          onClick={() =>
                            toggleCommentVisibility(
                              item.comment_id,
                              item.comment_status === "แสดง" ? "ซ่อน" : "แสดง"
                            )
                          }>
                          {item.comment_status === "แสดง" ? "ซ่อน" : "แสดง"}
                        </button>
                      </td>
                    </>
                  )}

                  <td className="flex justify-center">
                    {activeTab === "done" ? (
                      <Eye
                        className="cursor-pointer"
                        onClick={(e) => {
                          const postUrl = `${window.location.origin}/admin/post-detail?postId=${item.post_id}&highlightComment=${item.comment_id}`;
                          window.open(postUrl, "_blank");
                        }}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer"
                        onClick={() => handleViewReportDetail(item)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={activeTab === "done" ? 8 : 6}
                  className="text-center py-4">
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

                {/* ปุ่มดูโพสต์ */}
                <div className="mb-4">
                  <div className="text-blue-700">
                    <p
                      className="cursor-pointer hover:text-blue-800 underline"
                      //  onClick={(e) => {
                      //   // เปิดหน้าโพสต์พร้อม highlight ความคิดเห็นในแท็บใหม่
                      //   const postUrl = `${window.location.origin}/admin/post-detail?postId=${selectedReport.post_id}&highlightComment=${selectedReport.comment_id}&viewMode=report`;
                      //   window.open(postUrl, "_blank");
                      // }
                      onClick={(e) => {
                        const postUrl = `${window.location.origin}/admin/post-detail?postId=${selectedReport.post_id}&highlightComment=${selectedReport.comment_id}&viewMode=report`;
                        window.open(postUrl, "_blank");
                      }}>
                      ดูความคิดเห็น
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  {activeTab === "done" ? (
                    <div className="flex items-center space-x-2">
                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          toggleCommentVisibility(
                            selectedReport.comment_id,
                            selectedReport.comment_status === "แสดง"
                              ? "ซ่อน"
                              : "แสดง"
                          )
                        }
                        disabled={isProcessing}>
                        {selectedReport.comment_status === "แสดง"
                          ? "ซ่อนความคิดเห็น"
                          : "แสดงความคิดเห็น"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2"></div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      className="btn btn-outline btn-error hover:text-white"
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
                  className="btn bg-green-500 text-white"
                  onClick={() => handleProcessReport("reject")}
                  disabled={isProcessing || !reviewText.trim()}>
                  จัดการรายงานนี้
                </button>
                <button
                  className="btn bg-red-500 text-white"
                  onClick={() => handleProcessReport("reject", true)}
                  disabled={isProcessing || !reviewText.trim()}>
                  จัดการทุกรายงาน
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
