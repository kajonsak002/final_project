import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

function ForGotPass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "verify_email",
        { email }
      );
      setStep(res.data.step);
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "reset_password",
        { email, newPassword }
      );
      console.log(res.data);
      setStep(res.data.step);
      toast.success(res.data.message, { autoClose: 800 });
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
      <ToastContainer />
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
              ตั้งรหัสผ่านใหม่
            </li>
            <li className={`step ${step >= 3 ? "step-warning" : ""}`}>
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
                />
              </div>

              <div className="card-actions mt-4 mb-2">
                <button
                  type="submit"
                  className="btn bg-[#16A34A] text-white w-full rounded-xl hover:bg-[#15803D]">
                  ยืนยัน
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <div className="form-control w-full mb-2">
                <label className="label mb-2">
                  <span className="label-text text-black font-medium">
                    รหัสผ่านใหม่
                  </span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="card-actions mt-4 mb-2">
                <button
                  type="submit"
                  className="btn bg-[#16A34A] text-white w-full rounded-xl hover:bg-[#15803D]">
                  รีเซ็ตรหัสผ่าน
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center mt-6 flex flex-col items-center space-y-4">
              <div className="text-green-600 text-4xl">✅</div>
              <h3 className="text-xl font-semibold text-green-700">
                รีเซ็ตรหัสผ่านเรียบร้อยแล้ว
              </h3>
              <p className="text-gray-600">
                คุณสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้ทันที
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
