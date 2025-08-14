import React, { useState } from "react";
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
  ChevronRight,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useSummaryCount } from "./SummaryCountContext";

// รายการเมนูทั้งหมด
const menuItems = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "dashboard",
  },
  {
    label: "ข้อมูลฟาร์ม",
    icon: <Users size={20} />,
    path: "user",
  },
  {
    label: "ข้อมูลคู่มือการเลี้ยงสัตว์",
    icon: <BookText size={20} />,
    path: "book",
  },
  {
    label: "จัดการข้อมูลสัตว์",
    icon: <Settings size={20} />,
    hasDropdown: true,
    subItems: [
      { label: "หมวดหมู่สัตว์", path: "category" },
      { label: "รายการสัตว์", path: "animal_all" },
      {
        label: "รายการประเภทสัตว์",
        path: "animal_type_all",
      },
    ],
  },
  // {
  //   label: "จัดการโพสต์",
  //   icon: <Settings size={20} />,
  //   hasDropdown: true,
  //   subItems: [
  //     // { label: "อนุมัติโพสต์", path: "post", countKey: "total_post_waiting" },
  //     {
  //       label: "รายงานโพสต์",
  //       path: "report_post",
  //       countKey: "total_report_post_waiting",
  //     },
  //   ],
  // },
  {
    label: "รายงานโพสต์",
    icon: <MailWarning size={20} />,
    path: "report_post",
    countKey: "total_report_post_waiting",
  },
  {
    label: "รายงานความคิดเห็น",
    icon: <MailWarning size={20} />,
    path: "comment_report",
    countKey: "total_comment_report_waiting",
  },
  {
    label: "ข่าวสาร",
    icon: <Newspaper size={20} />,
    hasDropdown: true,
    subItems: [
      { label: "จัดการข่าวสาร", path: "news" },
      { label: "ประวัติข่าวสารของฉัน", path: "news-history" },
    ],
  },
  {
    label: "คำร้องเพิ่มประเภทสัตว์",
    icon: <ChartColumnBig size={20} />,
    path: "animal_type_request",
    countKey: "total_animal_full_request_waiting",
  },

  // {
  //   label: "รายงาน",
  //   icon: <ChartColumnBig size={20} />,
  //   hasDropdown: true,
  //   subItems: [
  //     { label: "รายงานสัตว์ที่เลี้ยง", path: "report_animal" },
  //     { label: "รายงานสินค้าของฟาร์ม", path: "report_product" },
  //   ],
  // },
];

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const { summaryCount } = useSummaryCount();

  const getTotalSubCount = (item) => {
    if (!item.subItems) return 0;
    return item.subItems.reduce((sum, sub) => {
      if (sub.countKey && summaryCount[sub.countKey] > 0) {
        return sum + summaryCount[sub.countKey];
      }
      return sum;
    }, 0);
  };

  const handleLogout = () => {
    toast.info("กำลังออกจากระบบ");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/admin/login");
    }, 1500);
  };

  const toggleDropdown = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
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

      {/* Header */}
      <div className="p-4 border-b border-base-200">
        <h2
          className={`text-xl font-bold text-center text-green-600 transition-all duration-300 ${
            !isOpen && "hidden"
          }`}>
          <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </h2>
        {!isOpen && (
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-green-600 font-bold text-xl">F</span>
          </div>
        )}
      </div>
      {/* 
      <div className="p-4 text-sm text-gray-500">
        <pre>{JSON.stringify(summaryCount, null, 2)}</pre>
      </div> */}

      {/* Menu */}
      <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === `/admin/${item.path}`;
          const isExpanded = expandedMenus[index];
          const hasActiveSub = item.subItems?.some(
            (subItem) => location.pathname === `/admin/${subItem.path}`
          );

          return (
            <div key={index} className="mb-1">
              {/* Main Item */}
              {item.hasDropdown ? (
                <div
                  onClick={() => isOpen && toggleDropdown(index)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                    isOpen ? "justify-between" : "justify-center"
                  } ${
                    isActive || hasActiveSub
                      ? "bg-green-50 text-green-600 font-medium border-l-4 border-green-500"
                      : "hover:bg-base-200 hover:text-green-600"
                  }`}>
                  <div className="flex items-center">
                    <span className={`${!isOpen && "scale-110"}`}>
                      {item.icon}
                    </span>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        !isOpen && "hidden"
                      }`}>
                      {item.label}
                      {/* แสดง badge รวมถ้าเป็นเมนูหลักที่มี subItems */}
                      {getTotalSubCount(item) > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {getTotalSubCount(item)}
                        </span>
                      )}
                      {/* แสดง badge ปกติถ้าเป็นเมนูหลักที่มี countKey */}
                      {item.countKey && summaryCount[item.countKey] > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {summaryCount[item.countKey]}
                        </span>
                      )}
                    </span>
                  </div>
                  {isOpen && (
                    <span
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}>
                      <ChevronRight size={16} />
                    </span>
                  )}
                </div>
              ) : (
                <Link to={item.path}>
                  <div
                    className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                      isOpen ? "justify-start" : "justify-center"
                    } ${
                      isActive
                        ? "bg-green-50 text-green-600 font-medium border-l-4 border-green-500"
                        : "hover:bg-base-200 hover:text-green-600"
                    }`}>
                    <span className={`${!isOpen && "scale-110"}`}>
                      {item.icon}
                    </span>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        !isOpen && "hidden"
                      }`}>
                      {item.label}
                      {item.countKey && summaryCount[item.countKey] > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                          {summaryCount[item.countKey]}
                        </span>
                      )}
                    </span>
                  </div>
                </Link>
              )}

              {/* Sub-items */}
              {item.hasDropdown && isExpanded && isOpen && (
                <div className="mt-2 ml-6 space-y-1 border-l-2 border-base-300 pl-4">
                  {item.subItems.map((sub, subIndex) => {
                    const isSubActive =
                      location.pathname === `/admin/${sub.path}`;
                    return (
                      <Link to={sub.path} key={subIndex}>
                        <div
                          className={`flex items-center p-2 rounded-md transition-all duration-200 text-sm group ${
                            isSubActive
                              ? "bg-green-50 text-green-600 font-medium"
                              : "hover:bg-base-200 hover:text-green-600 text-base-content/70"
                          }`}>
                          <span
                            className={`w-2 h-2 rounded-full mr-3 ${
                              isSubActive ? "bg-green-500" : "bg-base-300"
                            }`}></span>
                          {sub.label}
                          {sub.countKey && summaryCount[sub.countKey] > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                              {summaryCount[sub.countKey]}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-base-200 mt-auto">
        <button
          onClick={handleLogout}
          className={`flex items-center p-3 w-full hover:bg-red-50 hover:text-red-500 rounded-lg cursor-pointer transition-all duration-200 group ${
            !isOpen && "justify-center"
          }`}>
          <span className={`${!isOpen && "scale-110"}`}>
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
