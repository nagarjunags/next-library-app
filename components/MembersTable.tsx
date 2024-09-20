"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { makeUserAsAdmin,deleteUser } from "@/app/members/actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  UId: number;
}

interface Pagination {
  total: number;
  limit: number;
  offset: number;
}

interface MembersTableProps {
  users: User[];
  pagination: Pagination;
}

export function MembersTable({ users, pagination }: MembersTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(
    Math.floor(pagination.offset / pagination.limit) + 1
  );

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    router.push(`/members?page=${newPage}&limit=${pagination.limit}`);
  };

  const handleMakeAdmin = (user: User) => {
    makeUserAsAdmin(user);
    alert(`Making user with ID ${user.UId} an admin`);
    router.refresh();

  };

  const handleDeleteUser = (user: User) => {
    deleteUser(user);
    alert(`Deleted user with ID ${user.UId}`);
    // Optionally, you can refresh the page or update state after deletion.
    router.refresh();
  };

  return (
    <Card className="m-4 mx-auto" style={{ width: "80%", maxWidth: "10000px" }}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-4">Members List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMakeAdmin(user)}
                      disabled={user.role === "admin"} // Disable if the user is already an admin
                      className="mr-2"
                    >
                      Make Admin
                    </Button>
                    <Button className="bg-red-500"
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                      disabled={user.role === "admin"} // Disable delete button for admin users
                    >
                      Delete User
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
