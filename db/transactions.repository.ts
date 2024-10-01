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
import { ITransaction, ITransactionBase,IRequest } from "./models/transaction.model";
import { MySqlTransactionPoolConnection } from "./db-connection";
import { UserRepository } from "./users.repository";
import { eq, sql, like, or, and } from "drizzle-orm";
import { book } from "./drizzle/library.schema";


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


  async createRequest(request:IRequest)
  {
    const db = await getDb();
    await db.insert(transaction).values(request);//.$returningId()[0].id;
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
    if (userId !== 0 ) {
      query.where(
        and(
          eq(transaction.userId, userId),
        )
      );
      

    const transactions = await query.execute();

    return {
      items: transactions,
      pagination: {
        hasPrevious: options.offset > 0,
        hasNext: transactions.length === options.limit,
        },
      };
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

  async getById(id: number) {
    const db = await getDb();
    // console.log(id);
    const result = await db
      .select()
      .from(transaction)
      .where(eq(transaction.transactionId,id))
      .limit(1)
      .execute();

    // Drizzle returns results as an array
    return result[0];
  }

  /**
   * Mark a transaction as returned by setting `returned` to `true`.
   */
  async markReturned(transactionId: number) {
    console.log(transactionId);
    const db = await getDb();
    const req = await this.getById(transactionId);
    const data = {
      ...req,
      isReturned:1,
      returnDate: new Date().toISOString()
    }
    console.log(data);
    try{

      const result = await db
      .update(transaction)
      .set(data)
      .where(eq(transaction.transactionId, transactionId))
      .execute();
  
      return { success: true };
    }
    catch(error)
    {
      return {success: false}
    }
  
  }
  
  async update(id:number,data:any)
  {
    const db = await getDb();
try{
  const result = await db
      .update(transaction)
      .set(data)
      .where(eq(transaction.transactionId, id))
      .execute();
  return { success: true };
    }
    catch(error)
    {
      return {success: false}
    }
    
  }


async handleBorrow(data: any) {
  const db = await getDb();
    // Step 1: Check the existence of the user
    const user = await this.userRepo.getById(data.userId);
    if (!user) {
        throw new Error("USER NOT FOUND");
    }

    // Step 2: Check the existence of the book
    let isbook = await this.bookRepo.getById(data.bookId);
    if (!isbook || !isbook.availableNumberOfCopies) {
        throw new Error("BOOK NOT AVAILABLE");
    }

    // Step 3: Handle the transaction with Drizzle ORM transaction handling
    await db.transaction(async (tx) => {
        // Decrement the number of available copies
        isbook = {
            ...isbook,
            availableNumberOfCopies: isbook.availableNumberOfCopies - 1,
        };
        if(isbook.availableNumberOfCopies<0)
        {
          throw new Error("Book Not available!");
        }

        // decremet the available number of copies of the  borrowed book 
        await tx.update(book).set(isbook).where(eq(book.id, BigInt(isbook.id)))
  
        data = {
          ...data,
          reqStatus:1,
        }
        // Update the transaction status
        let thisTransaction = await tx
        .update(transaction)
        .set(data)
        .where(eq(transaction.transactionId, data.transactionId))
        .execute();
        

      return { success: true };
       
    });
}

async handleReturn(transactionId:number){

  const db = await getDb();

  let thisTransaction = await this.getById(transactionId);

  let isbook = await this.bookRepo.getById(thisTransaction.bookId);
  
  //step 1: check the presence of boook in DB
  if(!isbook)
  {
    throw new Error("Book Entry not present in DB");
  }

  // step 2 : check the presence of the member in the DB

  const ismember = await this.userRepo.getById(thisTransaction.userId);
  if(!ismember)
  {
    throw new Error("Member details not present in the database");
  }

  // step 3 Perform the transaction:
  await db.transaction(async (tx)=>{

     // Increment the number of available copies
     isbook = {
      ...isbook,
      availableNumberOfCopies: isbook.availableNumberOfCopies + 1,
  };

     // increment the available number of copies of the  borrowed book 
     await tx.update(book).set(isbook).where(eq(book.id, BigInt(isbook.id)))

     thisTransaction = {
      ...thisTransaction,
      isReturned:1
    }
    // Update the transaction status
   await tx
    .update(transaction)
    .set(thisTransaction)
    .where(eq(transaction.transactionId, thisTransaction.transactionId))
    .execute();
    
  return { success: true };
   
  })

 return { success: true };
}

}
