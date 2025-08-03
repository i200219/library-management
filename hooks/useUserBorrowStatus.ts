"use client";

import { useState, useEffect } from "react";

interface BorrowRecord {
  id: string;
  dueDate: string;
  borrowDate: string;
  status: string;
}

interface UserBorrowStatus {
  isBorrowedByUser: boolean;
  borrowRecord: BorrowRecord | null;
}

export const useUserBorrowStatus = (bookId: string, userId: string) => {
  const [borrowStatus, setBorrowStatus] = useState<UserBorrowStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBorrowStatus = async () => {
    if (!bookId || !userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/books/${bookId}/borrow-status?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch borrow status: ${response.statusText}`);
      }

      const data = await response.json();
      setBorrowStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setBorrowStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowStatus();
  }, [bookId, userId]);

  const refetch = () => {
    fetchBorrowStatus();
  };

  return {
    borrowStatus,
    loading,
    error,
    refetch,
  };
};