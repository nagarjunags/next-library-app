// import { UserRepository } from "./users.repository";
// import { BookRepository } from "./books.repository"
// import { IBook } from "./models/books.model";
// import { getDb } from "./drizzle/migrate";

// export class TransactionRepository {
//   userRepo: UserRepository;
//   bookRepo: BookRepository;

//   constructor() {
// this.userRepo = new UserRepository();
// this.bookRepo = new BookRepository();
//   }

//   async create(data: any) {
//     const db =await  getDb();
//     // Check wether the user is present or not during the transaction
//     if ((await this.userRepo.getById(data.userId)) === null) {
//       return { status: "failed", error: "user not found" };
//     }

//     // Check the availability of the book
//     let book = await this.bookRepo.getById(data.bookId);// TODO: may need to chande id to ISBN
//     if (book === undefined || book === null) {
//       // console.log(errorTheme("No book with the ID:", data.bookId));
//       return { status :"failed", error:"No Book with the provided ID"};
//     }
//      else if (book.availableNumberOfCopies <= 0) {
//       // console.log(errorTheme("Currently the book is not available"));
//       return { status: "failed", error: "Currently the book is not available" };
//     }
//      const updatedBook: IBook = {
//           ...book,
//           availableNumberOfCopies : book.availableNumberOfCopies - 1,
//         };

// //-------------------------IMPLEMENT THIS IN UI----------
//   // const returnDate: Date = addDaysToDate(returnPeriod);

//   // function addDaysToDate(daysToAdd: number, baseDate: Date = new Date()): Date {
//   //   const resultDate = new Date(baseDate);
//   //   resultDate.setDate(resultDate.getDate() + daysToAdd);
//   //   return resultDate;
//   // }
// //-------------------------------------------------------

//     const transaction = {
//       userId:data.userId,
//       bookId:data.bookId,
//       returnDate: data.returnDate
//     }

//    const createdTrxnId = await db.transaction(async (trxn) => {})

//   }

// }
//@/db/transactions.repository.ts
import { BookRepository } from "./books.repository";
import { transaction } from "./drizzle/library.schema";
import { getDb } from "./drizzle/migrate";
import { MySqlQueryGenerator, SqlClause } from "./libs/mysql-query-generator";
import { WhereExpression } from "./libs/types";
import { IBook } from "./models/books.model";
import { ITransaction, ITransactionBase } from "./models/transaction.model";
import { MySqlTransactionPoolConnection } from "./db-connection";
import { UserRepository } from "./users.repository";
import { eq, sql, like, or, and } from "drizzle-orm";

import mysql from "mysql2/promise";

export class TransactionRepository {
  pool: mysql.Pool | null;

  userRepo: UserRepository;
  bookRepo: BookRepository;
  private mySqlTransactionPoolConnection: MySqlTransactionPoolConnection;

  constructor() {
    this.pool = mysql.createPool(
      "mysql://root:root_password@localhost:3306/library_db"
    );
    this.mySqlTransactionPoolConnection = new MySqlTransactionPoolConnection(
      this.pool
    );
    this.userRepo = new UserRepository();
    this.bookRepo = new BookRepository();
  }

  async create(data): Promise<ITransaction | null> {
    console.log("repodata:", data);
    if ((await this.userRepo.getById(data.userId)) === null) {
      //   console.log(errorTheme("No Users with the ID:", data.userId));
      return null;
    }
    // console.log(await this.userRepo.getById(data.userId));

    const book = await this.bookRepo.getById(data.bookId);
    // return null;

    if (book === undefined || book === null) {
      //   console.log(errorTheme("No book with the ID:", data.bookId));
      return null;
    } else if (book.availableNumberOfCopies <= 0) {
      //   console.log(errorTheme("Currently the book is not available"));
      return null;
    }
    const decrementBookClauseGen = async (id: number): Promise<SqlClause> => {
      const whereExpression: WhereExpression<IBook> = {
        id: { op: "EQUALS", value: id },
      };

      const bookId = data.bookId;
      const updateData: Partial<IBook> = {
        availableNumberOfCopies: book?.availableNumberOfCopies - 1,
      };
      const updateClause = await MySqlQueryGenerator.generateUpdateSql(
        "books",
        updateData,
        whereExpression
      );
      return updateClause;
    };
    const decrementClause = await decrementBookClauseGen(data.bookId);
    console.log(decrementClause); // TODO Run this query in transactions.
    const insertClause =
      await MySqlQueryGenerator.generateInsertSql<ITransactionBase>(
        "transactions",
        [data]
      );
    console.log(insertClause);
    try {
      await this.mySqlTransactionPoolConnection.query(
        decrementClause.query,
        decrementClause.values
      );
      await this.mySqlTransactionPoolConnection.query(
        insertClause.query,
        insertClause.values[0]
      );
      await this.mySqlTransactionPoolConnection.commit();
      console.log("SUCCESSFULL ");
    } catch (err) {
      console.log(err);
      console.log("fAIL ");

      await this.mySqlTransactionPoolConnection.rollback();
    } finally {
      await this.mySqlTransactionPoolConnection.release();
    }

    return null;
  }

  async list(
    userId: number,
    options: { limit: number; offset: number; orderBy?: string }
  ) {
    const db = await getDb();
    const query = db
      .select()
      .from(transaction)
      .limit(options.limit)
      .offset(options.offset);
    // .orderBy(options.orderBy || transaction.issueddate, "desc");

    // Filter by userId only if userId is not 0 (for admin purposes)
    if (userId !== 0) {
      query.where(eq(transaction.userId, userId));
    }

    const transactions = await query.execute();

    return {
      items: transactions,
      pagination: {
        hasPrevious: options.offset > 0,
        hasNext: transactions.length === options.limit,
      },
    };
  }

  /**
   * Mark a transaction as returned by setting `returned` to `true`.
   */
  async markReturned(transactionId: number) {
    const db = await getDb();
    // const result = await db
    //   .update(transaction)
    //   .set({
    //     isReturned: 1, // Mark as returned
    //     returnDate: new Date().toISOString(), // Set the current date as return date
    //   })
    //   .where(eq(transaction.transactionId, transactionId))
    //   .execute();

    return { success: true };
  }
}
