import React, { useState, useEffect } from "react";
import TinyEditor from "../../components/TinyEditor";
import { toast } from "../../utils/toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditNews() {
  const [newsTitle, setNewsTitle] = useState("");
  const [content, setContent] = useState("");
  const [sourceRef, setSourceRef] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const fetchNewsDetail = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_URL_API}news/detail/${id}`
      );
      const news = response.data.data[0];
      setNewsTitle(news.title);
      setContent(news.content);
      setSourceRef(news.source_ref || "");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news detail:", error);
      toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูลข่าวสาร");
      setLoading(false);
    }
  };

  const handleEditorChange = (value, editor) => {
    setContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      newsTitle,
      content,
      sourceRef,
    };

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_URL_API}news/${id}`,
        payload
      );
      toast.success(res.data.msg);
      setTimeout(() => {
        navigate("/admin/news-history");
      }, 1000);
    } catch (err) {
      console.log("Error update news", err);
      toast.error(err.response?.data?.msg || "เกิดข้อผิดพลาดในการแก้ไขข่าวสาร");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full">
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
                <a
                  href="/admin/news-history"
                  className="text-blue-600 hover:text-blue-800">
                  ประวัติข่าวสารของฉัน
                </a>
              </li>
              <li>
                <a className="text-black">แก้ไขข่าวสาร</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">แก้ไขข่าวสาร</h1>
          </div>
          <form onSubmit={(e) => handleSubmit(e)} className="p-4 space-y-4">
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
                required
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แหล่งที่มา
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="เช่น กรมปศุสัตว์ หรือ https://..."
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/admin/news-history")}
                className="btn bg-red-500 text-white w-22"
                disabled={saving}>
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn bg-green-500 text-white w-22"
                disabled={saving}>
                {saving ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "บันทึก"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditNews;
