"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, pagination }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.replace(`?${params.toString()}`);
  };

  const totalPages = Math.ceil(pagination.total / 9);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all page numbers if fewer than or equal to the max visible pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={i === page ? "default" : "outline"} // Use "default" for solid style
            onClick={() => handlePageChange(i)}
            className={`mx-1 w-10 h-10 ${
              i === page ? "bg-blue-500 text-white" : "border-white text-white"
            }`}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Show condensed pagination
      if (page > 3) {
        // Show first page and ellipsis if the current page is greater than 3
        pageNumbers.push(
          <Button
            key="1"
            variant="outline"
            onClick={() => handlePageChange(1)}
            className="mx-1 w-10 h-10 border-white text-white"
          >
            1
          </Button>
        );
        if (page > 4) {
          pageNumbers.push(<span key="start-dots">...</span>);
        }
      }

      // Show page numbers around the current page
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={i === page ? "default" : "outline"}
            onClick={() => handlePageChange(i)}
            className={`mx-1 w-10 h-10 ${
              i === page ? "bg-blue-500 text-white" : "border-white text-white"
            }`}
          >
            {i}
          </Button>
        );
      }

      if (page < totalPages - 2) {
        pageNumbers.push(<span key="end-dots">...</span>);
        pageNumbers.push(
          <Button
            key={totalPages}
            variant="outline"
            onClick={() => handlePageChange(totalPages)}
            className="mx-1 w-10 h-10 border-white text-white"
          >
            {totalPages}
          </Button>
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="flex items-center">
        <Button
          variant="outline"
          disabled={!pagination.hasPrevious}
          onClick={() => handlePageChange(page - 1)}
          className="mr-2 border-white text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex items-center space-x-1">{renderPageNumbers()}</div>
        <Button
          variant="outline"
          disabled={!pagination.hasNext}
          onClick={() => handlePageChange(page + 1)}
          className="ml-2 border-white text-white disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
