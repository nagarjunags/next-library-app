import { getDb } from "./drizzle/migrate";
import { user } from "./drizzle/library.schema";
import { eq, sql, like } from "drizzle-orm";

export class UserRepository {
  /**
   * Get the user from the user ID
   *
   * @async
   * @param {number} id
   * @returns {unknown}
   */
  async getById(id: number) {
    const db = await getDb();
    const result = await db
      .select()
      .from(user)
      .where(eq(user.UId, id))
      .limit(1);
    return result[0] ?? null;
  }

  async getByEmail(email: string) {
    const db = await getDb();
    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return result[0] ?? null;
  }
  async create(data) {
    const db = await getDb();
    console.table(data);
    const insertId = (await db.insert(user).values(data).$returningId())[0].UId;
    // console.log(insertId);
    //TODO: add getbyId and return the created user
    const insertedUser = this.getById(insertId);
    return insertedUser ?? null;
  }
}
