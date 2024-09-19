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
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { data: session } = useSession();

  const handleBorrow = async () => {
    toast.promise(
      borrowBookAction(book.isbnNo, book.title),
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
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{book.title}</CardTitle>
          <p className="text-sm text-gray-600">{book.author}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <ImageIcon className="w-12 h-12 text-gray-500" />
              </div>
            )}
          </div>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">ISBN:</span> {book.isbnNo}
            </p>
            <p>
              <span className="font-medium">Pages:</span> {book.numofPages}
            </p>
            <p>
              <span className="font-medium">Available:</span>{" "}
              {book.availableNumberOfCopies}/{book.totalNumberOfCopies}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-4">
          {session && (
            <Button
              onClick={handleBorrow}
              className="flex-1 mr-2 bg-gray-200 hover:bg-gray-300"
            >
              <Book className="mr-2 h-4 w-4" /> Borrow
            </Button>
          )}
          {session?.user?.role === "admin" && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="flex-1 ml-2 bg-red-500 hover:bg-gray-300"
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
