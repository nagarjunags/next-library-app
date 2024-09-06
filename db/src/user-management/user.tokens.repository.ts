// user.repository.ts
import { and, eq } from "drizzle-orm";
import { getDb } from "../drizzle/migrate";
import { refreshTokenTable } from "../drizzle/schema";

export default class TokenRepository {
  // Existing methods...

  async addRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    try {
      const db = await getDb();
      await db
        .insert(refreshTokenTable)
        .values({ userId: userId, token: refreshToken });

      return true;
    } catch (error) {
      console.error("Error adding refresh token:", error);
      return false;
    }
  }

  // async removeRefreshToken(
  //   userId: number,
  //   refreshToken: string
  // ): Promise<boolean> {
  //   try {
  //     const db = await getDb();
  //     const deleted = await db
  //       .delete(refreshTokenTable)
  //       .where(
  //         and(
  //           eq(refreshTokenTable.userId, userId),
  //           eq(refreshTokenTable.token, refreshToken)
  //         )
  //       );
  //     return true;
  //   } catch (error) {
  //     console.error("Error removing refresh token:", error);
  //     return false;
  //   }
  // }

  async findRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<boolean> {
    try {
      const db = await getDb();
      const [rows] = await db
        .select()
        .from(refreshTokenTable)
        .where(
          and(
            eq(refreshTokenTable.userId, userId)
            // eq(refreshTokenTable.token, refreshToken)
          )
        );

      // return rows.token === refreshToken;
      return rows.userId === userId;
    } catch (error) {
      console.error("Error finding refresh token:", error);
      return false;
    }
  }
}
