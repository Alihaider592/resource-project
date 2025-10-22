"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) pages.push(1, '...');

    for (let i = startPage; i <= endPage; i++) pages.push(i);

    if (endPage < totalPages) pages.push('...', totalPages);

    return pages;
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white border-t border-gray-200 rounded-b-xl">
      <div className="text-sm text-gray-700 mb-2 sm:mb-0">
        Showing <b>{startIndex}</b> to <b>{endIndex}</b> of <b>{totalItems}</b> results
      </div>
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </button>

        {getPageNumbers().map((item, index) =>
          typeof item === 'string' ? (
            <span key={index} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">{item}</span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item as number)}
              aria-current={item === currentPage ? 'page' : undefined}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                item === currentPage
                  ? 'z-10 bg-purple-100 border-purple-500 text-purple-600'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
