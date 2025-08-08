import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../../admin/components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Eye, Clock } from "lucide-react";

dayjs.locale("th");

function HistoryPostReport() {
  const [reportRecive, setReportRecive] = useState([]);
  const [detailPost, setDetailPost] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = localStorage.getItem("farmer_id");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const getReportReciveData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `reports/post/received/${id}`
      );
      console.log(res.data);
      setReportRecive(res.data.rows);
    } catch (err) {
      console.log("Error to get ReportReciveDate : ", err);
    }
  };

  const getDetailPost = async (id) => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + `post/${id}`);
      setDetailPost(res.data.posts[0]);
      setIsModalOpen(true);
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

  const totalPages = Math.ceil(reportRecive.length / itemsPerPage);

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("th").format("D MMMM YYYY เวลา HH:mm");
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
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              {/* <th>ชื่อผู้รายงาน</th> */}
              <th>เหตุผล</th>
              <th>วันที่รายงาน</th>
              <th>การดำเนินการ</th>
              <th className="text-center">รายละเอียดโพสต์</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  {/* <td>{item.reporter_name}</td> */}
                  <td>{item.reason}</td>
                  <td>
                    {dayjs(item.report_date)
                      .locale("th")
                      .add(543, "year")
                      .format("D MMMM YYYY")}
                  </td>
                  <td>{item.report_review}</td>
                  <td className="flex justify-center">
                    <Eye
                      className="cursor-pointer"
                      onClick={() => getDetailPost(item.post_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
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

      {isModalOpen && (
        <dialog open className="modal">
          <div
            key={detailPost.post_id}
            className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-green-50 hover:shadow-xl transition-all duration-300">
            {/* ปุ่มปิด */}
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10"
              onClick={() => setIsModalOpen(false)}>
              ✕
            </button>

            {/* Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                      <img
                        src={detailPost?.farm_img}
                        alt="Farm"
                        className="rounded-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {detailPost.farm_name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(detailPost.create_at)}
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-30 h-10 rounded-2xl p-2 text-center text-white bg-green-500">
                      <p className="">สถานะ {detailPost.is_visible}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                {detailPost.content}
              </div>

              {/* Image */}
              {detailPost.image_post && (
                <div className="mb-4">
                  <img
                    src={detailPost.image_post}
                    alt="โพสต์"
                    className="w-full h-120 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default HistoryPostReport;
