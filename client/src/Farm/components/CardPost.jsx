import React, { useState } from "react";
import { Ellipsis } from "lucide-react";

function CardPost({ post }) {
  const [detail, setDetail] = useState("");
  const handleReport = () => {
    console.log("📢 รายงานโพสต์:");
    console.log("🆔 ID:", post.id);
    console.log("📝 detail:", detail);
  };

  return (
    <div className="card w-[700px] bg-white shadow-md mt-4">
      <div className="card-body">
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-row">
            <div className="avatar mr-3">
              <div className="w-10 rounded-full">
                <img src={post.avatar} alt="avatar" />
              </div>
            </div>
            <div>
              <h2 className="font-semibold">{post.username}</h2>
              <p className="text-sm text-gray-500">{post.date}</p>
            </div>
          </div>
          <div>
            <div className="dropdown dropdown-start">
              <div tabIndex={0} role="button" className="cursor-pointer">
                <Ellipsis />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                <li>
                  <a
                    onClick={() =>
                      document
                        .getElementById(`report_modal_${post.id}`)
                        .showModal()
                    }>
                    รายงาน
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <p>{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="post"
            className="mt-2 w-full max-h-[400px] object-cover rounded-lg"
          />
        )}
      </div>

      {/* Modal Form Report Post */}
      <dialog id={`report_modal_${post.id}`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">รายงานโพสต์</h3>
          <fieldset className="fieldset">
            <legend className="fieldset-legend text-sm font-medium">
              เหตุผล
            </legend>
            <textarea
              className="textarea h-24 w-full"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="ระบุเหตุผลการรายงานโพสต์"></textarea>
          </fieldset>
          <div className="flex justify-end mt-2">
            <button className="btn btn-primary" onClick={handleReport}>
              รายงาน
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default CardPost;
