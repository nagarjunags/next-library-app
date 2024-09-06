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
      // Build the query using Drizzle ORM
      let query = db
        .select()
        .from(booksRequestsTable)
        .where(eq(booksRequestsTable.uId, user.toString())) as any;

      if (search) {
        query = query.where(
          or(
            like(booksRequestsTable.isbnNo, `%${search}%`),
            like(booksRequestsTable.uId, `%${search}%`)
            // Add more fields here if needed
          )
        ) as any; // Using 'or' to match either uId or isbnNo
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
}
