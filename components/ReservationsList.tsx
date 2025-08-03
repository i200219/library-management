"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cancelReservation, getUserReservations } from "@/lib/actions/reservation";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import BookCover from "@/components/BookCover";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ReservationItem {
  id: string;
  bookId: string;
  reservationDate: string | Date;
  expiryDate: string | Date;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  priorityPosition: number;
  bookTitle: string;
  bookAuthor: string;
  bookCoverUrl: string;
  bookCoverColor: string;
}

interface ReservationsListProps {
  className?: string;
}

const ReservationsList = ({ className }: ReservationsListProps) => {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchReservations = async () => {
    if (!session?.user?.id) return;

    try {
      const result = await getUserReservations(session.user.id);
      if (result.success) {
        setReservations(result.data || []);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch reservations",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching reservations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [session?.user?.id]);

  const handleCancelReservation = async (reservationId: string) => {
    if (!session?.user?.id) return;

    setCancellingId(reservationId);

    try {
      const result = await cancelReservation(reservationId, session.user.id);
      
      if (result.success) {
        toast({
          title: "Reservation Cancelled",
          description: result.message,
        });
        
        // Refresh the reservations list
        await fetchReservations();
      } else {
        toast({
          title: "Cancellation Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while cancelling the reservation",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'FULFILLED':
        return 'text-blue-600 bg-blue-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      case 'EXPIRED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isExpiringSoon = (expiryDate: string | Date) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays <= 2 && diffInDays > 0;
  };

  const isExpired = (expiryDate: string | Date) => {
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center py-8 text-gray-400">Loading reservations...</div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="text-center py-8 text-gray-400">
          <Image
            src="/icons/book.svg"
            alt="No reservations"
            width={48}
            height={48}
            className="mx-auto mb-4 opacity-50"
          />
          <p>No reservations found</p>
          <p className="text-sm mt-2">Reserve books when they're not available to get notified when they become available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <h2 className="text-xl font-semibold mb-4">My Reservations</h2>
      
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <BookCover
                  coverColor={reservation.bookCoverColor}
                  coverImage={reservation.bookCoverUrl}
                  className="w-16 h-20"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {reservation.bookTitle}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      by {reservation.bookAuthor}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>Queue Position: #{reservation.priorityPosition}</span>
                      <span>Reserved: {formatDate(reservation.reservationDate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          getStatusColor(reservation.status)
                        )}
                      >
                        {reservation.status}
                      </span>
                      
                      {reservation.status === 'ACTIVE' && (
                        <span className="text-xs text-gray-500">
                          Expires: {formatDate(reservation.expiryDate)}
                          {isExpiringSoon(reservation.expiryDate) && (
                            <span className="text-orange-600 font-medium ml-1">(Soon)</span>
                          )}
                          {isExpired(reservation.expiryDate) && (
                            <span className="text-red-600 font-medium ml-1">(Expired)</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {reservation.status === 'ACTIVE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={cancellingId === reservation.id}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {cancellingId === reservation.id ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationsList;