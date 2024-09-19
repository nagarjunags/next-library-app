"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [recommendations, setRecommendations] = useState([]);
  const router = useRouter();

  // Debounced function to fetch search recommendations
  const fetchRecommendations = async (searchTerm: string) => {
    if (searchTerm) {
      const response = await fetch(
        `/api/search/recomendations?search=${encodeURIComponent(
          searchTerm
        )}&category=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      setRecommendations(data.books);
    } else {
      setRecommendations([]);
    }
  };

  const debouncedFetch = useDebouncedCallback(fetchRecommendations, 300);

  useEffect(() => {
    if (query) {
      debouncedFetch(query);
    }
  }, [query, debouncedFetch]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(
      `/?search=${encodeURIComponent(query)}&category=${encodeURIComponent(
        category
      )}`
    );
  };

  const handleRecommendationClick = (recommendation) => {
    setQuery(recommendation.title);
    router.push(`/?search=${encodeURIComponent(recommendation.title)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mt-3 mx-auto max-w-2xl w-full flex flex-col md:flex-row items-center"
    >
      <div className="w-full md:w-3/5 md:pr-2 mb-4 md:mb-0 relative">
        <input
          type="text"
          id="location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => debouncedFetch(query)}
          onBlur={() => setRecommendations([])} // Hide recommendations on blur
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Search books..."
          autoComplete="off"
        />
        {/* Display recommendations */}
        {recommendations.length > 0 && (
          <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg mt-2 max-h-40 overflow-y-auto z-10">
            {recommendations.map((rec) => (
              <li
                key={rec.id}
                onClick={() => handleRecommendationClick(rec)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {rec.title} by {rec.author} - {rec.genre}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full md:w-2/5 md:pl-2">
        <select
          id="property-type"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Narrative">Narrative</option>
          <option value="Fiction">Fiction</option>
          <option value="Sci-fi">Sci-fi</option>
          <option value="Mystery">Mystery</option>
          <option value="Historical Fiction">Historical Fiction</option>
          <option value="Non Fiction">Non Fiction</option>
          <option value="Horror">Horror</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        className="md:ml-4 mt-4 md:mt-0 w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
      >
        Search
      </button>
    </form>
  );
};

export default Search;
