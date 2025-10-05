import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  MessageSquare,
  Calendar,
  User,
  Search,
  Filter,
  RefreshCw,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/th";
import axios from "axios";
import Pagination from "../components/Pagination";
import Swal from "sweetalert2";

dayjs.extend(relativeTime);
dayjs.locale("th");

function AllPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const itemsPerPage = 10;

  // ดึงข้อมูลโพสต์ทั้งหมด
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_URL_API + "post/get-all-posts/admin"
      );
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      //   Swal.fire({
      //     title: "เกิดข้อผิดพลาด!",
      //     text: "ไม่สามารถดึงข้อมูลโพสต์ได้",
      //     icon: "error",
      //     confirmButtonText: "ตกลง",
      //   });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // กรองและเรียงลำดับข้อมูล
  const filteredAndSortedPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.farm_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" || post.is_visible === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // คำนวณ pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / itemsPerPage);
  const indexOfLastPost = currentPage * itemsPerPage;
  const indexOfFirstPost = indexOfLastPost - itemsPerPage;
  const currentPosts = filteredAndSortedPosts.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  // ฟังก์ชันซ่อน/เเสดงโพสต์
  const togglePostVisibility = async (post_id, currentStatus) => {
    const nextStatus = currentStatus === "เเสดง" ? "ซ่อน" : "เเสดง";

    let reason = "";

    // ถ้าจะซ่อนโพสต์ ให้กรอกเหตุผล
    if (nextStatus === "ซ่อน") {
      const { value: inputReason } = await Swal.fire({
        title: "ซ่อนโพสต์",
        text: "กรุณาระบุเหตุผลในการซ่อนโพสต์นี้",
        input: "textarea",
        inputPlaceholder: "ระบุเหตุผล...",
        inputAttributes: {
          "aria-label": "ระบุเหตุผลในการซ่อนโพสต์",
        },
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

      if (!inputReason) return; // ถ้าผู้ใช้ยกเลิก
      reason = inputReason.trim();
    } else {
      // ถ้าจะเเสดงโพสต์ ให้ยืนยัน
      const result = await Swal.fire({
        title: "เเสดงโพสต์",
        text: "คุณต้องการเเสดงโพสต์นี้หรือไม่?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "เเสดงโพสต์",
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
          nextStatus === "ซ่อน" ? "ซ่อนโพสต์เรียบร้อย" : "เเสดงโพสต์เรียบร้อย",
        icon: "success",
        confirmButtonText: "ตกลง",
      });

      // รีเฟรชข้อมูล
      await fetchAllPosts();
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

  // ไปดูรายละเอียดโพสต์
  const viewPostDetail = (postId) => {
    navigate(`/admin/post-detail?postId=${postId}&viewMode=admin`);
  };

  // เปิด modal แสดงเหตุผล
  const showReason = (reason) => {
    setSelectedReason(reason);
    setShowReasonModal(true);
  };

  // ปิด modal
  const closeReasonModal = () => {
    setShowReasonModal(false);
    setSelectedReason("");
  };

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (date) => {
    return dayjs(date).locale("th").format("D MMMM YYYY, HH:mm");
  };

  // ฟังก์ชันจัดรูปแบบเวลาสัมพัทธ์
  const formatRelativeTime = (date) => {
    return dayjs(date).locale("th").fromNow();
  };

  // สถานะ badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "เเสดง":
        return "badge badge-success text-white";
      case "ซ่อน":
        return "badge badge-error text-white";
      default:
        return "badge badge-neutral";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="w-full mx-auto px-4">
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
                <a className="text-black">จัดการโพสต์ทั้งหมด</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                จัดการโพสต์ทั้งหมด
              </h1>
              <p className="text-gray-600">
                จัดการและควบคุมการเเสดงผลโพสต์ทั้งหมดในระบบ
              </p>
            </div>
            {/* <button
              onClick={fetchAllPosts}
              className="btn btn-outline btn-primary">
              <RefreshCw className="w-4 h-4 mr-2" />
              รีเฟรชข้อมูล
            </button> */}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex gap-3">
            {/* Search */}
            <div className="w-3/4">
              <input
                type="text"
                placeholder="ค้นหาโพสต์หรือฟาร์ม..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="w-1/4">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                className="select select-bordered w-full pl-10"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">ทุกสถานะ</option>
                <option value="เเสดง">เเสดง</option>
                <option value="ซ่อน">ซ่อน</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>ทั้งหมด: {posts.length} โพสต์</span>

            <span>
              เเสดง: {posts.filter((p) => p.is_visible === "เเสดง").length}{" "}
              โพสต์
            </span>
            <span>
              ซ่อน: {posts.filter((p) => p.is_visible === "ซ่อน").length} โพสต์
            </span>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th>#</th>
                  <th>โพสต์โดย</th>
                  <th>เนื้อหา</th>
                  <th>วันที่โพสต์</th>
                  {/* <th>ความคิดเห็น</th> */}
                  <th>สถานะ</th>
                  <th>เหตุผล</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.length > 0 ? (
                  currentPosts.map((post, index) => (
                    <tr key={post.post_id} className="hover">
                      <td>{indexOfFirstPost + index + 1}</td>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full">
                              <img
                                src={post.farm_img || "/default-avatar.png"}
                                alt={post.farm_name}
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {post.farm_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <p className="text-sm truncate">
                            {post.content.length > 50
                              ? post.content.substring(0, 50) + "..."
                              : post.content}
                          </p>
                          {/* {post.image_post && (
                            <span className="text-xs text-blue-600">
                              มีรูปภาพ
                            </span>
                          )} */}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div>{formatTime(post.create_at)}</div>
                          <div className="text-gray-500">
                            {formatRelativeTime(post.create_at)}
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <div className="flex items-center text-sm">
                          <MessageSquare className="w-4 h-4 mr-1 text-gray-500" />
                          {post.comment_count || 0}
                        </div>
                      </td> */}
                      <td>
                        <span className={getStatusBadge(post.is_visible)}>
                          {post.is_visible}
                        </span>
                      </td>
                      <td>
                        {post.is_visible === "ซ่อน" && post.hide_reason ? (
                          <div className="max-w-xs">
                            <button
                              className="btn btn-xs btn-outline btn-warning"
                              onClick={() => showReason(post.hide_reason)}
                              title="ดูเหตุผลที่ซ่อนโพสต์">
                              <Eye className="w-3 h-3 mr-1" />
                              ดูเหตุผล
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          {/* ปุ่มดูรายละเอียด */}
                          <button
                            className="btn btn-sm btn-outline btn-info"
                            onClick={() => viewPostDetail(post.post_id)}
                            title="ดูรายละเอียดโพสต์">
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* ปุ่มซ่อน/เเสดง */}
                          <button
                            className={`btn btn-sm ${
                              post.is_visible === "เเสดง"
                                ? "btn-error"
                                : "btn-success"
                            }`}
                            onClick={() =>
                              togglePostVisibility(
                                post.post_id,
                                post.is_visible
                              )
                            }
                            title={
                              post.is_visible === "เเสดง"
                                ? "ซ่อนโพสต์"
                                : "เเสดงโพสต์"
                            }>
                            {post.is_visible === "เเสดง" ? "ซ่อน" : "เเสดง"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
                        <p>ไม่พบโพสต์ที่ตรงกับเงื่อนไขการค้นหา</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* DaisyUI Modal สำหรับแสดงเหตุผล */}
      <dialog className={`modal ${showReasonModal ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">เหตุผลที่ซ่อนโพสต์</h3>
          <div className="bg-gray-100 p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedReason}
            </p>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" onClick={closeReasonModal}>
              ปิด
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeReasonModal}>close</button>
        </form>
      </dialog>
    </div>
  );
}

export default AllPosts;
