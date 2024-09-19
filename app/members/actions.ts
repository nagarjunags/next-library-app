"use server";

import { UserRepository } from "@/db/users.repository";

export async function fetchPaginatedMembers(page: number, limit: number) {
  const userRepo = new UserRepository();
  const offset = (page - 1) * limit;
  return await userRepo.list({ limit, offset });
}
