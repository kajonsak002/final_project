import React, { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, EllipsisVertical, Eye } from "lucide-react";
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
  const [reason, setReason] = useState("");
  const [selectedNews, setSelectedNews] = useState([]);
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

  // Bulk hide
  const handleHide = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_URL_API}news/hide/bulk`,
        { ids: selectedNews, reason, action: "hide" }
      );
      toast.success(response.data.msg);
      setShowHideModal(false);
      setReason("");
      setSelectedNews([]);
      viewMode === "all" ? fetchAllNews() : fetchMyNews();
    } catch (error) {
      console.error("Error hiding news:", error);
      toast.error("เกิดข้อผิดพลาดในการซ่อนข่าวสาร");
    }
  };

  // Bulk show
  const handleShow = async (ids) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_URL_API}news/hide/bulk`,
        { ids, action: "show", reason: null }
      );
      toast.success(response.data.msg);
      setSelectedNews([]);
      viewMode === "all" ? fetchAllNews() : fetchMyNews();
    } catch (error) {
      console.error("Error showing news:", error);
      toast.error("เกิดข้อผิดพลาดในการแสดงข่าวสาร");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ซ่อน":
        return "text-green-600 bg-green-50";
      case "แสดง":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
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

        {/* Bulk action bar */}
        {selectedNews.length > 0 && (
          <div className="flex gap-2 px-6 py-2 bg-base-100  rounded-md mb-2">
            <button
              onClick={() => setShowHideModal(true)}
              className="btn btn-sm bg-yellow-500 text-white">
              ซ่อนที่เลือก ({selectedNews.length})
            </button>
            <button
              onClick={() => handleShow(selectedNews)}
              className="btn btn-sm bg-green-600 text-white">
              แสดงที่เลือก ({selectedNews.length})
            </button>
          </div>
        )}

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
              <div className="mt-3 w-full overflow-x-auto">
                <table className="table bg-base-100 w-full">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={
                            selectedNews.length === pageData.length &&
                            pageData.length > 0
                          }
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedNews(
                                pageData.map((news) => news.news_id)
                              );
                            } else {
                              setSelectedNews([]);
                            }
                          }}
                        />
                      </th>
                      <th>#</th>
                      <th>หัวข้อข่าว</th>
                      {viewMode === "all" && <th>เจ้าของ</th>}
                      <th>วันที่โพสต์</th>
                      <th>วันที่แก้ไขล่าสุด</th>
                      <th>แหล่งที่มา</th>
                      <th>สถานะ</th>
                      <th className="text-center">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.length > 0 ? (
                      pageData.map((news, index) => (
                        <tr key={news.news_id}>
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm"
                              checked={selectedNews.includes(news.news_id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedNews([
                                    ...selectedNews,
                                    news.news_id,
                                  ]);
                                } else {
                                  setSelectedNews(
                                    selectedNews.filter(
                                      (id) => id !== news.news_id
                                    )
                                  );
                                }
                              }}
                            />
                          </td>
                          <td>
                            {index + 1 + (currentPage - 1) * itemsPerPage}
                          </td>
                          <td className="max-w-50 truncate">{news.title}</td>
                          {viewMode === "all" && (
                            <td className="max-w-xs truncate">
                              {news.owner_name || "-"}
                            </td>
                          )}
                          <td>{formatDate(news.created_at)}</td>
                          <td className="text-center">
                            {news.updated_at !== null
                              ? formatDate(news.updated_at)
                              : "-"}
                          </td>
                          <td className="max-w-xs truncate">
                            {news.source_ref || "-"}
                          </td>
                          <td className="">
                            <span
                              className={`badge badge-sm gap-1 ${getStatusColor(
                                news.status
                              )}`}>
                              {news.status}
                            </span>
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
                            {viewMode === "mine" && (
                              <button
                                onClick={() =>
                                  navigate(`/admin/edit-news/${news.news_id}`)
                                }
                                className="btn btn-sm btn-warning flex items-center gap-1 text-white">
                                <Edit size={18} />
                              </button>
                            )}

                            <details className="dropdown dropdown-end">
                              <summary className="btn btn-sm bg-green-500 ">
                                <EllipsisVertical className="w-5" />
                              </summary>
                              <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-40 p-2 shadow-md text-sm">
                                {news.status === "แสดง" ? (
                                  <li
                                    onClick={() => {
                                      setSelectedNews([news.news_id]);
                                      setShowHideModal(true);
                                    }}>
                                    ซ่อน
                                  </li>
                                ) : (
                                  <li
                                    onClick={() => handleShow([news.news_id])}>
                                    แสดง
                                  </li>
                                )}
                              </ul>
                            </details>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={viewMode === "all" ? 8 : 7}
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

      {/* Modal */}
      {showHideModal && (
        <dialog open className="modal">
          <div className="modal-box p-6 rounded-2xl shadow-lg relative bg-white">
            <h3 className="font-bold text-2xl mb-6 text-gray-800">
              ซ่อนข่าวสาร
            </h3>
            <form onSubmit={handleHide} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  ข่าวที่เลือก
                </label>
                <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                  {newsList
                    .filter((news) => selectedNews.includes(news.news_id))
                    .map((news) => (
                      <p
                        key={news.news_id}
                        className="text-gray-900 break-words">
                        • {news.title}
                      </p>
                    ))}
                  {selectedNews.length === 0 && (
                    <p className="text-gray-500">ยังไม่ได้เลือกข่าว</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  สาเหตุ
                </label>
                <textarea
                  className="textarea textarea-bordered w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg"
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="กรุณาระบุสาเหตุ..."
                  maxLength={255}
                />
                <div className="text-sm text-gray-500 mt-1 text-right">
                  {reason.length}/255
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!reason.trim() || selectedNews.length === 0}
                  className={`btn px-6 ${
                    reason.trim() && selectedNews.length > 0
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}>
                  ยืนยัน
                </button>
                <button
                  type="button"
                  className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 border-none px-6"
                  onClick={() => setShowHideModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </form>
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-500 hover:text-gray-700"
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
