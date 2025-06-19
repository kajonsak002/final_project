import React, { useState } from "react";
import CardPost from "../components/CardPost"; // ← อย่าลืม import

function Comunity() {
  const postData = [
    {
      id: 1,
      username: "สมชาย ฟาร์มสุข",
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      date: "20 เม.ย. 2025",
      content: "วันนี้อากาศดีมากครับ ฟาร์มสดใสมาก ☀️",
      image: "https://mpics.mgronline.com/pics/Images/561000004876701.JPEG",
    },
    {
      id: 2,
      username: "สายไหม ฟาร์มหมู",
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      date: "19 เม.ย. 2025",
      content: "แจกหมูฟรี 1 ตัว! สำหรับคนที่กดไลก์โพสต์นี้ 🐷",
    },
    {
      id: 3,
      username: "สายไหม ฟาร์มหมู",
      avatar:
        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      date: "19 เม.ย. 2025",
      content: "แจกหมูฟรี 1 ตัว! สำหรับคนที่กดไลก์โพสต์นี้ 🐷",

      image: "https://mpics.mgronline.com/pics/Images/561000004876701.JPEG",
    },
  ];

  const [detail, setDetail] = useState();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div className="breadcrumbs text-md">
        <ul>
          <li>หน้าเเรก</li>
          <li>ระบบชุมชน</li>
        </ul>
      </div>
      <div className="mx-auto flex flex-col justify-center items-center">
        {/* Add New Post */}
        <div
          className="add-post cursor-pointer"
          onClick={() => document.getElementById("add_post").showModal()}>
          <div className="card bg-base-100 w-[700px] shadow-sm">
            <div className="card-body">
              <div className="flex items-center">
                <div className="avatar mx-2">
                  <div className="w-[50px] rounded-full">
                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                  </div>
                </div>
                <input
                  type="text"
                  readOnly
                  className="input rounded-xl w-full bg-[#F3F4F6] text-gray-400 border-0 cursor-pointer"
                  placeholder="คุณกำลังคิดอะไรอยู่"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="fillter-post mt-4">
          <div className="card w-[700px] bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex gap-2">
                <div className="btn bg-[#EFF6FF] text-[#2563EB] rounded-2xl">
                  โพสต์ทั้งหมด
                </div>
                <div className="btn bg-[#EFF6FF] text-[#2563EB] rounded-2xl">
                  โพสต์ของฉัน
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Post Cards */}
        {postData.map((post) => (
          <CardPost key={post.id} post={post} />
        ))}

        <dialog id="add_post" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">เพิ่มโพสต์</h3>

            {/* ช่องใส่เนื้อหา */}
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="เขียนเนื้อหาโพสต์ที่นี่..."
              className="textarea textarea-bordered w-full mb-4"
              rows={4}></textarea>

            {/* ช่องใส่รูปภาพ */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />

            {/* แสดงรูปภาพที่เลือก */}
            {selectedImg && (
              <div className="mt-4">
                <img
                  src={selectedImg}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="flex mt-2 justify-end">
              <div className="btn btn-primary">เพิ่มโพสต์</div>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </>
  );
}

export default Comunity;
