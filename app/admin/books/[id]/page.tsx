import { notFound } from "next/navigation";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import BookOverview from "@/components/BookOverview";

interface BookParams {
  params: {
    id: string;
  };
  searchParams: {
    userId: string;
  };
}

export default async function BookPage({
  params: { id },
  searchParams: { userId },
}: BookParams) {
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
      <BookOverview {...bookWithFormattedDate} userId={userId} />
    </div>
  );
}
