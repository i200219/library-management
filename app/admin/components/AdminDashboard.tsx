"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Session {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminDashboard({ session }: { session: Session }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-dark-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bebas-neue text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-light-100">
              {session.user.name}
            </div>
            <button
              onClick={() => window.location.href = '/api/auth/signout'}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-3">
          <div className="backdrop-blur-md bg-dark-300/80 rounded-2xl p-6">
            <h3 className="mb-2 text-xl font-semibold text-light-100">Total Users</h3>
            <div className="font-bebas-neue text-3xl text-primary">123</div>
          </div>
          <div className="backdrop-blur-md bg-dark-300/80 rounded-2xl p-6">
            <h3 className="mb-2 text-xl font-semibold text-light-100">Active Books</h3>
            <div className="font-bebas-neue text-3xl text-primary">456</div>
          </div>
          <div className="backdrop-blur-md bg-dark-300/80 rounded-2xl p-6">
            <h3 className="mb-2 text-xl font-semibold text-light-100">Borrowed Books</h3>
            <div className="font-bebas-neue text-3xl text-primary">78</div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/users"
            className={`
              ${pathname === '/admin/users' ? 'ring-2 ring-primary' : ''}
              backdrop-blur-md bg-dark-300/80 rounded-2xl p-6 transition-all
              hover:bg-dark-300/90 hover:shadow-lg
              flex flex-col items-center gap-4 cursor-pointer
            `}
          >
            <div className="text-4xl text-primary">👤</div>
            <h3 className="text-xl font-semibold text-light-100">Manage Users</h3>
            <p className="text-center text-light-200">
              View and manage all library users and their permissions
            </p>
          </Link>
          <Link
            href="/admin/books"
            className={`
              ${pathname === '/admin/books' ? 'ring-2 ring-primary' : ''}
              backdrop-blur-md bg-dark-300/80 rounded-2xl p-6 transition-all
              hover:bg-dark-300/90 hover:shadow-lg
              flex flex-col items-center gap-4 cursor-pointer
            `}
          >
            <div className="text-4xl text-primary">📚</div>
            <h3 className="text-xl font-semibold text-light-100">Manage Books</h3>
            <p className="text-center text-light-200">
              Add, edit, and manage the library's book collection
            </p>
          </Link>
          <Link
            href="/admin/reports"
            className={`
              ${pathname === '/admin/reports' ? 'ring-2 ring-primary' : ''}
              backdrop-blur-md bg-dark-300/80 rounded-2xl p-6 transition-all
              hover:bg-dark-300/90 hover:shadow-lg
              flex flex-col items-center gap-4 cursor-pointer
            `}
          >
            <div className="text-4xl text-primary">📊</div>
            <h3 className="text-xl font-semibold text-light-100">View Reports</h3>
            <p className="text-center text-light-200">
              Generate and view library usage statistics and reports
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
