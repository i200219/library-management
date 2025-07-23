"use client";

import React, { useEffect, useState } from "react";

const BorrowRequestsPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/borrow-requests");
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        setRequests([]);
      }
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "APPROVED" | "DECLINED") => {
    await fetch(`/api/borrow-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: action }),
    });
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: action } : req
      )
    );
  };

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Borrow Requests</h1>
      <p className="text-md text-gray-700 mb-8">
        Here you can view, approve, or decline borrow requests from users.
      </p>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No borrow requests found.</div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-2 px-4 border-b text-left">User</th>
                <th className="py-2 px-4 border-b text-left">Book</th>
                <th className="py-2 px-4 border-b text-left">Request Date</th>
                <th className="py-2 px-4 border-b text-left">Due Date</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-blue-100">
                  <td className="py-2 px-4 border-b">{req.userName}</td>
                  <td className="py-2 px-4 border-b">{req.bookTitle}</td>
                  <td className="py-2 px-4 border-b">{req.requestDate}</td>
                  <td className="py-2 px-4 border-b">{req.dueDate ?? "-"}</td>
                  <td className="py-2 px-4 border-b">{req.status}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                      disabled={req.status === "APPROVED"}
                      onClick={() => handleAction(req.id, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      disabled={req.status === "DECLINED"}
                      onClick={() => handleAction(req.id, "DECLINED")}
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default BorrowRequestsPage;
