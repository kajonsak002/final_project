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
    <div className="">
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <a>หน้าเเรก</a>
          </li>
          <li>ฟาร์ม</li>
        </ul>
      </div>
    </div>
  );
}

export default UserController;
