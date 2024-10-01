import React from "react";
// import { Requestsrepository } from "@/db/requests.repository";
import { TransactionRepository} from "@/db/transactions.repository";
import { BookRepository} from "@/db/books.repository";
import BookRequestsClient from "./BookRequestsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const BookRequestsList = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-xl font-semibold text-gray-800">
            You are not authorized to view this page.
          </p>
        </div>
      </div>
    );
  }

  // const requestRepo = new Requestsrepository();
  const transactionRepo = new TransactionRepository();
  const bookRepo = new BookRepository();

  const searchTerm = searchParams.search || "";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  let id = session.user.id;
  if (session.user.role === "admin") {
    id = 0;
  }

  // const { items: requests, pagination } = await requestRepo.list(id, {
  //   search: searchTerm,
  //   limit,
  //   offset,
  // });
 

  let { items: requests, pagination } = await transactionRepo.list(id, {
    limit,
    offset,
  });
  
  requests = await Promise.all(
    requests.map(async (request) => {
      const book = await bookRepo.getById(request.bookId);
      return {
        ...request,
        bookTitle: book.title,
      };
    })
  );
console.log(requests);
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
