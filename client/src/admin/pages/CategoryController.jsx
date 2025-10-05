import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../../utils/toast";
import Pagination from "../components/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { Plus, Pencil, Trash2 } from "lucide-react";

const CategoryController = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "category");
      setCategories(res.data);
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการดึงหมวดหมู่");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(import.meta.env.VITE_URL_API + "category/insert", {
        category_name: categoryName,
      });
      toast.success("เพิ่มหมวดหมู่สำเร็จ");
      setCategoryName("");
      fetchCategories();
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.category_id);
    setEditName(cat.category_name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        import.meta.env.VITE_URL_API + `category/update/${editId}`,
        { category_name: editName }
      );
      toast.success("แก้ไขหมวดหมู่สำเร็จ");
      setEditId(null);
      setEditName("");
      fetchCategories();
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการแก้ไขหมวดหมู่");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        import.meta.env.VITE_URL_API + `category/delete/${deleteId}`
      );
      toast.success("ลบหมวดหมู่สำเร็จ");
      fetchCategories();
      closeDeleteModal();
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการลบหมวดหมู่");
    }
  };

  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const pageData = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    setCategoryName("");
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = (cat) => {
    setEditId(cat.category_id);
    setEditName(cat.category_name);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditId(null);
    setEditName("");
    setIsEditModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen">
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
              <a className="text-black">จัดการหมวดหมู่สัตว์</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="card bg-base-100 w-full shadow-sm mb-4">
        <div className="card-body">
          <h3 className="font-bold text-xl mb-2">เพิ่มหมวดหมู่สัตว์</h3>

          <button
            className="btn bg-green-600 w-45  text-white hover:bg-green-700"
            onClick={openAddModal}>
            <Plus size={20} className="mr-2" />
            เพิ่มหมวดหมู่สัตว์
          </button>
        </div>
      </div>
      {/* Add Modal */}
      {isAddModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeAddModal}>
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">เพิ่มหมวดหมู่สัตว์</h3>
            <form
              onSubmit={(e) => {
                handleAdd(e);
                closeAddModal();
              }}>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="ชื่อหมวดหมู่สัตว์"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <div className="modal-action mt-[5px]">
                <button
                  type="submit"
                  className="btn bg-green-600 text-white hover:bg-green-700">
                  <Plus size={20} className="mr-2" />
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
      {/* Edit Modal */}
      {isEditModalOpen && (
        <dialog open className="modal">
          <div className="modal-box">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeEditModal}>
              ✕
            </button>
            <h3 className="font-bold text-lg mb-4">แก้ไขหมวดหมู่สัตว์</h3>
            <form
              onSubmit={(e) => {
                handleUpdate(e);
                closeEditModal();
              }}>
              <input
                type="text"
                className="input input-bordered w-full mb-4"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn bg-green-600 text-white hover:bg-green-700">
                  <Pencil size={20} className="mr-2" />
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
      <div className="card bg-base-100 w-full shadow-sm">
        <div className="card-body">
          <h4 className="font-bold mb-2">รายการหมวดหมู่</h4>
          <table className="table w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อหมวดหมู่</th>
                <th className="text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length > 0 ? (
                pageData.map((cat, idx) => (
                  <tr key={cat.category_id}>
                    <td>{idx + 1 + (currentPage - 1) * itemsPerPage}</td>
                    <td>{cat.category_name}</td>
                    <td className="text-center space-x-2">
                      <button
                        className="btn bg-green-600 btn-sm text-white hover:bg-green-700"
                        onClick={() => openEditModal(cat)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        className="btn bg-red-500 btn-sm text-white hover:bg-red-600"
                        onClick={() => openDeleteModal(cat.category_id)}>
                        <Trash2 size={16} />
                      </button>
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
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
};

export default CategoryController;
