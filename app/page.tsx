// app/page.tsx
"use server";
import React from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import { BookRepository } from "@/db/books.repository";
import BookCard from "@/components/Bookcard";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";

const Home = async ({ searchParams }) => {
  const bookRepo = new BookRepository();

  const session = await getServerSession(authOptions);
  console.log("home", session?.user?.id);

  // Retrieve search term, page, and limit from query params
  const searchTerm = searchParams.search || "";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 9;
  const offset = (page - 1) * limit;

  // Fetch paginated books
  const { items: books, pagination } = await bookRepo.list({
    search: searchTerm,
    limit,
    offset,
  });

  return (
    <section className="bg-blue-500 py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Find The Book
          </h1>
          <p className="my-4 text-xl text-white">
            Search the book by Author, title or genre...
          </p>
        </div>
        <Search /> {/* Client component for search */}
        {/* Book cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} /> // Passing book prop to BookCard
          ))}
        </div>
        {/* Pagination controls */}
        <Pagination page={page} pagination={pagination} />
      </div>
    </section>
  );
};

export default Home;
