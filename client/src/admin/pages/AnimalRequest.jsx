import axios from "axios";
import { Search, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";

import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

function AnimalRequest() {
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getAnimalRequest = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "animal/get-req"
      );
      setAllData(res.data);
      console.log(res.data);
    } catch (err) {
      console.log("Error fetch Animal Request", err);
    }
  };

  const handleCheck = async (req_data, status) => {
    const { request_id } = req_data;
    const dataObj = {
      request_id,
      status,
    };
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animal/manage-req",
        dataObj
      );
      toast.success(res.data.message);
      getAnimalRequest();
      setCurrentPage(1);
    } catch (err) {
      console.log("Error approved req: ", err);
      toast.error(err?.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    getAnimalRequest();
  }, []);

  const filteredData = allData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="w-full min-h-screen px-4">
      <ToastContainer />
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <Link to={"/admin/dashboard"}>หน้าเเรก</Link>
          </li>
          <li>คำร้องขอเพิ่มรายการสัตว์</li>
        </ul>
      </div>

      <div className="card bg-base-100 w-full shadow-sm mt-2">
        <div className="card-body">
          <h4 className="font-bold">ค้นหาข้อมูล</h4>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      <div className="overflow-x-auto mt-3 w-full">
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              {/* <th>รหัสคำร้อง</th> */}
              <th>ชื่อผู้ส่งคำร้อง</th>
              <th>ชื่อสัตว์</th>
              <th>วันที่</th>
              <th>สถานะ</th>
              <th className="text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.request_id}>
                  <td>{index + 1}</td>
                  {/* <td>{item.request_id}</td> */}
                  <td>{item.farm_name}</td>
                  <td>{item.name}</td>
                  <td>
                    {dayjs(item.create_at)
                      .locale("th")
                      .add(543, "year")
                      .format("D MMMM YYYY")}
                  </td>
                  <td>{item.status}</td>
                  <td className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCheck(item, "อนุมัติ")}
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors duration-200">
                        <Check className="w-3 h-3 mr-1" />
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleCheck(item, "ปฏิเสธ")}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors duration-200">
                        <X className="w-3 h-3 mr-1" />
                        ปฏิเสธ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default AnimalRequest;
