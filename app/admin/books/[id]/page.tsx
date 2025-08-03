import { notFound } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import BookOverview from "@/components/BookOverview";
import DeleteBook from "@/components/admin/DeleteBook";

interface BookParams {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    userId: string;
  }>;
}

// Client wrapper for DeleteBook
function DeleteBookWrapper({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  return <DeleteBook bookId={bookId} bookTitle={bookTitle} className="ml-auto" />;
}

export default async function BookPage({
  params,
  searchParams,
}: BookParams) {
  // Await params before accessing its properties
  const { id } = await params;
  // Await searchParams before accessing its properties
  const { userId } = await searchParams;
  // Fetch the book from the database
  const [book] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  // If book is not found, show 404 page
  if (!book) {
    notFound();
  }

  // Convert createdAt to string and handle null case
  const bookWithFormattedDate = {
    ...book,
    createdAt: book.createdAt ? book.createdAt.toISOString() : "",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Book Details</h1>
        <DeleteBookWrapper bookId={book.id} bookTitle={book.title} />
      </div>
      
      <BookOverview {...bookWithFormattedDate} userId={userId} />
    </div>
  );
}
