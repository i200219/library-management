import React from "react";
import BookCard from "@/components/BookCard";

interface Props {
  title: string;
  books: books[];
  containerClassName?: string;
}

const BookList = ({ title, books, containerClassName }: Props) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-light-100">No books available</p>
      </div>
    );
  }

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="book-list">
        {books.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </ul>
    </section>
  );
};

export default BookList;
