import axios from "axios";
import { Search, Check, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { useSummaryCount } from "../components/SummaryCountContext";

function AnimalTypeRequest() {
  const [allData, setAlldata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [pendingReject, setPendingReject] = useState(null);

  const getAnimalTypeReq = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "animal/full/get-req"
      );
      setAlldata(res.data);
      // console.log(res.data);
    } catch (err) {
      console.log("Error get Data : ", err);
      // toast.error(err?.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    getAnimalTypeReq();
  }, []);

  const filteredData = allData.filter((item) =>
    (item.animal_name + " " + item.type_name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const { fetchSummary } = useSummaryCount();

  const handleCheck = async (req_data, status, reason = "") => {
    const { request_id } = req_data;
    const dataObj = {
      request_id,
      status,
    };
    if (status === "ปฏิเสธ") {
      dataObj.reason = reason;
    }
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animal/full/manage-req",
        dataObj
      );
      toast.success(res.data.message);
      getAnimalTypeReq();
      await fetchSummary(); // เพิ่มบรรทัดนี้
    } catch (err) {
      console.log("Error approved req: ", err);
      toast.error(err?.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleRejectClick = (item) => {
    setPendingReject(item);
    setShowRejectModal(true);
    setRejectReason("");
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error("กรุณากรอกเหตุผลในการปฏิเสธ");
      return;
    }
    handleCheck(pendingReject, "ปฏิเสธ", rejectReason);
    setShowRejectModal(false);
    setPendingReject(null);
    setRejectReason("");
  };

  return (
    <div className="w-full min-h-screen">
      <ToastContainer />

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
              <a className="text-black">คำร้องขอเพิ่มประเภทสัตว์</a>
            </li>
          </ul>
        </div>
      </div>
      {/* 
      <div className="card bg-base-100 w-full shadow-sm mt-2">
        <div className="card-body">
          <h4 className="font-bold">ค้นหาข้อมูล</h4>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto mt-3">
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              {/* <th>รหัสคำร้อง</th> */}
              <th>ชื่อผู้ส่งคำร้อง</th>
              <th>ชื่อสัตว์</th>
              <th>ชื่อประเภท</th>
              <th>วันที่</th>
              <th>สถานะ</th>
              <th className="text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.request_id} className="hover">
                  <td>{index + 1}</td>
                  {/* <td>{item.request_id}</td> */}
                  <td>{item.farm_name}</td>
                  <td>{item.animal_name}</td>
                  <td>{item.type_name}</td>
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
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md">
                        <Check className="w-3 h-3 mr-1" />
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleRejectClick(item)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded-md">
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

      {showRejectModal && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowRejectModal(false)}>
              ✕
            </button>
            <h3 className="font-bold text-lg mb-2 text-red-600">
              กรุณากรอกเหตุผลในการปฏิเสธ
            </h3>
            <textarea
              className="textarea textarea-bordered w-full mb-4"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="modal-action">
              <button className="btn" onClick={() => setShowRejectModal(false)}>
                ยกเลิก
              </button>
              <button
                className="btn bg-red-500 text-white hover:bg-red-600"
                onClick={handleRejectConfirm}>
                <X size={20} className="mr-2" />
                ยืนยัน
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default AnimalTypeRequest;
