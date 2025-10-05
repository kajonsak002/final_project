// src/utils/toast.js
import Swal from "sweetalert2";

export const toast = {
  success: (msg, options = {}) => {
    const timer = options.timer || 0;
    const showProgressBar = timer > 0;

    Swal.fire({
      icon: "success",
      title: msg,
      text: options.text || "",
      confirmButtonText: options.confirmButtonText || "ตกลง",
      timer: timer,
      timerProgressBar: showProgressBar,
      showConfirmButton: !showProgressBar,
      allowOutsideClick: !showProgressBar,
      allowEscapeKey: !showProgressBar,
      ...options, // เผื่อส่ง option เพิ่มเติมเข้ามา
    });
  },

  error: (msg, options = {}) => {
    const timer = options.timer || 0;
    const showProgressBar = timer > 0;

    Swal.fire({
      icon: "error",
      title: msg,
      text: options.text || "",
      confirmButtonText: options.confirmButtonText || "ตกลง",
      timer: timer,
      timerProgressBar: showProgressBar,
      showConfirmButton: !showProgressBar,
      allowOutsideClick: !showProgressBar,
      allowEscapeKey: !showProgressBar,
      ...options,
    });
  },

  warning: (msg, options = {}) => {
    const timer = options.timer || 0;
    const showProgressBar = timer > 0;

    Swal.fire({
      icon: "warning",
      title: msg,
      text: options.text || "",
      confirmButtonText: options.confirmButtonText || "ตกลง",
      timer: timer,
      timerProgressBar: showProgressBar,
      showConfirmButton: !showProgressBar,
      allowOutsideClick: !showProgressBar,
      allowEscapeKey: !showProgressBar,
      ...options,
    });
  },

  info: (msg, options = {}) => {
    const timer = options.timer || 0;
    const showProgressBar = timer > 0;

    Swal.fire({
      icon: "info",
      title: msg,
      text: options.text || "",
      confirmButtonText: options.confirmButtonText || "ตกลง",
      timer: timer,
      timerProgressBar: showProgressBar,
      showConfirmButton: !showProgressBar,
      allowOutsideClick: !showProgressBar,
      allowEscapeKey: !showProgressBar,
      ...options,
    });
  },

  // Confirmation dialog
  confirm: async (msg, options = {}) => {
    const result = await Swal.fire({
      title: options.title || msg,
      text: options.text || "",
      icon: options.icon || "warning",
      showCancelButton: true,
      confirmButtonColor: options.confirmButtonColor || "#d33",
      cancelButtonColor: options.cancelButtonColor || "#3085d6",
      confirmButtonText: options.confirmButtonText || "ยืนยัน",
      cancelButtonText: options.cancelButtonText || "ยกเลิก",
      ...options,
    });
    return result.isConfirmed;
  },
};
