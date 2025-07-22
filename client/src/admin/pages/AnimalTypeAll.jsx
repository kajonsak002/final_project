import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import axios from "axios";
import Pagination from "../components/Pagination";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AnimalTypeAll() {
  const [allData, setAllData] = useState([]);
  const [animals, setAnimals] = useState([]); // เพิ่ม state สำหรับเก็บข้อมูลสัตว์
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    animal_id: "",
    animal_name: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const itemsPerPage = 5;

  const getAnimalAll = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animal_type");
      setAllData(res.data);
    } catch (err) {
      console.log("Error Get Animal All :", err);
    }
  };

  const getAnimals = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animal");
      setAnimals(res.data);
      console.log(res.data);
    } catch (err) {
      console.log("Error Get Animals:", err);
    }
  };

  useEffect(() => {
    getAnimalAll();
    getAnimals(); // เรียกใช้ฟังก์ชันดึงข้อมูลสัตว์
  }, []);

  const filteredData = allData.filter((item) =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    try {
      if (isEditing) {
        res = await axios.put(
          `${import.meta.env.VITE_URL_API}animal_type/update/${editId}`,
          {
            name: formData.animal_name,
            animal_id: formData.animal_id,
          }
        );
      } else {
        res = await axios.post(
          `${import.meta.env.VITE_URL_API}animal_type/insert`,
          {
            animal_id: formData.animal_id,
            name: formData.animal_name,
          }
        );
      }
      toast.success(res.data.message);
      getAnimalAll();
      setFormData({ animal_id: "", animal_name: "" });
      setIsEditing(false);
      setEditId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error Submit Animal Type:", err);
      toast.error(err.response.data.message);
    }
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    setFormData({
      animal_id: data.animal_id,
      animal_name: data.type_name,
    });
    setEditId(data.type_id);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL_API}animal_type/delete/${deleteId}`
      );
      toast.success(res.data.message);
      getAnimalAll();
      setIsConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error Delete Animal Type:", err);
      toast.error(err.response.data.message);
    }
  };

  const sortedPageData = [...pageData].sort((a, b) => {
    const animalA =
      animals.find((an) => an.animal_id === a.animal_id)?.name || "";
    const animalB =
      animals.find((an) => an.animal_id === b.animal_id)?.name || "";
    if (animalA.toLowerCase() < animalB.toLowerCase()) return -1;
    if (animalA.toLowerCase() > animalB.toLowerCase()) return 1;
    // ถ้าชื่อสัตว์เท่ากัน ให้เรียงตามชื่อประเภท
    if ((a.type_name || "").toLowerCase() < (b.type_name || "").toLowerCase())
      return -1;
    if ((a.type_name || "").toLowerCase() > (b.type_name || "").toLowerCase())
      return 1;
    return 0;
  });

  return (
    <>
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <a>หน้าเเรก</a>
          </li>
          <li>จัดการรายการประเภทสัตว์</li>
        </ul>
      </div>

      <div className="card bg-base-100 w-full shadow-sm mt-4">
        <div className="card-body">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h4 className="font-bold text-lg">ค้นหาข้อมูล</h4>
            <button
              className="btn bg-green-600 text-white hover:bg-green-700 w-[140px]"
              onClick={() => {
                setIsEditing(false);
                setFormData({ animal_id: "", animal_name: "" });
                setIsModalOpen(true);
              }}>
              <Plus /> เพิ่มข้อมูล
            </button>
          </div>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      <div className="mt-3 w-full">
        <table className="table bg-base-100 w-full">
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>ชื่อประเภท</th>
              <th>ชื่อสัตว์</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {sortedPageData.length > 0 ? (
              sortedPageData.map((item, index) => {
                const animal = animals.find(
                  (a) => a.animal_id === item.animal_id
                );
                return (
                  <tr key={item.type_id} className="text-center">
                    <td>{index + 1}</td>
                    <td>{item.type_name}</td>
                    <td>{animal ? animal.name : "-"}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="btn btn-sm bg-green-600 hover:bg-green-700 text-white">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(item.type_id)}
                          className="btn btn-sm bg-red-500 hover:bg-red-600 text-white">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4">
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
                onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
              <h3 className="font-bold text-lg mb-4">
                {isEditing ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">เลือกสัตว์ *</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.animal_id}
                    onChange={(e) =>
                      setFormData({ ...formData, animal_id: e.target.value })
                    }
                    required>
                    <option value="">เลือกสัตว์</option>
                    {animals.map((animal) => (
                      <option key={animal.animal_id} value={animal.animal_id}>
                        {animal.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-black">
                      ชื่อประเภทสัตว์ *
                    </span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full mt-2"
                    placeholder="กรอกชื่อประเภทสัตว์"
                    value={formData.animal_name}
                    onChange={(e) =>
                      setFormData({ ...formData, animal_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="modal-action mt-4">
                  <button
                    type="submit"
                    className="btn bg-green-600 text-white hover:bg-green-700">
                    {isEditing ? (
                      <Pencil size={20} className="mr-2" />
                    ) : (
                      <Plus size={20} className="mr-2" />
                    )}
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        )}

        <ConfirmDeleteModal
          isOpen={isConfirmOpen}
          onConfirm={handleDelete}
          onCancel={() => {
            setIsConfirmOpen(false);
            setDeleteId(null);
          }}
        />
      </div>
      <ToastContainer />
    </>
  );
}

export default AnimalTypeAll;
