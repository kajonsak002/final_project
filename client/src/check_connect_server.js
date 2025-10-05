import axios from "axios";
import { toast } from "./utils/toast";

export async function connect_server() {
  try {
    const res = await axios.get(import.meta.env.VITE_URL_SOCKET);
    if (res.status === 200) {
      // toast.success("เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ");
      console.log("เชื่อมต่อกับเซิร์ฟเวอร์สำเร็จ");
    } else {
      console.log("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      // toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  } catch (err) {
    console.log(err);
    // toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
  }
}
