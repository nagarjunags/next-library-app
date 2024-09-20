"use server";

import { UserRepository } from "@/db/users.repository";

export async function fetchPaginatedMembers(page: number, limit: number) {
  const userRepo = new UserRepository();
  const offset = (page - 1) * limit;
  return await userRepo.list({ limit, offset });
}

export async function makeUserAsAdmin(user: any)
{
  const userRepo = new UserRepository();
  const updatedData = {
    ...user,
    role:"admin",
  }
  console.log("action:",updatedData);
  userRepo.update(user.UId,updatedData);
}

export async function deleteUser(user: any)
{
  const userRepo = new UserRepository();
  await userRepo.delete(user.UId);

}
