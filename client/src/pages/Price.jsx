import axios from "axios";
import { Search, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import SearchBar from "../admin/components/SearchBar";
import Pagination from "../admin/components/Pagination";

function Price() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchPriceData();
  }, []);

  const fetchPriceData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(import.meta.env.VITE_URL_API + "price");
      setData(res.data.allData);
      setTitle(res.data.title);
    } catch (err) {
      console.error("Error fetching price data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceFilter = (item) => {
    const avgPrice = parseFloat(item.avgPrice);
    const min =
      minPrice === "" ? Number.MIN_SAFE_INTEGER : parseFloat(minPrice);
    const max =
      maxPrice === "" ? Number.MAX_SAFE_INTEGER : parseFloat(maxPrice);
    return avgPrice >= min && avgPrice <= max;
  };

  const filteredData = data.filter((item) => {
    const matchesPrice = handlePriceFilter(item);
    const matchesType =
      selectedType === "" ||
      item.name.toLowerCase().includes(selectedType.toLowerCase());
    return matchesPrice && matchesType;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, selectedType]);

  const types = [
    { label: "สุกร", value: "สุกรชำแหละ" },
    { label: "เนื้อวัว", value: "เนื้อโค" },
    { label: "เนื้อไก่", value: "ไก่สดชำแหละ" },
    { label: "ไก่เป็นตัว", value: "ไก่สดทั้งตัว" },
    { label: "เป็ดสด", value: "เป็ดสด" },
    { label: "ไข่เป็ด", value: "ไข่เป็ด" },
    { label: "ไข่ไก่", value: "ไข่ไก่" },
  ];

  if (loading) {
    return (
      <div className="mx-auto px-5 my-5 max-w-6xl">
        <div className="flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <p className="text-gray-600">กำลังโหลดข้อมูลราคา...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="mx-8 my-5 px-5">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h1 className="text-2xl font-bold">ราคาเนื้อสัตว์</h1>
          </div>
          {title && (
            <p className="text-green-100">
              {title} {"  "} ข้อมูลจาก : กระทรวงพาณิชย์{"  "}
              <a
                href="https://www.moc.go.th/th/content/category/detail/id/311/iid/3048"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-200 underline hover:text-green-300">
                ดูเพิ่มเติมที่นี่
              </a>
            </p>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  ประเภทเนื้อสัตว์
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
                  <option value="">ทั้งหมด</option>
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  ราคาต่ำสุด (บาท)
                </label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="ราคาต่ำสุด"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  ราคาสูงสุด (บาท)
                </label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="ราคาสูงสุด"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageData.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="p-6">
                <h3 className="font-semibold text-green-800 text-lg mb-3 leading-tight">
                  {item.name}
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">ช่วงราคา</span>
                    <span className="font-medium text-green-700">
                      {item.price}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">ราคาเฉลี่ย</span>
                    <span className="font-bold text-green-600 text-lg">
                      ฿{item.avgPrice}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded">
                      {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {pageData.length === 0 && (minPrice || maxPrice || selectedType) && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-100">
            <div className="text-green-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-green-800 font-medium mb-2">ไม่พบข้อมูล</h3>
            <p className="text-gray-600">
              {selectedType && `ไม่พบข้อมูลสำหรับประเภท "${selectedType}"`}
              {(minPrice || maxPrice) &&
                ` ในช่วงราคา ${minPrice || "0"} - ${
                  maxPrice || "ไม่จำกัด"
                } บาท`}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Price;
