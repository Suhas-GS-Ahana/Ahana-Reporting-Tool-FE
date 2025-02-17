"use client";

import { Users, Plus, Trash, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RolesPage() {
  // Dummy data for roles
  const roles = [
    { id: 1, name: "Admin", usersAssigned: 10 },
    { id: 2, name: "Editor", usersAssigned: 25 },
    { id: 3, name: "User", usersAssigned: 500 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Roles Management</h2>

      {/* Role Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Roles</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Users className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{roles.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/roles/create" className="block w-fit">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
            <Plus className="w-4 h-4" /> Add Role
          </button>
        </Link>
      </div>

      {/* Roles Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Role Name</th>
              <th className="border p-3 text-left">Users Assigned</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="border p-3">{role.name}</td>
                <td className="border p-3">{role.usersAssigned}</td>
                <td className="border p-3 text-center flex justify-center gap-3">
                  <button className="text-blue-500 hover:text-blue-600 transition">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button className="text-red-500 hover:text-red-600 transition">
                    <Trash className="w-5 h-5" />
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
