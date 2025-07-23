"use client";

import React from "react";

const ReportsPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-900">View Reports</h1>
      <p className="text-md text-gray-700 mb-8">
        Here you can view analytics and reports about users and books.
      </p>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-400 py-12">
          {/* Replace with charts/analytics */}
          <span>No reports available yet.</span>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
