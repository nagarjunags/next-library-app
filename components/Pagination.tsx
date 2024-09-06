"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Pagination = ({ page, pagination }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // console.log("Pagination object:", pagination);

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  console.log(pagination.total);
  const totalPages = Math.ceil(pagination.total / 9);

  // console.log("Page:", page);
  // console.log("Total Pages:", totalPages);

  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="mb-4 text-white">
        {" "}
        {/* Page {page} of {totalPages}{" "}// TODO:Add this and correct calculation of total pages*/}
      </div>
      <div className="flex">
        <button
          disabled={!pagination.hasPrevious}
          onClick={() => handlePageChange(page - 1)}
          className="bg-white text-blue-500 px-4 py-2 mx-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={!pagination.hasNext}
          onClick={() => handlePageChange(page + 1)}
          className="bg-white text-blue-500 px-4 py-2 mx-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
