"use client";
import React, { useState, TransitionStartFunction } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion"; // For animations if needed
import { markAsReturned } from "./actions"; // Server action for marking as returned
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons for pagination
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
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
  // console.log(transactions);

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
  // console.log(transactions[0].issueddate);
  const isAdmin = session?.user?.role === "admin";

  return (
    <Card className="m-4 mx-auto" style={{ width: "80%", maxWidth: "10000px" }}>
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
                <TableHead>Issued Date</TableHead>
                
                {isAdmin && <TableHead>Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  {isAdmin && <TableCell>{transaction.userId}</TableCell>}
                  <TableCell>{transaction.bookId}</TableCell>
                  <TableCell>
                    {format(
                      new Date(" Sep 12 2024 (India Standard Time)"),
                      "yyyy-MM-dd "
                    )}
                  </TableCell>
                
                  {isAdmin && (
                    <TableCell>
                   <Button
  onClick={() =>
    handleReturn(transaction.transactionId, React.startTransition)
  }
  disabled={updating === transaction.id || transaction.isReturned === 1}  // Disable if updating or already returned
  className={`${
    updating === transaction.id || transaction.isReturned === 1
      ? "bg-gray-400 cursor-not-allowed" // Disabled styling
      : "bg-blue-600 hover:bg-blue-700"  // Enabled styling
  }`}
>
  {updating === transaction.id
    ? "Updating..."
    : transaction.isReturned === 1
      ? "Already Returned"
      : "Mark as Returned"}
</Button>


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
