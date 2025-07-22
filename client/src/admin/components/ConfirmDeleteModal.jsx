import { Trash2 } from "lucide-react";

function ConfirmDeleteModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg text-red-600">ยืนยันการลบ</h3>
        <p className="py-4">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?</p>
        <div className="modal-action">
          <button
            className="btn bg-red-500 text-white hover:bg-red-600"
            onClick={onConfirm}>
            <Trash2 size={20} className="mr-2" />
            ลบ
          </button>
          <button className="btn" onClick={onCancel}>
            ยกเลิก
          </button>
        </div>
      </div>
    </dialog>
  );
}

export default ConfirmDeleteModal;
