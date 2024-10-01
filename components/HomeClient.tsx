"use client";

import React, { useState, useEffect } from "react";
import { fetchBooks } from "@/app/[locale]/homeAction"; // Import the server-side action
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
import { useTranslations } from "next-intl";

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
  const { data: session } = useSession();
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [books, setBooks] = useState<BookType[]>(initialBooks);
  const [sortBy, setSortBy] = useState<"title" | "author">("title");
  const router = useRouter(); // Initialize the router
  const [locale, setLocale] = useState("en");
  const t = useTranslations("Index");

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

  // Function to handle language change
  const handleLanguageChange = (newLocale: string) => {
    console.log(newLocale);
    setLocale(newLocale);
    // Push to the router to change the URL with the new locale
    router.push(`/${newLocale}`); // Update the URL with the new locale
  };

  // Effect to update translations when locale changes
  useEffect(() => {
    // Trigger a re-render for the translations
    t("someKey"); // This is a hack to force the re-evaluation of translations
  }, [locale]);

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-white sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            {t("discoverNextRead")}
          </h1>
          <p className="my-6 text-xl text-blue-100">
            {t("exploreCollection")}
          </p>
        </div>

        <div className="mt-4 mb-4">
          <label htmlFor="language-select" className="text-white">
            {t("selectLanguage")}:
          </label>
          <select
            id="language-select"
            value={locale}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="ml-2 p-2 rounded"
          >
            <option value="en">English</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>

        <Search />

        <div className="w-full flex justify-between items-center mt-6">
          <DropdownMenu>
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
            <div className="bg-white p-6 rounded-lg shadow-lg relative border-black">
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
