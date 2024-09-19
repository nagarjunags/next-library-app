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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-primary">Members List</h1>
      <MembersTable users={users} pagination={pagination} />
    </div>
  );
}
