"use client";

import { useState, useEffect, useCallback } from "react";
import type { BookAvailabilityStatus } from "@/app/api/books/[id]/availability/route";
import { fetchBookAvailability } from "@/lib/utils/bookAvailability";

export interface UseBookAvailabilityResult {
  availabilityStatus: BookAvailabilityStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBookAvailability = (bookId: string): UseBookAvailabilityResult => {
  const [availabilityStatus, setAvailabilityStatus] = useState<BookAvailabilityStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      setError(null);
      const status = await fetchBookAvailability(bookId);
      setAvailabilityStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch availability");
      setAvailabilityStatus(null);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const refetch = useCallback(async () => {
    await fetchAvailability();
  }, [fetchAvailability]);

  return {
    availabilityStatus,
    loading,
    error,
    refetch,
  };
};