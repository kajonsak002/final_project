import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyEditor({ content, handleEditorChange }) {
  return (
    <div>
      <Editor
        apiKey="cnm3cofu4qfnohlo3g5annexiyobfk6sm31iren9z6os0mcy"
        value={content || ""}
        onEditorChange={handleEditorChange}
        init={{
          height: 700,
          menubar: false,
          plugins: [
            "image",
            "table",
            "lists",
            "advlist",
            "autolink",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "media",
            "insertdatetime",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | table",
          image_title: true,
          automatic_uploads: true,
          file_picker_types: "image",
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.onchange = function () {
              const file = input.files[0];
              const reader = new FileReader();
              reader.onload = function () {
                const id = "blobid" + new Date().getTime();
                const blobCache =
                  window.tinymce.activeEditor.editorUpload.blobCache;
                const base64 = reader.result.split(",")[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
              };
              reader.readAsDataURL(file);
            };

            input.click();
          },
        }}
      />

      {/* <div className="mt-4 p-2 bg-gray-100 rounded">
        <h2 className="font-bold">Preview HTML:</h2>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div> */}
    </div>
  );
}
