import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

// Create a function to initialize the database connection and perform migrations
async function initializeDb() {
  // Database URL
  const databaseUrl =
    "mysql://admin:root_password@library-db.c1ew80qc617b.eu-north-1.rds.amazonaws.com:3306/library-db2";

  // Connection for migrations
  const migrationClient = await mysql.createConnection({
    uri: databaseUrl,
    multipleStatements: true, // Required for running migrations
  });

  // Perform migrations
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "/path/to/your/migrations", // Adjust this path to your migrations folder
  });

  await migrationClient.end();

  // Connection pool for queries
  const pool = mysql.createPool({
    uri: databaseUrl,
  });

  // Create and return the `db` instance
  return drizzle(pool);
}

// Export the `db` instance and `UserTable` after initialization
let db: ReturnType<typeof drizzle> | undefined;

export async function getDb() {
  if (!db) {
    db = await initializeDb();
  }
  return db;
}
