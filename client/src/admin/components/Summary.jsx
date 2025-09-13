import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function Summary() {
  const [summaryData, setSummaryData] = useState([]);

  const getSummaryData = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL_API + "get_summary");
      setSummaryData(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  useEffect(() => {
    getSummaryData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body flex flex-row items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
          <div>
            <h2 className="card-title text-base mb-1">ฟาร์มทั้งหมด</h2>
            <p className="text-xl">
              {summaryData.total_farm != ""
                ? summaryData.total_farm + " ฟาร์ม"
                : "0 ฟาร์ม"}
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body flex flex-row items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="card-title text-base mb-1">รอการอนุมัติลงทะเบียน</h2>
            <p className="text-xl">
              {" "}
              {summaryData.total_farm_waiting != ""
                ? summaryData.total_farm_waiting + " ฟาร์ม"
                : "0 ฟาร์ม"}
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body flex flex-row items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="card-title text-base mb-1">
              คำร้องเพิ่มรายการสัตว์
            </h2>
            <p className="text-xl">
              {summaryData.total_animal_full_request_waiting != ""
                ? summaryData.total_animal_full_request_waiting + " คำร้อง"
                : "0 คำร้อง"}
            </p>
          </div>
        </div>
      </div>

      <div className="card bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="card-body flex flex-row items-center gap-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h2 className="card-title text-base mb-1">รายงานโพสต์</h2>
            <p className="text-xl">
              {summaryData.total_report_post_waiting != ""
                ? summaryData.total_report_post_waiting + " คำร้อง"
                : "0 คำร้อง"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
