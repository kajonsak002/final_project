import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, Link } from "react-router-dom";

function BookDetail() {
  const location = useLocation();
  const book = location.state?.book;

  console.log("BookDetail : " + book);

  return (
    <div>
      <div className="mt-5 mx-8">
        <Link to="/book">
          <button className="btn btn-outline">
            <ArrowLeft />
            <span>ย้อนกลับ</span>
          </button>
        </Link>
      </div>
      <pre>{JSON.stringify(book, null, 2)}</pre>
    </div>
  );
}

export default BookDetail;
