// This modal component allows the user to assign or update roles for a specific user. It displays all
// available roles, with checkboxes to select or unselect roles, and has Cancel and Save Changes buttons.

import { useState } from "react";

export default function AssignRoleModal({ user, onClose, onSave }) {

  // Defining Available Roles and State
  const allRoles = ["Admin", "Editor", "User", "Reviewer"]; // Available roles
  const [selectedRoles, setSelectedRoles] = useState(user.roles || []); // stores the roles currently selected for the user. It initially takes the roles assigned to the user (user.roles)
 
  // Handling Role Selection/Deselection
  const handleRoleChange = (role) => {
    setSelectedRoles((prevRoles) =>
      prevRoles.includes(role)
        ? prevRoles.filter((r) => r !== role)
        : [...prevRoles, role]
    );
  };

  // Handling Save
  const handleSave = () => {
    onSave(user.id, selectedRoles); // Pass selected user roles to parent component
    onClose(); // Close the modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Assign Roles to {user.name}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
          {allRoles.map((role) => (
            <label key={role} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRoles.includes(role)} //If the role is already in selectedRoles, the checkbox is checked.
                onChange={() => handleRoleChange(role)}
              />
              <span>{role}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[hsl(var(--button-color))] text-white rounded hover:bg-[hsl(var(--button-color-hover))]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
