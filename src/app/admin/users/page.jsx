// viewing, adding, editing, and deleting users

"use client";
import { useState } from "react";
import { Users, Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // To open the Create modal
  const [selectedUser, setSelectedUser] = useState(null); // To track selected user for editing or deletion
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To open the Edit modal

  // Dummy users data (Replace with actual API data)
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "9245384153",
      role: "Admin",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "7245861239",
      role: "Editor",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "8215347852",
      role: "User",
    },
  ];

  // Function to open edit modal with user data
  const handleEditUser = (user) => {
    setSelectedUser(user); // Set the selected user for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  // Function to handle user deletion
  const handleDeleteUser = (userId) => {
    // Here you can add the logic for deleting the user (API call or state update)
    const confirmDelete = window.confirm(`Do you want to delete this user with id ${userId}?`);
    if (confirmDelete) {
      alert(`User with ID ${userId} deleted`);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    alert(`User Updated: ${JSON.stringify(updatedUser, null, 2)}`);
    // Perform state update or API call
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Users Management</h2>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Users className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">1,250</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-fit">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">Role</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-3">{user.name}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.phone}</td>
                <td className="border p-3">{user.role}</td>
                <td className="border p-3 text-center flex justify-center gap-3">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-500 hover:text-blue-600 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {isModalOpen && <CreateUserModal onClose={() => setIsModalOpen(false)} />}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedUser) => handleUpdateUser(updatedUser)}
        />
      )}
    </div>
  );
}
