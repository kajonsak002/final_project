import axios from "axios";
import { CirclePlus, Eye, Pencil, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import SearchBar from "../../admin/components/SearchBar";
import Pagination from "../../admin/components/Pagination";
import ConfirmDeleteModal from "../../admin/components/ConfirmDeleteModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    product_name: "",
    price: "",
    unit: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const getProductFarm = async () => {
    const id = localStorage.getItem("farmer_id");
    try {
      setProducts([]); // Force clear before setting new data
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `farm-products/${id}`
      );
      setProducts(res.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.msg || "เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า"
      );
    }
  };

  useEffect(() => {
    getProductFarm();
  }, []);

  const filteredData = products.filter((item) => {
    return item.product_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const openAddModal = () => {
    setFormData({
      product_id: "",
      product_name: "",
      price: "",
      unit: "",
      image: null,
    });
    setImagePreview(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setFormData({
      product_id: product.product_id,
      product_name: product.product_name,
      price: product.price,
      unit: product.unit,
      image: null,
    });
    setImagePreview(product.image || null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem("farmer_id");
    const data = new FormData();
    data.append("name", formData.product_name);
    data.append("price", formData.price);
    data.append("unit", formData.unit);
    if (formData.image) data.append("image", formData.image);
    if (isEditing) data.append("product_id", formData.product_id);
    try {
      let res;
      if (isEditing) {
        res = await axios.put(
          import.meta.env.VITE_URL_API + `farm-products/${id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        res = await axios.post(
          import.meta.env.VITE_URL_API + `farm-products/${id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      toast.success(res.data.msg);
      getProductFarm();
      setIsModalOpen(false);
      setFormData({
        product_id: "",
        product_name: "",
        price: "",
        unit: "",
        image: null,
      });
      setImagePreview(null);
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || "เกิดข้อผิดพลาด");
    }
  };

  const confirmDelete = (product_id) => {
    setDeleteId(product_id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    const id = localStorage.getItem("farmer_id");
    try {
      const res = await axios.delete(
        import.meta.env.VITE_URL_API + `farm-products/${id}`,
        { data: { product_id: deleteId } }
      );
      toast.success(res.data.msg);
      // Always fetch latest data from backend after delete
      getProductFarm();
      setIsConfirmOpen(false);
      setDeleteId(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      product_id: "",
      product_name: "",
      price: "",
      unit: "",
      image: null,
    });
    setImagePreview(null);
    setIsEditing(false);
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
              <a className="text-black">จัดการสินค้า</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="card bg-base-100 w-full shadow-md mt-6 rounded-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="w-full ">
              <h4 className="font-bold text-xl mb-2 text-gray-700">
                ค้นหาข้อมูล
              </h4>
            </div>
            <button
              className="btn bg-green-600 hover:bg-green-700 text-white w-full lg:w-[160px]"
              onClick={openAddModal}>
              <CirclePlus className="mr-2" /> เพิ่มสินค้า
            </button>
          </div>
          <SearchBar
            className="w-full"
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
      </div>
      <div className="mt-3 w-full">
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อสินค้า</th>
              <th className="text-left">รูปภาพ</th>
              <th>ราคา</th>
              <th>หน่วย</th>
              <th className="text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.product_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td>{item.product_name}</td>
                  <td className="py-2 flex justify-start items-center">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover"
                      />
                    ) : (
                      <span>ไม่มีรูปภาพ</span>
                    )}
                  </td>
                  <td>{item.price}</td>
                  <td>{item.unit}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-green-600 p-2 rounded text-white cursor-pointer"
                        title="แก้ไข"
                        onClick={() => handleEdit(item)}>
                        <Pencil size={18} />
                      </button>
                      <button
                        className="bg-red-600 p-2 rounded text-white cursor-pointer"
                        title="ลบ"
                        onClick={() => confirmDelete(item.product_id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
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
                onClick={closeModal}>
                ✕
              </button>
              <h3 className="font-bold text-lg mb-4">
                {isEditing ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">ชื่อสินค้า *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full mt-2"
                    placeholder="กรอกชื่อสินค้า"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">ราคา *</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full mt-2"
                    placeholder="กรอกราคา"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">หน่วย *</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full mt-2"
                    placeholder="กรอกหน่วย เช่น กิโลกรัม ตัว ถุง ฯลฯ"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-control w-full mb-4">
                  <label className="label">
                    <span className="label-text text-black">
                      รูปภาพ {isEditing ? "(ถ้าต้องการเปลี่ยน)" : "*"}
                    </span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full mt-2"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    {...(!isEditing && { required: true })}
                  />
                  <div className="relative flex justify-center mt-2 w-full">
                    <div className="border border-gray-300 bg-base-200 rounded w-full h-[300px] flex items-center justify-center">
                      <div className="absolute top-3 right-3  rounded-full">
                        {!isEditing && (
                          <div
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={() => setImagePreview(null)}>
                            <X size={16} />
                          </div>
                        )}
                      </div>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt={isEditing ? "current" : "preview"}
                          style={{
                            width: 300,
                            height: 270,
                            objectFit: "cover",
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">
                          เลือกรูปภาพสินค้า
                        </span>
                      )}
                    </div>
                  </div>
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
      <ToastContainer autoClose={1000} />
    </div>
  );
}

export default Product;
