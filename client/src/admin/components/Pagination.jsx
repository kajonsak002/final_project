import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="join">
        <button
          className="join-item btn btn-sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}>
          «
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            className={`join-item btn btn-sm ${
              page === currentPage ? "btn-active bg-green-600 text-white" : ""
            }`}
            onClick={() => onPageChange(page)}>
            {page}
          </button>
        ))}

        <button
          className="join-item btn btn-sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}>
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
