import React from "react";
import { X, MessageSquare, Clock, UserCircle, Send } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/th";

function DetailPost({ open, post, onClose, comment }) {
  if (!open || !post) return null;

  const formatDate = (dateString) => {
    return dayjs(dateString).locale("th").format("D MMMM YYYY เวลา HH:mm");
  };

  return (
    <dialog open className="modal">
      <div className="modal-box max-w-6xl h-[80vh] p-0 bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="relative w-full h-full flex">
          {/* Close Button */}
          <button
            className="cursor-pointer absolute right-4 top-4 z-20 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-200"
            onClick={onClose}>
            <X />
          </button>

          {/* Left: Image if exists */}
          {post?.image_post ? (
            <div className="w-1/2 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
              <img
                src={post.image_post}
                alt="Post Image"
                className="object-contain max-h-full max-w-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          ) : null}

          {/* Right: Content and Comments */}
          <div
            className={`${
              post?.image_post ? "w-1/2" : "w-full"
            } bg-gradient-to-b from-white to-gray-50 flex flex-col`}>
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100 bg-white">
              <div className="flex items-center space-x-3 mb-3">
                <div className="avatar">
                  <div className="w-16 rounded-full">
                    <img src={post?.farm_img} alt="Farm" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {post?.farm_name}
                  </h3>
                  <p className="text-gray-500 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(post.create_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 border-b border-gray-100 bg-white">
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">
                  {post?.content || "ไม่มีเนื้อหาโพสต์"}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  ความคิดเห็น
                </h4>

                <div className="space-y-4">
                  {comment.length > 0 ? (
                    <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            A
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-1">
                            ผู้ใช้งาน A
                          </p>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            โพสต์นี้ดีมากครับ ข้อมูลเป็นประโยชน์มาก
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <button className="text-xs text-gray-500 hover:text-blue-500 transition-colors">
                              ตอบกลับ
                            </button>
                            <span className="text-xs text-gray-400">
                              2 ชั่วโมงที่แล้ว
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-[300px]  p-8">
                      <div className="relative">
                        <div className="relative bg-white rounded-full p-8 shadow-lg border border-slate-100 mb-6 group hover:shadow-xl transition-shadow duration-300">
                          <MessageSquare size={64} className="text-slate-400" />
                        </div>
                      </div>

                      <div className="text-center space-y-3 max-w-md">
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">
                          ยังไม่มีความคิดเห็น
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed">
                          เป็นคนแรกที่แสดงความคิดเห็น
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comment Input Section */}
            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                        alt="User"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="แสดงความคิดเห็น..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors duration-200">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

export default DetailPost;
