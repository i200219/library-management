"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import ReturnBook from "@/components/ReturnBook";
import { useRouter } from "next/navigation";

interface BorrowedBook {
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
  dueDate: string;
  borrowDate: string;
}

interface Props {
  book: BorrowedBook;
  userId: string;
}

const BorrowedBookCard = ({ book, userId }: Props) => {
  const router = useRouter();
  
  const handleReturnSuccess = () => {
    // Refresh the page to update the borrowed books list
    router.refresh();
  };

  const isOverdue = new Date(book.dueDate) < new Date();

  return (
    <div className="book-card group relative">
      <Link href={`/books/${book.id}`} className="block">
        <BookCover
          variant="regular"
          className="transition-transform duration-300 group-hover:scale-105"
          coverColor={book.coverColor}
          coverImage={book.coverUrl}
        />
      </Link>

      <div className="mt-4 space-y-2">
        <Link href={`/books/${book.id}`}>
          <h3 className="book-title group-hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        
        <p className="book-genre">by {book.author}</p>
        
        <div className="flex items-center gap-1">
          <Image src="/icons/star.svg" alt="rating" width={16} height={16} />
          <span className="text-sm text-light-100">{book.rating}</span>
        </div>

        {/* Due Date Info */}
        <div className={`text-xs p-2 rounded-lg ${
          isOverdue 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          <p className="font-medium">
            {isOverdue ? '⚠️ Overdue' : '📅 Due Date'}
          </p>
          <p>{new Date(book.dueDate).toLocaleDateString()}</p>
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <ReturnBook
            userId={userId}
            bookId={book.id}
            bookTitle={book.title}
            onReturnSuccess={handleReturnSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default BorrowedBookCard;