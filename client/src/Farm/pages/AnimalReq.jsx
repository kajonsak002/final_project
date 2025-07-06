import React, { useState, useEffect } from "react";
import SearchBar from "../../admin/components/SearchBar";
import { CirclePlus, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../admin/components/Pagination";

import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

const AnimalReq = () => {
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animal_name, setAnimal_name] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = allData.filter((item) => {
    const mathchesStatus = status
      ? item.status.toLowerCase() === status.toLowerCase()
      : true;
    return mathchesStatus;
  });

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getHistory = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "animal/history",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("History data:", res.data);
      setAllData(res.data);
    } catch (err) {
      console.error("Error fetching history:", err);
      toast.warning(err.response?.data?.message);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", animal_name);
    setIsModalOpen(false);
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animal/req",
        {
          animal_name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      //   console.log("Response:", res.data);
      toast.success(res.data.message);
      getHistory();
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="breadcrumbs text-md">
        <ul>
          <li>หน้าเเรก</li>
          <li>ส่งคำร้องเพิ่มรายการสัตว์</li>
        </ul>
      </div>

      <div className="card bg-base-100 w-full shadow-md mt-6 rounded-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* ส่วนค้นหา */}
            <div className="w-full lg:w-auto">
              <h4 className="font-bold text-xl mb-2 text-gray-700">
                ค้นหาข้อมูล
              </h4>
              <select
                className="select select-bordered w-full lg:w-64"
                onClick={(e) => setStatus(e.target.value)}>
                <option value="">เลือกสถานะ</option>
                <option value="อนุมัติ">อนุมัติ</option>
                <option value="รออนุมัติ">รออนุมัติ</option>
                <option value="ปฏิเสธ">ปฏิเสธ</option>
              </select>
            </div>

            <button
              className="btn bg-green-600 hover:bg-green-700 text-white w-full lg:w-[160px]"
              onClick={() => {
                setIsModalOpen(true);
                setFormData({ animal_name: "" });
              }}>
              <CirclePlus className="mr-2" /> เพิ่มคำร้อง
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 w-full">
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อสัตว์</th>
              <th>วันที่ส่งคำร้อง</th>
              <th>วันที่ดำเนินการคำร้อง</th>
              <th className="text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.request_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{item.name}</td>
                  <td>
                    {dayjs(item.create_at)
                      .locale("th")
                      .add(543, "year")
                      .format("D MMMM YYYY HH:mm:ss")}
                  </td>
                  <td>
                    {item.approved_date !== null
                      ? dayjs(item.approved_date)
                          .locale("th")
                          .add(543, "year")
                          .format("D MMMM YYYY HH:mm:ss")
                      : ""}
                  </td>
                  <td className="text-center">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  ไม่พบข้อมูล
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
        {isModalOpen && (
          <dialog open className="modal">
            <div className="modal-box">
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setAnimal_name("");
                }}>
                ✕
              </button>
              <h3 className="font-bold text-lg mb-4">เพิ่มข้อมูล</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-black">ชื่อสัตว์ *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full mt-2"
                    placeholder="กรอกชื่อสัตว์"
                    value={animal_name}
                    onChange={(e) => setAnimal_name(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-action mt-4">
                  <button type="submit" className="btn btn-primary">
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
};

export default AnimalReq;
