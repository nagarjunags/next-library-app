// performQueries.ts
import { getDb, UserTable } from "./migrate";

async function performQueries() {
  const db = await getDb();

  try {
    await db.insert(UserTable).values({ name: "John Doe" }).execute();
    console.log("Queries executed successfully.");
  } catch (error) {
    console.error("Failed to execute queries:", error);
  }
}

performQueries();
