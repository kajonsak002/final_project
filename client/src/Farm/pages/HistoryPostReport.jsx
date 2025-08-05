import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../../admin/components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Eye } from "lucide-react";

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
              <a className="text-gray-500">ประวัติการถูกรายงานโพสต์</a>
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
          <div className="modal-box">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => {
                setIsModalOpen(false);
                setDetailPost([]);
              }}>
              ✕
            </button>
            <pre>{JSON.stringify(detailPost, null, 2)}</pre>
            <div className="modal-action">
              <button
                className="btn bg-green-500 text-white"
                onClick={() => {
                  setIsModalOpen(false);
                  setDetailPost([]);
                }}>
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
