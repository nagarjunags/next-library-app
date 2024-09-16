// app/profile/actions.ts
"use server";
import { UserRepository } from "@/db/users.repository";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

// Fetch user details by ID from session
export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userRepo = new UserRepository();
  const userProfile = await userRepo.getById(session.user.id);
  return userProfile;
}

// Update user details by ID
export async function updateUserProfile(updatedData: any) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userRepo = new UserRepository();
  await userRepo.update(session.user.id, updatedData);
  const updatedProfile = await userRepo.getById(session.user.id);
  return updatedProfile;
}
