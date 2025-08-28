import React from "react";
import { Link } from "react-router-dom";

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
              <span className="text-gray-500">รายงานสัตว์ที่เลี้ยง</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ลิงก์เปิดในแท็บใหม่ */}
      <Link
        to="/admin/report/animals"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800">
        ดูรายงานสัตว์
      </Link>
    </div>
  );
}

export default ReportAnimals;
