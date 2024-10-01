// @/app/requests/actions.ts
"use server";
import { Requestsrepository } from "@/db/requests.repository";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { BookRepository } from "@/db/books.repository";
import { TransactionRepository } from "@/db/transactions.repository";

// transactionId,
// parseInt(newStatus),
// bookId,
// userId

export async function updateRequestStatus(
  transactionId: number,
  newStatus: number,
  bookId: number,
  userId: number
) {
  const session = await getServerSession(authOptions);
  console.log(transactionId,
    newStatus,
    bookId,
    userId);
  console.log("Session from request action", session);

  if (session?.user?.role !== "admin") {
    throw new Error("User is not authenticated");
  }
  
  const bookRepo = new BookRepository();
  const transactionRepo = new TransactionRepository();

  const book = await bookRepo.getById(bookId);

  const today = new Date();
  const dueDate = new Date(today.setDate(today.getDate() + 15))
    .toISOString()
    .split("T")[0]; // Adds 15 days and converts to YYYY-MM-DD format
    console.log(dueDate);

    //Handle Rejection:
    if(newStatus === 0)
    {
      let transactionData = await transactionRepo.getById(transactionId);
      transactionData = {
        ...transactionData,
        reqStatus:0,
      }
    transactionRepo.update(transactionId,transactionData);
      return { success: true };
    }

 
    try{
      let transactionData = await transactionRepo.getById(transactionId);
      transactionData = {
        ...transactionData,
        issueddate:today,
        dueDate:dueDate,
        reqStatus:1,
      }

      transactionRepo.handleBorrow(transactionData);
      return { success: true };
    }
    catch(error){
      return { success: false };
    }
    

  // const data = {
  //   userId: session.user.id,
  //   bookId: book.id,
  //   returnDate, // returnDate will be a string in 'YYYY-MM-DD' format
  // };

  // try {
  //   const transaction = transactionRepo.create(data);
  //   console.log("eee", transaction);
  //   // Use the repository to update the status
  //   const result = await requestRepo.updateStatus(requestId, newStatus);

  //   if (result.success) {
  //     return { success: true };
  //   } else {
  //     return { success: false, error: "Failed to update the status" };
  //   }
  // } catch (error) {
  //   console.error("Error updating request status:", error);
  //   return { success: false, error: "An unexpected error occurred" };
  // }
}
