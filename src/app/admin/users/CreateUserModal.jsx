// Modal to create new user

"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function CreateUserModal({ onClose }) {

  // Managing Form State
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "User"
  });

  // Handling Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`User Created: ${JSON.stringify(user)}`);
    onClose(); // Close modal after creating user
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create User</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            maxLength={10}
            pattern="^\d{10}$"
            title="Phone number must be exactly 10 digits"
            required
          />

          <div className="flex items-center space-x-4">
            <input
              type="password"
              placeholder="Create Password"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4 mr-2" /> Create User
          </button>
        </form>
      </div>
    </div>
  );
}
