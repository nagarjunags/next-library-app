// app/homeAction.ts (server-side action)
"use server";

import { BookRepository } from "@/db/books.repository";

export const fetchBooks = async (searchParams: {
  search: string;
  page: string;
}) => {
  const bookRepo = new BookRepository();

  const searchTerm = searchParams.search || "";
  const page = parseInt(searchParams.page || "1", 10); // Extract page from search params
  const limit = 9;
  const offset = (page - 1) * limit;

  const { items: books, pagination } = await bookRepo.list({
    search: searchTerm,
    limit,
    offset,
  });
  console.log("-->", books);
  return { books, pagination };
};
