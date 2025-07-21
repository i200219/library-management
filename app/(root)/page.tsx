import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { auth } from "@/auth";
import { books as BookType } from "@/types";
import dummyBooks from '@/dummybooks.json';

const Home = async () => {
  const session = await auth();
  
  try {
    // Add createdAt field to dummy books
    const latestBooks = dummyBooks.slice(0, 10).map(book => ({
      ...book,
      createdAt: new Date().toISOString()
    }));

    if (!latestBooks || latestBooks.length === 0) {
      return (
        <div className="text-center py-20">
          <p className="text-xl text-light-100">No books available in the library</p>
        </div>
      );
    }

    return (
      <>
        <BookOverview 
          {...latestBooks[0]} 
          userId={session?.user?.id as string} 
        />

        <BookList
          title="Latest Books"
          books={latestBooks.slice(1)}
          containerClassName="mt-28"
        />
      </>
    );
  } catch (error) {
    console.error('Error loading books:', error);
    return (
      <div className="text-center py-20">
        <p className="text-xl text-light-100">Error loading books. Please try again later.</p>
      </div>
    );
  }
};

export default Home;
