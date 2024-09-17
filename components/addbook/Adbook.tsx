"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "@/app/actions/add-book";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [isbnNo, setIsbnNo] = useState("");
  const [numofPages, setNumofPages] = useState<number | string>("");
  const [totalNumberOfCopies, setTotalNumberOfCopies] = useState<
    number | string
  >("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use environment variables for sensitive data
  const uploadImageToCloudinary = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/df1ae5amd/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed.");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error; // Rethrow to be caught in handleSubmit
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let coverImageUrl = "";

      if (coverImage) {
        coverImageUrl = await uploadImageToCloudinary(coverImage);
        console.log(coverImageUrl);
      }

      await addBook({
        title,
        author,
        publisher,
        genre,
        isbnNo,
        numofPages: Number(numofPages),
        totalNumberOfCopies: Number(totalNumberOfCopies),
        coverImage: coverImageUrl,
      });

      alert("Book added successfully!");
      router.refresh(); // Refresh the page
    } catch (error) {
      console.error("Error adding book:", error);
      setError("An error occurred while adding the book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Publisher:</label>
          <input
            type="text"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">ISBN Number:</label>
          <input
            type="text"
            value={isbnNo}
            onChange={(e) => setIsbnNo(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Number of Pages:</label>
          <input
            type="number"
            value={numofPages}
            onChange={(e) => setNumofPages(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Total Number of Copies:</label>
          <input
            type="number"
            value={totalNumberOfCopies}
            onChange={(e) => setTotalNumberOfCopies(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Cover Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCoverImage(e.target.files ? e.target.files[0] : null)
            }
            className="border p-2"
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Book"}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
