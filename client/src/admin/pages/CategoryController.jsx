import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../components/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

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
    <div className="w-full min-h-screen px-4 py-2">
      <ToastContainer />
      <div className="breadcrumbs text-md mb-2">
        <ul>
          <li>หน้าแรก</li>
          <li>จัดการหมวดหมู่สัตว์</li>
        </ul>
      </div>
      <div className="card bg-base-100 w-full shadow-sm mb-4">
        <div className="card-body">
          <h4 className="font-bold mb-2">เพิ่มหมวดหมู่สัตว์</h4>
          <button
            className="btn bg-green-600 text-white"
            onClick={openAddModal}>
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
                className="input input-bordered w-full mb-4"
                placeholder="ชื่อหมวดหมู่สัตว์"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary bg-green-600 text-white">
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
                  className="btn btn-success bg-green-600 text-white">
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
                    <td className="text-center">
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => openEditModal(cat)}>
                        แก้ไข
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => openDeleteModal(cat.category_id)}>
                        ลบ
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
