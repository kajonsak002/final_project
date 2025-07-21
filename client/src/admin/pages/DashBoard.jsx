import React from "react";
import Summary from "../components/Summary";
import TableUser from "../TableUser";
import CategoryController from "./CategoryController";
import { Route } from "react-router-dom";

function DashBoard() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">DashBoard</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Summary />
        <div className="w-full overflow-x-auto max-w-full">
          <h2 className="text-xl font-bold mb-2">จัดการอนุมัติการลงทะเบียน</h2>
          <TableUser />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
