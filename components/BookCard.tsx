import React from "react";
import Link from "next/link";
import BookCover from "@/components/BookCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Book {
  id: string;
  title: string;
  genre: string;
  coverColor: string;
  coverUrl: string;
}

interface BookCardProps extends Book {
  isLoanedBook?: boolean;
}

const BookCard = (props: BookCardProps) => (
  <li className={cn(props.isLoanedBook && "xs:w-52 w-full")}>
    <Link
      href={`/books/${props.id}`}
      className={cn(props.isLoanedBook && "w-full flex flex-col items-center")}
    >
      <BookCover coverColor={props.coverColor} coverImage={props.coverUrl} />

      <div className={cn("mt-2 sm:mt-4", !props.isLoanedBook && "xs:max-w-40 max-w-28")}>
        <p className="book-title">{props.title}</p>
        <p className="book-genre">{props.genre}</p>
      </div>

      {props.isLoanedBook && (
        <div className="mt-2 sm:mt-3 w-full">
          <div className="book-loaned">
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={16}
              height={16}
              className="sm:w-[18px] sm:h-[18px] object-contain"
            />
            <p className="text-light-100 text-xs sm:text-sm">11 days left to return</p>
          </div>

          <Button className="book-btn">Download receipt</Button>
        </div>
      )}
    </Link>
  </li>
);

export default BookCard;
