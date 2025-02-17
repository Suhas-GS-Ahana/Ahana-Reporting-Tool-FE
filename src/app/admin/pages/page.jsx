"use client";

import { FileText, Plus, Trash, Lock, Unlock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PagesPage() {
  // Dummy data for pages
  const pages = [
    { id: 1, name: "Dashboard", usersAssigned: 50, status: "Public" },
    { id: 2, name: "Admin Panel", usersAssigned: 5, status: "Restricted" },
    { id: 3, name: "Reports", usersAssigned: 20, status: "Public" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pages Management</h2>

      {/* Page Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Pages</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <FileText className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{pages.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/pages/create">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">
            <Plus className="w-4 h-4" /> Add Page
          </button>
        </Link>
      </div>

      {/* Pages Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Page Name</th>
              <th className="border p-3 text-left">Users Assigned</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="border p-3">{page.name}</td>
                <td className="border p-3">{page.usersAssigned}</td>
                <td className="border p-3 flex items-center gap-2">
                  {page.status === "Public" ? (
                    <span className="text-green-500 flex items-center gap-1">
                      <Unlock className="w-4 h-4" /> Public
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center gap-1">
                      <Lock className="w-4 h-4" /> Restricted
                    </span>
                  )}
                </td>
                <td className="border p-3 text-center flex justify-center gap-3">
                  <button className="text-blue-500 hover:text-blue-600 transition">
                    <FileText className="w-5 h-5" />
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

  