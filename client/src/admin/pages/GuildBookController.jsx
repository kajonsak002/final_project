import axios from "axios";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

function GuildBookController() {
  const [guildbook, setGuildbook] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const getGuildBookData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(import.meta.env.VITE_URL_API + "guildbook");
      setGuildbook(res.data.data);
    } catch (err) {
      console.log("error get guildbook data : ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGuildBookData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบคู่มือนี้หรือไม่?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const res = await axios.delete(
        import.meta.env.VITE_URL_API + `guildbook/${id}`
      );

      if (res.status === 200) {
        alert("ลบคู่มือเรียบร้อยแล้ว");
        getGuildBookData(); // Refresh data
      }
    } catch (err) {
      console.log("error delete guildbook : ", err);
      alert("เกิดข้อผิดพลาดในการลบคู่มือ");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/book/edit/${id}`);
  };

  const filteredData = guildbook.filter(
    (item) =>
      (item.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.content || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

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
              <a className="text-black">จัดการคู่มือการเลี้ยงสัตว์</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between space-x-3 mb-1">
          <h2 className="text-xl font-bold">ค้นหา</h2>
          <div>
            <Link to="add_guild_book">
              <button className="btn bg-green-500 text-white w-26">
                เพิ่มข้อมูล
              </button>
            </Link>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาจากหัวข้อหรือเนื้อหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl
          focus:ring-2 focus:ring-green-500 focus:border-transparent
          transition-all duration-200 bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-3 w-full">
        {guildbook.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">ไม่พบข้อมูลคู่มือการเลี้ยงสัตว์</p>
          </div>
        ) : (
          <>
            <table className="table bg-base-100 w-full">
              <thead>
                <tr className="text-center">
                  <th>#</th>
                  <th>หัวข้อ</th>
                  <th>เนื้อหา</th>
                  <th>วันที่สร้าง</th>
                  <th>วันที่แก้ไข</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((item, index) => (
                  <tr key={item.guildbook_id} className="text-center">
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.title}</td>
                    <td>
                      {item.content.replace(/<[^>]+>/g, "").slice(0, 20) +
                        "..."}
                    </td>
                    <td>{dayjs(item.created_at).format("D MMMM YYYY")}</td>
                    <td>{dayjs(item.updated_at).format("D MMMM YYYY")}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item.guildbook_id)}
                          className="btn btn-sm bg-green-600 hover:bg-green-700 text-white">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.guildbook_id)}
                          disabled={deleteLoading === item.guildbook_id}
                          className="btn btn-sm bg-red-500 hover:bg-red-600 text-white">
                          {deleteLoading === item.guildbook_id ? (
                            <div className="loading loading-spinner loading-xs"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default GuildBookController;
