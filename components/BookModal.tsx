import React, { useState } from "react";
import { addBookAction } from "@/app/actions/action";

const BookModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);

    const result = await addBookAction(formData);

    if (result.success) {
      alert("Book added successfully!");
      onClose(); // Close modal on success
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Book</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="author"
            placeholder="Author"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="publisher"
            placeholder="Publisher"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="genre"
            placeholder="Genre"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="isbnNo"
            placeholder="ISBN Number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="numofPages"
            type="number"
            placeholder="Number of Pages"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="totalNumberOfCopies"
            type="number"
            placeholder="Total Number of Copies"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            name="coverImage"
            type="file"
            accept="image/*"
            className="w-full mb-4"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white py-2 px-4 rounded ml-4"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookModal;
