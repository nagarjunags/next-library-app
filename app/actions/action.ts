import { revalidatePath } from "next/cache";
import { getDb } from "@/drizzle/migrate";
import { book } from "@/drizzle/library.schema";
import { IBook } from "@/db/models/books.model";

// Add Book Action
export async function addBookAction(formData: FormData) {
  try {
    // Extracting form data
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const publisher = formData.get("publisher") as string;
    const genre = formData.get("genre") as string;
    const isbnNo = formData.get("isbnNo") as string;
    const numofPages = parseInt(formData.get("numofPages") as string);
    const totalNumberOfCopies = parseInt(
      formData.get("totalNumberOfCopies") as string
    );

    // Handle image upload
    const imageFile = formData.get("coverImage") as File;
    const coverImageBase64 = await handleImageUpload(imageFile);

    // Insert book into database
    const db = await getDb();
    const newBook = {
      title,
      author,
      publisher,
      genre: genre || null,
      isbnNo: isbnNo || null,
      numofPages,
      totalNumberOfCopies,
      availableNumberOfCopies: totalNumberOfCopies,
      coverImage: coverImageBase64,
    };

    await db.insert(book).values(newBook);

    // Optionally, revalidate the path if necessary
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error adding book:", error);
    return { success: false, error: "Failed to add book" };
  }
}

// Handle Image Upload
async function handleImageUpload(file: File): Promise<string> {
  if (!file) {
    return "";
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "YOUR_UPLOAD_PRESET");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const result = await response.json();

  return result.secure_url;
}
