"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { returnBook } from "@/lib/actions/book";

interface Props {
  userId: string;
  bookId: string;
  bookTitle: string;
  onReturnSuccess?: () => Promise<void> | void;
}

const ReturnBook = ({
  userId,
  bookId,
  bookTitle,
  onReturnSuccess,
}: Props) => {
  const router = useRouter();
  const [returning, setReturning] = useState(false);

  const handleReturnBook = async () => {
    setReturning(true);

    try {
      const result = await returnBook({ bookId, userId });

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Book returned successfully",
        });

        // Call the callback to refresh availability status
        if (onReturnSuccess) {
          await onReturnSuccess();
        }

        router.push("/my-profile");
      } else {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while returning the book",
        variant: "destructive",
      });
    } finally {
      setReturning(false);
    }
  };

  return (
    <Button
      className="bg-green-600 hover:bg-green-700 text-white min-h-12 sm:min-h-14 w-fit max-md:w-full"
      onClick={handleReturnBook}
      disabled={returning}
    >
      <Image src="/icons/book.svg" alt="return" width={20} height={20} />
      <p className="font-bebas-neue text-xl">
        {returning ? "Returning..." : "Return Book"}
      </p>
    </Button>
  );
};

export default ReturnBook;