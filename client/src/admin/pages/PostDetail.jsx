import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  UserCircle,
  Send,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";

dayjs.extend(relativeTime);
dayjs.locale("th");

function PostDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightCommentId, setHighlightCommentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const postId = searchParams.get("postId");
  const commentId = searchParams.get("highlightComment");
  const viewMode = searchParams.get("viewMode");

  // ✅ รวม togglePostVisibility เหลือฟังก์ชันเดียว
  const togglePostVisibility = async (post_id, currentStatus) => {
    const nextStatus = currentStatus === "เเสดง" ? "ซ่อน" : "เเสดง";
    let reason = "";

    if (nextStatus === "ซ่อน") {
      // ต้องกรอกเหตุผลก่อนซ่อน
      const { value: inputReason } = await Swal.fire({
        title: "ซ่อนโพสต์",
        text: "กรุณาระบุเหตุผลในการซ่อนโพสต์นี้",
        input: "textarea",
        inputPlaceholder: "ระบุเหตุผล...",
        inputAttributes: { "aria-label": "ระบุเหตุผลในการซ่อนโพสต์" },
        showCancelButton: true,
        confirmButtonText: "ซ่อนโพสต์",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        inputValidator: (value) => {
          if (!value || value.trim() === "") {
            return "กรุณาระบุเหตุผลในการซ่อนโพสต์";
          }
        },
      });

      if (!inputReason) return;
      reason = inputReason.trim();
    } else {
      // แค่ยืนยันถ้าจะเปิดโพสต์
      const result = await Swal.fire({
        title: "แสดงโพสต์",
        text: "คุณต้องการแสดงโพสต์นี้หรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "แสดงโพสต์",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
      });

      if (!result.isConfirmed) return;
    }

    try {
      const endpoint =
        nextStatus === "ซ่อน" ? "post/hide-post" : "post/show-post";

      const requestData = { post_id };
      if (nextStatus === "ซ่อน") {
        requestData.reason = reason;
      }

      await axios.post(import.meta.env.VITE_URL_API + endpoint, requestData);

      Swal.fire({
        title: "สำเร็จ!",
        text:
          nextStatus === "ซ่อน" ? "ซ่อนโพสต์เรียบร้อย" : "แสดงโพสต์เรียบร้อย",
        icon: "success",
        confirmButtonText: "ตกลง",
      });

      await fetchPostDetail();
    } catch (error) {
      console.error("Error toggling post visibility:", error);
      const errorMessage =
        error.response?.data?.msg || "ไม่สามารถอัปเดตสถานะโพสต์ได้";
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  useEffect(() => {
    if (commentId) {
      setHighlightCommentId(commentId);
    }
  }, [commentId]);

  const fetchPostDetail = async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const postRes = await axios.get(
        import.meta.env.VITE_URL_API + `post/${postId}`
      );
      setPost(postRes.data.posts[0]);

      const commentRes = await axios.get(
        import.meta.env.VITE_URL_API + `comment/get-comment/admin/${postId}`
      );
      setComments(commentRes.data.comments || []);
    } catch (error) {
      console.error("Error fetching post detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCommentVisibility = async (comment_id, nextStatus) => {
    const confirmMessage =
      nextStatus === "ซ่อน"
        ? "คุณต้องการซ่อนความคิดเห็นนี้หรือไม่?"
        : "คุณต้องการแสดงความคิดเห็นนี้หรือไม่?";

    const result = await Swal.fire({
      title: "ยืนยันการทำรายการ",
      text: confirmMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    try {
      if (nextStatus === "ซ่อน") {
        await axios.post(
          import.meta.env.VITE_URL_API + "comment/hide-comment",
          {
            comment_id,
          }
        );
        Swal.fire("ซ่อนความคิดเห็นเรียบร้อย", "", "success");
      } else {
        await axios.post(
          import.meta.env.VITE_URL_API + "comment/show-comment",
          {
            comment_id,
          }
        );
        Swal.fire("อัปเดตสถานะความคิดเห็นเรียบร้อย", "", "success");
      }
      await fetchPostDetail();
    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตความคิดเห็นได้", "error");
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [postId]);

  // Pagination
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(
    indexOfFirstComment,
    indexOfLastComment
  );

  useEffect(() => {
    if (highlightCommentId && comments.length > 0) {
      const highlightedIndex = comments.findIndex(
        (comment) => comment.comment_id == highlightCommentId
      );
      if (highlightedIndex !== -1) {
        const targetPage = Math.ceil((highlightedIndex + 1) / commentsPerPage);
        setCurrentPage(targetPage);
      }
    }
  }, [highlightCommentId, comments]);

  const formatFacebookTime = (date) => {
    const now = dayjs();
    const inputDate = dayjs(date);
    const diffInMinutes = now.diff(inputDate, "minute");
    const diffInHours = now.diff(inputDate, "hour");
    const diffInDays = now.diff(inputDate, "day");

    if (diffInMinutes < 1) return "เมื่อครู่นี้";
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    if (diffInDays === 1) return `เมื่อวาน เวลา ${inputDate.format("HH:mm")}`;
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} สัปดาห์ที่แล้ว`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} เดือนที่แล้ว`;
    return inputDate.format("D MMMM YYYY");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">ไม่พบโพสต์</h2>
          <p className="text-gray-500">โพสต์นี้อาจถูกลบหรือไม่มีอยู่</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className=" px-4">
        {/* Breadcrumb */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
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
                <a className="text-black">รายละเอียดโพสต์</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full">
                  <img
                    src={post.farm_img || "/default-avatar.png"}
                    alt={post.farm_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {post.farm_name}
                </h3>
                <p className="text-gray-500 text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatFacebookTime(post.create_at)}
                </p>
              </div>
            </div>
            {viewMode === "admin" && post && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full ${
                    post.is_visible === "เเสดง"
                      ? "bg-green-500"
                      : post.is_visible === "ซ่อน"
                      ? "bg-red-500"
                      : "bg-gray-500"
                  }`}>
                  สถานะ {post.is_visible}
                </span>
                <button
                  className={`btn btn-sm ${
                    post.is_visible === "เเสดง"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                  onClick={() =>
                    togglePostVisibility(post.post_id, post.is_visible)
                  }>
                  {post.is_visible === "เเสดง" ? "ซ่อนโพสต์" : "แสดงโพสต์"}
                </button>
              </div>
            )}
          </div>

          <div className="mb-6">
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {post.image_post && (
            <div className="mb-6">
              <img
                src={post.image_post}
                alt="โพสต์"
                className="w-full max-h-96 object-cover rounded-lg shadow-md"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>{comments.length} ความคิดเห็น</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h4 className="font-bold text-lg mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            ความคิดเห็น ({comments.length})
          </h4>

          <div className="space-y-4">
            {currentComments.length > 0 ? (
              currentComments.map((comment) => {
                const isHighlighted =
                  highlightCommentId &&
                  comment.comment_id == highlightCommentId;
                return (
                  <div
                    className={`rounded-lg p-4 transition-colors duration-200 ${
                      isHighlighted
                        ? "bg-yellow-200 border-2 border-yellow-400 shadow-lg"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    key={comment.comment_id}>
                    <div className="flex items-start space-x-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          <img
                            src={comment.farm_img || "/default-avatar.png"}
                            alt={comment.farm_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm text-gray-800">
                            {comment.farm_name}
                          </p>
                          {isHighlighted && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                              ความคิดเห็นที่ถูกรายงาน
                            </span>
                          )}
                          {viewMode === "report" ? (
                            ""
                          ) : (
                            <span
                              className={`text-white text-xs px-2 py-1 rounded-full ${
                                comment.status === "แสดง"
                                  ? "bg-green-500"
                                  : comment.status === "ซ่อน"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                              }`}>
                              สถานะ{" "}
                              {comment.status === "ลบแล้ว" ? "ซ่อน" : "แสดง"}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-2">
                          {comment.content}
                        </p>
                        <p className="text-gray-500 text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatFacebookTime(comment.create_at)}
                        </p>
                        <div className="mt-2">
                          {viewMode === "admin" && (
                            <button
                              className={`btn btn-xs ${
                                comment.status === "แสดง"
                                  ? "bg-red-500 text-white hover:bg-red-600"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                              onClick={() =>
                                toggleCommentVisibility(
                                  comment.comment_id,
                                  comment.status === "แสดง" ? "ซ่อน" : "แสดง"
                                )
                              }>
                              {comment.status === "แสดง"
                                ? "ซ่อนความคิดเห็น"
                                : "แสดงความคิดเห็น"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>ยังไม่มีความคิดเห็น</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
