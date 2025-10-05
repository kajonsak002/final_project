import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GuildBookEditor from "../components/GuildbookEditor";
import { toast } from "../../utils/toast";

function EditGuildBook() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [sourceRefs, setSourceRefs] = useState([""]);
  const [tags, setTags] = useState([""]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchGuildBookData();
  }, [id]);

  const fetchGuildBookData = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_URL_API + `guildbook/${id}`
      );
      const guildBook = response.data.data;
      // console.log(guildBook);
      setTitle(guildBook.title || "");
      setContent(guildBook.content || "");
      setSourceRefs(
        guildBook.source_refs && guildBook.source_refs.length > 0
          ? guildBook.source_refs
          : [""]
      );
      setTags(
        guildBook.tags && guildBook.tags.length > 0 ? guildBook.tags : [""]
      );

      setCurrentImage(guildBook.image || null);
      setImagePreview(guildBook.image || null);
    } catch (error) {
      console.error("Error fetching guild book:", error);
      navigate("/admin/book");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleEditorChange = (value) => {
    setContent(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("กรุณากรอกหัวข้อและเนื้อหาให้ครบถ้วน");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("source_refs", JSON.stringify(sourceRefs));
      formData.append("tags", JSON.stringify(tags));
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.patch(
        import.meta.env.VITE_URL_API + `guildbook/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("แก้ไขคู่มือเรียบร้อยแล้ว");
        setTimeout(() => {
          navigate("/admin/book");
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating guild book:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขคู่มือ");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/book");
  };

  const [newTagInput, setNewTagInput] = useState("");

  const handleAddTag = (newTag) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };

  const removeTags = (index) => {
    const updated = tags.filter((_, i) => i !== index);
    setTags(updated);
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center h-64">
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
                  href="/admin/book"
                  className="text-blue-600 hover:text-blue-800">
                  จัดการคู่มือการเลี้ยงสัตว์
                </a>
              </li>
              <li>
                <span className="text-black">แก้ไขคู่มือการเลี้ยงสัตว์</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              แก้ไขคู่มือการเลี้ยงสัตว์
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หัวข้อ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ระบุหัวข้อ"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ภาพปก
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={
                      imagePreview.startsWith("http")
                        ? imagePreview
                        : URL.createObjectURL(image)
                    }
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เนื้อหา <span className="text-red-500">*</span>
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <GuildBookEditor
                  content={content}
                  handleEditorChange={handleEditorChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แหล่งที่มา
              </label>
              {sourceRefs.map((ref, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="เช่น กรมปศุสัตว์ หรือ https://..."
                    value={ref}
                    onChange={(e) => {
                      const updated = [...sourceRefs];
                      updated[i] = e.target.value;
                      setSourceRefs(updated);
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSourceRefs(sourceRefs.filter((_, idx) => idx !== i))
                    }
                    className="text-red-500 hover:text-red-700 font-bold">
                    ลบ
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setSourceRefs([...sourceRefs, ""])}
                className="mt-2 px-3 py-1 btn bg-green-500 text-white">
                + เพิ่มแหล่งอ้างอิง
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เพิ่ม Tags
              </label>

              {/* Display existing tags as chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map(
                  (tag, i) =>
                    tag && (
                      <div
                        key={i}
                        className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTags(i)}
                          className="ml-1 text-green-600 hover:text-green-800 hover:bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                          ×
                        </button>
                      </div>
                    )
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="เช่น โรคในไก่ หรือ โรคระบาด..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newTagInput.trim()) {
                        handleAddTag(newTagInput.trim());
                        setNewTagInput("");
                      }
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTagInput.trim()) {
                      handleAddTag(newTagInput.trim());
                      setNewTagInput("");
                    }
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                  เพิ่ม
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancel}
                className="btn bg-red-500 text-white w-22">
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn bg-green-500 text-white w-22">
                {loading ? (
                  <div className="loading loading-spinner loading-sm"></div>
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

export default EditGuildBook;
