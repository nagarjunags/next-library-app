"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Book, User } from "lucide-react";
import { borrowBookAction } from "@/actions/borrowActions";
import { deleteBookAction } from "@/actions/deleteBookActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { data: session } = useSession();

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-700">
            {book.title}
          </CardTitle>
          <CardDescription>{book.author}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Publisher:</span> {book.publisher}
            </p>
            <p>
              <span className="font-semibold">Genre:</span> {book.genre}
            </p>
            <p>
              <span className="font-semibold">ISBN:</span> {book.isbnNo}
            </p>
            <p>
              <span className="font-semibold">Pages:</span> {book.numofPages}
            </p>
            <p>
              <span className="font-semibold">Total Copies:</span>{" "}
              {book.totalNumberOfCopies}
            </p>
            <p>
              <span className="font-semibold">Available:</span>{" "}
              {book.availableNumberOfCopies}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {session && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleBorrow} className="w-full mr-2">
                    <Book className="mr-2 h-4 w-4" /> Borrow
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Borrow this book</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {session?.user?.role === "admin" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    className="w-full ml-2"
                  >
                    <User className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete this book (Admin only)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BookCard;
