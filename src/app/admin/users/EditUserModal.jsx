import { useState } from "react";

export default function EditUserModal({ user, onClose, onUpdate }) {
  const [activeTab, setActiveTab] = useState("edit"); // Controls whether the "Edit User Details" tab or the "Change Password" tab is active
  const [editedUser, setEditedUser] = useState(user); // Stores the modified user data
  const [newPassword, setNewPassword] = useState(""); // Hold password input values
  const [confirmPassword, setConfirmPassword] = useState(""); // ""

  // Handling User Update
  const handleUserUpdate = (e) => {
    e.preventDefault();
    onUpdate(editedUser);
    onClose();
  };

  // Handling Password Change
  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword) {
      alert("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onUpdate({ ...user, password: newPassword });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">User Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            X
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "edit" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("edit")}
          >
            Edit User Details
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "password"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {activeTab === "edit" ? (
          // Edit User Form
          <form onSubmit={handleUserUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={editedUser.userName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, userName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={editedUser.email}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={editedUser.firstName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={editedUser.lastName}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, lastName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={editedUser.phone}
                onChange={(e) =>
                  setEditedUser({ ...editedUser, phone: e.target.value })
                }
                maxLength={10}
                pattern="^\d{10}$"
                title="Phone number must be exactly 10 digits"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </form>
        ) : (
          // Change Password Form
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,}$"
                title="Password must be at least 7 characters long and include uppercase, lowercase, number, and symbol"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Change Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
