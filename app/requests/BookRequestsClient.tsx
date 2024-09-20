"use client";

import React, { useState, TransitionStartFunction } from "react";
import { useSession } from "next-auth/react";
import { updateRequestStatus } from "./actions";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define a custom session type
interface CustomSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

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
  const { data: session } = useSession() as { data: CustomSession | null };
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
    newStatus: string,
    isbNo: string,
    startTransition: TransitionStartFunction
  ) => {
   
    setUpdating(requestId);
    startTransition(async () => {
      const result = await updateRequestStatus(
        requestId,
        parseInt(newStatus),
        isbNo
      );

      if (result.success) {
        alert("Status updated successfully");
        window.location.reload();
      } else {
        alert(`Failed to update status: ${result.error}`);
      }
    });

    setUpdating(null);
  };

  const isAdmin = session?.user?.role === "admin";

  return (
    <Card className="m-4 mx-auto" style={{ width: '80%', maxWidth: '10000px' }}>

      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Book Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>User ID</TableHead>}
                <TableHead>Book Title</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  {isAdmin && (
                    <TableCell>
                      {request.uId}
                      {updating === request.id && "Updating..."}
                    </TableCell>
                  )}
                  <TableCell>{request.bookTitle}</TableCell>
                  <TableCell>
                    {new Date(request.reqDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <Select
                        value={
                          request.status === null
                            ? "pending"
                            : request.status.toString()
                        }
                        onValueChange={(value) =>
                          handleStatusChange(
                            request.id,
                            value,
                            request.isbnNo,
                            React.startTransition
                          )
                        }
                        disabled={updating === request.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="1">Approved</SelectItem>
                          <SelectItem value="0">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span>
                        {request.status === null
                          ? "Pending"
                          : request.status === 1
                          ? "Approved"
                          : "Rejected"}
                      </span>
                    )}
                  </TableCell>
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
