"use client";
//@/apps/requests/BooksRequestsClient.tsx
import React, { useState, TransitionStartFunction } from "react";
import { useSession } from "next-auth/react";
import { updateRequestStatus } from "./actions"; // Import the server action

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
  console.log("logging", requests);
  const { data: session } = useSession();
  const [updating, setUpdating] = useState<number | null>(null);

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    if (searchTerm) {
      url.searchParams.set("search", searchTerm);
    }
    window.location.href = url.toString();
  };

  const handleStatusChange = async (
    requestId: number,
    newStatus: number,
    isbNo: string,
    startTransition: TransitionStartFunction
  ) => {
    setUpdating(requestId);

    // Use Next.js actions (server actions)
    startTransition(async () => {
      const result = await updateRequestStatus(requestId, newStatus, isbNo);

      if (result.success) {
        alert("Status updated successfully");
        window.location.reload();
      } else {
        alert(`Failed to update status: ${result.error}`);
      }
    });

    setUpdating(null); // This is the correct line
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Book Requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {" "}
              {session?.user?.role === "admin" && (
                <th className="border p-2 text-left">User ID</th>
              )}
              <th className="border p-2 text-left">ISBN No</th>
              <th className="border p-2 text-left">Request Date</th>
              <th className="border p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b">
                {session?.user?.role === "admin" && (
                  <td className="border p-2">
                    {request.uId} {/* Displaying user ID */}
                    {updating === request.id && "Updating..."}
                  </td>
                )}
                <td className="border p-2">{request.isbnNo}</td>
                <td className="border p-2">
                  {new Date(request.reqDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {session?.user?.role === "admin" ? (
                    <select
                      value={request.status === null ? "" : request.status}
                      onChange={(e) =>
                        handleStatusChange(
                          request.id,
                          parseInt(e.target.value),
                          request.isbnNo,
                          React.startTransition // TODO :PASS THE ISBN AND SO THAT ITS AVAILABLE FOR ACTION FILE
                        )
                      }
                      disabled={updating === request.id}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="">Pending</option>
                      <option value="1">Approved</option>
                      <option value="0">Rejected</option>
                    </select>
                  ) : request.status === null ? (
                    "Pending"
                  ) : request.status === 1 ? (
                    "Approved"
                  ) : (
                    "Rejected"
                  )}
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
