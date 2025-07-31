import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

export default function GuildBookEditor({ content, handleEditorChange }) {
  return (
    <Editor
      apiKey="cnm3cofu4qfnohlo3g5annexiyobfk6sm31iren9z6os0mcy"
      value={content}
      onEditorChange={handleEditorChange}
      init={{
        height: 700,
        menubar: false,
        plugins: ["image", "table", "lists", "code"],
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | table | code",
        image_title: true,
        automatic_uploads: true,
        images_upload_credentials: true,
        convert_urls: false,
        remove_script_host: false,
        relative_urls: false,

        images_upload_handler: (blobInfo, progress) => {
          return new Promise(async (resolve, reject) => {
            try {
              const formData = new FormData();
              formData.append("image", blobInfo.blob(), blobInfo.filename());
              const res = await axios.post(
                "http://localhost:3000/api/guildbook/upload",
                formData
              );
              const imageUrl = res.data.imageUrl;
              if (typeof imageUrl === "string") resolve(imageUrl);
              else reject({ message: "Invalid URL", remove: true });
            } catch (err) {
              reject({ message: "Upload failed", remove: true });
            }
          });
        },
      }}
    />
  );
}
