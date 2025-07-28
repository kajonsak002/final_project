import React, { useState } from "react";
import TinyEditor from "../../components/TinyEditor";

function AddNews({ navigate }) {
  const [newsTitle, setNewsTitle] = useState("");
  const [content, setContent] = useState("");

  const handleEditorChange = (value, editor) => {
    setContent(value);
    // console.log("Content:", value);
  };

  const handleSubmit = async () => {
    alert("กำลังพัฒนา....");
  };

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a
                  href="/profile"
                  className="text-blue-600 hover:text-blue-800">
                  หน้าแรก
                </a>
              </li>
              <li>
                <a
                  href="/profile/news"
                  className="text-blue-600 hover:text-blue-800">
                  ข่าวสาร
                </a>
              </li>
              <li>
                <a className="text-gray-500">เพิ่มข่าวสาร</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">เพิ่มข่าวสาร</h1>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label
                htmlFor="newsTitle"
                className="block text-sm font-medium text-gray-700 mb-2">
                หัวข่าว <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="newsTitle"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                placeholder="ระบุหัวข้อข่าวสาร"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เนื้อหาข่าว <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <TinyEditor
                  content={content}
                  handleEditorChange={handleEditorChange}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button className="btn  bg-red-500 text-white w-22">
                ยกเลิก
              </button>
              <button className="btn bg-green-500 text-white w-22">
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNews;
