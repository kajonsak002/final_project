import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Pagination from "../../admin/components/Pagination";
import SearchBar from "../../admin/components/SearchBar";

dayjs.locale("th");

function News() {
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
    <>
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a
                  href="/profile"
                  className="text-blue-600 hover:text-blue-800">
                  หน้าแรก
                </a>
              </li>
              <li>
                <a className="text-gray-500">ข่าวสาร</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="card w-full bg-base-100">
          <div className="card-body">
            <div className="flex flex-col justify-between items-center sm:flex-row gap-2">
              <h1 className="font-bold text-lg">ค้นหา</h1>
              <Link to={"insert"}>
                <button className="btn bg-green-500 text-white w-full sm:w-auto ">
                  เพิ่มข่าวสาร
                </button>
              </Link>
            </div>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>

        {pageData.map((item, index) => (
          <div key={index}>
            <div className="card card-side bg-base-100 shadow-sm w-full h-[150px] my-2">
              <div className="card-body">
                <div className="flex justify-between">
                  <div>
                    <h2 className="card-title text-green-800">
                      {item.title.length > 100
                        ? item.title.slice(0, 130) + "..."
                        : item.title}
                    </h2>
                  </div>
                  <div className="card-date text-green-500">
                    {dayjs(item.created_at).format("D MMMM YYYY HH:mm:ss")}
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {item.content.replace(/<[^>]+>/g, "").slice(0, 100) + "..."}
                </p>

                <Link to={`detail/${item.news_id}`}>
                  <span className="relative inline-block text-sm text-green-600 font-medium transition-all duration-300 hover:text-green-800 hover:underline">
                    อ่านเพิ่มเติม →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
}

export default News;
