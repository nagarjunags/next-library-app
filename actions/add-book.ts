// app/actions/add-book.ts
"use server";

import { v2 as cloudinary } from "cloudinary";
import { BookRepository } from "@/db/books.repository";
import { Readable } from "stream"; // To handle stream conversion

// Configure Cloudinary (using environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Instantiate the BookRepository
const bookRepository = new BookRepository();

// Helper function to upload the image to Cloudinary as a stream
function uploadToCloudinary(buffer: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "library_books" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to a readable stream and pipe it to Cloudinary
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null); // End the stream
    readableStream.pipe(stream);
  });
}

// Server-side action to handle book addition
export async function addBookAction(
  title: string,
  author: string,
  publisher: string,
  genre: string,
  isbnNo: string,
  numofPages: number,
  totalNumberOfCopies: number,
  coverImage: File | null
) {
  try {
    let coverImageUrl = "";
    if (coverImage) {
      const arrayBuffer = await coverImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload image to Cloudinary and get the URL
      const uploadResponse = await uploadToCloudinary(buffer);
      coverImageUrl = uploadResponse.secure_url;
    }

    const bookData = {
      title,
      author,
      publisher,
      genre,
      isbnNo,
      numofPages,
      totalNumberOfCopies,
      coverImage: coverImageUrl,
    };

    // Add book to the repository (database)
    const addedBook = await bookRepository.create(bookData);

    return {
      success: true,
      message: "Book added successfully!",
      book: addedBook,
    };
  } catch (error) {
    console.error("Error adding book:", error);
    return { success: false, message: "Failed to add the book." };
  }
}
