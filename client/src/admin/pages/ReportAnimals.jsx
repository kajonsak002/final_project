import React from "react";

function ReportAnimals() {
  return (
    <div>
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
              <a className="text-gray-500">รายงานสัตว์ที่เลี้ยง</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ReportAnimals;
