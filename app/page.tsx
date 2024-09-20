// app/page.tsx (client-side)
"use client";

import React, { useEffect, useState } from "react";
import HomeClient from "@/components/HomeClient"; // Client Component
import { fetchBooks } from "./homeAction"; // Import the server-side action

const Home = ({ searchParams }) => {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState({});
  const page = parseInt(searchParams.page || "1", 10);

  useEffect(() => {
    const fetchData = async () => {
      // Call the server-side action to fetch the books
      const { books, pagination } = await fetchBooks({
        search: searchParams.search || "",
        page: searchParams.page || "1",
      });
      // console.log("hheerree");
      // console.log(books);
      setBooks(books);
      setPagination(pagination);
    };
    fetchData();
  }, [searchParams]);

  return <HomeClient books={books} pagination={pagination} page={page} />;
};

export default Home;
