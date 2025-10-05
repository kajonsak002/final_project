import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "../utils/toast";

function ForGotPass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "verify_email",
        { email }
      );
      setStep(res.data.step);
      console.log(res.data);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <div className="card bg-base-100 w-full max-w-md shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex justify-center mb-4">
            รีเซ็ตรหัสผ่าน
          </h2>

          <ul className="steps w-full mb-6">
            <li className={`step ${step >= 1 ? "step-warning" : ""}`}>
              กรอกอีเมล์
            </li>
            <li className={`step ${step >= 2 ? "step-warning" : ""}`}>
              สำเร็จ
            </li>
          </ul>

          {step === 1 && (
            <form onSubmit={handleEmailSubmit}>
              <div className="form-control w-full mb-2">
                <label className="label mb-2">
                  <span className="label-text text-black font-medium">
                    อีเมล์
                  </span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="กรอกอีเมล์"
                  className="input input-bordered w-full"
                  required
                  disabled={loading}
                />
              </div>

              <div className="card-actions mt-4 mb-2">
                <button
                  type="submit"
                  className="btn bg-[#16A34A] text-white w-full rounded-xl hover:bg-[#15803D]"
                  disabled={loading}>
                  {loading ? "กำลังส่ง..." : "ยืนยัน"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center flex flex-col items-center space-y-2">
              <div className="text-green-600 text-4xl">✅</div>
              <h3 className="text-xl font-semibold text-green-700">
                ส่งลิงค์สำหรับรีเซ็ตรหัสผ่านเรียบร้อยเเล้ว
              </h3>
              <p className="text-gray-600">
                ตรวจสอบในอีเมล์ของท่านเเล้วทำการกดลิ้งค์เพื่อทำการเปลี่ยนรหัสผ่าน
              </p>
              <Link
                to="/login"
                className="btn btn-outline btn-success mt-2 px-6">
                กลับไปที่หน้าเข้าสู่ระบบ
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForGotPass;
