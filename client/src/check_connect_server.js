import axios from "axios";
import { toast } from "react-toastify";

export async function connect_server() {
  try {
    const res = await axios.get(import.meta.env.VITE_URL_SOCKET);
    if (res.status === 200) {
      toast.success("เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ");
    } else {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  } catch (err) {
    console.log(err);
  }
}
