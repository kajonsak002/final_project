import axios, { HttpStatusCode } from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "../utils/toast";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(import.meta.env.VITE_URL_API + "login", {
        email,
        password,
      });
      console.log(res.data);
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("username", res.data.data.fullname);
      localStorage.setItem("image_profile", res.data.data.farm_img);
      toast.success(`ยินดีต้อนรับ ${res.data.data.fullname}`, {
        timer: 1000,
      });
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      console.log("Error : ", err);
      if (err.response.status === 403) {
        toast.error(`บัญชีถูกระงับ เนื่องจาก \n ${err.response.data.reason}`);
      }
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="card bg-base-100 w-96 shadow-sm">
        <div className="card-body">
          <h2 className="card-title flex justify-center">เข้าสู่ระบบ</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-control w-full mb-2">
              <label className="label mb-2">
                <span className="label-text text-black font-medium">
                  ชื่อผู้ใช้
                </span>
              </label>
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control relative w-full mb-2">
              <label className="label mb-2">
                <span className="label-text text-black font-medium">
                  รหัสผ่าน
                </span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pr-10"
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-3 top-10 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-10 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <div className="card-actions mt-4 mb-2">
              <button className="btn bg-[#16A34A] text-white w-full rounded-xl hover:bg-[#15803D]">
                เข้าสู่ระบบ
              </button>
            </div>
            <div className="flex justify-between">
              <span>
                ยังไม่มีบัญชีผู้ใช้?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 underline hover:text-blue-700">
                  ลงทะเบียน
                </Link>
              </span>
              <Link to="/forgot_password">
                <span className="text-blue-500 underline">ลืมรหัสผ่าน</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
