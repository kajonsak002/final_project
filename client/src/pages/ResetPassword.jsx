import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "../utils/toast";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + `reset-password/${token}`,
        { newPassword: password }
      );
      toast.success(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      toast.error(err.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            ตั้งรหัสผ่านใหม่
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <label className="input input-bordered flex items-center gap-2 w-full">
              <Lock className="w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="รหัสผ่านใหม่"
                className="grow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </label>

            {/* Confirm Password */}
            <label className="input input-bordered flex items-center gap-2 w-full">
              <KeyRound className="w-5 h-5" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="ยืนยันรหัสผ่าน"
                className="grow"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                className="focus:outline-none"
                onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="btn bg-green-500 text-white w-full">
              บันทึกรหัสผ่าน
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
