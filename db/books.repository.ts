import { MySqlQueryGenerator } from "./libs/mysql-query-generator";
import { WhereExpression } from "./libs/types";
import { IBook } from "./models/books.model";
import mysql from "mysql2/promise";
import { MySqlPoolConnection } from "./db-connection";
import { RowDataPacket } from "mysql2";
import { getDb } from "./drizzle/migrate";
import { book } from "./drizzle/library.schema";
import { like, or, eq } from "drizzle-orm";

export class BookRepository {
  private mySqlPoolConnection: MySqlPoolConnection;
  pool: mysql.Pool | null;

  constructor() {
    this.pool = mysql.createPool(
      "mysql://root:root_password@localhost:3306/library_db"
    ); // TODO: remove the password before pushing
    this.mySqlPoolConnection = new MySqlPoolConnection(this.pool); //
  }

  async search(key: string) {
    const db = getDb();

    const whereExpression: WhereExpression<IBook> = {
      OR: [
        { title: { op: "CONTAINS", value: `${key}` } },
        { author: { op: "CONTAINS", value: `${key}` } },
        { publisher: { op: "CONTAINS", value: `${key}` } },
        { genre: { op: "CONTAINS", value: `${key}` } },
        { isbnNo: { op: "CONTAINS", value: `${key}` } },
        { id: { op: "CONTAINS", value: `${key}` } },
      ],
    };
    const searchClause = MySqlQueryGenerator.generateSelectSql(
      "books",
      [],
      whereExpression,
      0,
      10
    );
    // console.log(searchClause);
    if (key === "") {
      let result: [] = await this.mySqlPoolConnection.query(
        "SELECT * FROM `books`",
        []
      );
      return result;
    }
    let result: RowDataPacket[] = await this.mySqlPoolConnection.query(
      searchClause.query,
      searchClause.values
    );
    return result;
  }

  async list(params: {
    limit: number; // Optional
    offset: number; // Optional
    search?: string; // Optional
  }): Promise<any> {
    const { limit = 10, offset = 0, search } = params;
    const db = await getDb();

    try {
      // Build the query using Drizzle ORM
      let query = db.select().from(book) as any;

      if (search) {
        query = query.where(
          or(
            like(book.title, `%${search}%`),
            like(book.author, `%${search}%`),
            like(book.publisher, `%${search}%`),
            like(book.genre, `%${search}%`),
            like(book.isbnNo, `%${search}%`),
            like(book.id, `%${search}%`)
          )
        ) as any; // Using 'or' to match either title or ...any other column
      }

      query = query.limit(limit).offset(offset);

      // Execute the query and get the results
      const books = await query.execute();

      // Log the actual SQL query if needed
      // console.log(query.toSQL());

      return {
        items: books as IBook[],
        pagination: {
          offset: offset || 0,
          limit: limit || books.length,
          total: books.length,
          hasNext: limit !== undefined && books.length === limit,
          hasPrevious: (offset || 0) > 0,
        },
      };
    } catch (err) {
      console.error("Error listing books:", err);
      throw err;
    }
  }

  async getById(id: number) {
    const db = await getDb();
    const result = await db
      .select()
      .from(book)
      .where(eq(book.id, BigInt(id)))
      .limit(1)
      .execute();

    // Drizzle returns results as an array
    return result[0] as unknown as IBook;
  }
  async getByIsbn(isbn: string) {
    const db = await getDb();
    const result = await db
      .select()
      .from(book)
      .where(eq(book.isbnNo, isbn))
      .limit(1)
      .execute();

    // Drizzle returns results as an array
    return result[0] as unknown as IBook;
  }
  async delete(id: number): Promise<IBook | null> {
    // Fetch the record before deletion to return it later
    const db = await getDb();
    const recordToDelete = await db
      .select()
      .from(book)
      .where(eq(book.id, BigInt(id)))
      .limit(1)
      .execute();

    if (recordToDelete.length === 0) {
      return null;
    }

    await db
      .delete(book)
      .where(eq(book.id, BigInt(id)))
      .execute();

    // Return the previously fetched record
    return recordToDelete[0] as unknown as IBook;
  }
}
