//schema.ts
import {
  date,
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  unique,
  varchar,
  bigint,
  tinyint,
} from "drizzle-orm/mysql-core";

export const book = mysqlTable("books", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  title: varchar("title", { length: 77 }).notNull(),
  author: varchar("author", { length: 150 }).notNull(),
  publisher: varchar("publisher", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 31 }).default(null),
  isbnNo: varchar("isbnNo", { length: 13 }).unique().default(null),
  numofPages: int("numofPages").notNull(),
  totalNumberOfCopies: int("totalNumberOfCopies").notNull(),
  availableNumberOfCopies: int("availableNumberOfCopies").default(null),
});

export const user = mysqlTable("users", {
  UId: int("UId").primaryKey().autoincrement(),
  name: varchar("name", { length: 150 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(), // Use a hashed password
  phoneNum: varchar("phoneNum", { length: 13 }).default(null),
  DOB: varchar("DOB", { length: 20 }).notNull(),
});
export const transaction = mysqlTable("transactions", {
  transactionId: int("transactionId").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  bookId: int("bookId").notNull(),
  issueddate: timestamp("issueddate").defaultNow().notNull(),
  returnDate: varchar("returnDate", { length: 100 }).notNull(),
  isReturned: tinyint("isReturned").default(0).notNull(),
  fine: int("fine").default(0).notNull(),
});

export const refreshTokenTable = mysqlTable("refreshTokens", {
  id: int("id").primaryKey().autoincrement(),
  userId: varchar("userId", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const booksRequestsTable = mysqlTable("books_requests", {
  id: bigint("id", { mode: "bigint", unsigned: true })
    .primaryKey()
    .autoincrement(),
  uId: varchar("uId", { length: 255 }).notNull(),
  reqDate: timestamp("reqDate").defaultNow().notNull(),
  returnDate: varchar("returnDate", { length: 50 }).default(null), // Nullable
  bookId: bigint("bookId", { mode: "bigint", unsigned: true }).notNull(),
  issuedDate: date("issuedDate").default(null), // Nullable
});
