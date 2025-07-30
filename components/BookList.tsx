"use client";

import React from "react";

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
  borrowDate?: string;
  dueDate?: string;
}

interface Props {
  books: Book[];
  containerClassName?: string;
  title?: string;
  onBookClick?: (book: Book) => void;
}

const BookList = ({ books, containerClassName, title, onBookClick }: Props) => {
  if (!books || books.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-xl text-light-100">No books available</p>
      </div>
    );
  }

  return (
    <section className={containerClassName}>
      {title && (
        <h2 className="text-2xl font-bebas-neue text-white mb-6">{title}</h2>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg bg-white shadow">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Borrowed On
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Days Left
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {books.map((book) => (
              <tr
                key={book.id}
                className={onBookClick ? "cursor-pointer hover:bg-gray-50" : ""}
                onClick={() => onBookClick?.(book)}
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="size-10 shrink-0">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-10 w-10 rounded"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{book.author}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">{book.genre}</div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {book.borrowDate ? new Date(book.borrowDate).toLocaleDateString() : 'Not borrowed'}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A'}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {book.dueDate ? Math.ceil(
                      (new Date(book.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    ) + ' days' : 'N/A'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BookList;
