import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

interface books {
  id: string;
  title: string;
  author: string;
  genre: string;
  rating: number;
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverColor: string;
  coverUrl: string;
  videoUrl: string;
  summary: string;
  createdAt: Date | null;
  isLoanedBook?: boolean;
  userId?: string;
}

interface AuthCredentials {
  fullName: string;
  email: string;
  password: string;
  universityId: number;
}

interface BookParams {
  title: string;
  author: string;
  genre: string;
  rating: number;
  coverUrl: string;
  coverColor: string;
  description: string;
  totalCopies: number;
  videoUrl: string;
  summary: string;
}

interface BorrowBookParams {
  bookId: string;
  userId: string;
}

interface BookRequest {
  id: string;
  userId: string;
  userName: string;
  bookId: string;
  bookTitle: string;
  bookCoverUrl?: string;
  borrowDate: string | Date;
  dueDate: string | Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
}

export interface CreateBookResponse {
  success: boolean;
  data?: books;
  message: string;
}

interface ReservationParams {
  bookId: string;
  userId: string;
}

interface Reservation {
  id: string;
  userId: string;
  bookId: string;
  reservationDate: string | Date;
  expiryDate: string | Date;
  status: 'ACTIVE' | 'FULFILLED' | 'CANCELLED' | 'EXPIRED';
  priorityPosition: number;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  // Joined fields
  userName?: string;
  bookTitle?: string;
  bookAuthor?: string;
}

interface ReservationResponse {
  success: boolean;
  data?: Reservation;
  message: string;
  queuePosition?: number;
}

interface DeleteBookResponse {
  success: boolean;
  message: string;
}