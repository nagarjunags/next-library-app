// /app/members/actions.ts
import { UserRepository } from "@/db/users.repository";

export async function fetchPaginatedMembers(page: number, limit: number) {
  "use server";
  const userRepo = new UserRepository();
  const offset = (page - 1) * limit;
  return await userRepo.list({ limit, offset });
}
