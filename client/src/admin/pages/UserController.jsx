import React from "react";

function UserController() {
  const user = [
    { name: "Kajonsak", age: "17", sex: "f" },
    { name: "Kajonsak", age: "17", sex: "f" },
    ,
    { name: "Kajonsak", age: "17", sex: "f" },
    ,
    { name: "Kajonsak", age: "17", sex: "f" },
    ,
    { name: "Kajonsak", age: "17", sex: "f" },
  ];
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a
              href="/admin/dashboard"
              className="text-blue-600 hover:text-blue-800">
              หน้าแรก
            </a>
          </li>
          <li>
            <a className="text-gray-500">ฟาร์ม</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserController;
