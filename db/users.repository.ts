// @/db/users.repository
import { getDb } from "./drizzle/migrate";
import { user } from "./drizzle/library.schema";
import { eq, sql, like, or } from "drizzle-orm";

export class UserRepository {
  async list(params: {
    limit: number; // Optional limit on number of users
    offset: number; // Optional offset for pagination
    search?: string; // Optional search term for filtering
  }): Promise<any> {
    const { limit = 10, offset = 0, search } = params;
    const db = await getDb();

    try {
      let query = db.select().from(user) as any;

      if (search) {
        query = query.where(
          or(
            like(user.name, `%${search}%`),
            like(user.email, `%${search}%`),
            like(user.phoneNum, `%${search}%`)
          )
        ) as any;
      }

      query = query.limit(limit).offset(offset);

      const users = await query.execute();

      return {
        items: users,
        pagination: {
          offset: offset || 0,
          limit: limit || users.length,
          total: users.length, // This might need a total count query if you want accurate pagination
          hasNext: users.length === limit,
          hasPrevious: offset > 0,
        },
      };
    } catch (err) {
      console.error("Error listing users:", err);
      throw err;
    }
  }
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
    const insertId = (await db.insert(user).values(data).$returningId())[0].UId;
    const insertedUser = this.getById(insertId);
    return insertedUser ?? null;
  }

  async update(id: number, updatedData: any) {
    const db = await getDb();
    await db.update(user).set(updatedData).where(eq(user.UId, id));
    const result = await db
      .select()
      .from(user)
      .where(eq(user.UId, id))
      .limit(1);
    return result[0] ?? null;
  }

  // New method to delete a user
  async delete(id: number) {
    const db = await getDb();
    // await db.delete().from(user).where(eq(user.UId, id));
    return { success: true };
  }

  // New method to make a user an admin
  async makeAdmin(id: number) {
    const db = await getDb();
    // await db.update(user).set({ role: "admin" }).where(eq(user.UId, id));
    return { success: true };
  }
}
