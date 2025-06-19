import React from "react";
import { Link } from "react-router-dom";
import { Menu, UserCircle } from "lucide-react";

const Header = ({ toggleSidebar, dropdownOpen, setDropdownOpen }) => {
  return (
    <header className="bg-base-100 border-b border-base-200">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-base-200 cursor-pointer">
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
