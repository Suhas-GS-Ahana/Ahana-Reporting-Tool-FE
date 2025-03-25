"use client";

import { useState } from "react";
import { Users, Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateRoleModal from "./CreateRoleModal";
import EditRoleModal from "./EditRoleModal";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";

//Role Name, Permissions, Actions
const columns = [
  { key: "name", label: "Role Name" },
  { key: "permissions", label: "Permissions" },
];

const rolesData = [
  {
    id: 1,
    name: "Admin",
    permissions: {
      Dashboard: ["Button 1", "Input 1"],
      Notifications: ["Enable Alerts", "Mute Notifications"],
      Users: ["Add User", "Delete User", "Edit User"],
      Settings: ["Toggle Dark Mode", "Change Password"],
      Reports: ["Generate Report", "Download PDF", "Filter Data"],
    },
  },
  {
    id: 2,
    name: "Editor",
    permissions: {
      Users: ["Add User", "Edit User"],
      Products: ["Add Product", "Edit Product"],
      Reports: ["Generate Report", "Filter Data"],
    },
  },
  {
    id: 3,
    name: "User",
    permissions: {
      Orders: ["Create Order", "Track Order"],
      Payments: ["Make Payment", "View Transactions"],
    },
  },
  {
    id: 4,
    name: "Reviewer",
    permissions: {
      Reports: ["Generate Report", "Filter Data"],
      Logs: ["View Logs"],
    },
  },
  {
    id: 5,
    name: "Manager",
    permissions: {
      Dashboard: ["Button 1", "Button 2"],
      Users: ["Add User", "Delete User"],
      Reports: ["Download PDF"],
    },
  },
  {
    id: 6,
    name: "Support",
    permissions: {
      Messages: ["Send Message", "Delete Message"],
      Logs: ["View Logs", "Export Logs"],
    },
  },
  {
    id: 7,
    name: "Super Admin",
    permissions: {
      Dashboard: ["Button 1", "Button 2", "Input 1"],
      Users: ["Add User", "Delete User", "Edit User"],
      Settings: ["Toggle Dark Mode", "Change Password"],
      Reports: ["Generate Report", "Download PDF", "Filter Data"],
      Orders: ["Create Order", "Cancel Order", "Track Order"],
      Payments: ["Make Payment", "Refund", "View Transactions"],
      Logs: ["View Logs", "Export Logs", "Clear Logs"],
    },
  },
  {
    id: 8,
    name: "Accountant",
    permissions: {
      Payments: ["Make Payment", "Refund", "View Transactions"],
      Reports: ["Generate Report", "Filter Data"],
    },
  },
  {
    id: 9,
    name: "HR",
    permissions: {
      Users: ["Add User", "Edit User"],
      Settings: ["Change Password"],
    },
  },
  {
    id: 10,
    name: "Auditor",
    permissions: {
      Logs: ["View Logs", "Export Logs"],
      Reports: ["Generate Report"],
    },
  },
  {
    id: 11,
    name: "Quality Analyst",
    permissions: {
      Reports: ["Filter Data"],
      Products: ["Edit Product"],
    },
  },
  {
    id: 12,
    name: "Developer",
    permissions: {
      Dashboard: ["Button 1"],
      Logs: ["View Logs", "Clear Logs"],
    },
  },
  {
    id: 13,
    name: "Customer Support",
    permissions: {
      Messages: ["Send Message", "Archive Chat"],
      Notifications: ["Enable Alerts"],
    },
  },
  {
    id: 14,
    name: "Operations Manager",
    permissions: {
      Orders: ["Create Order", "Cancel Order"],
      Reports: ["Generate Report", "Download PDF"],
    },
  },
  {
    id: 15,
    name: "Inventory Manager",
    permissions: {
      Products: ["Add Product", "Edit Product", "Delete Product"],
      Reports: ["Filter Data"],
    },
  },
  {
    id: 16,
    name: "Marketing Analyst",
    permissions: {
      Reports: ["Generate Report", "Download PDF"],
      Dashboard: ["Button 2"],
    },
  },
  {
    id: 17,
    name: "Security Officer",
    permissions: {
      Logs: ["View Logs", "Clear Logs"],
      Settings: ["Change Password"],
    },
  },
  {
    id: 18,
    name: "Product Manager",
    permissions: {
      Products: ["Edit Product", "Delete Product"],
      Reports: ["Filter Data"],
    },
  },
  {
    id: 19,
    name: "Sales Representative",
    permissions: {
      Orders: ["Create Order", "Track Order"],
      Payments: ["Make Payment"],
    },
  },
  {
    id: 20,
    name: "Legal Advisor",
    permissions: {
      Logs: ["View Logs"],
      Reports: ["Download PDF"],
    },
  },
  {
    id: 21,
    name: "Training Coordinator",
    permissions: {
      Users: ["Add User", "Edit User"],
      Notifications: ["Set Preferences"],
    },
  },
  {
    id: 22,
    name: "System Administrator",
    permissions: {
      Settings: ["Toggle Dark Mode", "Change Password"],
      Logs: ["View Logs", "Export Logs", "Clear Logs"],
    },
  },
  {
    id: 23,
    name: "Compliance Officer",
    permissions: {
      Logs: ["View Logs"],
      Reports: ["Generate Report", "Filter Data"],
    },
  },
  {
    id: 24,
    name: "Event Manager",
    permissions: {
      Notifications: ["Enable Alerts", "Set Preferences"],
      Messages: ["Send Message"],
    },
  },
  {
    id: 25,
    name: "Vendor Manager",
    permissions: {
      Orders: ["Track Order"],
      Payments: ["View Transactions"],
    },
  },
];

export default function RolesPage() {
  // State Variables
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Controls visibility of the "Create Role" modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Controls visibility of the "Edit Role" modal
  // Stores roles with their assigned permissions
  const [roles, setRoles] = useState(rolesData);

  const [roleToEdit, setRoleToEdit] = useState(null); // Stores the role being edited

  //
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = roles.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

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

    toast.success(
      `Role updated successfully! \n ${JSON.stringify(updatedRole)}`,
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      }
    );

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
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="cursor-pointer border p-3 text-left"
                >
                  {column.label}{" "}
                  {sortKey === column.key
                    ? sortOrder === "asc"
                      ? "▲"
                      : "▼"
                    : null}
                </th>
              ))}
              <th className="border p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((role, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="border p-3">
                    {column.key === "permissions" ? (
                      role.permissions &&
                      Object.entries(role.permissions).length > 0 ? (
                        Object.entries(role.permissions).map(
                          ([page, elements]) => (
                            <div key={page}>
                              <strong>{page}:</strong> {elements.join(", ")}
                            </div>
                          )
                        )
                      ) : (
                        <span>No permissions assigned</span>
                      )
                    ) : (
                      role[column.key] || "N/A"
                    )}
                  </td>
                ))}
                {/* Action Buttons */}
                <td className="border p-3 text-center flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setRoleToEdit(role);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-600 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="flex items-center gap-2 px-4 py-2 h-8 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Prev
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 h-8 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Next
          </Button>
        </div>
        <div>
          <label>Rows per page: </label>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="ml-2 p-1 border"
          >
            {[5, 10, 15, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
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
