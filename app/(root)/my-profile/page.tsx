// app/profile/page.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BorrowedBookCard from "@/components/BorrowedBookCard";
import ReservationsList from "@/components/ReservationsList";
import { db } from "@/database/drizzle";
import { borrowRecords, books } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";

// Type definition for borrowed books with additional borrow-related fields
type BorrowedBook = {
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
  createdAt: Date | null;
  dueDate: string;
  borrowDate: Date;
};

const Page = async () => {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  // Fetch borrowed books for the current user
  const borrowedBooks = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
      description: books.description,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      videoUrl: books.videoUrl,
      summary: books.summary,
      createdAt: books.createdAt,
      dueDate: borrowRecords.dueDate,
      borrowDate: borrowRecords.borrowDate,
    })
    .from(books)
    .innerJoin(
      borrowRecords,
      and(
        eq(books.id, borrowRecords.bookId),
        eq(borrowRecords.userId, session.user.id),
        eq(borrowRecords.status, "BORROWED")
      )
    );

  return <ProfileContent session={session} borrowedBooks={borrowedBooks} />;
};

const ProfileContent = ({
  session,
  borrowedBooks,
}: {
  session: any;
  borrowedBooks: BorrowedBook[];
}) => {
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-dark-100 p-6 md:p-12">
      {/* Header Section */}
      <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-dark-100">
                  {session?.user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bebas-neue text-white">My Profile</h1>
              <p className="text-light-100 mt-2">{session?.user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin" className="flex items-center gap-2">
                <Button
                  variant="default"
                  className="bg-primary text-dark-100 hover:bg-primary/90 transition-all duration-300 flex items-center gap-2 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">🔒</span>
                  <span className="text-xl font-semibold">Admin Panel</span>
                </Button>
              </Link>
            )}
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
              className="inline-flex"
            >
              <Button
                variant="ghost"
                className="text-light-100 hover:text-white flex items-center gap-2 px-4 py-3 rounded-lg"
              >
                <span className="text-xl">🚪</span>
                <span className="text-lg">Logout</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Borrowed Books Section */}
      <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-2xl font-bebas-neue text-white mb-6">
          Borrowed Books ({borrowedBooks.length})
        </h2>
        {borrowedBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-light-100 text-lg mb-4">No books currently borrowed</p>
            <Link href="/books">
              <Button className="bg-primary text-dark-100 hover:bg-primary/90">
                Browse Books
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {borrowedBooks.map((book) => (
              <BorrowedBookCard
                key={book.id}
                book={{
                  ...book,
                  id: book.id.toString(),
                  dueDate: book.dueDate?.toString() || "",
                  borrowDate: book.borrowDate?.toString() || "",
                  createdAt: book.createdAt?.toString() || "",
                }}
                userId={session.user.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reservations Section */}
      <div className="bg-dark-300/80 backdrop-blur-md rounded-2xl p-6 mt-8">
        <ReservationsList />
      </div>
    </div>
  );
};

export default Page;
