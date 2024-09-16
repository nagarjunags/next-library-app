// actions.ts
"use server";
import { Requestsrepository } from "@/db/requests.repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { BookRepository } from "@/db/books.repository";

export async function deleteBookAction(bookId: number) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    throw new Error("User is not authenticated");
  }

  const requestRepo = new Requestsrepository();
  const bookRepo = new BookRepository();

  try {
    const result = await bookRepo.delete(bookId);

    return { success: true };
  } catch (error) {
    console.error("Failed to create book request", error);
    return { success: false, error: error.message };
  }
}
