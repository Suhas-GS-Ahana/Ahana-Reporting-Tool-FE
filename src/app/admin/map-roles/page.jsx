// This React component, MapRolesPage, is a role management dashboard where admins can
// view users and assign roles to them

"use client";
import { useState } from "react";
import { UserCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AssignRoleModal from "./AssignRoleModal";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";

//Name,Email,Assigned Roles,Actions
const columns = [
  { key: "userName", label: "User Name" },
  { key: "email", label: "Email" },
  { key: "roles", label: "Assigned Roles" },
];

const userData = [
  {
    id: 1,
    userName: "john_doe",
    email: "john@example.com",
    roles: ["Admin", "Editor"],
  },
  { id: 2, userName: "jane_smith", email: "jane@example.com", roles: ["User"] },
  {
    id: 3,
    userName: "bob_johnson",
    email: "bob@example.com",
    roles: ["Editor", "Reviewer"],
  },
  {
    id: 4,
    userName: "alice_brown",
    email: "alice@example.com",
    roles: ["User", "Reviewer"],
  },
  {
    id: 5,
    userName: "charlie_davis",
    email: "charlie@example.com",
    roles: ["Admin"],
  },
  {
    id: 6,
    userName: "emily_white",
    email: "emily@example.com",
    roles: ["Editor"],
  },
  {
    id: 7,
    userName: "david_black",
    email: "david@example.com",
    roles: ["Reviewer"],
  },
  {
    id: 8,
    userName: "sophia_green",
    email: "sophia@example.com",
    roles: ["User", "Editor"],
  },
  {
    id: 9,
    userName: "james_wilson",
    email: "james@example.com",
    roles: ["Admin", "Reviewer"],
  },
  {
    id: 10,
    userName: "olivia_moore",
    email: "olivia@example.com",
    roles: ["User"],
  },
  {
    id: 11,
    userName: "michael_harris",
    email: "michael@example.com",
    roles: ["Editor", "Reviewer"],
  },
  {
    id: 12,
    userName: "emma_clark",
    email: "emma@example.com",
    roles: ["User", "Admin"],
  },
  {
    id: 13,
    userName: "ethan_lewis",
    email: "ethan@example.com",
    roles: ["Editor"],
  },
  {
    id: 14,
    userName: "isabella_hall",
    email: "isabella@example.com",
    roles: ["Reviewer", "User"],
  },
  {
    id: 15,
    userName: "daniel_young",
    email: "daniel@example.com",
    roles: ["Admin"],
  },
  { id: 16, userName: "mia_allen", email: "mia@example.com", roles: ["User"] },
  {
    id: 17,
    userName: "william_king",
    email: "william@example.com",
    roles: ["Editor", "Reviewer"],
  },
  {
    id: 18,
    userName: "ava_scott",
    email: "ava@example.com",
    roles: ["User", "Admin"],
  },
  {
    id: 19,
    userName: "benjamin_adams",
    email: "benjamin@example.com",
    roles: ["Editor"],
  },
  {
    id: 20,
    userName: "charlotte_nelson",
    email: "charlotte@example.com",
    roles: ["Reviewer", "User"],
  },
  {
    id: 21,
    userName: "henry_carter",
    email: "henry@example.com",
    roles: ["Admin"],
  },
  {
    id: 22,
    userName: "amelia_mitchell",
    email: "amelia@example.com",
    roles: ["User"],
  },
  {
    id: 23,
    userName: "alexander_perez",
    email: "alexander@example.com",
    roles: ["Editor", "Reviewer"],
  },
  {
    id: 24,
    userName: "lucas_roberts",
    email: "lucas@example.com",
    roles: ["User", "Admin"],
  },
  {
    id: 25,
    userName: "harper_evans",
    email: "harper@example.com",
    roles: ["Editor"],
  },
];

export default function MapRolesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); //Tracks whether the assign role modal is open
  const [selectedUser, setSelectedUser] = useState(null); //Stores the user selected for role assignment

  // Dummy users with assigned roles (Replace with actual API data)
  const [users, setUsers] = useState(userData);

  //
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = users.filter((item) =>
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

  // Function to open assign role modal
  const handleAssignRole = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Function to Save Assigned Roles
  const handleSaveRoles = (userId, newRoles) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, roles: newRoles } : user
      )
    );
    // alert(`User ID ${userId} has been assigned roles: ${newRoles.join(", ")}`);
    toast.success(
      `User ID ${userId} has been assigned roles: ${newRoles.join(", ")}`,
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
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Map Roles</h2>

      {/* Role Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Users with Roles</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <UserCog className="h-8 w-8 text-[hsl(var(--icon-color))]" />
            <span className="text-2xl font-bold">{users.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border border-gray-300 rounded"
      />
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-[hsl(var(--table-header-background))] text-[hsl(var(--table-header-foreground))]">
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
            {paginatedData.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="border p-3">
                    {column.key === "roles"
                      ? user.roles.join(", ") // Handle array formatting for roles
                      : user[column.key] || "N/A"}
                  </td>
                ))}
                {/* Assign Role Button */}
                <td className="border p-3 text-center">
                  <button
                    onClick={() => handleAssignRole(user)}
                    className="text-[hsl(var(--button2-color))] hover:text-[hsl(var(--button2-color-hover))] transition"
                  >
                    Assign Role
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
            className="flex items-center gap-2 px-4 py-2 h-8 bg-[hsl(var(--button-color))]  text-white rounded-lg shadow-md hover:bg-[hsl(var(--button-color-hover))] transition"
          >
            Prev
          </Button>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="flex items-center gap-2 px-4 py-2 h-8 bg-[hsl(var(--button-color))]  text-white rounded-lg shadow-md hover:bg-[hsl(var(--button-color-hover))] transition"
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

      {/* Assign Role Modal */}
      {isModalOpen && (
        <AssignRoleModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveRoles}
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
