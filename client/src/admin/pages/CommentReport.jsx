import React from "react";
import { Link } from "react-router-dom";

function CommentReport() {
  return (
    <div>
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <Link to={"/admin/dashboard"}>หน้าเเรก</Link>
          </li>
          <li>จัดการรายงานความคิดเห็น</li>
        </ul>
      </div>
    </div>
  );
}

export default CommentReport;
