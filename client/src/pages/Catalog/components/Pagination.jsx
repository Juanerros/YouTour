import React from "react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage, 
  onGoToPage 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="page-btn prev"
        onClick={onPrevPage}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      <div className="page-numbers">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`page-btn ${page === currentPage ? "active" : ""}`}
            onClick={() => onGoToPage(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="page-btn next"
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination; 