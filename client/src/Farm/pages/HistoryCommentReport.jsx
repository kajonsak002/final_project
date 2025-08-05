import axios from "axios";
import React, { useEffect, useState } from "react";
import Pagination from "../../admin/components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Eye } from "lucide-react";

dayjs.locale("th");

function HistoryCommentReport() {
  const [reportRecive, setReportRecive] = useState([]);
  const id = localStorage.getItem("farmer_id");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const getReportReciveData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `reports/comment/received/${id}`
      );
      console.log(res.data);
      setReportRecive(res.data.rows);
    } catch (err) {
      console.log("Error to get ReportReciveDate : ", err);
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
              <a className="text-gray-500">ประวัติการถูกรายงานความคิดเห็น</a>
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
              <th>เนื้อหา</th>
              <th>เหตุผล</th>
              <th>วันที่รายงาน</th>
              {/* <th className="text-center">ดูรายละเอียดโพสต์</th> */}
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  {/* <td>{item.farm_name}</td> */}
                  <td>{item.content}</td>
                  <td>{item.reason}</td>
                  <td>
                    {dayjs(item.report_date)
                      .locale("th")
                      .add(543, "year")
                      .format("D MMMM YYYY")}
                  </td>
                  {/* <td className="flex justify-center">
                    <Eye />
                  </td> */}
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
    </div>
  );
}

export default HistoryCommentReport;
