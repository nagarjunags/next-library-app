// components/BookCard.tsx
"use client";
import React from "react";
import { borrowBookAction } from "@/actions/borrowActions";
import { deleteBookAction } from "@/actions/deleteBookActions"; // Import the delete action
import { useSession } from "next-auth/react"; // Import useSession to get session details

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  numofPages: number;
  totalNumberOfCopies: number;
  availableNumberOfCopies: number;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { data: session } = useSession(); // Get session details

  const handleBorrow = async () => {
    const confirmation = window.confirm(
      `Are you sure you want to borrow "${book.title}"?`
    );

    if (confirmation) {
      try {
        const result = await borrowBookAction(book.isbnNo);
        if (result.success) {
          alert("Book borrowed successfully!");
        } else {
          alert(`Failed to borrow book: ${result.error}`);
        }
      } catch (error) {
        console.error("An error occurred during the borrow process", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      `Are you sure you want to delete "${book.title}"?`
    );

    if (confirmation) {
      try {
        const result = await deleteBookAction(book.id);
        if (result.success) {
          alert("Book deleted successfully!");
        } else {
          alert(`Failed to delete book: ${result.error}`);
        }
      } catch (error) {
        console.error("An error occurred during the delete process", error);
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="bg-white border border-blue-500 shadow-md rounded-lg p-6 flex flex-col justify-between h-full transition-transform transform hover:scale-105">
      <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{book.title}</h2>
        <p className="text-blue-600 mb-1">
          <strong>Author:</strong> {book.author}
        </p>
        <p className="text-blue-600 mb-1">
          <strong>Publisher:</strong> {book.publisher}
        </p>
        <p className="text-blue-600 mb-1">
          <strong>Genre:</strong> {book.genre}
        </p>
        <p className="text-blue-600 mb-1">
          <strong>ISBN:</strong> {book.isbnNo}
        </p>
        <p className="text-blue-600 mb-1">
          <strong>Pages:</strong> {book.numofPages}
        </p>
        <p className="text-blue-600 mb-1">
          <strong>Copies:</strong> {book.totalNumberOfCopies}
        </p>
        <p className="text-blue-600">
          <strong>Available:</strong> {book.availableNumberOfCopies}
        </p>
      </div>
      <div className="mt-4 flex space-x-2">
        {session && (
          <button
            onClick={handleBorrow}
            className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
          >
            Borrow
          </button>
        )}

        {/* Conditionally render delete button for admin users */}
        {session?.user?.role === "admin" && (
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 ease-in-out"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCard;
