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
      <div className="fixed top-0 left-0 h-full w-64 bg-white z-20">
        <Sidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="ml-64 h-full flex flex-col">
        {/* Header Fixed */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-white z-10">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        {/* Scrollable content below header */}
        <main className="flex-1 mt-16 overflow-y-auto p-4 bg-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
