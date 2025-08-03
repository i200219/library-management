import type { BookAvailabilityStatus } from "@/app/api/books/[id]/availability/route";

export interface BookAvailabilityHookResult {
  availabilityStatus: BookAvailabilityStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const fetchBookAvailability = async (bookId: string): Promise<BookAvailabilityStatus> => {
  const response = await fetch(`/api/books/${bookId}/availability`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch availability: ${response.statusText}`);
  }
  
  return response.json();
};

export const getBorrowingEligibilityMessage = (
  availabilityStatus: BookAvailabilityStatus | null,
  userStatus: string | undefined
): { isEligible: boolean; message: string } => {
  if (!availabilityStatus) {
    return {
      isEligible: false,
      message: "Unable to check book availability",
    };
  }

  if (userStatus !== "APPROVED") {
    return {
      isEligible: false,
      message: "You are not eligible to borrow books. Please contact the administrator.",
    };
  }

  if (!availabilityStatus.isAvailable) {
    return {
      isEligible: false,
      message: availabilityStatus.reason,
    };
  }

  return {
    isEligible: true,
    message: "You can borrow this book",
  };
};

export const formatAvailabilityReason = (availabilityStatus: BookAvailabilityStatus): string => {
  if (availabilityStatus.isAvailable) {
    return availabilityStatus.reason;
  }

  const { details } = availabilityStatus;
  
  if (details.totalCopies === 1 && details.borrowedBy && details.borrowedBy.length > 0) {
    const borrower = details.borrowedBy[0];
    const dueDate = new Date(borrower.dueDate).toLocaleDateString();
    
    if (borrower.isOverdue) {
      return `This book is currently borrowed by ${borrower.userName} and is overdue (was due: ${dueDate})`;
    } else {
      return `This book is currently borrowed by ${borrower.userName} (due: ${dueDate})`;
    }
  }

  if (details.borrowedCopies >= details.totalCopies) {
    const overdueCount = details.borrowedBy?.filter(b => b.isOverdue).length || 0;
    
    if (overdueCount > 0) {
      return `All ${details.totalCopies} copies are borrowed. ${overdueCount} ${overdueCount === 1 ? 'copy is' : 'copies are'} overdue.`;
    } else {
      return `All ${details.totalCopies} copies are currently borrowed`;
    }
  }

  return availabilityStatus.reason;
};