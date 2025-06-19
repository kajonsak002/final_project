import axios from "axios";
import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import { CirclePlus, Edit, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

function AnimalAll() {
  const [allData, setAllData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ animal_name: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const itemsPerPage = 5;

  const getAnimalAll = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "animal");
      setAllData(res.data);
    } catch (err) {
      console.error("Error Get Animal All:", err);
    }
  };

  useEffect(() => {
    getAnimalAll();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    try {
      if (isEditing) {
        res = await axios.put(
          `${import.meta.env.VITE_URL_API}animal/update/${editId}`,
          { animal_name: formData.animal_name }
        );
      } else {
        res = await axios.post(`${import.meta.env.VITE_URL_API}animal/insert`, {
          animal_name: formData.animal_name,
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
    setFormData({ animal_name: data.name });
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
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <a>หน้าแรก</a>
          </li>
          <li>จัดการรายการสัตว์</li>
        </ul>
      </div>

      <div className="card bg-base-100 w-full shadow-sm mt-4">
        <div className="card-body">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <h4 className="font-bold text-lg">ค้นหาข้อมูล</h4>
            <button
              className="btn bg-green-600 text-white w-[140px]"
              onClick={() => {
                setIsEditing(false);
                setFormData({ animal_name: "" });
                setIsModalOpen(true);
              }}>
              <CirclePlus /> เพิ่มข้อมูล
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
              <th className="text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.animal_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{item.name}</td>
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleEdit(item)}>
                        <Edit size={16} /> แก้ไข
                      </button>
                      <button
                        className="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => confirmDelete(item.animal_id)}>
                        <Trash2 size={16} /> ลบ
                      </button>
                    </div>
                  </td>
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
                onClick={() => setIsModalOpen(false)}>
                ✕
              </button>
              <h3 className="font-bold text-lg mb-4">
                {isEditing ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
              </h3>
              <form onSubmit={handleSubmit}>
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
                  <button type="submit" className="btn btn-primary">
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
