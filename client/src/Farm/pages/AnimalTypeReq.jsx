import axios from "axios";
import { CirclePlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "../../utils/toast";
import Pagination from "../../admin/components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";

function AnimalTypeReq() {
  const [allData, setAllData] = useState([]);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type_name: "",
    isNewAnimal: true, // เพิ่ม flag สำหรับเลือกสัตว์ใหม่หรือเก่า
    category_id: null,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

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
        import.meta.env.VITE_URL_API + "animal/full/history",
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

  const getAnimals = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animal");
      setAnimals(res.data);
    } catch (err) {
      console.log("Error Get Animals:", err);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "category");
      setCategories(res.data);
    } catch (err) {
      console.log("Error Get Categories:", err);
    }
  };

  useEffect(() => {
    getHistory();
    getAnimals();
    getCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
    if (!formData.name.trim()) {
      toast.error("กรุณากรอกชื่อสัตว์");
      return;
    }

    // ถ้าเป็นสัตว์ใหม่ ต้องระบุหมวดหมู่
    if (formData.isNewAnimal && !formData.category_id) {
      toast.error("กรุณาเลือกหมวดหมู่สำหรับสัตว์ใหม่");
      return;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "animal/full/req",
        {
          animal_name: formData.name,
          type_name: formData.type_name,
          category_id: formData.category_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Response:", res.data);
      toast.success(res.data.message);
      getHistory();
      // รีเซ็ตฟอร์ม
      setFormData({
        name: "",
        type_name: "",
        isNewAnimal: true,
        category_id: null,
      });
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการส่งคำร้อง"
      );
    }
    setIsModalOpen(false);
  };

  const handleAnimalSelect = (animalId) => {
    if (animalId === "new") {
      setFormData({ ...formData, name: "", isNewAnimal: true });
    } else {
      const selectedAnimal = animals.find(
        (a) => a.animal_id === parseInt(animalId)
      );
      setFormData({
        ...formData,
        name: selectedAnimal.name,
        isNewAnimal: false,
        category_id: selectedAnimal.category_id || null,
      });
    }
  };

  const getColorStatus = (status) => {
    if (status === "อนุมัติ") {
      return "bg-green-500 text-white"; // สีเขียวเข้ม + ตัวอักษรขาว
    } else if (status === "รออนุมัติ") {
      return "bg-yellow-500 text-white"; // สีเหลือง + ตัวอักษรดำ
    } else if (status === "ปฏิเสธ") {
      return "bg-red-500 text-white"; // สีแดง + ตัวอักษรขาว
    }
    return "bg-gray-300 text-black"; // สี default
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
              <a className="text-black">ส่งคำร้องเพิ่มรายการสัตว์</a>
            </li>
          </ul>
        </div>
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
                setFormData({
                  name: "",
                  type_name: "",
                  isNewAnimal: true,
                  category_id: null,
                });
              }}>
              <CirclePlus className="mr-2" /> เพิ่มคำร้อง
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 w-full">
        <div className="my-3">
          <h2 className="font-bold text-xl">
            ประวัติการส่งคำร้องเพิ่มรายการสัตว์
          </h2>
        </div>
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th className="text-center">วันที่ส่งคำร้อง</th>
              <th>ชื่อสัตว์</th>
              <th>ชื่อประเภท</th>
              <th className="text-center">วันที่ดำเนินการคำร้อง</th>
              <th className="text-center">เหตุผล</th>
              <th className="text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.request_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="text-center">
                    {dayjs(item.create_at)
                      .locale("th")
                      .add(543, "year")
                      .format("D MMMM YYYY")}
                  </td>
                  <td>{item.animal_name}</td>
                  <td>{item.type_name}</td>
                  <td className="text-center">
                    {item.approved_date
                      ? dayjs(item.approved_date)
                          .locale("th")
                          .add(543, "year")
                          .format("D MMMM YYYY")
                      : "-"}
                  </td>
                  <td className="text-center">
                    {item.reason ? item.reason : "-"}
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge ${getColorStatus(item.status)} p-3`}>
                      {item.status}
                    </span>
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
                  setFormData({
                    name: "",
                    type_name: "",
                    isNewAnimal: true,
                    category_id: null,
                  });
                }}>
                ✕
              </button>
              <h3 className="font-bold text-lg mb-4">เพิ่มข้อมูลสัตว์</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">
                      หมวดหมู่{" "}
                      {formData.isNewAnimal && (
                        <span className="text-red-500">*</span>
                      )}
                    </span>
                  </label>
                  <select
                    className={`select select-bordered w-full ${
                      formData.isNewAnimal && !formData.category_id
                        ? "select-error"
                        : ""
                    }`}
                    disabled={!formData.isNewAnimal}
                    value={formData.category_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: e.target.value || null,
                      })
                    }
                    required={formData.isNewAnimal}>
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">เลือกสัตว์ *</span>
                  </label>
                  <select
                    className="select select-bordered w-full mb-2"
                    onChange={(e) => handleAnimalSelect(e.target.value)}
                    required>
                    <option value="new">+ เพิ่มสัตว์ใหม่</option>
                    {animals.map((animal) => (
                      <option key={animal.animal_id} value={animal.animal_id}>
                        {animal.name}
                      </option>
                    ))}
                  </select>

                  {formData.isNewAnimal && (
                    <input
                      type="text"
                      className={`input input-bordered w-full mt-2 ${
                        !formData.name.trim() ? "input-error" : ""
                      }`}
                      placeholder="กรอกชื่อสัตว์ใหม่ *"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  )}

                  {/* {!formData.isNewAnimal && (
                    <div className="alert alert-info mt-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current shrink-0 w-6 h-6">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>
                        เลือกสัตว์: <strong>{formData.name}</strong>
                      </span>
                    </div>
                  )} */}
                </div>

                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">
                      ชื่อประเภทสัตว์ *
                    </span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered w-full mt-2 ${
                      !formData.type_name.trim() ? "input-error" : ""
                    }`}
                    placeholder="กรอกชื่อประเภทสัตว์ *"
                    value={formData.type_name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, type_name: e.target.value })
                    }
                  />
                </div>

                <div className="modal-action mt-4">
                  <button
                    type="submit"
                    className="btn bg-green-600 hover:bg-green-700 text-white">
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
}

export default AnimalTypeReq;
