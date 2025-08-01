import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BookDetail() {
  const [detail, setDetail] = useState({});
  const { id } = useParams();

  const getDetailGuildBook = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `guildbook/${id}`
      );
      setDetail(res.data.data[0]);
    } catch (err) {
      console.log("Error get Detail Guildbook : ", err);
    }
  };

  useEffect(() => {
    getDetailGuildBook();
  }, []);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{detail.title}</h1>

      {/* Cover Image (ถ้ามี) */}
      {detail.image && (
        <img
          src={detail.image.replace("localhost:3000", window.location.origin)}
          alt={detail.title}
          className="rounded-lg shadow-md mb-6 w-full max-h-[500px] object-cover"
        />
      )}

      {/* เนื้อหา HTML */}
      <div
        id="html-content"
        className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: detail.content }}
      />
    </div>
  );
}

export default BookDetail;
