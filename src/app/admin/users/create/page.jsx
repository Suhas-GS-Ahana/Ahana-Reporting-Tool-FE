"use client";
import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateUser() {
  const [user, setUser] = useState({ name: "", email: "", role: "User" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`User Created: ${JSON.stringify(user)}`);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 p-6 bg-white shadow-md rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back
          </button>
        </Link>
        <h2 className="text-2xl font-bold">Create User</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4 mr-2" /> Create User
        </button>
      </form>
    </div>
  );
}
