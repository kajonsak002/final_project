import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

function NewsDetail() {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const styles = {
    ul: {
      listStyleType: "disc",
      paddingLeft: "1.5rem",
      marginBottom: "1rem",
      lineHeight: "1.6",
    },
    ol: {
      listStyleType: "decimal",
      paddingLeft: "1.5rem",
      marginBottom: "1rem",
      lineHeight: "1.6",
    },
    p: {
      marginBottom: "1rem",
      lineHeight: "1.7",
    },
    h1: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      color: "#1f2937",
      lineHeight: "1.2",
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      marginTop: "2rem",
      color: "#374151",
      lineHeight: "1.3",
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "0.75rem",
      marginTop: "1.5rem",
      color: "#4b5563",
      lineHeight: "1.4",
    },
    img: {
      maxWidth: "100%",
      height: "auto",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    blockquote: {
      borderLeft: "4px solid #3b82f6",
      paddingLeft: "1rem",
      marginLeft: "0",
      marginBottom: "1rem",
      fontStyle: "italic",
      backgroundColor: "#f8fafc",
      padding: "1rem",
      borderRadius: "0.25rem",
    },
    a: {
      color: "#3b82f6",
      textDecoration: "underline",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "1rem",
      border: "1px solid #e5e7eb",
      borderRadius: "0.5rem",
      overflow: "hidden",
    },
    th: {
      backgroundColor: "#f9fafb",
      padding: "0.75rem",
      textAlign: "left",
      fontWeight: "bold",
      borderBottom: "1px solid #e5e7eb",
    },
    td: {
      padding: "0.75rem",
      borderBottom: "1px solid #f3f4f6",
    },
  };

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          import.meta.env.VITE_URL_API + `news/detail/${id}`
        );
        setData(res.data.data[0] || { content: "<p>ไม่พบข้อมูล</p>" });
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({ content: "<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>" });
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [id]);

  useEffect(() => {
    const container = document.getElementById("html-content");
    if (container && data.content) {
      Object.entries(styles).forEach(([tag, style]) => {
        container.querySelectorAll(tag).forEach((element) => {
          Object.assign(element.style, style);
        });
      });

      container.querySelectorAll("li").forEach((li) => {
        li.style.marginBottom = "0.5rem";
      });

      container.querySelectorAll("code").forEach((code) => {
        code.style.backgroundColor = "#f1f5f9";
        code.style.padding = "0.25rem 0.5rem";
        code.style.borderRadius = "0.25rem";
        code.style.fontSize = "0.875rem";
        code.style.fontFamily = "monospace";
      });

      container.querySelectorAll("pre").forEach((pre) => {
        pre.style.backgroundColor = "#1e293b";
        pre.style.color = "#f1f5f9";
        pre.style.padding = "1rem";
        pre.style.borderRadius = "0.5rem";
        pre.style.overflow = "auto";
        pre.style.marginBottom = "1rem";
      });
    }
  }, [data]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <button
              onClick={handleGoBack}
              className="mb-4 inline-flex items-center text-sm font-bold p-3 rounded-2xl text-white hover:bg-green-600 bg-green-500 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ย้อนกลับ
            </button>
            {data.title && (
              <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                {data.title}
              </h1>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              {data.created_at && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  📅 วันที่{" "}
                  {new Date(data.created_at).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {data.owner_name && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✍️ ผู้แจ้ง {data.owner_name}
                </span>
              )}
            </div>

            <div
              id="html-content"
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />

            {/* Source Reference Section */}
            {data.source_ref && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    🔗 แหล่งที่มา
                  </h3>
                  <div className="space-y-2">
                    {isValidUrl(data.source_ref) ? (
                      <a
                        href={data.source_ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span className="break-all">{data.source_ref}</span>
                      </a>
                    ) : (
                      <div className="text-gray-700">
                        <span className="break-all">{data.source_ref}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
