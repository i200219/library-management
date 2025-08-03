"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface BorrowedByInfo {
  userName: string;
  dueDate: string;
  isOverdue: boolean;
}

interface BookAvailabilityStatusProps {
  isAvailable: boolean;
  reason: string;
  details: {
    totalCopies: number;
    availableCopies: number;
    borrowedCopies: number;
    borrowedBy?: BorrowedByInfo[];
  };
  className?: string;
}

const BookAvailabilityStatus = ({
  isAvailable,
  reason,
  details,
  className,
}: BookAvailabilityStatusProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={cn("book-availability-status", className)}>
      {/* Main Status */}
      <div className={cn(
        "flex items-center gap-3 p-4 rounded-lg border",
        isAvailable 
          ? "bg-green-50 border-green-200 text-green-800" 
          : "bg-red-50 border-red-200 text-red-800"
      )}>
        <div className="flex-shrink-0">
          <Image
            src={isAvailable ? "/icons/book.svg" : "/icons/clock.svg"}
            alt={isAvailable ? "available" : "unavailable"}
            width={20}
            height={20}
            className={cn(
              "object-contain",
              isAvailable ? "text-green-600" : "text-red-600"
            )}
          />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">
            {isAvailable ? "Available" : "Not Available"}
          </p>
          <p className="text-sm opacity-90">{reason}</p>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="mt-4 space-y-3">
        {/* Copy Information */}
        <div className="flex justify-between items-center text-sm text-light-100">
          <span>Total Copies:</span>
          <span className="font-medium">{details.totalCopies}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-light-100">
          <span>Available:</span>
          <span className={cn(
            "font-medium",
            details.availableCopies > 0 ? "text-green-600" : "text-red-600"
          )}>
            {details.availableCopies}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm text-light-100">
          <span>Currently Borrowed:</span>
          <span className="font-medium">{details.borrowedCopies}</span>
        </div>

        {/* Borrowed By Information */}
        {details.borrowedBy && details.borrowedBy.length > 0 && (
          <div className="mt-4 pt-4 border-t border-light-500">
            <h4 className="text-sm font-medium text-light-200 mb-3">
              Currently Borrowed By:
            </h4>
            <div className="space-y-2">
              {details.borrowedBy.map((borrower, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-md text-sm",
                    borrower.isOverdue
                      ? "bg-red-50 border border-red-200"
                      : "bg-gray-50 border border-gray-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/user.svg"
                      alt="user"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                    <span className="font-medium text-dark-200">
                      {borrower.userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/icons/calendar.svg"
                      alt="calendar"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                    <span className={cn(
                      "text-xs",
                      borrower.isOverdue ? "text-red-600 font-medium" : "text-gray-600"
                    )}>
                      Due: {formatDate(borrower.dueDate)}
                      {borrower.isOverdue && " (Overdue)"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAvailabilityStatus;