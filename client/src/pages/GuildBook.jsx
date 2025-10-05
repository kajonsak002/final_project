import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Users,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Pagination from "../admin/components/Pagination";

function GuildBook() {
  const [guildBooks, setGuildBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uniqueTag, setUniqueTag] = useState([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const itemsPerPage = 6;

  const filteredGuildBooks = guildBooks.filter((book) => {
    const search = searchTerm.toLowerCase();

    // Filter by search term
    const matchesSearch =
      book.title.toLowerCase().includes(search) ||
      book.content.toLowerCase().includes(search) ||
      (book.tags &&
        book.tags.some((tag) => tag.toLowerCase().includes(search)));

    // Filter by selected tags
    const matchesTags =
      selectedTags.length === 0 ||
      (book.tags &&
        selectedTags.every((selectedTag) =>
          book.tags.some(
            (bookTag) => bookTag.toLowerCase() === selectedTag.toLowerCase()
          )
        ));

    return matchesSearch && matchesTags;
  });

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

  const getAllTags = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "guildbook/tags"
      );

      if (Array.isArray(res.data.tag)) {
        const flatTags = res.data.tag
          .flat(Infinity)
          .map((tag) => tag.trim())
          .filter(Boolean);

        const uniqueTags = [...new Set(flatTags)];

        setUniqueTag(uniqueTags);
        console.log(uniqueTags);
      } else {
        console.log("Tag data is not an array:", res.data.tag);
      }
    } catch (err) {
      console.log("Error get Tags : ", err);
    }
  };

  // Handle tag selection
  const handleTagClick = (tag) => {
    setSelectedTags((prev) => {
      const isSelected = prev.includes(tag);
      if (isSelected) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setCurrentPage(1);
  };

  // Clear all selected tags
  const clearSelectedTags = () => {
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // Toggle expanded view for card tags
  const toggleCardExpansion = (cardIndex) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardIndex]: !prev[cardIndex],
    }));
  };

  useEffect(() => {
    getGuildBook();
    getAllTags();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags]);

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

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาจากหัวข้อคู่มือ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Tags Filter Section */}
          {uniqueTag.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-medium text-green-800">
                  กรองตาม Tags
                </h3>
                {/* <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium transition-colors">
                  <span>{showAllTags ? "แสดงน้อยลง" : "แสดงทั้งหมด"}</span>
                  {showAllTags ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button> */}
              </div>

              {/* Selected Tags Display */}
              {selectedTags.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">
                      Tags ที่เลือก ({selectedTags.length})
                    </span>
                    <button
                      onClick={clearSelectedTags}
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1">
                      <X size={14} />
                      <span>ล้างทั้งหมด</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full cursor-pointer hover:bg-green-600 transition-colors"
                        onClick={() => handleTagClick(tag)}>
                        #{tag}
                        <X size={12} className="ml-1" />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Tags */}
              <div className="flex flex-wrap gap-2">
                {uniqueTag
                  .slice(0, showAllTags ? uniqueTag.length : 12)
                  .map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-2 text-sm font-medium rounded-full border transition-all duration-200 hover:scale-105 ${
                        selectedTags.includes(tag)
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400"
                      }`}>
                      #{tag}
                    </button>
                  ))}
                {uniqueTag.length > 12 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="px-3 py-2 text-sm font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 hover:scale-105 flex items-center space-x-1">
                    <span>
                      {showAllTags
                        ? "แสดงน้อยลง"
                        : `+${uniqueTag.length - 12} เพิ่มเติม`}
                    </span>
                    {showAllTags ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
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

                    {/* Enhanced Tags Display */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.tags
                            .slice(
                              0,
                              expandedCards[index] ? item.tags.length : 3
                            )
                            .map((tag, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleTagClick(tag);
                                }}
                                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all duration-200 hover:scale-105 ${
                                  selectedTags.includes(tag)
                                    ? "bg-green-500 text-white border-green-500"
                                    : "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 hover:from-emerald-200 hover:to-green-200"
                                }`}>
                                #{tag}
                              </button>
                            ))}

                          {/* แสดงจำนวน tag ที่ซ่อน */}
                          {/* {!expandedCards[index] && item.tags.length > 3 && (
                            <span className="px-3 py-1 text-sm font-medium rounded-full border bg-gray-100 text-gray-600">
                              +{item.tags.length - 3} เพิ่มเติม
                            </span>
                          )} */}
                        </div>
                      </div>
                    )}

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
                ลองเปลี่ยนคำค้นหาหรือเลือก Tags อื่น
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    clearSelectedTags();
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200">
                  ดูคู่มือทั้งหมด
                </button>
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearSelectedTags}
                    className="w-full bg-white text-green-600 border border-green-300 px-6 py-3 rounded-xl font-medium hover:bg-green-50 transition-all duration-200">
                    ล้าง Tags ที่เลือก
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuildBook;
