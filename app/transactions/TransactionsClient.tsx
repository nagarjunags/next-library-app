"use client";
import React, { useState, TransitionStartFunction } from "react";
import { useSession } from "next-auth/react";
import { markAsReturned } from "./actions"; // Server action for marking as returned

export default function TransactionsClient({
  transactions,
  pagination,
  currentPage,
}: {
  transactions: any[];
  pagination: { hasPrevious: boolean; hasNext: boolean };
  currentPage: number;
}) {
  const { data: session } = useSession();
  const [updating, setUpdating] = useState<number | null>(null);

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("page", newPage.toString());
    window.location.href = url.toString();
  };

  const handleReturn = async (
    transactionId: number,
    startTransition: TransitionStartFunction
  ) => {
    setUpdating(transactionId);

    // Server action to mark the book as returned
    startTransition(async () => {
      const result = await markAsReturned(transactionId);
      if (result.success) {
        alert("Book marked as returned successfully");
        window.location.reload();
      } else {
        alert(`Failed to mark as returned: ${result.error}`);
      }
    });

    setUpdating(null);
  };

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {session?.user?.role === "admin" && (
                <th className="border p-2 text-left">User ID</th>
              )}
              <th className="border p-2 text-left">ISBN No</th>
              <th className="border p-2 text-left">Borrow Date</th>
              <th className="border p-2 text-left">Return Status</th>
              {session?.user?.role === "admin" && (
                <th className="border p-2 text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                {session?.user?.role === "admin" && (
                  <td className="border p-2">{transaction.userId}</td>
                )}
                <td className="border p-2">{transaction.isbnNo}</td>
                <td className="border p-2">
                  {new Date(transaction.borrowDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {transaction.returned
                    ? "Returned"
                    : session?.user?.role === "admin" && (
                        <button
                          onClick={() =>
                            handleReturn(transaction.id, React.startTransition)
                          }
                          disabled={updating === transaction.id}
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                        >
                          {updating === transaction.id
                            ? "Updating..."
                            : "Mark as Returned"}
                        </button>
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
