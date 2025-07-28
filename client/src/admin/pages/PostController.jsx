import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Calendar, Eye, X, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { useSummaryCount } from "../components/SummaryCountContext";

dayjs.locale("th");

function PostController() {
  const [allPost, setAllPost] = useState([]);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 5;
  const { fetchSummary } = useSummaryCount();

  const getPostWaitApproval = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "post-wait-approval"
      );
      setAllPost(res.data.posts);
    } catch (err) {
      console.log("Error Get Post Wait Approval : ฆ", err);
    }
  };

  useEffect(() => {
    getPostWaitApproval();
  }, []);

  const filteredData = allPost.filter((item) => {
    const mathchesStatus = status
      ? item.status.toLowerCase() === status.toLowerCase()
      : true;
    return mathchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const pageData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("th").format("D MMMM YYYY");
  };

  const showDetail = (detail) => {
    setSelectedPost(detail);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "อนุมัติ":
        return "badge badge-success text-white";
      case "รออนุมัติ":
        return "badge badge-warning text-white";
      case "ปฏิเสธ":
        return "badge badge-error text-white";
      default:
        return "badge badge-neutral";
    }
  };

  const ApprovalPost = async (status, post) => {
    const { post_id } = post;
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + `post/approval-post/${post_id}`,
        { status }
      );
      setIsModalOpen(false);
      setSelectedPost(null);
      getPostWaitApproval();
      await fetchSummary();
      toast.success(res.data.message);
    } catch (err) {
      toast.success(err);
    }
  };

  return (
    <div>
      <div>
        <ToastContainer />
      </div>
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
              <a className="text-gray-500">จัดการอนุมัติโพสต์</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-3 w-full">
        <h2 className="text-xl font-bold mb-2">จัดการอนุมัติโพสต์</h2>
        <table className="table bg-base-100 w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>โพสต์โดย</th>
              <th>เนื้อหา</th>
              <th>วันที่โพสต์</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((item, index) => (
                <tr key={item.post_id}>
                  <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="avatar">
                        <div className="w-12 rounded-full">
                          <img src={item.farm_img} alt={item.farm_name} />
                        </div>
                      </div>
                      <div className="ml-2">
                        <div className="text-sm font-medium text-gray-900">
                          {item.farm_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.content.length > 40
                      ? item.content.slice(0, 40) + "..."
                      : item.content}
                  </td>
                  <td>{formatDate(item.create_at)}</td>
                  <td>
                    <span className={getStatusBadge(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="cursor-pointer">
                    <Eye
                      onClick={() => showDetail(item)}
                      className="w-5 h-5 text-blue-600 hover:text-blue-800 transition-colors"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {isModalOpen && (
          <dialog open className="modal">
            <div className="modal-box w-full max-w-3xl p-4">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPost(null);
                }}>
                ✕
              </button>

              <h3 className="modal-title font-bold text-lg">รายละเอียด</h3>

              {/* เนื้อหาหลัก */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
                {/* ฝั่งซ้าย - ข้อมูลโพสต์ */}
                <div
                  className={`${
                    !selectedPost.image_post ? "lg:col-span-2" : ""
                  } space-y-4`}>
                  {/* ข้อมูลคนโพสต์ */}
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-100">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring-2 ring-blue-300 ring-offset-1">
                        <img
                          src={selectedPost.farm_img}
                          alt={selectedPost.farm_name}
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {selectedPost.farm_name}
                      </h4>
                      <p className="text-xs text-blue-600 font-medium">
                        ผู้โพสต์
                      </p>
                    </div>
                  </div>

                  {/* เนื้อหาโพสต์ */}
                  <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                    <h5 className="text-base font-semibold text-gray-800 mb-2 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      เนื้อหาโพสต์
                    </h5>

                    <div className="h-[275px] max-h-[400px] w-full overflow-auto break-words whitespace-pre-wrap">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {selectedPost.content || "ไม่มีเนื้อหาโพสต์"}
                      </p>
                    </div>
                  </div>

                  {/* วันที่โพสต์ */}
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-amber-600" />
                      <span className="text-sm font-medium text-amber-800">
                        วันที่โพสต์:
                      </span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1 ml-6 font-medium">
                      {formatDate(selectedPost.create_at)}
                    </p>
                  </div>
                </div>

                {/* ฝั่งขวา - แสดงเฉพาะเมื่อมีภาพ */}
                {selectedPost.image_post && (
                  <div className="flex flex-col">
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-md p-4 h-[545px]">
                      <div className="flex items-center justify-center h-full min-h-[250px]">
                        <img
                          className="max-w-xs object-contain rounded-md shadow"
                          src={selectedPost.image_post}
                          alt={`โพสต์ ${selectedPost.post_id}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  className="btn bg-green-600 text-white hover:bg-green-700 px-6"
                  onClick={() => ApprovalPost("อนุมัติ", selectedPost)}>
                  <Check size={20} className="mr-2" />
                  อนุมัติ
                </button>
                <button
                  className="btn bg-red-500 text-white hover:bg-red-600 px-6"
                  onClick={() => ApprovalPost("ไม่อนุมัติ", selectedPost)}>
                  <X size={20} className="mr-2" />
                  ปฏิเสธ
                </button>
              </div>
            </div>
          </dialog>
        )}
      </div>
    </div>
  );
}

export default PostController;
