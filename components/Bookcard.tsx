"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Book, User, Image as ImageIcon } from "lucide-react";
import { borrowBookAction } from "@/actions/borrowActions";
import { deleteBookAction } from "@/actions/deleteBookActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  numofPages: number;
  totalNumberOfCopies: number;
  availableNumberOfCopies: number;
  coverImage: string;
  price: number;  // Added price field
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { data: session } = useSession();

  const handleBorrow = async () => {
    toast.promise(
      borrowBookAction(book.id, book.title),
      {
        loading: 'Borrowing book...',
        success: (result) => result.success ? `Successfully borrowed "${book.title}"` : `Failed to borrow: ${result.error}`,
        error: 'An error occurred while borrowing the book.',
      },
      {
        style: {
          minWidth: '250px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#fff',
        },
        success: {
          duration: 5000,
          icon: '🎉',
        },
        error: {
          duration: 5000,
          icon: '❌',
        },
      }
    );
  };

  const handleDelete = async () => {
    toast((t) => (
      <div className="flex flex-col items-center">
        <p className="mb-2">{`Are you sure you want to delete "${book.title}"?`}</p>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              toast.promise(
                deleteBookAction(book.id),
                {
                  loading: 'Deleting book...',
                  success: (result) => result.success ? 'Book deleted successfully!' : `Failed to delete: ${result.error}`,
                  error: 'An error occurred while deleting the book.',
                },
                {
                  style: {
                    minWidth: '250px',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                  },
                  success: {
                    duration: 5000,
                    icon: '🗑️',
                  },
                  error: {
                    duration: 5000,
                    icon: '❌',
                  },
                }
              );
              toast.dismiss(t.id);
            }}
            variant="destructive"
            size="sm"
          >
            Delete
          </Button>
          <Button
            onClick={() => toast.dismiss(t.id)}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
      style: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        borderRadius: '8px',
        padding: '1rem',
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between border border-gray-300 bg-white text-gray-900 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardHeader className="p-4">
          <CardTitle className="text-lg font-semibold line-clamp-2">{book.title}</CardTitle>
          <p className="text-sm text-gray-600 line-clamp-1">{book.author}</p>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <div className="mb-4 relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                layout="fill"
                objectFit="contain"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <p className="line-clamp-1">
              <span className="font-medium">ISBN:</span> {book.isbnNo}
            </p>
            <p>
              <span className="font-medium">Pages:</span> {book.numofPages}
            </p>
            <p>
              <span className="font-medium">Available:</span>{" "}
              {book.availableNumberOfCopies}/{book.totalNumberOfCopies}
            </p>
            <p className="text-green-500 text-lg font-semibold"> {/* Updated styles here */}
              <span className="font-medium">Price:</span> ₹{book.price || 200}
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 flex justify-between">
          {session && (
            <Button
              onClick={handleBorrow}
              className="bg-blue-200 flex-1 mr-2 text-primary-foreground hover:bg-primary/90"
            >
              <Book className="mr-2 h-4 w-4" /> Borrow
            </Button>
          )}
          {session?.user?.role === "admin" && (
            <Button 
              onClick={handleDelete}
              variant="destructive"
              className="bg-red-400 flex-1 ml-2"
            >
              &times; Delete
            </Button>
          )}
        </CardFooter>
      </Card>
      <Toaster />
    </motion.div>
  );
};

export default BookCard;
