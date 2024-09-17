//@components/addbook/action.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { BookRepository } from "@/db/books.repository";
import { Readable } from "stream"; // To handle stream conversion

// Configure Cloudinary (using environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("HHHEEERRREEE");

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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const author = formData.get("author")?.toString();
    const publisher = formData.get("publisher")?.toString();
    const genre = formData.get("genre")?.toString();
    const isbnNo = formData.get("isbnNo")?.toString();
    const numofPages = Number(formData.get("numofPages"));
    const totalNumberOfCopies = Number(formData.get("totalNumberOfCopies"));
    const coverImage = formData.get("coverImage") as Blob; // Blob for server-side handling

    if (coverImage) {
      // Convert Blob to Buffer for server-side handling
      const arrayBuffer = await coverImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload the image to Cloudinary using the Buffer
      const uploadResponse = await uploadToCloudinary(buffer);

      const coverImageUrl = uploadResponse.secure_url; // Now this exists

      // Prepare the data to be sent to the repository
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

      // Use the BookRepository to handle the database operation
      const addedBook = await bookRepository.create(bookData);

      return NextResponse.json({
        message: "Book added successfully!",
        book: addedBook,
      });
    } else {
      return NextResponse.json(
        { message: "Cover image is required." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error adding book:", error);
    return NextResponse.json(
      { message: "An error occurred." },
      { status: 500 }
    );
  }
}
