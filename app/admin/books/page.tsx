"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookList from "@/components/BookList";
import { useRouter } from "next/navigation";

const ManageBooksPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/books");
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        } else {
          setBooks([]);
        }
      } catch (error) {
        setBooks([]);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleBookClick = async (book: any) => {
    // Fetch borrow status for the book
    const res = await fetch(`/api/books/${book.id}/borrow-status`);
    const borrowInfo = res.ok ? await res.json() : null;

    // Show details in a modal (simple implementation)
    alert(
      `Title: ${book.title}\n` +
        `Author: ${book.author}\n` +
        `Borrowed: ${borrowInfo?.isBorrowed ? "Yes" : "No"}\n` +
        (borrowInfo?.isBorrowed ? `Due Date: ${borrowInfo.dueDate}` : "")
    );
  };

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading books...</div>
        ) : (
          <BookList
            books={books}
            containerClassName=""
            onBookClick={handleBookClick}
          />
        )}
      </div>
    </section>
  );
};

export default ManageBooksPage;
