// /app/members/page.tsx
import { fetchPaginatedMembers } from "./actions";
import { MembersTable } from "@/components/MembersTable";

export default async function MembersPage({
  searchParams,
}: {
  searchParams?: { page?: string; limit?: string };
}) {
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = parseInt(searchParams?.limit || "10", 10);

  const { items: users, pagination } = await fetchPaginatedMembers(page, limit);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Members List</h1>
      <MembersTable users={users} pagination={pagination} />
    </div>
  );
}
