import React, { useEffect, useState } from "react";
import { Check, X, User } from "lucide-react";
import axios from "axios";
import Pagination from "./components/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { toast, ToastContainer } from "react-toastify";

function TableUser() {
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(5);
  const [pageData, setPageData] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [reason, setReason] = useState("");
  const [rejectModal, setRejectModal] = useState(false);
  const [selectUser, setSelectUser] = useState([]);

  const getUserApproved = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "farmer/waiting-approval"
      );
      // console.log(res.data);
      setAllData(res.data);
    } catch (err) {
      console.log("Error get User Wait Approved : ", err);
    }
  };

  useEffect(() => {
    const indexOfLast = currentPage * dataPerPage;
    const indexOfFirst = indexOfLast - dataPerPage;
    setPageData(allData.slice(indexOfFirst, indexOfLast));
  }, [currentPage, allData]);

  const totalPages = Math.ceil(allData.length / dataPerPage);

  useEffect(() => {
    getUserApproved();
  }, []);

  const handleSubmit = async (user, status) => {
    const { farmer_id, email, farm_name } = user;

    if (loadingStates[farmer_id]) return;

    setLoadingStates((prev) => ({ ...prev, [farmer_id]: status }));

    const dataObj = {
      farmer_id,
      email,
      farm_name,
      status,
      reason,
    };

    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "farmer/manage-approval",
        dataObj
      );
      toast.success(res.data.message);
      getUserApproved();
    } catch (err) {
      console.log("Error approved farmer : ", err);
      toast.error(
        err.response?.data?.message || "เกิดข้อผิดพลาดในการดำเนินการ"
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [farmer_id]: null }));
      setSelectUser(null);
      setRejectModal(false);
      setReason(null);
    }
  };

  const handleReject = (user) => {
    setSelectUser(user);
    setRejectModal(true);
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="overflow-x-auto">
        <table className="table bg-base-100 min-w-[600px]">
          <thead>
            <tr>
              <th className="px-6">#</th>
              <th className="px-7">ชื่อฟาร์ม</th>
              <th className="px-6">วันที่สมัครสมาชิก</th>
              <th className="px-8">สถานะ</th>
              <th className="text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pageData.map((user, index) => (
              <tr
                key={user.farmer_id}
                className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative">
                      {/* {console.log(user.farm_img)} */}
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={user.farm_img}
                        alt={user.farm_name}
                      />
                      <div className="hidden absolute top-0 left-0 h-10 w-10 rounded-full bg-gray-200 items-center justify-center">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.farm_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dayjs(user.create_at).add(543, "year").format("D MMMM YYYY")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleSubmit(user, "อนุมัติ")}
                      disabled={loadingStates[user.farmer_id]}
                      className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loadingStates[user.farmer_id] === "อนุมัติ" ? (
                        <span className="loading loading-spinner loading-xs mr-1"></span>
                      ) : (
                        <Check className="w-3 h-3 mr-1" />
                      )}
                      อนุมัติ
                    </button>
                    <button
                      onClick={() => handleReject(user)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      <X className="w-3 h-3 mr-1" />
                      ปฏิเสธ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {rejectModal && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-md bg-white shadow-2xl">
            <h3 className="font-bold text-lg mb-4">ปฏิเสธการสมัครสมาชิก</h3>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="โปรดระบุเหตุผลในการปฏิเสธการสมัครสมาชิก"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="modal-action mt-4 flex gap-3">
              <button
                className="btn bg-green-500  text-white"
                onClick={() => handleSubmit(selectUser, "ปฏิเสธ")}
                disabled={!reason?.trim()}>
                {loadingStates[selectUser.farmer_id] === "ปฏิเสธ" ? (
                  <span className="loading loading-spinner loading-xs mr-1"></span>
                ) : (
                  <p>ยืนยัน</p>
                )}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setReason(null);
                  setRejectModal(false);
                }}>
                ยกเลิก
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setReason(null);
              setRejectModal(false);
            }}></div>
        </dialog>
      )}
    </div>
  );
}

export default TableUser;
