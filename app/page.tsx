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

  const searchTerm = searchParams.search || "";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 9;
  const offset = (page - 1) * limit;

  const { items: books, pagination } = await bookRepo.list({
    search: searchTerm,
    limit,
    offset,
  });

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            Discover Your Next Read
          </h1>
          <p className="my-6 text-xl text-blue-100">
            Explore our vast collection by author, title, or genre...
          </p>
        </div>
        <Search />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
        <Pagination page={page} pagination={pagination} />
      </div>
    </section>
  );
};

export default Home;
