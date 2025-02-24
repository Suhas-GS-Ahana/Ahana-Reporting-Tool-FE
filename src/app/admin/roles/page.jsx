"use client";

import { useState } from "react";
import { Users, Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";

const allPages = [
  { name: "Dashboard", elements: ["Button 1", "Button 2", "Input 1"] },
  { name: "Users", elements: ["Add User", "Delete User", "Edit User"] },
  { name: "Settings", elements: ["Toggle Dark Mode", "Change Password"] },
  {
    name: "Reports",
    elements: ["Generate Report", "Download PDF", "Filter Data"],
  },
  { name: "Orders", elements: ["Create Order", "Cancel Order", "Track Order"] },
  {
    name: "Products",
    elements: ["Add Product", "Edit Product", "Delete Product"],
  },
  {
    name: "Notifications",
    elements: ["Enable Alerts", "Mute Notifications", "Set Preferences"],
  },
  {
    name: "Messages",
    elements: ["Send Message", "Delete Message", "Archive Chat"],
  },
  {
    name: "Payments",
    elements: ["Make Payment", "Refund", "View Transactions"],
  },
  { name: "Logs", elements: ["View Logs", "Export Logs", "Clear Logs"] },
];

export default function RolesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
  const [roleToEdit, setRoleToEdit] = useState(null);

  const handleAddRole = (newRole) => {
    setRoles((prevRoles) => [...prevRoles, newRole]);
  };

  const handleUpdateRole = (updatedRole) => {
    // Remove pages that have no selected elements
    const cleanedPermissions = Object.fromEntries(
      Object.entries(updatedRole.permissions).filter(
        ([, elements]) => elements.length > 0
      )
    );
  
    // Update the role with cleaned permissions
    const newRole = { ...updatedRole, permissions: cleanedPermissions };
  
    setRoles((prevRoles) =>
      prevRoles.map((role) => (role.id === newRole.id ? newRole : role))
    );
  };
  

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Roles Management</h2>

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-fit">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

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
                  <button
                    className="text-blue-500 hover:text-blue-600 transition"
                    onClick={() => {
                      setRoleToEdit(role);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Edit className="w-5 h-5" />
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

      {isCreateModalOpen && (
        <CreateRoleModal
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleAddRole}
        />
      )}
      {isEditModalOpen && (
        <EditRoleModal
          role={roleToEdit}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdateRole}
        />
      )}
    </div>
  );
}
