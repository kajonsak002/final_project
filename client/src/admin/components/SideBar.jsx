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
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

// รายการเมนูทั้งหมด
const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "dashboard",
  },
  { label: "ข้อมูลฟาร์ม", icon: <Users size={20} />, path: "user" },
  {
    label: "ข้อมูลคู่มือการเลี้ยงสัตว์",
    icon: <BookText size={20} />,
    path: "book",
  },
  { label: "จัดการโพสต์", icon: <Settings size={20} />, path: "post" },
  {
    label: "จัดการรายงานโพสต์",
    icon: <MailWarning size={20} />,
    path: "report_post",
  },
  {
    label: "รายงานความคิดเห็น",
    icon: <MailWarning size={20} />,
    path: "comment_report",
  },
  { label: "เเจ้งเตือนข่าวสาร", icon: <Newspaper size={20} />, path: "news" },
  {
    label: "รายงานสัตว์ที่เลี้ยง",
    icon: <ChartColumnBig size={20} />,
    path: "report_animal",
  },
  {
    label: "รายงานผลิตภัณฑ์",
    icon: <ChartColumnBig size={20} />,
    path: "report_product",
  },
  {
    label: "คำร้องขอเพิ่มรายการสัตว์",
    icon: <ChartColumnBig size={20} />,
    path: "animal_request",
  },
  {
    label: "คำร้องขอเพิ่มประเภทสัตว์",
    icon: <ChartColumnBig size={20} />,
    path: "animal_type_request",
  },
  {
    label: "รายการสัตว์",
    icon: <ChartColumnBig size={20} />,
    path: "animal_all",
  },
  {
    label: "รายการประเภทสัตว์",
    icon: <ChartColumnBig size={20} />,
    path: "animal_type_all",
  },
  {
    label: "จัดการหมวดหมู่",
    icon: <ChartColumnBig size={20} />,
    path: "category",
  },
];

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    toast.info("กำลังออกจากระบบ");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("login");
    }, 1500);
  };

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

      <div className="p-4">
        <h2
          className={`text-2xl font-bold text-center text-gray-800 ${
            !isOpen && "hidden"
          }`}>
          Admin Panel
        </h2>
      </div>

      <nav className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-150px)]">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === `/admin/${item.path}`;
          // console.log(location.pathname === `/admin/${item.path}`);
          return (
            <Link to={item.path} key={index}>
              <span
                className={`flex items-center p-2 rounded-lg ml-3 mb-2 transition-colors ${
                  !isOpen && "justify-center"
                } ${
                  isActive
                    ? "bg-base-300 text-primary font-semibold"
                    : "hover:bg-base-200"
                }`}>
                {item.icon}
                <span className={`ml-2 ${!isOpen && "hidden"}`}>
                  {item.label}
                </span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-base-200">
        <button
          onClick={handleLogout}
          className={`flex items-center p-2 w-full hover:bg-base-200 rounded-lg cursor-pointer ${
            !isOpen && "justify-center"
          }`}>
          <LogOut size={20} />
          <span className={`ml-2 ${!isOpen && "hidden"}`}>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
