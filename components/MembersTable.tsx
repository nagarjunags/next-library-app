// /components/MembersTable.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";

interface User {
  UId: number;
  name: string;
  email: string;
  role: string;
}

interface Pagination {
  offset: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface MembersTableProps {
  users: User[];
  pagination: Pagination;
}

export const MembersTable: React.FC<MembersTableProps> = ({
  users,
  pagination,
}) => {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    const response = await fetch(`/members/delete?id=${id}`, {
      method: "POST",
    });
    if (response.ok) {
      router.refresh(); // Refresh the page after deletion
    }
  };

  const handleMakeAdmin = async (id: number) => {
    const response = await fetch(`/members/make-admin?id=${id}`, {
      method: "POST",
    });
    if (response.ok) {
      router.refresh(); // Refresh the page after updating role
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/members?page=${page}`);
  };

  return (
    <div>
      <table className="min-w-full bg-white border border-gray-300 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b border-gray-300 text-left">
              Name
            </th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">
              Email
            </th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">
              Role
            </th>
            <th className="px-4 py-2 border-b border-gray-300 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.UId}>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                {user.name}
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                {user.email}
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left">
                {user.role}
              </td>
              <td className="px-4 py-2 border-b border-gray-300 text-left flex space-x-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  onClick={() => handleMakeAdmin(user.UId)}
                >
                  Make Admin
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={() => handleDelete(user.UId)}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <button
          className={`px-4 py-2 rounded ${
            pagination.hasPrevious
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!pagination.hasPrevious}
          onClick={() => handlePageChange(pagination.offset / pagination.limit)}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 rounded ${
            pagination.hasNext
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!pagination.hasNext}
          onClick={() =>
            handlePageChange(pagination.offset / pagination.limit + 2)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};
