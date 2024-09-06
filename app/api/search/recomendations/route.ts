import { NextResponse } from "next/server";
import { BookRepository } from "@/db/books.repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchTerm = searchParams.get("search") || "";

  const repo = new BookRepository();
  const books = await repo.search(searchTerm);
  // console.log(books);

  return NextResponse.json({ books });
}
