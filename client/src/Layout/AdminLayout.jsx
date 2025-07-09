import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../admin/components/SideBar";
import Header from "../admin/components/Header";
import axios from "axios";
import { toast } from "react-toastify";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const checkToken = async () => {
    if (!token) {
      toast.error("ไม่พบ Token");
      navigate("/");
      return;
    }
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "admin/check_token",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Token ไม่ถูกต้อง");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Fixed */}
      <div
        className={`fixed top-0 left-0 h-full bg-white z-20 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}>
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div
        className={`h-screen flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}>
        {/* Header Fixed */}
        <div
          className="fixed top-0 right-0 h-16 bg-white z-10 transition-all duration-300"
          style={{ left: sidebarOpen ? "16rem" : "4rem" }}>
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Scrollable content below header */}
        <main className="flex-1 overflow-y-auto mt-16 p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
