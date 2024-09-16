// @/db/requests.repository.ts
import { getDb } from "./drizzle/migrate";
import { booksRequestsTable } from "./drizzle/library.schema";
import { eq, sql, like, or, and } from "drizzle-orm";

export class Requestsrepository {
  /**
   * This function is called whenever a user(in the home page)
   * clicks on the borrow button
   *
   * this should create a request in the books_requests table
   *
   */
  async create(borrowRequest) {
    const db = await getDb();

    const insertId = (
      await db.insert(booksRequestsTable).values(borrowRequest).$returningId()
    )[0].id;
    const insertedRequest = this.getById(insertId);
    console.table(insertedRequest);
    return insertedRequest ?? null;
  }

  async getById(id: bigint) {
    const db = await getDb();
    const result = await db
      .select()
      .from(booksRequestsTable)
      .where(eq(booksRequestsTable.id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async list(
    user: number,
    params: {
      limit: number;
      offset: number;
      search?: string; // Optional search parameter
    }
  ): Promise<any> {
    const { limit = 10, offset = 0, search } = params;
    const db = await getDb();

    try {
      // Build the base query using Drizzle ORM
      let query = db.select().from(booksRequestsTable) as any;

      // Add condition to filter by user ID only if user !== 0
      if (user !== 0) {
        query = query.where(eq(booksRequestsTable.uId, user.toString())) as any;
      }

      // Apply search filter if search term is provided
      if (search) {
        query = query.where(
          or(
            like(booksRequestsTable.isbnNo, `%${search}%`),
            like(booksRequestsTable.uId, `%${search}%`)
          )
        ) as any;
      }

      query = query.limit(limit).offset(offset);

      // Execute the query and get the results
      const requests = await query.execute();

      return {
        items: requests as any[], // Replace with appropriate type if available
        pagination: {
          offset: offset || 0,
          limit: limit || requests.length,
          total: requests.length,
          hasNext: limit !== undefined && requests.length === limit,
          hasPrevious: (offset || 0) > 0,
        },
      };
    } catch (err) {
      console.error("Error listing book requests:", err);
      throw err;
    }
  }
  async updateStatus(requestId: number, newStatus: number) {
    const db = await getDb();
    console.log("REPO:", requestId, newStatus);

    try {
      // Update the status of the book request
      await db
        .update(booksRequestsTable)
        .set({ status: newStatus })
        .where(eq(booksRequestsTable.id, requestId));

      return { success: true };
    } catch (error) {
      console.error("Error updating book request status:", error);
      return { success: false, error: error.message };
    }
  }
}
