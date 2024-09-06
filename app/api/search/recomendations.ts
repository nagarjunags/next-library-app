import type { NextApiRequest, NextApiResponse } from "next";
import { BookRepository } from "@/db/books.repository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;
  const repo = new BookRepository();

  try {
    const recommendations = await repo.search(query as string);
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}
