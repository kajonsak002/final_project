import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, BookOpen, ExternalLink } from "lucide-react";

function BookDetail() {
  const [detail, setDetail] = useState({});
  const { id } = useParams();

  const getDetailGuildBook = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_URL_API + `guildbook/${id}`
      );
      setDetail(res.data.data);
    } catch (err) {
      console.log("Error get Detail Guildbook : ", err);
    }
  };

  useEffect(() => {
    getDetailGuildBook();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="p-4 w-full">
        <div className="">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Article Header */}
              <div className="p-6 md:p-8 pb-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  {detail.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>เผยแพร่: {formatDate(detail.created_at)}</span>
                    </div>
                  )}
                  {detail.updated_at &&
                    detail.updated_at !== detail.created_at && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>อัปเดต: {formatDate(detail.updated_at)}</span>
                      </div>
                    )}
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>คู่มือการเลี้ยง</span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {detail.title}
                </h1>
              </div>
              {/* Article Content */}
              <div className="px-6 md:px-8 pb-6 md:pb-8">
                <div
                  className="prose prose-base md:prose-lg prose-gray max-w-none"
                  style={{
                    fontFamily: "'Sarabun', sans-serif",
                    lineHeight: 1.6,
                    // กำหนด margin รอบ img
                    // margin รอบๆ รูป 12px (3 เท่าของ 4px ตัวอย่าง)
                  }}
                  dangerouslySetInnerHTML={{ __html: detail.content }}
                />

                <style>
                  {`
                    .prose img {
                      margin: 12px; /* หรือ margin: 12px 12px 12px 12px; */
                      border-radius: 0.75rem; /* ถ้าอยากให้เหมือน tailwind: rounded-xl */
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* เงานิดๆ เหมือน tailwind prose-img:shadow-md */
                      max-width: 100%;
                      height: auto;
                      display: block;
                    }
                  `}
                </style>
              </div>
              {detail.source_refs && Array.isArray(detail.source_refs) && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-blue-600" />
                    แหล่งอ้างอิง
                  </h3>
                  <div className="space-y-3">
                    {detail.source_refs.map((ref, idx) => (
                      <div key={idx} className="group">
                        {ref.startsWith("http") ? (
                          <a
                            href={ref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200">
                            <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm break-all group-hover:underline">
                              {ref}
                            </span>
                          </a>
                        ) : (
                          <div className="flex items-start gap-2 text-gray-700">
                            <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="text-sm">{ref}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
