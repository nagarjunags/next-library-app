// components/HomeClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { fetchBooks } from "@/app/homeAction"; // Import the server-side action

import { useRouter, useSearchParams } from "next/navigation";
import BookCard from "@/components/Bookcard";
import AddBook from "@/components/addbook/Adbook";
import Search from "@/components/Search";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Book as BookType } from "@/components/Bookcard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useSession } from "next-auth/react";

interface HomeClientProps {
  books: BookType[];
  pagination: any;
  page: number;
}

const HomeClient: React.FC<HomeClientProps> = ({
  books: initialBooks,
  pagination,
  page,
}) => {
  console.log(initialBooks);

  const { data: session } = useSession();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [books, setBooks] = useState<BookType[]>(initialBooks);
  const [sortBy, setSortBy] = useState<"title" | "author">("title");
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const query = searchParams.get("search") || "";
  // const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // useEffect(() => {
  //   const fetchBookss = async () => {
  //     // const response = await fetch(
  //     // `/api/search/recomendations?search=${encodeURIComponent(
  //     //   query
  //     // )}&page=${currentPage}`;
  //     // );
  //     // const data = await response.json();
  //     // setBooks(data.books);
  //     // const response =   async () => {
  //     //   const { books, pagination } = await fetchBooks({
  //     //     search: encodeURIComponent(query) || "",
  //     //     page: currentPage.toString()|| "1",
  //     //   });
  //     // setBooks(books);

  //     };
  //   };

  //   fetchBookss();
  // }, [query, currentPage]);

  const handleAddBookClick = () => {
    setShowAddBookModal(true);
  };
  const handleCloseModal = () => {
    setShowAddBookModal(false);
  };

  const handleSort = (option: "title" | "author") => {
    setSortBy(option);
    const sortedBooks = [...initialBooks].sort((a, b) =>
      a[option].localeCompare(b[option])
    );
    setBooks(sortedBooks);
  };

  // const handleSearchResults = (searchResults: BookType[]) => {
  //   setBooks(searchResults);
  // };

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

        <div className="w-full flex justify-between items-center mt-6">
          <DropdownMenu>
            {/* <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white text-blue-600">
                Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger> */}
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleSort("title")}>
                Title
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("author")}>
                Author
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {session?.user?.role === "admin" && (
            <Button
              onClick={handleAddBookClick}
              className="bg-blue-700 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Add Book
            </Button>
          )}
        </div>
        <Pagination page={page} pagination={pagination} />

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialBooks.map((book) => (
            <BookCard key={book.id} book={book as BookType} />
          ))}
        </div>
        <Pagination page={page} pagination={pagination} />

        {showAddBookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg relative  border-black">
              <button
                className="absolute top-2 right-2 text-gray-600 m-2 border-2 font-black h-8 w-8 border-black hover:text-gray-900"
                onClick={handleCloseModal}
              >
                &times;
              </button>
              <AddBook />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeClient;
