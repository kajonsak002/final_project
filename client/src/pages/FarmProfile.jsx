import React, { useEffect, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Eye,
  Calendar,
  Star,
  Users,
  Package,
  Hash,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-8">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}>
          «
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`join-item btn btn-sm ${
              page === currentPage ? "btn-active bg-green-600 text-white" : ""
            }`}
            onClick={() => onPageChange(page)}>
            {page}
          </button>
        ))}

        <button
          className="join-item btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}>
          »
        </button>
      </div>
    </div>
  );
};

function FarmProfile() {
  const [farm, setFarm] = useState([]);
  const [products, setProducts] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [activeTab, setActiveTab] = useState("products");

  // Pagination states
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentAnimalPage, setCurrentAnimalPage] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  const id = useParams();

  const getFarmData = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `profile/${id.id}`
      );
      setFarm(res.data.data);
    } catch (error) {
      console.error("Error fetching farm data:", error);
    }
  };

  const getProductFarm = async () => {
    try {
      setProducts([]);
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `farm-products/${id.id}`
      );
      setProducts(res.data.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า");
    }
  };

  const getAnimalsFarm = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `animal/${id.id}`
      );
      const data = res.data.data;

      const formatted = data.map((item) => ({
        id: item.farm_animal_id,
        type: `${item.animal_name} (${item.type_name})`,
        count: item.quantity,
        lot: item.lot_code,
        created_at: item.created_at,
        updated_at: item.updated_at,
        description: `รหัสล๊อต: ${item.lot_code}`,
        quantity_received: item.quantity_received,
        image: `/images/${item.animal_name}.jpg`,
      }));

      setAnimals(formatted);
    } catch (err) {
      console.log("Error fetching animals", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getFarmData();
      await getProductFarm();
      await getAnimalsFarm();
    };
    fetchData();
  }, []);

  // Calculate pagination
  const totalProductPages = Math.ceil(products.length / itemsPerPage);
  const totalAnimalPages = Math.ceil(animals.length / itemsPerPage);

  const getCurrentProducts = () => {
    const startIndex = (currentProductPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const getCurrentAnimals = () => {
    const startIndex = (currentAnimalPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return animals.slice(startIndex, endIndex);
  };

  const handleProductPageChange = (page) => {
    setCurrentProductPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnimalPageChange = (page) => {
    setCurrentAnimalPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50">
        {/* Banner Section */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={farm.farm_banner}
            alt="Farm Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Card Section */}
        <div className="px-8 -mt-20 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left Side - Profile Image */}
                <div className="md:w-1/3 p-6 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-60 h-50 mx-auto rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={farm.farm_img}
                        alt="Farm Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side - Farm Information */}
                <div className="md:w-2/3 p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {farm.farm_name}
                  </h1>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-green-600" />
                      <span>
                        จังหวัด{farm.province} อำเภอ{farm.amphure} ตำบล
                        {farm.tambon}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 mr-3 text-green-600" />
                      <span>{farm.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-3 text-green-600" />
                      <span>{farm.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="pt-8"></div>

        {/* Tabs Section */}
        <div className="border-b border-gray-200">
          <div className="w-full px-10">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("products")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "products"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                <Package className="w-4 h-4 inline mr-1" />
                สินค้า ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("animals")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "animals"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                <Users className="w-4 h-4 inline mr-1" />
                สัตว์เลี้ยง ({animals.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "products" && (
            <div className="w-full mx-auto">
              <h2 className="text-2xl font-bold mb-6">สินค้าของเรา</h2>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentProducts().map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
                    <img
                      src={product.image}
                      alt={product.product_name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        {product.product_name}
                      </h3>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-green-600">
                          ฿{product.price}
                        </span>
                        <span className="text-gray-500">/{product.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalProductPages > 1 && (
                <Pagination
                  currentPage={currentProductPage}
                  totalPages={totalProductPages}
                  onPageChange={handleProductPageChange}
                />
              )}
            </div>
          )}

          {/* Animals Farm */}
          {activeTab === "animals" && (
            <div className="w-full mx-auto">
              <h2 className="text-2xl font-bold mb-6">สัตว์เลี้ยงในฟาร์ม</h2>

              {/* Animals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCurrentAnimals().map((animal) => (
                  <div
                    key={animal.id}
                    className="group relative bg-white rounded-2xl shadow overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    {/* Enhanced Header */}
                    <div className="bg-gradient-to-br from-green-400 to-green-600 p-6 text-white relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
                      </div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-2xl mb-2">
                            {animal.type}
                          </h3>
                          <span className="font-bold text-lg">
                            คงเหลือ {animal.count} ตัว
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Content */}
                    <div className="p-6 space-y-4">
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="hover:bg-blue-50 rounded-lg p-3 transition-colors">
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium uppercase">
                                รหัสล๊อต
                              </p>
                              <p className="font-semibold text-gray-800">
                                {animal.lot}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="hover:bg-green-50 rounded-lg p-3 transition-colors">
                          <div className="flex items-center space-x-2">
                            <Package className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-xs text-gray-500 font-medium uppercase">
                                จำนวน
                              </p>
                              <p className="font-semibold text-gray-800">
                                {animal.quantity_received}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">วันที่เลี้ยง:</span>
                          <span>
                            {new Date(animal.created_at).toLocaleDateString(
                              "th-TH"
                            )}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="font-medium">อัปเดตล่าสุด:</span>
                          <span>
                            {new Date(animal.updated_at).toLocaleDateString(
                              "th-TH"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalAnimalPages > 1 && (
                <Pagination
                  currentPage={currentAnimalPage}
                  totalPages={totalAnimalPages}
                  onPageChange={handleAnimalPageChange}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FarmProfile;
