import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { use, useEffect } from "react";
import { Link } from "react-router-dom";

function GuildBookController() {
  return (
    <>
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
              <a className="text-gray-500">จัดการคู่มือการเลี้ยงสัตว์</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default GuildBookController;
