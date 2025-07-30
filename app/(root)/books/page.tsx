import BookOverview from "@/components/BookOverview";
import BookGrid from "@/components/BookGrid";
import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id ?? "";

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/books`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch books: ${response.statusText}`);
    }

    const latestBooks = await response.json();

    if (!latestBooks || latestBooks.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-xl text-light-100">No books available in the library</p>
        </div>
      );
    }
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <BookOverview
          {...latestBooks[0]}
          userId={userId}
        />

         <BookGrid
          books={latestBooks.slice(1)}
          userId={userId}
          user={session?.user}
        />
      </main>
    );
  } catch (error) {
    console.error("Error loading books:", error);
    return (
      <div className="text-center py-20">
        <p className="text-xl text-light-100">Error loading books. Please try again later.</p>
      </div>
    );
  }
};

