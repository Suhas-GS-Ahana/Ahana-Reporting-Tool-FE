// This React component, MapRolesPage, is a role management dashboard where admins can 
// view users and assign roles to them

"use client";
import { useState } from "react";
import { UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AssignRoleModal from "./AssignRoleModal";

export default function MapRolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); //Tracks whether the assign role modal is open
  const [selectedUser, setSelectedUser] = useState(null); //Stores the user selected for role assignment

  // Dummy users with assigned roles (Replace with actual API data)
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", roles: ["Admin", "Editor"] },
    { id: 2, name: "Jane Smith", email: "jane@example.com", roles: ["User"] },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", roles: ["Editor", "Reviewer"] },
  ]);

  // Function to open assign role modal
  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to Save Assigned Roles
  const handleSaveRoles = (userId, newRoles) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, roles: newRoles } : user
      )
    );
    alert(`User ID ${userId} has been assigned roles: ${newRoles.join(", ")}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Map Roles</h2>

      {/* Role Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Users with Roles</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <UserCog className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{users.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Assigned Roles</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-3">{user.name}</td>
                <td className="border p-3">{user.email}</td>
                <td className="border p-3">{user.roles.join(", ")}</td>
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleAssignRole(user)}
                    className="text-blue-500 hover:text-blue-600 transition"
                  >
                     Assign Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Role Modal */}
      {isModalOpen && (
        <AssignRoleModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRoles}
        />
      )}
    </div>
  );
}
