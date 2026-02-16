
import React, { useState } from 'react';

interface PaginationProps {
  total: number | any;
  getRequestData: (query: { page: number; limit: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({ total, getRequestData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);

  const totalPages = Math.ceil(total / pageSize);

  const toggleDropup = () => {
    setIsOpen(!isOpen);
  };

  const changePageSize = (size: number) => {
    setIsOpen(false);
    setPageSize(size);
    setPageNo(1);
    let query = {
      page: 1,
      limit: size,
    };
    getRequestData(query);
  };

  const nextPage = () => {
    if (pageNo < totalPages) {
      const nextPageNo = pageNo + 1;
      setPageNo(nextPageNo);
      let query = {
        page: nextPageNo,
        limit: pageSize,
      };
      getRequestData(query);
    }
  };

  const previousPage = () => {
    if (pageNo > 1) {
      const previousPageNo = pageNo - 1;
      setPageNo(previousPageNo);
      let query = {
        page: previousPageNo,
        limit: pageSize,
      };
      getRequestData(query);
    }
  };

  return (
    <div className="bg-white rounded-lg p-1 flex justify-between">
      <div className="relative text-left flex gap-4 items-center">
        <div>
          <button
            onClick={toggleDropup}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          >
            {pageSize}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M10 12l-8-8h16l-8 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="font-semibold">Total Count: {total}</div>
        {isOpen && (
          <div className="origin-bottom-right absolute bottom-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <button onClick={() => changePageSize(10)} className="block px-4 py-2 text-sm text-black hover:bg-gray-900 hover:text-gray-900" role="menuitem">
                10
              </button>
              <button onClick={() => changePageSize(20)} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                20
              </button>
              <button onClick={() => changePageSize(50)} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                50
              </button>
              <button onClick={() => changePageSize(100)} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                100
              </button>
              <button onClick={() => changePageSize(500)} className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                500
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="py-2 px-4 mr-5">
        <button
          onClick={previousPage}
          disabled={pageNo === 1}
          className={`text-sm focus:outline-none ${pageNo === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:text-gray-900'}`}
        >
          Previous
        </button>
        <p className="text-sm text-black hover:text-black focus:outline-none inline py-2 px-4">{pageNo}</p>
        <button
          onClick={nextPage}
          disabled={pageNo === totalPages}
          className={`ml-4 text-sm focus:outline-none ${pageNo === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-black hover:text-gray-900'}`}
        >
          Next
        </button>

      </div>
    </div>
  );
};

export default Pagination;
