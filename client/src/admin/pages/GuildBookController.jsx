import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { use, useEffect } from "react";
import { Link } from "react-router-dom";

function GuildBookController() {
  return (
    <>
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <a>หน้าเเรก</a>
          </li>
          <li>จัดการคู่มือการเลี้ยงสัตว์</li>
        </ul>
      </div>
    </>
  );
}

export default GuildBookController;
