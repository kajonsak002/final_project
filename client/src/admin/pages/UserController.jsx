import axios from "axios";
import { Search, User, Eye, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

function UserController() {
  const [farms, setFarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState([]);
  const dataPerPage = 7;

  const getFarm = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "allFarms");
      setFarms(res.data);
      // console.log(res.data);
    } catch (err) {
      console.log("Error get farm : ", err);
    }
  };

  useEffect(() => {
    getFarm();
  }, []);

  useEffect(() => {
    const indexOfLast = currentPage * dataPerPage;
    const indexOfFirst = indexOfLast - dataPerPage;
    setPageData(farms.slice(indexOfFirst, indexOfLast));
  }, [currentPage, farms]);

  const totalPages = Math.ceil(farms.length / dataPerPage);

  return (
    <>
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
              <a className="text-gray-500">จัดการฟาร์ม</a>
            </li>
          </ul>
        </div>
      </div>

      {/* <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between space-x-3 mb-1">
          <h2 className="text-xl font-bold">ค้นหา</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาจากหัวข้อหรือเนื้อหา..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl
          focus:ring-2 focus:ring-green-500 focus:border-transparent
          transition-all duration-200 bg-gray-50 focus:bg-white"
          />
        </div>
      </div> */}

      <div className="mt-3">
        <h2 className="font-bold text-xl my-2">จัดการฟาร์มในระบบ</h2>
        <div className="overflow-x-auto">
          <table className="table bg-base-100 min-w-[600px]">
            <thead>
              <tr>
                <th className="px-6">#</th>
                <th className="px-7">ชื่อฟาร์ม</th>
                <th className="px-6">วันที่สมัครสมาชิก</th>
                <th className="px-8">วันที่อนุมัติ</th>
                <th className="text-center">สถานะบัญชี</th>
                <th className="text-center">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageData.map((user, index) => (
                <tr
                  key={user.farmer_id}
                  className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={user.farm_img}
                          alt={user.farm_name}
                        />
                        <div className="hidden absolute top-0 left-0 h-10 w-10 rounded-full bg-gray-200 items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.farm_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {dayjs(user.create_at)
                      .add(543, "year")
                      .format("D MMMM YYYY")}
                  </td>
                  <td>
                    {dayjs(user.appoved_date)
                      .add(543, "year")
                      .format("D MMMM YYYY")}
                  </td>
                  <td className="text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${
                                  user.is_active == "ปกติ"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                      {user.is_active}
                    </span>
                  </td>

                  <td className="flex justify-center items-center">
                    <div className="px-1">
                      <Link to={`/admin/farm/${user.farmer_id}`}>
                        <Eye size={22} />
                      </Link>
                    </div>
                    <div className="px-1">
                      <Trash2 size={22} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {farms.length > 7 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </>
  );
}

export default UserController;
