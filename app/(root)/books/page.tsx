import BookOverview from "@/components/BookOverview";
import BookGrid from "@/components/BookGrid";
import { auth } from "@/auth";
import { headers } from "next/headers";
import SearchableBookGrid from "@/components/SearchableBookGrid";

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
        <main className="flex flex-col items-center p-4 sm:p-8 lg:p-24 min-h-[calc(100vh-160px)]">
          <div className="text-center py-12 sm:py-20 px-4">
            <p className="text-lg sm:text-xl text-light-100">No books available in the library</p>
          </div>
        </main>
      );
    }
    return (
      <main className="flex flex-col items-center p-4 sm:p-8 lg:p-24 min-h-[calc(100vh-160px)]">
        <BookOverview
          {...latestBooks[0]}
          userId={userId}
        />

         <SearchableBookGrid
          books={latestBooks.slice(1)}
          userId={userId}
          user={session?.user}
        />
      </main>
    );
  } catch (error) {
    console.error("Error loading books:", error);
    return (
      <main className="flex flex-col items-center p-4 sm:p-8 lg:p-24 min-h-[calc(100vh-160px)]">
        <div className="text-center py-12 sm:py-20 px-4">
          <p className="text-lg sm:text-xl text-light-100">Error loading books. Please try again later.</p>
        </div>
      </main>
    );
  }
};

