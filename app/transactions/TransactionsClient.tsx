"use client";
import React, { useState, TransitionStartFunction } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion"; // For animations if needed
import { markAsReturned } from "./actions"; // Server action for marking as returned
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons for pagination
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const isAdmin = session?.user?.role === "admin";

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>User ID</TableHead>}
                <TableHead>ISBN No</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Return Status</TableHead>
                {isAdmin && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  {isAdmin && <TableCell>{transaction.userId}</TableCell>}
                  <TableCell>{transaction.isbnNo}</TableCell>
                  <TableCell>
                    {new Date(transaction.borrowDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {transaction.returned ? (
                      "Returned"
                    ) : (
                      <span className="text-yellow-500">Not Returned</span>
                    )}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      {!transaction.returned && (
                        <Button
                          onClick={() =>
                            handleReturn(transaction.id, React.startTransition)
                          }
                          disabled={updating === transaction.id}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {updating === transaction.id
                            ? "Updating..."
                            : "Mark as Returned"}
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-between">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevious}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            variant="outline"
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
