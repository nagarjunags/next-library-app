"use server";
// app/actions/add-book.ts (Server Action)
import { BookRepository } from "@/db/books.repository";

// This must be a server-side action
export async function addBook(bookData: {
  title: string;
  author: string;
  publisher: string;
  genre: string;
  isbnNo: string;
  numofPages: number;
  totalNumberOfCopies: number;
  coverImage: string; // URL after Cloudinary upload
}) {
  // console.log(bookData);

  const bookRepository = new BookRepository();

  try {
    const newBook = await bookRepository.create({
      title: bookData.title,
      author: bookData.author,
      publisher: bookData.publisher,
      genre: bookData.genre,
      isbnNo: bookData.isbnNo,
      numofPages: bookData.numofPages,
      totalNumberOfCopies: bookData.totalNumberOfCopies,
      coverImage: bookData.coverImage,
    });

    return newBook;
  } catch (error) {
    console.error("Error adding book:", error);
    throw new Error("Failed to add book");
  }
}
