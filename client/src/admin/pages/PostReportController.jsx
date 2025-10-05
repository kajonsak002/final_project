import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import Pagination from "../components/Pagination";

import dayjs from "dayjs";
import "dayjs/locale/th";
import { Eye, Check, X, Clock } from "lucide-react";
import { useSummaryCount } from "../components/SummaryCountContext";
import DetailPost from "./DetailPost";
import Swal from "sweetalert2";

dayjs.locale("th");

function PostReportController() {
  const [reportData, setReportData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [activeTab, setActiveTab] = useState("pending"); // pending | done
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectReport] = useState(null);
  const [IsreportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [detailPost, setDetailPost] = useState(null);
  const [isDetailPostOpen, setIsDetailPostOpen] = useState(false);
  // const [manageAll, setManageAll] = useState(false);
  const [isConfirmManageAllOpen, setIsConfirmManageAllOpen] = useState(false);
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

  const getHistoryData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "post/get-post-report/history"
      );
      setHistoryData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching post report history:", err);
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

  const handleViewReportDetail = (post) => {
    setSelectReport(post);
    setIsReportModalOpen(true);
    setReviewText("");
    setShowRejectInput(false);
  };

  const handleProcessReport = async (action, manageAllParam = false) => {
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
          manageAll: manageAllParam,
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
      setSelectReport(null);
      setIsReportModalOpen(false);
      setIsConfirmManageAllOpen(false);
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

  const togglePostVisibility = async (post_id, nextStatus) => {
    const confirmMessage =
      nextStatus === "ซ่อน"
        ? "คุณต้องการซ่อนโพสต์นี้หรือไม่?"
        : "คุณต้องการแสดงโพสต์นี้หรือไม่?";

    const result = await Swal.fire({
      title: "ยืนยันการทำรายการ",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      if (nextStatus === "ซ่อน") {
        await axios.post(import.meta.env.VITE_URL_API + "post/hide-post", {
          post_id,
        });
        Swal.fire("ซ่อนเรียบร้อย!", "", "success");
      } else {
        await axios.post(import.meta.env.VITE_URL_API + "post/show-post", {
          post_id,
        });
        Swal.fire("อัปเดตสถานะโพสต์เรียบร้อย!", "", "success");
      }
      await getHistoryData();
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถอัปเดตสถานะโพสต์ได้", "error");
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
              <a className="text-black">จัดการรายงานโพสต์</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 w-full">
        <h2 className="text-xl font-bold mb-2">จัดการรายงานโพสต์</h2>

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
              <th>รายละเอียดโพสต์</th>
              <th>เหตุผล</th>
              <th>ผู้แจ้งรายงาน</th>
              {/* {activeTab === "done" && (
                <>
                  <th className="text-center">สถานะโพสต์</th>
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
                  <td>
                    <div className="max-w-xs truncate">{item.content}</div>
                  </td>
                  <td className="max-w-xs truncate">{item.reason}</td>
                  <td>{item.reporter_farm_name}</td>

                  {activeTab === "done" && (
                    <>
                      <td className="text-center">
                        <span
                          className={`text-white text-xs px-2 py-1 rounded-full ${
                            item.post_status === "เเสดง"
                              ? "bg-green-500"
                              : item.post_status === "ซ่อน"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}>
                          {item.post_status}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className={`btn btn-xs ${
                            item.post_status === "เเสดง"
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                          onClick={() =>
                            togglePostVisibility(
                              item.post_id,
                              item.post_status === "เเสดง" ? "ซ่อน" : "แสดง"
                            )
                          }>
                          {item.post_status === "เเสดง" ? "ซ่อน" : "แสดง"}
                        </button>
                      </td>
                    </>
                  )}

                  <td className="flex justify-center">
                    {activeTab === "done" ? (
                      <Eye
                        className="cursor-pointer hover:text-blue-500"
                        onClick={() => {
                          const postUrl = `${window.location.origin}/admin/post-detail?postId=${item.post_id}&viewMode=report`;
                          window.open(postUrl, "_blank");
                        }}
                      />
                    ) : (
                      <Eye
                        className="cursor-pointer hover:text-blue-500"
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

        {activeTab !== "done" && IsreportModalOpen && selectedReport && (
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

                  {selectedReport.post_owner_farm_name && (
                    <div>
                      <label className="font-semibold text-sm">
                        เจ้าของโพสต์:
                      </label>
                      <p className="text-gray-700 mt-1">
                        {selectedReport.post_owner_farm_name}
                      </p>
                    </div>
                  )}

                  {selectedReport.post_create_at && (
                    <div>
                      <label className="font-semibold text-sm">
                        วันที่โพสต์:
                      </label>
                      <p className="text-gray-700 mt-1">
                        {dayjs(selectedReport.post_create_at).format(
                          "D MMMM YYYY HH:mm"
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-blue-700">
                    <p
                      className="cursor-pointer hover:text-blue-800 underline"
                      //  onClick={(e) => {
                      //   // เปิดหน้าโพสต์ในแท็บใหม่
                      //   const postUrl = `${window.location.origin}/admin/post-detail?postId=${selectedReport.post_id}`;
                      //   window.open(postUrl, "_blank");
                      // }
                      onClick={() => {
                        const postUrl = `${window.location.origin}/admin/post-detail?postId=${selectedReport.post_id}&viewMode=report`;
                        window.open(postUrl, "_blank");
                      }}>
                      ดูรายละเอียดโพสต์
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  {activeTab === "done" ? (
                    <div className="flex items-center space-x-2">
                      <button
                        className="btn btn-outline"
                        onClick={() =>
                          togglePostVisibility(
                            selectedReport.post_id,
                            selectedReport.post_status === "เเสดง"
                              ? "ซ่อน"
                              : "แสดง"
                          )
                        }
                        disabled={isProcessing}>
                        {selectedReport.post_status === "เเสดง"
                          ? "ซ่อนโพสต์"
                          : "แสดงโพสต์"}
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
                      onClick={() => handleProcessReport("approve", true)}
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
                  จัดการรายงานนี่
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

        {isDetailPostOpen && selectedReport && (
          // <dialog open className="modal">
          //   <div className="modal-box max-w-3xl bg-white shadow-2xl rounded-xl overflow-hidden p-6">
          //     <button
          //       className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          //       onClick={() => setIsDetailPostOpen(false)}>
          //       ✕
          //     </button>
          //     <h3 className="font-bold text-xl mb-4">รายละเอียดโพสต์</h3>
          //     <div className="flex flex-col md:flex-row gap-6">
          //       {/* รูปภาพโพสต์ */}
          //       {selectedReport.image_post && (
          //         <div className="md:w-1/2 flex justify-center items-center">
          //           <img
          //             src={selectedReport.image_post}
          //             alt="โพสต์"
          //             className="rounded-lg shadow-lg max-h-64 object-contain"
          //           />
          //         </div>
          //       )}
          //       {/* ข้อมูลโพสต์ */}
          //       <div className="md:w-1/2">
          //         <div className="mb-2">
          //           <span className="font-semibold">เนื้อหาโพสต์:</span>
          //           <p className="text-gray-700 mt-1">
          //             {selectedReport.content || "ไม่มีเนื้อหา"}
          //           </p>
          //         </div>
          //         <div className="mb-2">
          //           <span className="font-semibold">เจ้าของโพสต์:</span>
          //           <p className="text-gray-700 mt-1">
          //             {selectedReport.post_owner_farm_name || "-"}
          //           </p>
          //         </div>
          //         <div className="mb-2">
          //           <span className="font-semibold">วันที่โพสต์:</span>
          //           <p className="text-gray-700 mt-1">
          //             {selectedReport.post_create_at
          //               ? dayjs(selectedReport.post_create_at).format(
          //                   "D MMMM YYYY HH:mm"
          //                 )
          //               : "-"}
          //           </p>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </dialog>
          <>
            <DetailPost />
          </>
        )}

        {isConfirmManageAllOpen && selectedReport && (
          <dialog open className="modal">
            <div className="modal-box w-full max-w-md">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => setIsConfirmManageAllOpen(false)}
                disabled={isProcessing}>
                ✕
              </button>
              <h4 className="font-semibold mb-2 text-lg">ยืนยันการอนุมัติ</h4>
              <p className="text-sm text-gray-700 mb-4">
                ต้องการจัดการรายงานทั้งหมดของโพสต์นี้หรือเฉพาะรายการนี้?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  className="btn btn-outline"
                  onClick={() => handleProcessReport("approve", false)}
                  disabled={isProcessing}>
                  จัดการรายการนี้
                </button>
                <button
                  className="btn bg-green-600 text-white"
                  onClick={() => handleProcessReport("approve", true)}
                  disabled={isProcessing}>
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

export default PostReportController;
