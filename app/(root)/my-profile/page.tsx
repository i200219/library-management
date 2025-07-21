import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";

const Page = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        
        <Button>Logout</Button>
      </form>

      <BookList
        title="Borrowed Books"
        books={sampleBooks.map(book => ({
          id: book.id,
          title: book.title,
          author: book.author,
          genre: book.genre,
          rating: book.rating,
          totalCopies: book.total_copies,
          availableCopies: book.available_copies,
          description: book.description,
          coverColor: book.color,
          coverUrl: book.cover,
          video: book.video,
          summary: book.summary,
        }))}
      />
    </>
  );
};
export default Page;
