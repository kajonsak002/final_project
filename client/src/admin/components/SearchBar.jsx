import React from "react";
import { Search } from "lucide-react";

function SearchBar({ value, onChange }) {
  return (
    <label className="input w-full">
      <Search className="opacity-50 h-4" />
      <input
        type="search"
        className="grow"
        placeholder="ค้นหาข้อมูล"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default SearchBar;
