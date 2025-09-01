import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function AnimalAll() {
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    animal_name: "",
    category_id: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [categories, setCategories] = useState([]);

  const itemsPerPage = 5;

  const getAnimalAll = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animal");
      setAllData(res.data);
    } catch (err) {
      console.error("Error Get Animal All:", err);
    }
  };

  const getCategories = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "category");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    getAnimalAll();
    getCategories();
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
          `${import.meta.env.VITE_URL_API}animal/update/${editId}`,
          {
            animal_name: formData.animal_name,
            category_id: formData.category_id,
          }
        );
      } else {
        res = await axios.post(`${import.meta.env.VITE_URL_API}animal/insert`, {
          animal_name: formData.animal_name,
          category_id: formData.category_id,
        });
      }

      toast.success(res.data.message);
      getAnimalAll();
      setFormData({ animal_name: "" });
      setIsEditing(false);
      setEditId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error Submit Animal:", err);
      toast.error(err.response.data.message);
    }
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    setFormData({
      animal_name: data.name,
      category_id: data.category_id || "",
    });
    setEditId(data.animal_id);
    setIsModalOpen(true);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_URL_API}animal/delete/${deleteId}`
      );
      toast.success(res.data.message);
      getAnimalAll();
      setIsConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error Delete Animal:", err);
      toast.error(err.response.data.message);
    }
  };

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
              <a className="text-black">จัดการรายการสัตว์</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="card bg-base-100 w-full shadow-sm mt-4">
        <div className="card-body">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h4 className="font-bold text-lg">ค้นหาข้อมูล</h4>
            <button
              className="btn bg-green-600 text-white hover:bg-green-700 w-[140px]"
              onClick={() => {
                setIsEditing(false);
                setFormData({ animal_name: "", category_id: "" });
                setIsModalOpen(true);
              }}>
              <Plus /> เพิ่มข้อมูล
            </button>
          </div>
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>

      <div className="mt-3 w-full">
        <ToastContainer />

        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อ</th>
              <th>หมวดหมู่</th>
              <th className="text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.animal_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{item.name}</td>
                  <td>{item.category_name || "-"}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleEdit(item)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => confirmDelete(item.animal_id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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
                    <span className="label-text text-black">
                      เลือกหมวดหมู่ *
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    required>
                    <option value="">เลือกหมวดหมู่</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-black">ชื่อสัตว์ *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full mt-2"
                    placeholder="กรอกชื่อสัตว์"
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
    </>
  );
}

export default AnimalAll;
