import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  BookText,
  MailWarning,
  ChartColumnBig,
  Newspaper,
  Settings,
  CirclePlus,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    toast.info("กำลังออกจากระบบ");
    localStorage.removeItem("userToken");
    localStorage.removeItem("farmer_id");
    localStorage.removeItem("image_profile");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const menuItems = [
    {
      name: "หน้าเเรก",
      icon: <LayoutDashboard size={20} />,
      path: "/profile",
    },
    {
      name: "จัดการสินค้า",
      icon: <ChartColumnBig size={20} />,
      path: "product",
    },
    {
      name: "จัดการสัตว์เลี้ยง",
      icon: <Users size={20} />,
      path: "animal",
    },
    {
      name: "ส่งคำร้องเพิ่มรายการสัตว์",
      icon: <CirclePlus size={20} />,
      path: "animal/request",
    },
    {
      name: "ส่งคำร้องเพิ่มรายการประเภทสัตว์",
      icon: <CirclePlus size={20} />,
      path: "animal-type/request",
    },
    {
      name: "ระบบชุมชน",
      icon: <Newspaper size={20} />,
      path: "social",
    },
    {
      name: "ข่าวสาร",
      icon: <MailWarning size={20} />,
      path: "news",
    },
    {
      name: "บันทึกเหตุการณ์สัตว์",
      icon: <BookText size={20} />,
      path: "logs",
    },
  ];

  return (
    <aside
      className={`bg-base-100 border-r border-base-200 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}>
      <ToastContainer
        position="top-right"
        autoClose={800}
        hideProgressBar={false}
        closeOnClick
        theme="light"
      />

      <div className="p-4 border-b border-base-200">
        <h2
          className={`text-xl font-bold text-center text-green-600 transition-all duration-300 ${
            !isOpen && "hidden"
          }`}>
          <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Farm Panel
          </span>
        </h2>
        {!isOpen && (
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-green-600 font-bold text-lg">F</span>
          </div>
        )}
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === `/profile/${item.path}`;

          return (
            <div key={index} className="mb-1">
              <Link to={item.path}>
                <div
                  className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                    isOpen ? "justify-start" : "justify-center"
                  } ${
                    isActive
                      ? "bg-green-50 text-green-600 font-medium border-l-4 border-green-500"
                      : "hover:bg-base-200 hover:text-green-600"
                  }`}>
                  <span
                    className={`${
                      !isOpen ? "scale-110" : ""
                    } transition-transform duration-200`}>
                    {item.icon}
                  </span>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      !isOpen && "hidden"
                    }`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-base-200 mt-auto">
        <button
          onClick={() => handleLogout()}
          className={`flex items-center p-3 w-full hover:bg-red-50 hover:text-red-500 rounded-lg cursor-pointer transition-all duration-200 group ${
            !isOpen && "justify-center"
          }`}>
          <span
            className={`${
              !isOpen ? "scale-110" : ""
            } transition-transform duration-200`}>
            <LogOut size={20} />
          </span>
          <span className={`ml-3 text-sm font-medium ${!isOpen && "hidden"}`}>
            ออกจากระบบ
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
