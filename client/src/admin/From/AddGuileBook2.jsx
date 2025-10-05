import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image,
  Link as LinkIcon,
  Plus,
} from "lucide-react";
import { toast } from "../../utils/toast";

function AddTest() {
  const [editorContent, setEditorContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const editorRef = useRef(null);
  const imageInputRef = useRef(null);

  const navigate = useNavigate();

  const [activeStates, setActiveStates] = useState({
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });

  useEffect(() => {
    if (editorRef.current) {
      const style = document.createElement("style");
      style.textContent = `
        [contenteditable="true"] ul {
          list-style-type: disc !important;
          margin-left: 20px !important;
        }
        [contenteditable="true"] ol {
          list-style-type: decimal !important;
          margin-left: 20px !important;
        }
        [contenteditable="true"] ul li, [contenteditable="true"] ol li {
          margin-bottom: 5px !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const handleContentChange = (e) => {
    setEditorContent(e.target.innerHTML);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        if (editorRef.current) {
          editorRef.current.focus();
          document.execCommand("insertImage", false, dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      title,
      category,
      content: editorContent,
    });
    toast.success("บันทึกข้อมูลสำเร็จ");
    setTimeout(() => {
      navigate("/admin/book");
    }, 1000);
  };

  const formatDoc = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    checkActiveStates();
  };

  const checkActiveStates = () => {
    setActiveStates({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
    });
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      checkActiveStates();
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    if (editorRef.current) {
      editorRef.current.addEventListener("click", checkActiveStates);
      editorRef.current.addEventListener("keyup", checkActiveStates);
    }

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (editorRef.current) {
        editorRef.current.removeEventListener("click", checkActiveStates);
        editorRef.current.removeEventListener("keyup", checkActiveStates);
      }
    };
  }, []);

  const handleListCommand = (listType) => {
    if (editorRef.current) {
      editorRef.current.focus();

      if (document.queryCommandState(listType)) {
        document.execCommand(listType);
      } else {
        if (
          listType === "insertOrderedList" &&
          document.queryCommandState("insertUnorderedList")
        ) {
          document.execCommand("insertUnorderedList");
        } else if (
          listType === "insertUnorderedList" &&
          document.queryCommandState("insertOrderedList")
        ) {
          document.execCommand("insertOrderedList");
        }

        document.execCommand(listType);

        if (listType === "insertUnorderedList") {
          setTimeout(() => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              let listItem = range.commonAncestorContainer;

              while (listItem && listItem.nodeName.toLowerCase() !== "li") {
                listItem = listItem.parentNode;
              }

              if (listItem) {
                const ul = listItem.parentNode;
                if (ul && ul.nodeName.toLowerCase() === "ul") {
                  ul.style.listStyleType = "disc";
                  ul.style.marginLeft = "20px";
                }
              }
            }
          }, 0);
        }
      }

      // Update active states
      checkActiveStates();
    }
  };

  return (
    <>
      <div className="breadcrumbs text-md">
        <ul>
          <li>
            <a>หน้าเเรก</a>
          </li>
          <li>
            <Link to={"/admin/book"}>จัดการคู่มือการเลี้ยงสัตว์</Link>
          </li>
          <li>เพิ่มข้อมูล</li>
        </ul>
      </div>

      {/* section form */}
      <div className="card w-full bg-base-100 shadow-xl mt-3 h-full">
        <div className="card-body">
          <h2 className="card-title text-xl mb-4">เพิ่มคู่มือการเลี้ยงสัตว์</h2>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="div">
                {/* Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black mb-2">
                      ชื่อสัตว์
                    </span>
                  </label>
                  <select className="select select-bordered w-full" required>
                    <option value="">เลือกสัตว์</option>
                    <option>ไก่</option>
                    <option>หมู</option>
                    <option>วัว</option>
                  </select>
                </div>

                {/* Category */}
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text text-black mb-2">ประเภท</span>
                  </label>
                  <select className="select select-bordered w-full" required>
                    <option value="">เลือกประเภท</option>
                    <option value="dog">ไก่เนื้อ</option>
                    <option>ไก่ไข</option>
                    <option>นก</option>
                  </select>
                </div>

                {/* Thumbnail */}
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text text-black mb-2">รูปภาพปก</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                  {thumbnailPreview && (
                    <div className="mt-2">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="div">
                {/* WYSIWYG Editor */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-black mb-2">เนื้อหา</span>
                  </label>

                  {/* Editor Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-gray-100 rounded-t border border-gray-300">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.bold ? "btn-active bg-blue-200" : ""
                      }`}
                      onClick={() => formatDoc("bold")}
                      title="ตัวหนา">
                      <Bold size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.italic ? "btn-active bg-blue-200" : ""
                      }`}
                      onClick={() => formatDoc("italic")}
                      title="ตัวเอียง">
                      <Italic size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.underline ? "btn-active bg-blue-200" : ""
                      }`}
                      onClick={() => formatDoc("underline")}
                      title="ขีดเส้นใต้">
                      <Underline size={16} />
                    </button>
                    <div className="divider divider-horizontal mx-1"></div>{" "}
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.justifyLeft ? "btn-active bg-blue-200" : ""
                      }`}
                      onClick={() => formatDoc("justifyLeft")}
                      title="จัดชิดซ้าย">
                      <AlignLeft size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.justifyCenter
                          ? "btn-active bg-blue-200"
                          : ""
                      }`}
                      onClick={() => formatDoc("justifyCenter")}
                      title="จัดกึ่งกลาง">
                      <AlignCenter size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.justifyRight
                          ? "btn-active bg-blue-200"
                          : ""
                      }`}
                      onClick={() => formatDoc("justifyRight")}
                      title="จัดชิดขวา">
                      <AlignRight size={16} />
                    </button>
                    <div className="divider divider-horizontal mx-1"></div>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.insertUnorderedList
                          ? "btn-active bg-blue-200"
                          : ""
                      }`}
                      onClick={() => handleListCommand("insertUnorderedList")}
                      title="รายการจุด">
                      <List size={16} />
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        activeStates.insertOrderedList
                          ? "btn-active bg-blue-200"
                          : ""
                      }`}
                      onClick={() => handleListCommand("insertOrderedList")}
                      title="รายการตัวเลข">
                      <ListOrdered size={16} />
                    </button>
                    <div className="divider divider-horizontal mx-1"></div>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => {
                        if (imageInputRef.current) {
                          imageInputRef.current.click();
                        }
                      }}
                      title="เพิ่มรูปภาพ">
                      <Image size={16} />
                    </button>
                  </div>

                  {/* Editor Content Area */}
                  <div
                    ref={editorRef}
                    className="w-full p-4 h-64 border border-gray-300 rounded-b overflow-y-auto h-80]"
                    contentEditable="true"
                    onInput={handleContentChange}
                    onClick={checkActiveStates}
                    onKeyUp={checkActiveStates}
                    style={{ height: "500px" }}></div>
                </div>
              </div>

              {/* Hidden image input for editor */}
              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />

              {/* Submit Button */}
              <div className="form-control mt-4">
                <button
                  type="submit"
                  className="btn bg-green-600 text-white hover:bg-green-700">
                  <Plus size={20} className="mr-2" />
                  บันทึกข้อมูล
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddTest;
