import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Clock,
  BookOpen,
  ExternalLink,
  Eye,
  Star,
} from "lucide-react";

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

  const parseTags = (tags) => {
    try {
      if (typeof tags === "string") {
        return JSON.parse(tags);
      }
      return Array.isArray(tags) ? tags : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(34, 197, 94, 0.2) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(16, 185, 129, 0.2) 2px, transparent 0)`,
            backgroundSize: "100px 100px",
          }}></div>
      </div>

      <div className="relative p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Floating Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Gradient Header */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>

            <div className="p-6 md:p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {detail.created_at && (
                  <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    <span>เผยแพร่: {formatDate(detail.created_at)}</span>
                  </div>
                )}
                {detail.updated_at &&
                  detail.updated_at !== detail.created_at && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      <span>อัปเดต: {formatDate(detail.updated_at)}</span>
                    </div>
                  )}
              </div>

              {/* Tags */}
              {detail.tags && parseTags(detail.tags).length > 0 && (
                <div className="flex flex-wrap gap-2  mb-6">
                  {parseTags(detail.tags).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py- bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 text-md font-semibold rounded-full border border-emerald-200 hover:scale-105 transition-transform duration-200">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title with Gradient */}
              <h1 className="text-3xl p-4 md:text-4xl lg:text-5xl font-semibold leading-tight mb-4">
                {detail.title}
              </h1>

              {/* Decorative Line */}
              <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden mb-8">
          <div className="p-6 md:p-8 lg:p-10">
            <div
              className="prose prose-lg md:prose-xl prose-gray max-w-none"
              style={{
                fontFamily: "'Sarabun', sans-serif",
                lineHeight: 1.8,
              }}
              dangerouslySetInnerHTML={{ __html: detail.content }}
            />

            <style>
              {`
                .prose {
                  color: #000;
                }
                .prose h1, .prose h2, .prose h3, .prose h4{
                  -webkit-background-clip: text;
                  // -webkit-text-fill-color: transparent;
                  background-clip: text;
                  font-weight: 800;
                  font-size: 1.2rem;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                  color: black;
                }
                .prose p {
                  margin-bottom: 1.5rem;
                  color: #000;
                  line-height: 1.8;
                }
                .prose img {
                  margin: 2rem auto;
                  border-radius: 1rem;
                  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                  max-width: 100%;
                  height: auto;
                  display: block;
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .prose img:hover {
                  transform: scale(1.02);
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .prose blockquote {
                  border-left: 4px solid #10b981;
                  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
                  margin: 2rem 0;
                  padding: 1.5rem;
                  border-radius: 0.75rem;
                  font-style: italic;
                  position: relative;
                }
                .prose blockquote::before {
                  content: '"';
                  position: absolute;
                  top: -0.5rem;
                  left: 1rem;
                  font-size: 3rem;
                  color: #10b981;
                  opacity: 0.3;
                }
                .prose ul, .prose ol {
                  margin: 1.5rem 0;
                }
                .prose li {
                  margin: 0.5rem 0;
                  color: #000;
                }
              `}
            </style>
          </div>
        </div>

        {/* References Section */}
        {detail.source_refs &&
          Array.isArray(detail.source_refs) &&
          detail.source_refs.length > 0 && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  แหล่งอ้างอิง
                </h3>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {detail.source_refs.map((ref, idx) => (
                    <div key={idx} className="group">
                      {ref.startsWith("http") ? (
                        <a
                          href={ref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border border-emerald-200 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                          <div className="p-2 bg-emerald-500 text-white rounded-lg group-hover:bg-emerald-600 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-emerald-800 break-all group-hover:text-emerald-900">
                              {ref}
                            </span>
                            <div className="text-xs text-emerald-600 mt-1">
                              คลิกเพื่อเปิดลิงก์
                            </div>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl">
                          <div className="p-2 bg-green-500 text-white rounded-lg">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-800">
                              {ref}
                            </span>
                            <div className="text-xs text-gray-600 mt-1">
                              เอกสารอ้างอิง
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default BookDetail;
