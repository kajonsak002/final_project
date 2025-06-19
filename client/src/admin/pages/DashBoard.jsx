import React from "react";
import Summary from "../components/Summary";
import TableUser from "../TableUser";

function DashBoard() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">DashBoard</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Summary />
        <div className="w-full overflow-x-auto max-w-full">
          <TableUser />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
