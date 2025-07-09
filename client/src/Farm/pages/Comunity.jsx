import React, { useState, useEffect } from "react";
import {
  Calendar,
  Eye,
  Image,
  MessageSquare,
  Sparkles,
  X,
  Clock,
  UserCircle,
  Send,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DetailPost from "../components/DetailPost";
function Community() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [addPostModal, setAddPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [comment, setComment] = useState([]);
  const farmer_id = localStorage.getItem("farmer_id");

  const getAllPost = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_URL_API + "post", {
        farmer_id,
      });
      setPosts(res.data.posts);
      // console.log(res.data.posts);
    } catch (err) {
      console.log("Error fetch Post : ", err);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
    console.log("Selected Post : ", post);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("th").format("D MMMM YYYY เวลา HH:mm");
  };

  const handleInputImg = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleAddPost = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("image", selectedFile);
        const res = await axios.post(
          import.meta.env.VITE_URL_API + "post/insert-post-img",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        toast.success(res.data.message);
      } else {
        const res = await axios.post(
          import.meta.env.VITE_URL_API + "post/insert",
          { content },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        toast.success(res.data.message);
      }
      setContent("");
      setSelectedFile(undefined);
      setPreview(undefined);
      setAddPostModal(false);
      getAllPost();
    } catch (err) {
      console.log("Error Add Post : ", err);
      toast.error(err.respone.message);
    }
  };

  return (
    <>
      <ToastContainer />
      {/* Breadcrumb */}
      <div className="breadcrumbs text-md">
        <ul>
          <li>หน้าเเรก</li>
          <li>ระบบชุมชน</li>
        </ul>
      </div>

      {/* Add Post */}
      <div className="flex justify-center items-center mt-4">
        <div
          className="card bg-white shadow-lg hover:shadow-xl h-[140px] transition-shadow duration-200 w-full max-w-2xl border border-gray-200 cursor-pointer"
          onClick={() => setAddPostModal(true)}>
          <div className="card-body flex flex-row items-center w-full p-4">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full ring-2 ring-gray-200">
                <img
                  src={localStorage.getItem("image_profile")}
                  alt="Profile"
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="input-form w-full ml-4">
              <input
                type="text"
                placeholder="คุณกำลังคิดอะไรอยู่..."
                className="input w-full bg-gray-50 border-gray-200 focus:border-blue-400 focus:bg-white transition-all duration-200 rounded-full px-4"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add post */}
      {addPostModal && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-lg bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-2xl text-gray-800">
                เพิ่มโพสต์ใหม่
              </h3>
              <button
                className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
                onClick={() => {
                  setAddPostModal(false);
                  setSelectedFile(null);
                  setPreview(null);
                }}>
                ✕
              </button>
            </div>

            <form className="space-y-4" encType="multipart/form-data">
              <div>
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    เนื้อหาโพสต์
                  </span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="textarea textarea-bordered w-full h-32 resize-none focus:border-blue-400 transition-colors duration-200"
                  placeholder="แบ่งปันความคิดของคุณ..."></textarea>
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    รูปภาพ
                  </span>
                </label>

                {/* Custom File Upload Button */}
                <div className="flex flex-col space-y-3 mt-2">
                  <label className="btn btn-outline w-full cursor-pointer flex items-center gap-2">
                    <Image />
                    เลือกรูปภาพ
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleInputImg}
                    />
                  </label>

                  {/* Image Preview */}
                  {selectedFile && preview && (
                    <div className="relative">
                      <div className="bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-200">
                        <div className="relative max-w-full max-h-64 overflow-hidden rounded-lg">
                          <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-auto max-h-64 object-contain rounded-lg shadow-sm"
                          />
                        </div>
                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreview(null);
                          }}
                          className="absolute top-1 right-1 btn btn-sm btn-circle btn-error btn-outline bg-white hover:bg-red-50">
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="modal-action  mt-4 flex gap-3">
              <button
                onClick={handleAddPost}
                className="btn bg-green-700 text-white w-1/2 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                โพสต์
              </button>
              <button
                className="btn bg-red-600 w-1/2 text-white"
                onClick={() => {
                  setAddPostModal(false);
                  setSelectedFile(null);
                  setPreview(null);
                }}>
                ยกเลิก
              </button>
            </div>
          </div>
          {/* Modal Backdrop */}
          <div
            className="modal-backdrop"
            onClick={() => setAddPostModal(false)}></div>
        </dialog>
      )}

      {/* แสดงโพสต์ทั้งหมด */}
      <div className="max-w-2xl mx-auto space-y-6 mt-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-500 text-lg">ยังไม่มีโพสต์ในชุมชน</p>
            <p className="text-gray-400">เป็นคนแรกที่แบ่งปันประสบการณ์!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.post_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-50 hover:shadow-xl transition-all duration-300">
              {/* Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <img src={post?.farm_img} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {post.farm_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {/* ฟาร์ม #{post.farmer_id} */}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.create_at)}
                  </div>
                </div>

                {/* Content */}
                <div className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                  {post.content}
                </div>

                {/* Image */}
                {post.image_post && (
                  <div className="mb-4">
                    <img
                      src={post.image_post}
                      alt="โพสต์"
                      className="w-full h-120 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(post)}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-medium">
                    <Eye className="w-4 h-4" />
                    ดูรายละเอียด
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {showPostDetail && (
          <DetailPost
            open={showPostDetail}
            post={selectedPost}
            onClose={() => {
              setShowPostDetail(false);
              setSelectedPost(null);
            }}
            comment={comment}
          />
        )}
      </div>
    </>
  );
}

export default Community;
