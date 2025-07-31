import React, { useEffect, useState } from "react";
import axios from "axios";

function NewTest() {
  const [data, setData] = useState("");

  const styles = {
    ul: {
      listStyleType: "disc",
      paddingLeft: "1.5rem",
    },
    ol: {
      listStyleType: "decimal",
      paddingLeft: "1.5rem",
    },
  };

  useEffect(() => {
    const getDate = async () => {
      const res = await axios.get(import.meta.env.VITE_URL_API + "news");
      setData(res.data.data[2]?.content || "<p>ไม่พบข้อมูล</p>");
    };
    getDate();
  }, []);

  useEffect(() => {
    // apply inline styles after content is rendered
    const container = document.getElementById("html-content");
    if (container) {
      container.querySelectorAll("ul").forEach((ul) => {
        Object.assign(ul.style, styles.ul);
      });
      container.querySelectorAll("ol").forEach((ol) => {
        Object.assign(ol.style, styles.ol);
      });
    }
  }, [data]);

  return (
    <div
      id="html-content"
      className="text-gray-700 mt-4 leading-7"
      dangerouslySetInnerHTML={{ __html: data }}></div>
  );
}

export default NewTest;
