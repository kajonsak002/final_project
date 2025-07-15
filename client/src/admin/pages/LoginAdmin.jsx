import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { connect_server } from "../../check_connect_server";

function LoginAdmin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    connect_server();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        import.meta.env.VITE_URL_API + "admin/login",
        {
          username,
          password,
        }
      );
      // console.log(res.data);
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
      toast.success("เข้าสู่ระบบสำเร็จ");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 800);
    } catch (error) {
      // console.error("Error during login:", error);
      toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-base-200">
      <ToastContainer
        position="top-center"
        autoClose={800}
        hideProgressBar={false}
        closeOnClick
        theme="light"
      />
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title flex justify-center mb-4">
            <h2 className="text-2xl font-bold">เข้าสู่ระบบ</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label mb-2">
                <span className="label-text text-black font-medium">
                  ชื่อผู้ใช้
                </span>
              </label>
              <input
                type="text"
                placeholder="กรอกชื่อผู้ใช้"
                className="input input-bordered w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-control w-full mt-4">
              <label className="label mb-2">
                <span className="label-text text-black font-medium">
                  รหัสผ่าน
                </span>
              </label>
              <input
                type="password"
                placeholder="กรอกรหัสผ่าน"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn bg-[#3bb143] w-full text-white hover:bg-amber-600">
                เข้าสู่ระบบ
              </button>
            </div>
            <div className="text-right my-2 text-blue-500 cursor-pointer underline">
              <Link to="/admin/reset_password">ลืมรหัสผ่าน</Link>
            </div>
            <div className="text-center">
              <p className="text-gray-700">
                ORAGANIC FARM GUILD -
                เว็บแอปพลิเคชันเเนวทางการเลี้ยงสัตว์แบบเกษตรอินทรีย์
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginAdmin;
