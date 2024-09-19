"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { addBook } from "@/app/actions/add-book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";
import { z } from "zod";

// Zod schema for validation
const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publisher: z.string().min(1, "Publisher is required"),
  genre: z.string().min(1, "Genre is required"),
  isbnNo: z
    .string()
    .length(13, "ISBN Number must be exactly 13 digits")
    .regex(/^\d+$/, "ISBN must contain only numbers"),
  numofPages: z.number().min(1, "Number of pages must be at least 1"),
  totalNumberOfCopies: z
    .number()
    .min(1, "Total number of copies must be at least 1"),
  coverImage: z.string().url("Cover image is required"),
});

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
  const [coverImage, setCoverImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const router = useRouter();

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
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      try {
        const imageUrl = await uploadImageToCloudinary(file);
        setCoverImage(imageUrl);
        setImageUploaded(true);
      } catch (error) {
        setError("Failed to upload image. Please try again.");
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert numofPages and totalNumberOfCopies to numbers
      const bookData = {
        title,
        author,
        publisher,
        genre,
        isbnNo,
        numofPages: Number(numofPages),
        totalNumberOfCopies: Number(totalNumberOfCopies),
        coverImage,
      };

      // Zod validation
      bookSchema.parse(bookData);

      // If validation passes, call the addBook action
      await addBook(bookData);

      alert("Book added successfully!");
      router.refresh();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(errors);
      } else {
        console.error("Error adding book:", error);
        setError("An error occurred while adding the book.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Add New Book</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {validationErrors.title && (
            <div className="text-red-500">{validationErrors.title}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          {validationErrors.author && (
            <div className="text-red-500">{validationErrors.author}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="publisher">Publisher</Label>
          <Input
            id="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            required
          />
          {validationErrors.publisher && (
            <div className="text-red-500">{validationErrors.publisher}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
          {validationErrors.genre && (
            <div className="text-red-500">{validationErrors.genre}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="isbnNo">ISBN Number</Label>
          <Input
            id="isbnNo"
            value={isbnNo}
            onChange={(e) => setIsbnNo(e.target.value)}
            required
          />
          {validationErrors.isbnNo && (
            <div className="text-red-500">{validationErrors.isbnNo}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="numofPages">Number of Pages</Label>
          <Input
            id="numofPages"
            type="number"
            value={numofPages}
            onChange={(e) => setNumofPages(e.target.value)}
            required
          />
          {validationErrors.numofPages && (
            <div className="text-red-500">{validationErrors.numofPages}</div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="totalNumberOfCopies">Total Number of Copies</Label>
          <Input
            id="totalNumberOfCopies"
            type="number"
            value={totalNumberOfCopies}
            onChange={(e) => setTotalNumberOfCopies(e.target.value)}
            required
          />
          {validationErrors.totalNumberOfCopies && (
            <div className="text-red-500">
              {validationErrors.totalNumberOfCopies}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage || imageUploaded}
            />
            {uploadingImage && <Loader2 className="h-4 w-4 animate-spin" />}
            {imageUploaded && <Check className="h-4 w-4 text-green-500" />}
          </div>
          {validationErrors.coverImage && (
            <div className="text-red-500">{validationErrors.coverImage}</div>
          )}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <Button type="submit" disabled={loading || !imageUploaded}>
          {loading ? "Adding..." : "Add Book"}
        </Button>
      </form>
    </div>
  );
};

export default AddBook;
