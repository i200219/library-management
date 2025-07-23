"use client";

import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-900">Admin Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">
        Welcome to the admin dashboard. Here you can manage users, books, and view reports.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-6 px-4 rounded-lg shadow transition-all flex flex-col items-center"
          onClick={() => router.push("/admin/users")}
        >
          <span className="text-xl mb-2">👤</span>
          Manage Users
        </button>
        <button
          className="bg-green-700 hover:bg-green-800 text-white font-semibold py-6 px-4 rounded-lg shadow transition-all flex flex-col items-center"
          onClick={() => router.push("/admin/books")}
        >
          <span className="text-xl mb-2">📚</span>
          Manage Books
        </button>
        <button
          className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-6 px-4 rounded-lg shadow transition-all flex flex-col items-center"
          onClick={() => router.push("/admin/reports")}
        >
          <span className="text-xl mb-2">📊</span>
          View Reports
        </button>
      </div>
    </div>
  );
};

export default Page;
