// actions.ts
"use server";
import { TransactionRepository } from "@/db/transactions.repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function borrowBookAction(bookId:number, title: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User is not authenticated");
  }

  // const requestRepo = new Requestsrepository(); // Removing the requests repository to the Transactions
  const transactionRepo = new TransactionRepository();

  try {
    const requestData = {
      userId: session.user.id as number,
      bookId: bookId,
    };

    // Create a new book request in the database
    const result = await transactionRepo.createRequest(requestData);
    return { success: true };
  } catch (error) {
    console.error("Failed to create book request", error);
    return { success: false, error: error.message };
  }
}
