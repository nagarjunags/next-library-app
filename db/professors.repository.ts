//@/db/professors.repository.ts
import { getDb } from "./drizzle/migrate";
import { professor } from "./drizzle/library.schema";
import { eq, sql, like, or } from "drizzle-orm";
import { bigint } from "drizzle-orm/mysql-core";


export class ProfessorsRepository {
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

      async getById(id: number) {
        const db = await getDb();
        const result = await db
          .select()
          .from(professor)
          .where(eq(professor.id, BigInt(id)))
          .limit(1);
        return result[0] ?? null;
      }
      async create(data) {
        const db = await getDb();
        const insertId = (await db.insert(professor).values(data).$returningId())[0].id;
        const insertedUser = this.getById(Number(insertId));
        return insertedUser ?? null;
      }


      async update(id: number, link:string) {
        // console.log(link);

        const prof = await this.getById(id)
        const updata = {
          ...prof,
          calendlyEventLink:link,
        }
        console.log(updata);
        const db = await getDb();
        const res = await db.update(professor).set(updata).where(eq(professor.id, BigInt(id)));
        const result = await db
          .select()
          .from(professor)
          .where(eq((professor.id), BigInt(id)))
          .limit(1);

        // console.log(res)  
        return result[0] ?? null;
      }
}