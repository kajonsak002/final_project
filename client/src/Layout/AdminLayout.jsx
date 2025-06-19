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
    <div className="w-screen h-screen flex bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 bg-gray-200 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
