import React, { useState, useEffect } from "react";
import { Search, BookOpen, Users, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "../admin/components/Pagination";

function GuildBook() {
  const [guildBooks, setGuildBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredGuildBooks = guildBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageData = filteredGuildBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredGuildBooks.length / itemsPerPage);

  const getGuildBook = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "guildbook");
      setGuildBooks(res.data.data);
    } catch (err) {
      console.log("Error to get guildBook");
    }
  };

  useEffect(() => {
    getGuildBook();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">
              ค้นหาคู่มือการเลี้ยงสัตว์
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาจากหัวข้อคู่มือ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Guild Books Grid */}
        {pageData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {pageData.map((item, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-slate-200/50 overflow-hidden transform hover:scale-105 hover:-translate-y-2 transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-green-600 transition-colors duration-200">
                      {item.title}
                    </h3>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {item.content.replace(/<[^>]+>/g, "").slice(0, 100) +
                        "..."}
                    </p>

                    {/* Action Button */}
                    <Link to={`/book/${item.guildbook_id}`}>
                      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                        เริ่มอ่านคู่มือ
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                ไม่พบคู่มือที่ค้นหา
              </h3>
              <p className="text-slate-600 mb-6">
                ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
                ดูคู่มือทั้งหมด
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuildBook;
