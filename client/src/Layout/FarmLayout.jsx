import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../Farm/components/SideBar";
import Header from "../Farm/components/Header";
import { toast } from "react-toastify";
import axios from "axios";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();

  const check_token = async () => {
    const token = localStorage.getItem("userToken");

    // ✅ ไม่พบ token → แจ้งเตือน + redirect
    if (!token) {
      toast.error("ไม่พบ token", { autoClose: 1000 });
      setIsLogin(false);
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "admin/check_token",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message, { autoClose: 1000 });
      setIsLogin(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Token ผิดพลาด", {
        autoClose: 1000,
      });
      setIsLogin(false);
      setTimeout(() => navigate("/login"), 1000);
    }
  };

  useEffect(() => {
    check_token();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <SideBar isOpen={sidebarOpen} />
        <div className="flex-1 gap-2">
          <Header
            toggleSidebar={toggleSidebar}
            dropdownOpen={dropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />
          <main className="p-4">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <p className="text-xl font-medium">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
    </div>
  );
}

export default AdminLayout;
