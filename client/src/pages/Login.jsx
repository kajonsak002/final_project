import axios from "axios";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      toast.success(res.data.message, {
        autoClose: 800,
      });
      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (err) {
      console.log("Error : ", err);
      toast.error(err.response.data.message, {
        autoClose: 800,
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <ToastContainer />
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
            <div className="form-control w-full mb-2">
              <label className="label mb-2">
                <span className="label-text text-black font-medium">
                  รหัสผ่าน
                </span>
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
              />
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
