import React, { useState, useEffect, useRef } from "react";
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
  Plus,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import DetailPost from "../components/DetailPost";
import Pagination from "../../admin/components/Pagination";
import { Link } from "react-router-dom";
function Community() {
  const [posts, setPosts] = useState([]);
  const [isShowPostMe, setIsShowPostMe] = useState(false);
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [addPostModal, setAddPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [comment, setComment] = useState([]);
  const farmer_id = localStorage.getItem("farmer_id");
  const [commentForPost, setCommentForPost] = useState([]);
  const [editPostModal, setEditPostModal] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editSelectedFile, setEditSelectedFile] = useState();
  const [editPreview, setEditPreview] = useState();
  const [editPostId, setEditPostId] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportPostId, setReportPostId] = useState(null);
  const [reportComment, setReportComment] = useState(false);
  const [reportCommentReason, setReportCommentReason] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const getAllPost = async () => {
    try {
      const res = await axios.post(import.meta.env.VITE_URL_API + "post", {
        farmer_id,
      });
      setPosts(res.data.posts);
      setIsShowPostMe(false);
      // console.log(res.data.posts);
    } catch (err) {
      console.log("Error fetch Post : ", err);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);

  const handleViewDetails = (post) => {
    getComment(post.post_id);
    setSelectedPost(post);
    setShowPostDetail(true);
    // console.log("Selected Post : ", post);
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

  const getComment = async (post_id) => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `comment/get-comment/${post_id}`
      );
      setCommentForPost(res.data.comments);
    } catch (err) {
      console.log("Error get comment", err);
      toast.error(err.respone.data.msg);
    }
  };

  const handleAddComment = async (post_id) => {
    // console.log({
    //   farmer_id,
    //   post_id,
    //   comment,
    // });

    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "comment/add",
        {
          farmer_id,
          post_id,
          content: comment,
        }
      );
      getComment(post_id);
      getAllPost();
      toast.success(res.data.msg);
      setComment("");
    } catch (err) {
      console.log("Error Add comment : ", err);
      toast.error(err.respone.data.msg);
    }
  };

  const getPostHistoyry = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "post-history",
        { farmer_id }
      );
      console.log(res.data?.posts);
      setPosts(res.data?.posts);
      setIsShowPostMe(true);
    } catch (err) {
      console.log("Error to get history post : ", err);
    }
  };

  const handleOpenEditPost = (post) => {
    setEditPostId(post.post_id);
    setEditContent(post.content);
    setEditSelectedFile(undefined);
    setEditPreview(post.image_post);
    setEditPostModal(true);
    setRemoveImage(false);
  };

  useEffect(() => {
    if (!editSelectedFile) {
      setEditPreview(selectedPost?.image_post || null);
      return;
    }
    const objectUrl = URL.createObjectURL(editSelectedFile);
    setEditPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [editSelectedFile]);

  const handleEditPost = async () => {
    try {
      const formData = new FormData();
      formData.append("content", editContent);
      if (editSelectedFile) {
        formData.append("image", editSelectedFile);
      }
      if (removeImage) {
        formData.append("remove_image", true);
      }
      const res = await axios.post(
        `${import.meta.env.VITE_URL_API}post/edit/${editPostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      toast.success(res.data.message);
      setEditPostModal(false);
      setEditContent("");
      setEditSelectedFile(undefined);
      setEditPreview(undefined);
      setEditPostId(null);
      setRemoveImage(false);
      getPostHistoyry();
    } catch (err) {
      console.log("Error Edit Post : ", err);
      toast.error(
        err?.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขโพสต์"
      );
    }
  };

  const handleOpenReportModal = (post) => {
    setReportPostId(post.post_id);
    setReportModal(true);
    setReportReason("");
  };

  const handleReportPost = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_URL_API + "post/report-post",
        {
          post_id: reportPostId,
          reason: reportReason,
          farmer_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      toast.success("รายงานโพสต์เรียบร้อยแล้ว");
      setReportModal(false);
      setReportReason("");
      setReportPostId(null);
    } catch (err) {
      toast.error("เกิดข้อผิดพลาดในการรายงานโพสต์");
    }
  };

  const handleReportCommentSubmit = async () => {
    const payload = {
      comment_id: selectedComment.comment_id,
      post_id: selectedComment.post_id,
      farmer_id,
      reason: reportCommentReason,
    };
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "comment/report-comment",
        payload
      );
      console.log(res.data);
      toast.success(res.data.msg);
      setReportComment(false);
    } catch (err) {
      console.log("Error report comment : ", err);
      toast.error(err.respone.data.msg);
    }
  };

  const handleDelPost = async (postId) => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + `post/delete/${postId}`,
        { farmer_id: localStorage.getItem("farmer_id") }
      );
      toast.success("ลบโพสต์สำเร็จเเล้ว");
      getPostHistoyry();
    } catch (err) {
      console.log("Error to Delete post : ", err);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState([]);
  const itemPerpage = 5;

  useEffect(() => {
    const indexOfLast = currentPage * itemPerpage;
    const indexOfFirst = indexOfLast - itemPerpage;

    setPageData(filteredPosts.slice(indexOfFirst, indexOfLast));
  }, [currentPage, posts, searchTerm, searchDate]);

  const filteredPosts = posts.filter((post) => {
    const matchText =
      post.farm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDate = searchDate
      ? dayjs(post.create_at).format("YYYY-MM-DD") === searchDate
      : true;

    return matchText && matchDate;
  });

  const totalPages = Math.ceil(filteredPosts.length / itemPerpage);

  return (
    <>
      <ToastContainer />
      {/* Breadcrumb */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/profile" className="text-blue-600 hover:text-blue-800">
                หน้าแรก
              </a>
            </li>
            <li>
              <a className="text-gray-500">ระบบชุมชน</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="card bg-white shadow-lg hover:shadow-xl  transition-shadow duration-200 w-full border border-gray-200">
          <div className="card-body w-full p-4">
            <div className="flex items-center">
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
                  onClick={() => setAddPostModal(true)}
                  type="text"
                  placeholder="คุณกำลังคิดอะไรอยู่..."
                  className="input w-full bg-gray-50 border-gray-200 focus:border-blue-400 focus:bg-white transition-all duration-200 rounded-full px-4"
                  readOnly
                />
              </div>
              <button
                className="p-2 mx-2 text-white cursor-pointer bg-green-500 rounded-2xl"
                onClick={() => setAddPostModal(true)}>
                <Plus />
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อฟาร์ม หรือ เนื้อหาโพสต์..."
                className="input  input-bordered w-full sm:w-2/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="date"
                className="input input-bordered w-full sm:w-1/3"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                className={`btn ${
                  !isShowPostMe ? "text-white bg-green-500" : "btn-outline"
                } rounded-md`}
                onClick={getAllPost}>
                โพสต์ทั้งหมด
              </button>
              <button
                className={`btn ${
                  isShowPostMe ? "text-white bg-green-500" : "btn-outline"
                } rounded-md`}
                onClick={getPostHistoyry}>
                โพสต์ของฉัน
              </button>
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

      {/* Modal Edit Post */}
      {editPostModal && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-lg bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-2xl text-gray-800">แก้ไขโพสต์</h3>
              <button
                className="btn btn-sm btn-circle btn-ghost hover:bg-gray-100"
                onClick={() => {
                  setEditPostModal(false);
                  setEditSelectedFile(undefined);
                  setEditPreview(undefined);
                  setEditContent("");
                  setEditPostId(null);
                  setRemoveImage(false);
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
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="textarea textarea-bordered w-full h-32 resize-none focus:border-blue-400 transition-colors duration-200"
                  placeholder="แก้ไขเนื้อหาโพสต์..."></textarea>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    รูปภาพ
                  </span>
                </label>
                <div className="flex flex-col space-y-3 mt-2">
                  <label className="btn btn-outline w-full cursor-pointer flex items-center gap-2">
                    <Image />
                    เลือกรูปภาพใหม่ (ถ้าต้องการ)
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        if (!e.target.files || e.target.files.length === 0) {
                          setEditSelectedFile(undefined);
                          return;
                        }
                        setEditSelectedFile(e.target.files[0]);
                      }}
                    />
                  </label>
                  {/* Image Preview */}
                  {editPreview && (
                    <div className="relative">
                      <div className="bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-200">
                        <div className="relative max-w-full max-h-64 overflow-hidden rounded-lg">
                          <img
                            src={editPreview}
                            alt="Preview"
                            className="w-full h-auto max-h-64 object-contain rounded-lg shadow-sm"
                          />
                        </div>
                        {/* Remove Image Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditSelectedFile(undefined);
                            setEditPreview(undefined);
                            setRemoveImage(true);
                          }}
                          className="absolute top-1 right-1 btn btn-sm btn-circle btn-error btn-outline bg-white hover:bg-red-50">
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                  {editPreview && (
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={removeImage}
                        onChange={(e) => setRemoveImage(e.target.checked)}
                        className="checkbox checkbox-error"
                      />
                      <span className="text-sm text-gray-600">ลบรูปภาพออก</span>
                    </label>
                  )}
                </div>
              </div>
            </form>
            {/* Action Buttons */}
            <div className="modal-action  mt-4 flex gap-3">
              <button
                onClick={handleEditPost}
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
                บันทึก
              </button>
              <button
                className="btn bg-red-600 w-1/2 text-white"
                onClick={() => {
                  setEditPostModal(false);
                  setEditSelectedFile(undefined);
                  setEditPreview(undefined);
                  setEditContent("");
                  setEditPostId(null);
                  setRemoveImage(false);
                }}>
                ยกเลิก
              </button>
            </div>
          </div>
          {/* Modal Backdrop */}
          <div
            className="modal-backdrop"
            onClick={() => setEditPostModal(false)}></div>
        </dialog>
      )}

      {/* Modal Report Post */}
      {reportModal && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-md bg-white shadow-2xl">
            <h3 className="font-bold text-lg mb-4">รายงานโพสต์</h3>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="โปรดระบุเหตุผลในการรายงาน"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="modal-action mt-4 flex gap-3">
              <button
                className="btn bg-green-500  text-white"
                onClick={handleReportPost}
                disabled={!reportReason.trim()}>
                ส่งรายงาน
              </button>
              <button className="btn" onClick={() => setReportModal(false)}>
                ยกเลิก
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setReportModal(false)}></div>
        </dialog>
      )}

      {/* แสดงโพสต์ทั้งหมด */}
      {/* <div className="max-w-2xl mx-auto space-y-6 mt-4"> */}
      <div className=" space-y-6 mt-4">
        {filteredPosts.length === 0 ? (
          <div className="card card-body bg-base-100 h-screen">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-500 text-lg">ไม่พบข้อมูลที่ค้นหา</p>
              <p className="text-gray-400">
                ลองเปลี่ยนการค้นหาจากวันที่ เนื้อหา ชื่อฟาร์ม!
              </p>
            </div>
          </div>
        ) : (
          pageData.map((post) => (
            <div
              key={post.post_id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-50 hover:shadow-xl transition-all duration-300">
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                        <Link to={`/profile/farm/${post.farmer_id}`}>
                          <img
                            src={post?.farm_img}
                            alt="Farm"
                            className="rounded-full object-cover"
                          />
                        </Link>
                      </div>
                    </div>
                    <div>
                      <Link to={`/profile/farm/${post.farmer_id}`}>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {post.farm_name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {formatDate(post.create_at)}
                      </div>
                    </div>
                  </div>
                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-sm btn-circle">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                      {isShowPostMe ? (
                        <>
                          <li>
                            <a onClick={() => handleOpenEditPost(post)}>
                              แก้ไขโพสต์
                            </a>
                          </li>
                          <li>
                            <a onClick={() => handleDelPost(post.post_id)}>
                              ลบโพสต์
                            </a>
                          </li>
                        </>
                      ) : (
                        <li>
                          <a onClick={() => handleOpenReportModal(post)}>
                            รายงานโพสต์
                          </a>
                        </li>
                      )}
                    </ul>
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
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p>ความคิดเห็นทั้งหมด {`(${post.comment_count})`}</p>
                  </div>
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
        {pageData.length > 10}
        {
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        }
        {showPostDetail && (
          <DetailPost
            open={showPostDetail}
            post={selectedPost}
            onClose={() => {
              setShowPostDetail(false);
              setSelectedPost(null);
            }}
            commentForPost={commentForPost}
            handleAddComment={handleAddComment}
            setComment={setComment}
            comment={comment}
            setReportComment={setReportComment}
            setSelectedComment={setSelectedComment}
          />
        )}
      </div>

      {/* Modal Report Post */}
      {reportComment && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-md bg-white shadow-2xl">
            <h3 className="font-bold text-lg mb-4">รายงานความคิดเห็น</h3>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="โปรดระบุเหตุผลในการรายงาน"
              value={reportCommentReason}
              onChange={(e) => setReportCommentReason(e.target.value)}
            />
            <div className="modal-action mt-4 flex gap-3">
              <button
                className="btn bg-green-500 text-white"
                onClick={handleReportCommentSubmit}
                disabled={!reportCommentReason.trim()}>
                ส่งรายงาน
              </button>
              <button
                className="btn"
                onClick={() => {
                  setReportComment(false);
                  setReportCommentReason("");
                }}>
                ยกเลิก
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setReportComment(false);
              setReportCommentReason("");
            }}></div>
        </dialog>
      )}
    </>
  );
}

export default Community;
