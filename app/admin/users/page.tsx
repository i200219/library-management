"use client";

import React, { useEffect, useState } from "react";

const ManageUsersPage = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [borrowLoading, setBorrowLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUserList(data);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role: newRole }),
    });
    setUserList((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    setUserList((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleUserClick = async (user: any) => {
    setSelectedUser(user);
    setBorrowLoading(true);
    const res = await fetch(`/api/users/${user.id}/borrowed`);
    const data = await res.json();
    setBorrowedBooks(data);
    setBorrowLoading(false);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setBorrowedBooks([]);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-900">Manage Users</h1>
      <p className="text-md text-gray-700 mb-8">
        Here you can view, add, edit, and remove users from the system.
      </p>
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-12">Loading users...</div>
        ) : userList.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <span>No users to display yet.</span>
          </div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-50">
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Role</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.role}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border rounded px-2 py-1 bg-gray-50"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(user.id, e.target.value)}
                      className="border rounded px-2 py-1 bg-gray-50"
                    >
                      <option value="APPROVED">Approved</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              Borrowed Books for {selectedUser.name}
            </h2>
            {borrowLoading ? (
              <div className="text-center text-gray-400 py-8">
                Loading borrowed books...
              </div>
            ) : borrowedBooks.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No borrowed books.
              </div>
            ) : (
              <table className="w-full border">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-4 border-b text-left">Book Title</th>
                    <th className="py-2 px-4 border-b text-left">Borrow Date</th>
                    <th className="py-2 px-4 border-b text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowedBooks.map((borrow) => (
                    <tr key={borrow.id}>
                      <td className="py-2 px-4 border-b">{borrow.bookTitle}</td>
                      <td className="py-2 px-4 border-b">{borrow.borrowDate}</td>
                      <td className="py-2 px-4 border-b">{borrow.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsersPage;
