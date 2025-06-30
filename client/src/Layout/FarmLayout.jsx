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
      <div className="h-screen flex overflow-hidden">
        {/* Sidebar Fixed */}
        <div className="fixed top-0 left-0 h-full w-64 bg-white z-10">
          <SideBar isOpen={sidebarOpen} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col ml-64">
          {/* Header Fixed */}
          <div className="fixed top-0 left-64 right-0 h-16 bg-white z-10">
            <Header
              toggleSidebar={toggleSidebar}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
            />
          </div>

          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto mt-16 p-4 bg-gray-100">
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
