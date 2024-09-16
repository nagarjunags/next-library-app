// app/requests/page.tsx
"use server"; // TODO: make the table to not to grow beyond certain limit
import React from "react";
import { Requestsrepository } from "@/db/requests.repository";
import BookRequestsClient from "./BookRequestsClient"; // Import the client component
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { user } from "@/db/drizzle/library.schema";

const BookRequestsList = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  console.log(session);

  if (!session) {
    return (
      <div>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }
  const requestRepo = new Requestsrepository();

  // Retrieve search term, page, and limit from query params
  const searchTerm = searchParams.search || "";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  let id = session.user.id;
  // Fetch paginated book requests // TODO: MAKE IT USER SPECIFIC
  if (session.user.role === "admin") {
    id = 0;
  }
  const { items: requests, pagination } = await requestRepo.list(id, {
    search: searchTerm,
    limit,
    offset,
  });

  return (
    <BookRequestsClient
      requests={requests}
      pagination={pagination}
      searchTerm={searchTerm}
      currentPage={page}
    />
  );
};

export default BookRequestsList;
