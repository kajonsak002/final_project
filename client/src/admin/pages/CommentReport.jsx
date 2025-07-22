import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../components/Pagination";

import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

function CommentReport() {
  const [reportData, setReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
                  <td className="text-center">-</td>
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
      </div>
    </div>
  );
}

export default CommentReport;
