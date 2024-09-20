"use server";
import { TransactionRepository } from "@/db/transactions.repository";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export async function markAsReturned(transactionId: number) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    throw new Error("User is not authorized to perform this action.");
  }

  const transactionRepo = new TransactionRepository();

  try {
    // Update the transaction to mark it as returned
    // console.log("--->",transactionId);
    const result = await transactionRepo.markReturned(transactionId);
    if (result.success) {
      return { success: true };
    } else {
      return { success: false, error: "Failed to mark as returned" };
    }
  } catch (error) {
    console.error("Error marking transaction as returned:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
