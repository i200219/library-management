"use client";

import React from "react";
import Image from "next/image";
import BookCover from "@/components/BookCover";
import BorrowBook from "@/components/BorrowBook";
import ReturnBook from "@/components/ReturnBook";
import ReserveBook from "@/components/ReserveBook";
import BookAvailabilityStatus from "@/components/BookAvailabilityStatus";
import { useBookAvailability } from "@/hooks/useBookAvailability";
import { useUserBorrowStatus } from "@/hooks/useUserBorrowStatus";
import { getBorrowingEligibilityMessage } from "@/lib/utils/bookAvailability";

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
  userStatus?: string;
}

const BookOverviewClient = ({
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
  userStatus,
}: Props) => {
  const { availabilityStatus, loading, error, refetch } = useBookAvailability(id);
  const { borrowStatus, loading: borrowLoading, error: borrowError, refetch: refetchBorrowStatus } = useUserBorrowStatus(id, userId);

  const borrowingEligibility = getBorrowingEligibilityMessage(availabilityStatus, userStatus);

  const handleBorrowSuccess = async () => {
    await refetch();
    await refetchBorrowStatus();
  };

  const handleReturnSuccess = async () => {
    await refetch();
    await refetchBorrowStatus();
  };

  return (
    <section className="book-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="book-info">
          <p>
            By <span className="font-semibold text-light-200">{author}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        <div className="book-copies">
          <p>
            Total Books <span>{totalCopies}</span>
          </p>

          <p>
            Available Books <span>{availableCopies}</span>
          </p>
        </div>

        <p className="book-description">{description}</p>

        {/* Enhanced Availability Status */}
        <div className="mt-6">
          {loading && (
            <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-gray-600">Checking availability...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <Image src="/icons/clock.svg" alt="error" width={16} height={16} />
              <span className="text-sm text-red-600">
                Error loading availability: {error}
              </span>
              <button
                onClick={refetch}
                className="ml-auto text-xs text-red-600 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {availabilityStatus && !loading && !error && (
            <BookAvailabilityStatus
              isAvailable={availabilityStatus.isAvailable}
              reason={availabilityStatus.reason}
              details={availabilityStatus.details}
              className="mb-4"
            />
          )}
        </div>

        {userId && userStatus && (
          <div className="flex flex-col gap-4">
            {/* Show borrow status loading */}
            {borrowLoading && (
              <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-gray-600">Checking borrow status...</span>
              </div>
            )}

            {/* Show borrow error */}
            {borrowError && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm text-red-600">
                  Error checking borrow status: {borrowError}
                </span>
                <button
                  onClick={refetchBorrowStatus}
                  className="ml-auto text-xs text-red-600 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Show appropriate button based on borrow status */}
            {borrowStatus && !borrowLoading && !borrowError && (
              <>
                {borrowStatus.isBorrowedByUser ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">
                        You have borrowed this book
                      </p>
                      {borrowStatus.borrowRecord && (
                        <p className="text-xs text-blue-600 mt-1">
                          Due: {new Date(borrowStatus.borrowRecord.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <ReturnBook
                      bookId={id}
                      userId={userId}
                      bookTitle={title}
                      onReturnSuccess={handleReturnSuccess}
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <BorrowBook
                      bookId={id}
                      userId={userId}
                      borrowingEligibility={borrowingEligibility}
                      onBorrowSuccess={handleBorrowSuccess}
                    />
                    
                    {/* Show reserve button if book is not available */}
                    {availabilityStatus && !availabilityStatus.isAvailable && (
                      <ReserveBook
                        bookId={id}
                        bookTitle={title}
                        isAvailable={availabilityStatus.isAvailable}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <BookCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <BookCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookOverviewClient;