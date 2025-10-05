import React, { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import Pagination from "../components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

function NewsHistory() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewMode, setViewMode] = useState("all"); // 'all' | 'mine'
  const [showHideModal, setShowHideModal] = useState(false);
  const [newsId, setNewsId] = useState(null);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();

  const admin_id = "1";

  useEffect(() => {
    setLoading(true);
    if (viewMode === "all") {
      fetchAllNews();
    } else {
      fetchMyNews();
    }
  }, [viewMode]);

  const fetchMyNews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API}news/my-news/${admin_id}/admin`
      );
      setNewsList(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      setLoading(false);
    }
  };

  const fetchAllNews = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API}news-manage`
      );
      setNewsList(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูลทั้งหมด");
      setLoading(false);
    }
  };

  const handleDelete = async (newsId) => {
    if (window.confirm("คุณต้องการลบข่าวสารนี้หรือไม่?")) {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_URL_API}news/${newsId}`
        );
        toast.success(response.data.msg);
        if (viewMode === "all") {
          fetchAllNews();
        } else {
          fetchMyNews();
        }
      } catch (error) {
        console.error("Error deleting news:", error);
        toast.error("เกิดข้อผิดพลาดในการลบข่าวสาร");
      }
    }
  };

  const formatDate = (dateString) => {
    return dayjs(dateString)
      .locale("th")
      .add(543, "year")
      .format("D MMMM YYYY");
  };

  const pageData = newsList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(newsList.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  const handleHide = async () => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_URL_API}news/hide/${newsId}`,
        { reason }
      );
      toast.success(response.data.msg);
      if (viewMode === "all") {
        fetchAllNews();
      } else {
        fetchMyNews();
      }
    } catch (error) {
      console.error("Error hiding news:", error);
      toast.error("เกิดข้อผิดพลาดในการซ่อนข่าวสาร");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Breadcrumb */}
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
                <a className="text-black">ประวัติข่าวสารของฉัน</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                จัดการข่าวสาร
              </h1>
              {/* <button
                onClick={() => navigate("/admin/add-news")}
                className="btn btn-primary flex items-center gap-2">
                <Plus size={16} />
                เพิ่มข่าวสารใหม่
              </button> */}
            </div>
          </div>
          <div className="px-6 py-3 flex items-center gap-2">
            <div role="tablist" className="tabs tabs-boxed">
              <button
                role="tab"
                className={`tab ${viewMode === "all" ? "tab-active" : ""}`}
                onClick={() => {
                  setCurrentPage(1);
                  setViewMode("all");
                }}>
                ทั้งหมด
              </button>
              <button
                role="tab"
                className={`tab ${viewMode === "mine" ? "tab-active" : ""}`}
                onClick={() => {
                  setCurrentPage(1);
                  setViewMode("mine");
                }}>
                ของฉัน
              </button>
            </div>
          </div>
        </div>

        {/* News List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {newsList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  ยังไม่มีข่าวสารที่คุณโพสต์
                </p>
                <button
                  onClick={() => navigate("/admin/add-news")}
                  className="btn btn-primary mt-4">
                  เพิ่มข่าวสารแรก
                </button>
              </div>
            ) : (
              <div className="mt-3 w-full">
                <table className="table bg-base-100 w-full">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>หัวข้อข่าว</th>
                      {viewMode === "all" && <th>เจ้าของ</th>}
                      <th>วันที่โพสต์</th>
                      <th>วันที่แก้ไขล่าสุด</th>
                      <th>แหล่งที่มา</th>
                      <th className="text-center">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.length > 0 ? (
                      pageData.map((news, index) => (
                        <tr key={news.news_id}>
                          <td>
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="max-w-xs truncate">{news.title}</td>
                          {viewMode === "all" && (
                            <td className="max-w-xs truncate">
                              <div className="flex items-center gap-2">
                                <span>{news.owner_name || "-"}</span>
                              </div>
                            </td>
                          )}
                          <td>{formatDate(news.created_at)}</td>
                          <td>{formatDate(news.updated_at)}</td>
                          <td className="max-w-xs truncate">
                            {news.source_ref || "-"}
                          </td>

                          <td className="flex justify-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/news/detail/${news.news_id}`)
                              }
                              className="btn btn-sm btn-outline flex items-center gap-1"
                              title="ดูข่าวสาร">
                              <Eye size={18} />
                            </button>
                            {viewMode !== "all" ? (
                              <>
                                <button
                                  onClick={() =>
                                    navigate(`/admin/edit-news/${news.news_id}`)
                                  }
                                  className="btn btn-sm btn-warning flex items-center gap-1 text-white">
                                  <Edit size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setShowHideModal(true);
                                    setNewsId(news.news_id);
                                  }}
                                  className="btn btn-sm btn-warning flex items-center gap-1 text-white">
                                  ซ่อน
                                </button>
                              </>
                            )}
                            {/* <button
                              onClick={() => handleDelete(news.news_id)}
                              className="btn btn-sm bg-red-500 flex items-center gap-1 text-white">
                              <Trash2 size={18} />
                            </button> */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={viewMode === "all" ? 7 : 6}
                          className="text-center py-4">
                          ไม่พบข้อมูล
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {pageData.length > 15 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {showHideModal && (
        <dialog open className="modal">
          <div className="modal-box p-6 rounded-2xl shadow-lg">
            <h3 className="font-bold text-xl mb-4">ซ่อนข่าวสาร</h3>

            <form onSubmit={handleHide} className="space-y-4">
              <div className="form-control">
                <label className="label my-2">
                  <span className="label-text text-black font-medium">
                    สาเหตุ
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full text-black focus:outline-none"
                  rows={4} // กำหนดความสูง (จำนวนบรรทัดเริ่มต้น)
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="กรุณาระบุสาเหตุ..."
                  maxLength={255}></textarea>
              </div>
            </form>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="btn bg-green-500 text-white hover:bg-green-600 border-none"
                onClick={handleHide}>
                ยืนยัน
              </button>
              <button
                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 border-none"
                onClick={() => setShowHideModal(false)}>
                ยกเลิก
              </button>
            </div>

            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-white"
              onClick={() => setShowHideModal(false)}>
              ✕
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default NewsHistory;
