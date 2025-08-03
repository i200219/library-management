import React from "react";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import BookOverviewClient from "@/components/BookOverviewClient";

interface Book {
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
}

interface Props extends Book {
  userId: string;
}

const BookOverview = async ({
  title,
  author,
  genre,
  rating,
  totalCopies,
  availableCopies,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
  videoUrl,
  summary,
  createdAt,
}: Props) => {
  // Get user status for eligibility checking
  const [user] = await db
    .select({
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (
    <BookOverviewClient
      id={id}
      title={title}
      author={author}
      genre={genre}
      rating={rating}
      totalCopies={totalCopies}
      availableCopies={availableCopies}
      description={description}
      coverColor={coverColor}
      coverUrl={coverUrl}
      videoUrl={videoUrl}
      summary={summary}
      createdAt={createdAt}
      userId={userId}
      userStatus={user?.status || undefined}
    />
  );
};

export default BookOverview;
