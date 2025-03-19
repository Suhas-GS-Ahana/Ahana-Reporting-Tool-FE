// Modal to create new user

"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";

export default function CreateUserModal({ onClose, onAdd }) {
  // Managing Form State
  const [user, setUser] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "User",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleAddUser = (e) => {
    e.preventDefault();
    if (user.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    onAdd(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 ">
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
        <form onSubmit={handleAddUser} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* User Details - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={user.userName}
                onChange={(e) => setUser({ ...user, userName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })}
              maxLength={10}
              pattern="^\d{10}$"
              title="Phone number must be exactly 10 digits"
              required
            />
          </div>

          {/* Passwords - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Create Password
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$"
                title="Password must be at least 7 characters long and include uppercase, lowercase, number, and symbol"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
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
