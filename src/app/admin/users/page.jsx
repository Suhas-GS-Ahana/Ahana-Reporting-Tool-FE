// viewing, adding, editing, and deleting users

"use client";
import { useState } from "react";
import { Users, Plus, Edit, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";

// Dummy users data (Replace with actual API data)

//UserName, Email, Phone,Role,Actions
const columns = [
  { key: "userName", label: "User Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
];

const users = [
  {
    id: 1,
    userName: "JohnDoe12",
    firstName: "John",
    lastName: "Doe",
    phone: "9245384153",
    email: "john@example.com",
    role: "Admin, Reviewer",
  },
  {
    id: 2,
    userName: "JaneSmith65",
    firstName: "Jane",
    lastName: "Smith",
    phone: "7245861239",
    email: "jane@example.com",
    role: "Editor, Reviewer",
  },
  {
    id: 3,
    userName: "MikeRoss99",
    firstName: "Mike",
    lastName: "Ross",
    phone: "7854123698",
    email: "mike@example.com",
    role: "User, Admin",
  },
  {
    id: 4,
    userName: "SaraConnor88",
    firstName: "Sara",
    lastName: "Connor",
    phone: "6987451236",
    email: "sara@example.com",
    role: "User, Editor",
  },
  {
    id: 5,
    userName: "TomHardy77",
    firstName: "Tom",
    lastName: "Hardy",
    phone: "8541263795",
    email: "tom@example.com",
    role: "Admin, User",
  },
  {
    id: 6,
    userName: "EmmaWatson01",
    firstName: "Emma",
    lastName: "Watson",
    phone: "9638527410",
    email: "emma@example.com",
    role: "Reviewer, User",
  },
  {
    id: 7,
    userName: "ChrisEvans34",
    firstName: "Chris",
    lastName: "Evans",
    phone: "7412589630",
    email: "chris@example.com",
    role: "Editor, Reviewer",
  },
  {
    id: 8,
    userName: "SophiaLee90",
    firstName: "Sophia",
    lastName: "Lee",
    phone: "8529637412",
    email: "sophia@example.com",
    role: "User, Admin",
  },
  {
    id: 9,
    userName: "DanielCraig56",
    firstName: "Daniel",
    lastName: "Craig",
    phone: "7896541230",
    email: "daniel@example.com",
    role: "User, Reviewer",
  },
  {
    id: 10,
    userName: "OliviaBrown22",
    firstName: "Olivia",
    lastName: "Brown",
    phone: "7419638520",
    email: "olivia@example.com",
    role: "Editor, Admin",
  },
  {
    id: 11,
    userName: "LiamMiller87",
    firstName: "Liam",
    lastName: "Miller",
    phone: "3697412580",
    email: "liam@example.com",
    role: "User, Editor",
  },
  {
    id: 12,
    userName: "AvaWilson99",
    firstName: "Ava",
    lastName: "Wilson",
    phone: "9632587410",
    email: "ava@example.com",
    role: "Admin, Reviewer",
  },
  {
    id: 13,
    userName: "NoahClark55",
    firstName: "Noah",
    lastName: "Clark",
    phone: "8521479630",
    email: "noah@example.com",
    role: "Editor, User",
  },
  {
    id: 14,
    userName: "MiaWalker44",
    firstName: "Mia",
    lastName: "Walker",
    phone: "7893216540",
    email: "mia@example.com",
    role: "Reviewer, Admin",
  },
  {
    id: 15,
    userName: "EthanHall33",
    firstName: "Ethan",
    lastName: "Hall",
    phone: "9517538520",
    email: "ethan@example.com",
    role: "User, Editor",
  },
  {
    id: 16,
    userName: "CharlotteAllen77",
    firstName: "Charlotte",
    lastName: "Allen",
    phone: "8529631470",
    email: "charlotte@example.com",
    role: "Admin, Reviewer",
  },
  {
    id: 17,
    userName: "JamesYoung21",
    firstName: "James",
    lastName: "Young",
    phone: "7539518520",
    email: "james@example.com",
    role: "Editor, User",
  },
  {
    id: 18,
    userName: "EllaKing09",
    firstName: "Ella",
    lastName: "King",
    phone: "1597534862",
    email: "ella@example.com",
    role: "Reviewer, Admin",
  },
  {
    id: 19,
    userName: "LucasWright99",
    firstName: "Lucas",
    lastName: "Wright",
    phone: "7538462951",
    email: "lucas@example.com",
    role: "User, Editor",
  },
  {
    id: 20,
    userName: "GraceLopez88",
    firstName: "Grace",
    lastName: "Lopez",
    phone: "6549871230",
    email: "grace@example.com",
    role: "Admin, Reviewer",
  },
  {
    id: 21,
    userName: "BenjaminScott76",
    firstName: "Benjamin",
    lastName: "Scott",
    phone: "3216549870",
    email: "benjamin@example.com",
    role: "Editor, User",
  },
  {
    id: 22,
    userName: "AmeliaGreen54",
    firstName: "Amelia",
    lastName: "Green",
    phone: "7896543210",
    email: "amelia@example.com",
    role: "Reviewer, Admin",
  },
  {
    id: 23,
    userName: "HenryNelson42",
    firstName: "Henry",
    lastName: "Nelson",
    phone: "9513574562",
    email: "henry@example.com",
    role: "User, Editor",
  },
  {
    id: 24,
    userName: "LilyCarter33",
    firstName: "Lily",
    lastName: "Carter",
    phone: "1596328475",
    email: "lily@example.com",
    role: "Admin, Reviewer",
  },
  {
    id: 25,
    userName: "SamuelMitchell11",
    firstName: "Samuel",
    lastName: "Mitchell",
    phone: "1234567890",
    email: "samuel@example.com",
    role: "Editor, User",
  },
];

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // To open the Create modal
  const [selectedUser, setSelectedUser] = useState(null); // To track selected user for editing or deletion
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To open the Edit modal

  //
  const [data, setData] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = data.filter((item) =>
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

  // Function to open edit modal with user data
  const handleEditUser = (user) => {
    setSelectedUser(user); // Set the selected user for editing
    setIsEditModalOpen(true); // Open the edit modal
  };

  // Function to handle user deletion
  const handleDeleteUser = (userId) => {
    // Here you can add the logic for deleting the user (API call or state update)
    const confirmDelete = window.confirm(
      `Do you want to delete this user with id ${userId}?`
    );
    if (confirmDelete) {
      toast.success(`User with ID ${userId} deleted successfully`, {
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
    }
  };

  // Function to handle user updation
  const handleUpdateUser = (updatedUser) => {
    // Perform state update or API call
    toast.success(
      `User updated successfully! \n ${JSON.stringify(updatedUser, null, 2)}`,
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

  // Function to handle user creation
  const handleAddUser = (newUser) => {
    toast.success(`User created successfully! \n ${JSON.stringify(newUser)}`, {
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
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Users Management</h2>
      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Users className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">1,250</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-fit">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
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
            {paginatedData.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="border p-3">
                    {user[column.key]}
                  </td>
                ))}
                <td className="border p-3 text-center flex justify-center gap-3">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-500 hover:text-blue-600 transition"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
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

      {/* Create User Modal */}
      {isModalOpen && (
        <CreateUserModal
          onClose={() => setIsModalOpen(false)}
          onAdd={(newUser) => handleAddUser(newUser)}
        />
      )}

      {/* Edit User Modal */}
      {isEditModalOpen && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedUser) => handleUpdateUser(updatedUser)}
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
