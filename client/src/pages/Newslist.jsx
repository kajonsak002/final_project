import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Pagination from "../admin/components/Pagination";
import SearchBar from "../admin/components/SearchBar";
import {
  Search,
  Calendar,
  ArrowRight,
  Newspaper,
  Clock,
  Filter,
  Eye,
} from "lucide-react";

dayjs.locale("th");

function Newslist() {
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getNews = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "news");
      console.log(res.data);
      setNews(res.data.data);
    } catch (err) {
      console.log("Error get news : ", err);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  const filteredData = news.filter(
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="flex items-center space-x-3 mb-4">
            <Search className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-800">
              ค้นหาข่าวสาร
            </h2>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาจากหัวข้อหรือเนื้อหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>
          {/* {searchTerm && (
            <div className="mt-3 flex items-center space-x-2 text-sm text-green-600">
              <Filter className="h-4 w-4" />
              <span>
                พบ {filteredData.length} รายการจากการค้นหา "{searchTerm}"
              </span>
            </div>
          )} */}
        </div>
        {/* News Cards */}
        <div className="space-y-6">
          {pageData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 overflow-hidden group">
              <div className="p-6">
                {/* Header with Date */}
                {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                    <Clock className="h-4 w-4" />
                    <span>
                      {dayjs(item.created_at).format("D MMMM YYYY HH:mm:ss")}
                    </span>
                  </div>
                </div> */}

                <h2 className="text-xl font-bold text-green-800 mb-3 group-hover:text-green-600 transition-colors duration-200">
                  {item.title.length > 100
                    ? item.title.slice(0, 150) + "..."
                    : item.title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                  {item.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."}
                </p>

                <Link to={`detail/${item.news_id}`}>
                  <div className="flex items-center justify-between pt-4 border-t border-green-100">
                    <span className="text-green-600 font-medium text-sm group-hover:text-green-700 transition-colors duration-200">
                      อ่านเพิ่มเติม
                    </span>
                    <ArrowRight className="h-4 w-4 text-green-600 group-hover:text-green-700 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-green-100 rounded-full mb-4">
              <Search className="h-12 w-12 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              ไม่พบข่าวสารที่ค้นหา
            </h3>
            <p className="text-gray-500">
              ลองใช้คำค้นหาอื่น หรือตรวจสอบการสะกดคำ
            </p>
          </div>
        )}
        <div className="flex justify-center ">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Newslist;
