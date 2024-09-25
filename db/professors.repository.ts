//@/db/professors.repository.ts
import { getDb } from "./drizzle/migrate";
import { professor } from "./drizzle/library.schema";
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
          let query = db.select().from(professor) as any;
    
          if (search) {
            query = query.where(
              or(
                like(professor.name, `%${search}%`),
                like(professor.department, `%${search}%`),
              )
            ) as any;
          }
    
          query = query.limit(limit).offset(offset);
    
          const professors = await query.execute();
    
          return {
            items: professors,
            pagination: {
              offset: offset || 0,
              limit: limit || professors.length,
              total: professors.length, // This might need a total count query if you want accurate pagination
              hasNext: professors.length === limit,
              hasPrevious: offset > 0,
            },
          };
        } catch (err) {
          console.error("Error listing users:", err);
          throw err;
        }
      }
}