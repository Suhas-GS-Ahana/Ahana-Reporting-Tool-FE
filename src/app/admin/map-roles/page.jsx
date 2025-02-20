"use client";

import { useState } from "react";
import { Users, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function MapRolesPage() {
  const [userRoles, setUserRoles] = useState([
    { id: 1, name: "Alice", role: "Editor" },
    { id: 2, name: "Bob", role: "Admin" },
    { id: 3, name: "Charlie", role: "User" },
  ]);

  const roles = ["Admin", "Editor", "User"];

  const handleRoleChange = (id, newRole) => {
    setUserRoles((prevUserRoles) =>
      prevUserRoles.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Map Roles to Users</h2>

      {/* User Role Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Users className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{userRoles.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* User-Role Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">User Name</th>
              <th className="border p-3 text-left">Assigned Role</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userRoles.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border p-3">{user.name}</td>
                <td className="border p-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-3 text-center">
                  <button className="text-blue-500 hover:text-blue-600 transition">
                    <Settings className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
