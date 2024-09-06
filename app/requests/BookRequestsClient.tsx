"use client";

import React from "react";

export default function BookRequestsClient({
  requests,
  pagination,
  searchTerm,
  currentPage,
}: {
  requests: any[];
  pagination: { hasPrevious: boolean; hasNext: boolean };
  searchTerm: string;
  currentPage: number;
}) {
  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    if (searchTerm) {
      url.searchParams.set("search", searchTerm);
    }
    window.location.href = url.toString();
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Book Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {/* <th className="border p-2 text-left">Request ID</th> */}
              <th className="border p-2 text-left">ISBN No</th>
              <th className="border p-2 text-left">Request Date</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b">
                {/* <td className="border p-2">{request.uId}</td> */}
                <td className="border p-2">{request.isbnNo}</td>
                <td className="border p-2">
                  {new Date(request.reqDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {request.status === null
                    ? "Pending"
                    : request.status
                    ? "Approved"
                    : "Rejected"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!pagination.hasPrevious}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
}
