// actions.ts
"use server";
import { Requestsrepository } from "@/db/requests.repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function borrowBookAction(isbnNo: string) {
  console.log("9686");
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("User is not authenticated");
  }

  const requestRepo = new Requestsrepository();

  try {
    const requestData = {
      uId: session.user.id,
      isbnNo: isbnNo,
    };

    // Create a new book request in the database
    const result = await requestRepo.create(requestData);
    console.log("Actions:", result);
    return { success: true };
  } catch (error) {
    console.error("Failed to create book request", error);
    return { success: false, error: error.message };
  }
}
