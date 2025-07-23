"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BookCover from "@/components/BookCover";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  videoUrl: string;
  summary: string;
  createdAt: string;
}

interface Props {
  books: Book[];
  userId: string;
  user: any;
}

const dummyBook: Book = {
  id: "1",
  title: "The Pragmatic Programmer",
  author: "Andrew Hunt, David Thomas",
  genre: "Programming",
  rating: 4.8,
  coverUrl: "https://images.unsplash.com/photo-1549078642-b2ba4bda0cdb",
  coverColor: "#2C3E50",
  description:
    "A guide to software development that emphasizes practical solutions and real-world examples.",
  totalCopies: 10,
  availableCopies: 5,
  videoUrl: "",
  summary:
    "A guide to software development that emphasizes practical solutions and real-world examples.",
  createdAt: "2025-07-23",
};

const BookGrid: React.FC<Props> = ({ books }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const router = useRouter();

  const booksToShow = books.length > 0 ? books : [dummyBook];

  if (!booksToShow || booksToShow.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-light-100">No books available in the library</p>
      </div>
    );
  }

  const handleBookClick = (book: Book) => {
    router.push(`/books/${book.id}`);
  };

  const handleClose = () => {
    setSelectedBook(null);
  };

  return (
    <>
      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {booksToShow.map((book) => (
          <div
            key={book.id}
            className="bg-blue-950 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => handleBookClick(book)}
          >
            <div className="flex flex-col gap-6">
              <div className="relative h-48 w-full">
                <BookCover
                  coverImage={book.coverUrl}
                  coverColor={book.coverColor}
                  className="h-full w-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-light-100 mb-2">{book.title}</h3>
                <p className="text-light-300 mb-2">{book.author}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500">{book.rating}</span>
                  <span className="text-light-300">•</span>
                  <span className="text-light-300">{book.genre}</span>
                </div>
                <p className="text-light-300 mb-4 line-clamp-3">{book.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleClose}
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-shrink-0 w-full md:w-1/3">
                <BookCover
                  coverImage={selectedBook.coverUrl}
                  coverColor={selectedBook.coverColor}
                  className="h-64 w-full"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedBook.title}</h2>
                <p className="text-lg text-gray-700 mb-2">{selectedBook.author}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-500">{selectedBook.rating}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-400">{selectedBook.genre}</span>
                </div>
                <p className="mb-4">{selectedBook.description}</p>
                <p className="mb-4 text-sm text-gray-500">{selectedBook.summary}</p>
                <div className="mb-4">
                  <span className="text-gray-600">Available: {selectedBook.availableCopies}</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">Total: {selectedBook.totalCopies}</span>
                </div>
                {selectedBook.videoUrl && (
                  <div className="mt-4">
                    <video
                      src={selectedBook.videoUrl}
                      controls
                      className="w-full h-64 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookGrid;
