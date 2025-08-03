"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ReservationItem {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: string | Date;
  expiryDate: string | Date;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  priorityPosition: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  userName: string;
  bookTitle: string;
  bookAuthor: string;
}

interface ReservationsManagerProps {
  className?: string;
}

const ReservationsManager = ({ className }: ReservationsManagerProps) => {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations");
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch reservations",
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
  }, []);

  const handleReservationAction = async (reservationId: string, action: string) => {
    setActioningId(reservationId);

    try {
      const response = await fetch("/api/reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId,
          action,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        
        // Refresh the reservations list
        await fetchReservations();
      } else {
        toast({
          title: "Action Failed",
          description: result.error || "Failed to update reservation",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the reservation",
        variant: "destructive",
      });
    } finally {
      setActioningId(null);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  const activeReservations = reservations.filter(r => r.status === 'ACTIVE');
  const inactiveReservations = reservations.filter(r => r.status !== 'ACTIVE');

  return (
    <div className={cn("w-full", className)}>
      <div className="bg-white rounded-2xl p-7">
        <h2 className="text-xl font-semibold mb-6">Reservation Management</h2>
        
        {reservations.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Image
              src="/icons/book.svg"
              alt="No reservations"
              width={48}
              height={48}
              className="mx-auto mb-4 opacity-50"
            />
            <p>No reservations found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Active Reservations */}
            {activeReservations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-green-700">
                  Active Reservations ({activeReservations.length})
                </h3>
                <div className="space-y-3">
                  {activeReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {reservation.bookTitle}
                            </h4>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                getStatusColor(reservation.status)
                              )}
                            >
                              {reservation.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              Queue #{reservation.priorityPosition}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Reserved by: <span className="font-medium">{reservation.userName}</span></p>
                            <p>Author: {reservation.bookAuthor}</p>
                            <p>Reserved: {formatDate(reservation.reservationDate)}</p>
                            <p className={cn(
                              "font-medium",
                              isExpired(reservation.expiryDate) ? "text-red-600" : "text-gray-600"
                            )}>
                              Expires: {formatDate(reservation.expiryDate)}
                              {isExpired(reservation.expiryDate) && " (EXPIRED)"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReservationAction(reservation.id, "fulfill")}
                            disabled={actioningId === reservation.id}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            {actioningId === reservation.id ? "Processing..." : "Fulfill"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReservationAction(reservation.id, "expire")}
                            disabled={actioningId === reservation.id}
                            className="text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            {actioningId === reservation.id ? "Processing..." : "Expire"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Inactive Reservations */}
            {inactiveReservations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-700">
                  Reservation History ({inactiveReservations.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {inactiveReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-medium text-gray-700">
                              {reservation.bookTitle}
                            </h4>
                            <span
                              className={cn(
                                "px-2 py-1 rounded-full text-xs font-medium",
                                getStatusColor(reservation.status)
                              )}
                            >
                              {reservation.status}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Reserved by: <span className="font-medium">{reservation.userName}</span></p>
                            <p>Author: {reservation.bookAuthor}</p>
                            <p>Reserved: {formatDate(reservation.reservationDate)}</p>
                            <p>Last Updated: {formatDate(reservation.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsManager;