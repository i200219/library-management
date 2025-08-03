"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Session {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

interface AdminStats {
  totalBooks: number;
  availableBooks: number;
  totalUsers: number;
  activeBorrows: number;
}

export default function AdminDashboard({ session }: { session: Session }) {
  
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-dark-100 p-3 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-red-500 text-sm sm:text-base">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-100 p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bebas-neue text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-light-100 text-sm sm:text-base truncate max-w-32 sm:max-w-none">
              {session.user.name}
            </div>
            <button
              onClick={() => window.location.href = '/api/auth/signout'}
              className="rounded-lg bg-red-600 px-3 sm:px-4 py-2 text-white transition-colors hover:bg-red-700 text-sm sm:text-base"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {stats ? (
            <>
              <div className="bg-dark-200 rounded-lg p-3 sm:p-6">
                <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2 text-white">Total Books</h3>
                <p className="text-xl sm:text-3xl font-bold text-blue-500">{stats.totalBooks}</p>
              </div>
              <div className="bg-dark-200 rounded-lg p-3 sm:p-6">
                <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2 text-white">Available Books</h3>
                <p className="text-xl sm:text-3xl font-bold text-green-500">{stats.availableBooks}</p>
              </div>
              <div className="bg-dark-200 rounded-lg p-3 sm:p-6">
                <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2 text-white">Total Users</h3>
                <p className="text-xl sm:text-3xl font-bold text-purple-500">{stats.totalUsers}</p>
              </div>
              <div className="bg-dark-200 rounded-lg p-3 sm:p-6">
                <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2 text-white">Active Borrowings</h3>
                <p className="text-xl sm:text-3xl font-bold text-yellow-500">{stats.activeBorrows}</p>
              </div>
            </>
          ) : (
            <div className="col-span-2 lg:col-span-4 text-center py-6 sm:py-8">
              <div className="animate-pulse">
                <div className="bg-dark-200 rounded-lg p-4 sm:p-6">
                  <div className="h-6 sm:h-8 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 sm:h-12 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link
            href="/admin/books"
            className="bg-dark-200 rounded-lg p-4 sm:p-6 hover:bg-dark-300 transition-colors"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">Manage Books</h3>
            <p className="text-gray-400 text-sm sm:text-base">View and manage the library collection</p>
          </Link>
          <Link
            href="/admin/users"
            className="bg-dark-200 rounded-lg p-4 sm:p-6 hover:bg-dark-300 transition-colors"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">Manage Users</h3>
            <p className="text-gray-400 text-sm sm:text-base">Manage library users and accounts</p>
          </Link>
          <Link
            href="/admin/book-requests"
            className="bg-dark-200 rounded-lg p-4 sm:p-6 hover:bg-dark-300 transition-colors"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-white">Book Requests</h3>
            <p className="text-gray-400 text-sm sm:text-base">View and handle book borrowing requests</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
