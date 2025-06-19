import React, { useState } from "react";

const ImageUpload = () => {
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const fileList = Array.from(e.target.files);
    const newImages = fileList.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 3)); // จำกัดที่ 3 ภาพ
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      {" "}
      <label className="btn btn-primary w-40" htmlFor="file-input">
        Upload Images
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
        multiple // รองรับการเลือกหลายไฟล์
      />
      {/* กล่องใหญ่สำหรับแสดงภาพ */}
      <div className="w-full max-w-4xl p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
        {/* แสดงภาพที่เลือก */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Uploaded ${index}`}
                className="w-full h-32 object-cover rounded-lg shadow-md"
              />
              {/* ปุ่มลบ */}
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                onClick={() => {
                  setImages(images.filter((_, idx) => idx !== index));
                }}>
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* หากมีรูปภาพเกิน 3 รูปให้แสดงข้อความ */}
      {images.length === 3 && (
        <div className="mt-4 text-red-500">
          You can upload up to 3 images only.
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
