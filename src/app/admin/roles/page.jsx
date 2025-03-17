"use client";

import { useState } from "react";
import { Users, Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import { Bounce, toast, ToastContainer } from "react-toastify";

export default function RolesPage() {

  // State Variables
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Controls visibility of the "Create Role" modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls visibility of the "Edit Role" modal
  // Stores roles with their assigned permissions
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Admin",
      permissions: {
        Dashboard: ["Button 1", "Input 1"],
        Notifications: ["Enable Alerts", "Mute Notifications"],
      },
    },
    {
      id: 2,
      name: "Editor",
      permissions: { Users: ["Add User", "Edit User"] },
    },
    { id: 3, name: "User", permissions: { Orders: ["Create Order"] } },
  ]);
  const [roleToEdit, setRoleToEdit] = useState(null); // Stores the role being edited


  // Functions

  // Adding a New Role
  const handleAddRole = (newRole) => {
    toast.success(`User created successfully! \n ${JSON.stringify(newRole)}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });
    setRoles((prevRoles) => [...prevRoles, newRole]);
  };

  // Updating an Existing Roles
  const handleUpdateRole = (updatedRole) => {
    // Remove pages that have no selected elements
    const cleanedPermissions = Object.fromEntries(
      Object.entries(updatedRole.permissions).filter(
        ([, elements]) => elements.length > 0
      )
    );

    // Update the role with cleaned permissions
    const newRole = { ...updatedRole, permissions: cleanedPermissions };

    toast.success(`Role updated successfully! \n ${JSON.stringify(updatedRole)}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      });

    setRoles((prevRoles) =>
      prevRoles.map((role) => (role.id === newRole.id ? newRole : role))
    );
    
  };

  // Deleting a Role
  const handleDeleteRole = (roleId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this role?"
    );
    if (confirmDelete) {
      toast.success(`User with ID ${roleId} deleted successfully`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Roles Management</h2>

      {/* Roles Stats - Displays the total number of roles */}
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

       {/* Add Role Button */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-fit">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      {/* Roles Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Role Name</th>
              <th className="border p-3 text-left">Permissions</th>
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50">
                <td className="border p-3">{role.name}</td>
                <td className="border p-3">
                  {role.permissions &&
                  Object.entries(role.permissions).length > 0 ? (
                    Object.entries(role.permissions).map(([page, elements]) => (
                      <div key={page}>
                        <strong>{page}:</strong> {elements.join(", ")}
                      </div>
                    ))
                  ) : (
                    <span>No permissions assigned</span>
                  )}
                </td>
                <td className="border p-3 text-center flex justify-center gap-3">
                  {/* Edit Button */}
                  <button
                    className="text-blue-500 hover:text-blue-600 transition"
                    onClick={() => {
                      setRoleToEdit(role);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  {/* Delete Button */}
                  <button
                    className="text-red-500 hover:text-red-600 transition"
                    onClick={() => handleDeleteRole(role.id)}
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rendering Modals */}
      {isCreateModalOpen && (
        <CreateRoleModal
          onClose={() => setIsCreateModalOpen(false)}
          onAdd={(newRole) => handleAddRole(newRole)}
        />
      )}
      
      {isEditModalOpen && (
        <EditRoleModal
          role={roleToEdit}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateRole}
        />
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
