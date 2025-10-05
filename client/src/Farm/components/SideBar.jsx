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
  CirclePlus,
  ChevronRight,
} from "lucide-react";
import { toast } from "../../utils/toast";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleLogout = () => {
    toast.info("กำลังออกจากระบบ", {
      timer: 1500,
    });
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
      name: "บันทึกการจำหน่าย",
      icon: <BookText size={20} />,
      path: "logs",
    },
    {
      name: "ส่งคำร้องเพิ่มรายการสัตว์",
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
      hasDropdown: true,
      subItems: [
        { name: "ดูข่าวสาร", path: "news" },
        { name: "ประวัติข่าวสารของฉัน", path: "news-history" },
      ],
    },
    {
      name: "ประวัติการถูกรายงาน",
      icon: <MailWarning size={20} />,
      hasDropdown: true,
      subItems: [
        { name: "รายงานโพสต์", path: "report/post" },
        { name: "รายงานความคิดเห็น", path: "report/comment" },
      ],
    },
    {
      name: "ประวัติการแจ้งรายงาน",
      icon: <MailWarning size={20} />,
      hasDropdown: true,
      subItems: [
        { name: "รายงานโพสต์ของฉัน", path: "report/sent/post" },
        { name: "รายงานความคิดเห็นของฉัน", path: "report/sent/comment" },
      ],
    },
  ];

  const toggleDropdown = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isMenuActive = (item, index) => {
    if (item.hasDropdown) {
      return (
        item.subItems.some(
          (sub) => location.pathname === `/profile/${sub.path}`
        ) || location.pathname === `/profile/${item.path}`
      );
    } else {
      return location.pathname === `/profile/${item.path}`;
    }
  };

  return (
    <aside
      className={`bg-base-100 border-r border-base-200 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}>
      <div className="p-4 border-b border-base-200 text-center space-y-2">
        {isOpen && (
          <>
            <img
              src={localStorage.getItem("image_profile")}
              alt="Farm"
              className="w-16 h-16 object-cover rounded-full mx-auto"
            />
          </>
        )}

        <div className="flex items-center justify-center space-x-2">
          {!isOpen ? (
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">
                {localStorage.getItem("username").slice(0, 1)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-700">
              {localStorage.getItem("username")}
            </span>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-150px)]">
        {menuItems.map((item, index) => {
          const isActive = isMenuActive(item, index);
          const isExpanded = expandedMenus[index];

          if (item.hasDropdown) {
            return (
              <div key={index} className="mb-1">
                <div
                  onClick={() => isOpen && toggleDropdown(index)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group ${
                    isOpen ? "justify-between" : "justify-center"
                  } ${
                    isActive
                      ? "bg-green-50 text-green-600 font-medium border-l-4 border-green-500"
                      : "hover:bg-base-200 hover:text-green-600"
                  }`}>
                  <div className="flex items-center">
                    <span className={`${!isOpen ? "scale-110" : ""}`}>
                      {item.icon}
                    </span>
                    <span
                      className={`ml-3 text-sm font-medium ${
                        !isOpen && "hidden"
                      }`}>
                      {item.name}
                    </span>
                  </div>
                  {isOpen && (
                    <ChevronRight
                      size={16}
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  )}
                </div>
                {isExpanded && isOpen && (
                  <div className="mt-2 ml-6 space-y-1 border-l-2 border-base-300 pl-4">
                    {item.subItems.map((sub, subIndex) => {
                      const isSubActive =
                        location.pathname === `/profile/${sub.path}`;
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
                            {sub.name}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          } else {
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
          }
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
