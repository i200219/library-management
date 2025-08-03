"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createReservation } from "@/lib/actions/reservation";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ReserveBookProps {
  bookId: string;
  bookTitle: string;
  isAvailable: boolean;
  className?: string;
}

const ReserveBook = ({ bookId, bookTitle, isAvailable, className }: ReserveBookProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleReservation = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to reserve books",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    if (isAvailable) {
      toast({
        title: "Book Available",
        description: "This book is currently available for borrowing. Please borrow it directly instead of making a reservation.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createReservation({
        userId: session.user.id,
        bookId,
      });

      if (result.success) {
        toast({
          title: "Reservation Successful",
          description: result.message,
        });
        
        // Refresh the page to update the UI
        router.refresh();
      } else {
        toast({
          title: "Reservation Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the reservation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show reserve button if book is available
  if (isAvailable) {
    return null;
  }

  return (
    <Button
      onClick={handleReservation}
      disabled={isLoading}
      className={`w-full bg-orange-500 hover:bg-orange-600 text-white ${className}`}
    >
      {isLoading ? "Reserving..." : "Reserve Book"}
    </Button>
  );
};

export default ReserveBook;