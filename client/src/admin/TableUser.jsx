import React, { useEffect, useState } from "react";
import { Check, X, User, Eye } from "lucide-react";
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
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectUser, setSelectUser] = useState([]);

  const getUserApproved = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + "farmer/waiting-approval"
      );
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
      setDetailsModal(false);
      setReason("");
    }
  };

  const handleReject = (user) => {
    setRejectModal(true);
  };

  const handleViewDetails = (user) => {
    setSelectUser(user);
    setDetailsModal(true);
  };

  const closeModals = () => {
    setReason("");
    setRejectModal(false);
    setDetailsModal(false);
    setSelectUser(null);
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
                  <button
                    onClick={() => handleViewDetails(user)}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors duration-200">
                    <Eye className="w-3 h-3 mr-1" />
                    ดูรายละเอียด
                  </button>
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

      {/* Farm Details Modal */}
      {detailsModal && selectUser && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-lg bg-white shadow-2xl">
            <h3 className="font-bold text-lg mb-4">รายละเอียดฟาร์ม</h3>

            {/* Farm Info in compact layout */}
            <div className="flex items-start gap-4 mb-4">
              <img
                className="h-16 w-16 rounded-lg object-cover border"
                src={selectUser.farm_img}
                alt={selectUser.farm_name}
              />
              <div className="flex-1 space-y-1">
                <h4 className="font-semibold text-gray-900">
                  {selectUser.farm_name}
                </h4>
                <p className="text-sm text-gray-600">{selectUser.email}</p>
                <p className="text-xs text-gray-500">
                  ID: {selectUser.farmer_id} | สมัคร:{" "}
                  {dayjs(selectUser.create_at)
                    .add(543, "year")
                    .format("DD/MM/YYYY")}
                </p>
              </div>
            </div>

            {/* Additional compact details */}
            {(selectUser.phone || selectUser.address) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-1">
                {selectUser.phone && (
                  <p className="text-sm">
                    <span className="font-medium">โทร:</span> {selectUser.phone}
                  </p>
                )}
                {selectUser.address && (
                  <p className="text-sm">
                    <span className="font-medium">ที่อยู่:</span>{" "}
                    {selectUser.address}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit(selectUser, "อนุมัติ")}
                disabled={loadingStates[selectUser.farmer_id]}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">
                {loadingStates[selectUser.farmer_id] === "อนุมัติ" ? (
                  <span className="loading loading-spinner loading-xs mr-1"></span>
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                อนุมัติ
              </button>

              <button
                onClick={() => handleReject(selectUser)}
                disabled={loadingStates[selectUser.farmer_id]}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg disabled:opacity-50">
                <X className="w-4 h-4 mr-1" />
                ปฏิเสธ
              </button>

              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={closeModals}>
                ปิด
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModals}></div>
        </dialog>
      )}

      {/* Reject Modal */}
      {rejectModal && selectUser && (
        <dialog open className="modal">
          <div className="modal-box w-full max-w-md bg-white shadow-2xl">
            <h3 className="font-bold text-lg mb-4 text-red-600">
              ปฏิเสธการสมัครสมาชิก
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                ฟาร์ม:{" "}
                <span className="font-medium">{selectUser.farm_name}</span>
              </p>
              <p className="text-sm text-gray-600">
                อีเมล: <span className="font-medium">{selectUser.email}</span>
              </p>
            </div>
            <textarea
              className="textarea textarea-bordered w-full h-24"
              placeholder="โปรดระบุเหตุผลในการปฏิเสธการสมัครสมาชิก"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="modal-action mt-4 flex gap-3">
              <button
                className="btn bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleSubmit(selectUser, "ปฏิเสธ")}
                disabled={
                  !reason?.trim() || loadingStates[selectUser.farmer_id]
                }>
                {loadingStates[selectUser.farmer_id] === "ปฏิเสธ" ? (
                  <span className="loading loading-spinner loading-xs mr-1"></span>
                ) : (
                  <X className="w-4 h-4 mr-1" />
                )}
                ยืนยันปฏิเสธ
              </button>
              <button className="btn btn-outline" onClick={closeModals}>
                ยกเลิก
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeModals}></div>
        </dialog>
      )}
    </div>
  );
}

export default TableUser;
