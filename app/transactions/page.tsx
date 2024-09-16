"use server";
import React from "react";
import { TransactionRepository } from "@/db/transactions.repository";
import TransactionsClient from "./TransactionsClient"; // Client component for transactions
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

const TransactionsList = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  const transactionRepo = new TransactionRepository();

  // Pagination and sorting non-returned books first
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 10;
  const offset = (page - 1) * limit;

  let id = session.user.id;
  // If the user is admin, fetch all transactions
  if (session.user.role === "admin") {
    id = 0; // Fetch all transactions
  }

  const { items: transactions, pagination } = await transactionRepo.list(id, {
    limit,
    offset,
    orderBy: "returned ASC", // Ensures non-returned books appear first
  });

  return (
    <TransactionsClient
      transactions={transactions}
      pagination={pagination}
      currentPage={page}
    />
  );
};

export default TransactionsList;
