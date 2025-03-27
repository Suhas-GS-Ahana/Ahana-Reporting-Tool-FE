// "use client"

// import { ArrowUpDown } from "lucide-react";
// import { useState } from "react";

// const userLogs = [
//   {
//     log_id: 1,
//     username: "JohnDoe12",
//     action_type: "Login",
//     timestamp: "2025-03-03T08:30:00Z",
//     ip_address: "192.168.1.10",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 2,
//     username: "JaneSmith34",
//     action_type: "Login",
//     timestamp: "2025-03-03T08:45:12Z",
//     ip_address: "192.168.1.15",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 3,
//     username: "BobBuilder56",
//     action_type: "Login",
//     timestamp: "2025-03-03T09:00:30Z",
//     ip_address: "192.168.1.20",
//     status: "Failed",
//     details: "Incorrect password attempt.",
//   },
//   {
//     log_id: 4,
//     username: "JohnDoe12",
//     action_type: "Logout",
//     timestamp: "2025-03-03T09:15:45Z",
//     ip_address: "192.168.1.10",
//     status: "Success",
//     details: "User logged out.",
//   },
//   {
//     log_id: 5,
//     username: "JaneSmith34",
//     action_type: "Update Profile",
//     timestamp: "2025-03-03T09:30:25Z",
//     ip_address: "192.168.1.15",
//     status: "Success",
//     details: "Updated profile information.",
//   },
//   {
//     log_id: 6,
//     username: "BobBuilder56",
//     action_type: "Failed Login",
//     timestamp: "2025-03-03T10:05:42Z",
//     ip_address: "192.168.1.20",
//     status: "Failed",
//     details: "Incorrect password attempt.",
//   },
//   {
//     log_id: 7,
//     username: "JohnDoe12",
//     action_type: "Password Change",
//     timestamp: "2025-03-03T10:20:33Z",
//     ip_address: "192.168.1.10",
//     status: "Success",
//     details: "User changed password successfully.",
//   },
//   {
//     log_id: 8,
//     username: "JaneSmith34",
//     action_type: "Logout",
//     timestamp: "2025-03-03T10:45:50Z",
//     ip_address: "192.168.1.15",
//     status: "Success",
//     details: "User logged out.",
//   },
//   {
//     log_id: 9,
//     username: "BobBuilder56",
//     action_type: "Login",
//     timestamp: "2025-03-03T11:10:12Z",
//     ip_address: "192.168.1.20",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 10,
//     username: "JohnDoe12",
//     action_type: "File Upload",
//     timestamp: "2025-03-03T11:30:00Z",
//     ip_address: "192.168.1.10",
//     status: "Success",
//     details: "Uploaded report.pdf.",
//   },
//   {
//     log_id: 11,
//     username: "AliceWonder90",
//     action_type: "Login",
//     timestamp: "2025-03-03T11:40:00Z",
//     ip_address: "192.168.1.30",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 12,
//     username: "CharlieKing78",
//     action_type: "Login",
//     timestamp: "2025-03-03T12:00:00Z",
//     ip_address: "192.168.1.35",
//     status: "Failed",
//     details: "Incorrect password attempt.",
//   },
//   {
//     log_id: 13,
//     username: "DavidKnight99",
//     action_type: "Password Change",
//     timestamp: "2025-03-03T12:15:00Z",
//     ip_address: "192.168.1.40",
//     status: "Success",
//     details: "User changed password successfully.",
//   },
//   {
//     log_id: 14,
//     username: "EmilyQueen23",
//     action_type: "Login",
//     timestamp: "2025-03-03T12:30:00Z",
//     ip_address: "192.168.1.45",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 15,
//     username: "FrankHero11",
//     action_type: "Logout",
//     timestamp: "2025-03-03T12:45:00Z",
//     ip_address: "192.168.1.50",
//     status: "Success",
//     details: "User logged out.",
//   },
//   {
//     log_id: 16,
//     username: "GraceHill45",
//     action_type: "Update Profile",
//     timestamp: "2025-03-03T13:00:00Z",
//     ip_address: "192.168.1.55",
//     status: "Success",
//     details: "Updated profile information.",
//   },
//   {
//     log_id: 17,
//     username: "HenryMills67",
//     action_type: "Login",
//     timestamp: "2025-03-03T13:15:00Z",
//     ip_address: "192.168.1.60",
//     status: "Failed",
//     details: "Incorrect password attempt.",
//   },
//   {
//     log_id: 18,
//     username: "IslaLake90",
//     action_type: "Login",
//     timestamp: "2025-03-03T13:30:00Z",
//     ip_address: "192.168.1.65",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 19,
//     username: "JackHawk12",
//     action_type: "File Upload",
//     timestamp: "2025-03-03T13:45:00Z",
//     ip_address: "192.168.1.70",
//     status: "Success",
//     details: "Uploaded image.png.",
//   },
//   {
//     log_id: 20,
//     username: "KellySun88",
//     action_type: "Login",
//     timestamp: "2025-03-03T14:00:00Z",
//     ip_address: "192.168.1.75",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 21,
//     username: "LeoStone34",
//     action_type: "Password Change",
//     timestamp: "2025-03-03T14:15:00Z",
//     ip_address: "192.168.1.80",
//     status: "Success",
//     details: "User changed password successfully.",
//   },
//   {
//     log_id: 22,
//     username: "MiaFrost19",
//     action_type: "Login",
//     timestamp: "2025-03-03T14:30:00Z",
//     ip_address: "192.168.1.85",
//     status: "Success",
//     details: "User logged in successfully.",
//   },
//   {
//     log_id: 23,
//     username: "NinaWave24",
//     action_type: "Logout",
//     timestamp: "2025-03-03T14:45:00Z",
//     ip_address: "192.168.1.90",
//     status: "Success",
//     details: "User logged out.",
//   },
//   {
//     log_id: 24,
//     username: "OscarGray21",
//     action_type: "Failed Login",
//     timestamp: "2025-03-03T15:00:00Z",
//     ip_address: "192.168.1.95",
//     status: "Failed",
//     details: "Incorrect password attempt.",
//   },
//   {
//     log_id: 25,
//     username: "PaulStorm57",
//     action_type: "Update Profile",
//     timestamp: "2025-03-03T15:15:00Z",
//     ip_address: "192.168.1.100",
//     status: "Success",
//     details: "Updated profile picture.",
//   },
// ];

// export default function UserLogs() {
//   const [sortedData, setSortedData] = useState(userLogs);
//   const [sortKey, setSortKey] = useState(null);
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const handleSort = (key) => {
//     const newSortOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
//     const sortedArray = [...sortedData].sort((a, b) => {
//       if (a[key] < b[key]) return newSortOrder === "asc" ? -1 : 1;
//       if (a[key] > b[key]) return newSortOrder === "asc" ? 1 : -1;
//       return 0;
//     });

//     setSortedData(sortedArray);
//     setSortKey(key);
//     setSortOrder(newSortOrder);
//   };

//   const filteredData = sortedData.filter((userlog) =>
//     Object.values(userlog).some((value) =>
//       String(value).toLowerCase().includes(searchTerm.toLowerCase())
//     )
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">User Logs</h2>

//       <input
//         type="text"
//         placeholder="Search..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="p-2 mb-4 border border-gray-300 rounded"
//       />

//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full border border-collapse border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               {[
//                 "log_id", "username", "action_type", "timestamp", "ip_address", "status", "details"
//               ].map((key) => (
//                 <th
//                   key={key}
//                   className="border p-3 text-left cursor-pointer"
//                   onClick={() => handleSort(key)}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <ArrowUpDown className="w-3 h-4" />
//                     <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((userlog) => (
//               <tr key={userlog.log_id}>
//                 {Object.values(userlog).map((value, index) => (
//                   <td key={index} className="border p-3">{value}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center space-x-2 mt-4">
//         {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
//           <button
//             key={pageNumber}
//             onClick={() => handlePageChange(pageNumber)}
//             className={`px-3 py-1 rounded ${
//               pageNumber === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             {pageNumber}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const columns = [
  { key: "log_id", label: "Log ID" },
  { key: "username", label: "Username" },
  { key: "action_type", label: "Action Type" },
  { key: "timestamp", label: "Timestamp" },
  { key: "ip_address", label: "IP Address" },
  { key: "status", label: "Status" },
  { key: "details", label: "Details" },
];

const sampleData = [
  {
    log_id: 1,
    username: "JohnDoe12",
    action_type: "Login",
    timestamp: "2025-03-03T08:30:00Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 2,
    username: "JaneSmith34",
    action_type: "Login",
    timestamp: "2025-03-03T08:45:12Z",
    ip_address: "192.168.1.15",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 3,
    username: "BobBuilder56",
    action_type: "Login",
    timestamp: "2025-03-03T09:00:30Z",
    ip_address: "192.168.1.20",
    status: "Failed",
    details: "Incorrect password attempt.",
  },
  {
    log_id: 4,
    username: "JohnDoe12",
    action_type: "Logout",
    timestamp: "2025-03-03T09:15:45Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "User logged out.",
  },
  {
    log_id: 5,
    username: "JaneSmith34",
    action_type: "Update Profile",
    timestamp: "2025-03-03T09:30:25Z",
    ip_address: "192.168.1.15",
    status: "Success",
    details: "Updated profile information.",
  },
  {
    log_id: 6,
    username: "BobBuilder56",
    action_type: "Failed Login",
    timestamp: "2025-03-03T10:05:42Z",
    ip_address: "192.168.1.20",
    status: "Failed",
    details: "Incorrect password attempt.",
  },
  {
    log_id: 7,
    username: "JohnDoe12",
    action_type: "Password Change",
    timestamp: "2025-03-03T10:20:33Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "User changed password successfully.",
  },
  {
    log_id: 8,
    username: "JaneSmith34",
    action_type: "Logout",
    timestamp: "2025-03-03T10:45:50Z",
    ip_address: "192.168.1.15",
    status: "Success",
    details: "User logged out.",
  },
  {
    log_id: 9,
    username: "BobBuilder56",
    action_type: "Login",
    timestamp: "2025-03-03T11:10:12Z",
    ip_address: "192.168.1.20",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 10,
    username: "JohnDoe12",
    action_type: "File Upload",
    timestamp: "2025-03-03T11:30:00Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "Uploaded report.pdf.",
  },
  {
    log_id: 11,
    username: "AliceWonder90",
    action_type: "Login",
    timestamp: "2025-03-03T11:40:00Z",
    ip_address: "192.168.1.30",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 12,
    username: "CharlieKing78",
    action_type: "Login",
    timestamp: "2025-03-03T12:00:00Z",
    ip_address: "192.168.1.35",
    status: "Failed",
    details: "Incorrect password attempt.",
  },
  {
    log_id: 13,
    username: "DavidKnight99",
    action_type: "Password Change",
    timestamp: "2025-03-03T12:15:00Z",
    ip_address: "192.168.1.40",
    status: "Success",
    details: "User changed password successfully.",
  },
  {
    log_id: 14,
    username: "EmilyQueen23",
    action_type: "Login",
    timestamp: "2025-03-03T12:30:00Z",
    ip_address: "192.168.1.45",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 15,
    username: "FrankHero11",
    action_type: "Logout",
    timestamp: "2025-03-03T12:45:00Z",
    ip_address: "192.168.1.50",
    status: "Success",
    details: "User logged out.",
  },
  {
    log_id: 16,
    username: "GraceHill45",
    action_type: "Update Profile",
    timestamp: "2025-03-03T13:00:00Z",
    ip_address: "192.168.1.55",
    status: "Success",
    details: "Updated profile information.",
  },
  {
    log_id: 17,
    username: "HenryMills67",
    action_type: "Login",
    timestamp: "2025-03-03T13:15:00Z",
    ip_address: "192.168.1.60",
    status: "Failed",
    details: "Incorrect password attempt.",
  },
  {
    log_id: 18,
    username: "IslaLake90",
    action_type: "Login",
    timestamp: "2025-03-03T13:30:00Z",
    ip_address: "192.168.1.65",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 19,
    username: "JackHawk12",
    action_type: "File Upload",
    timestamp: "2025-03-03T13:45:00Z",
    ip_address: "192.168.1.70",
    status: "Success",
    details: "Uploaded image.png.",
  },
  {
    log_id: 20,
    username: "KellySun88",
    action_type: "Login",
    timestamp: "2025-03-03T14:00:00Z",
    ip_address: "192.168.1.75",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 21,
    username: "LeoStone34",
    action_type: "Password Change",
    timestamp: "2025-03-03T14:15:00Z",
    ip_address: "192.168.1.80",
    status: "Success",
    details: "User changed password successfully.",
  },
  {
    log_id: 22,
    username: "MiaFrost19",
    action_type: "Login",
    timestamp: "2025-03-03T14:30:00Z",
    ip_address: "192.168.1.85",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 23,
    username: "NinaWave24",
    action_type: "Logout",
    timestamp: "2025-03-03T14:45:00Z",
    ip_address: "192.168.1.90",
    status: "Success",
    details: "User logged out.",
  },
  {
    log_id: 24,
    username: "OscarGray21",
    action_type: "Failed Login",
    timestamp: "2025-03-03T15:00:00Z",
    ip_address: "192.168.1.95",
    status: "Failed",
    details: "Incorrect password attempt.",
  },
  {
    log_id: 25,
    username: "PaulStorm57",
    action_type: "Update Profile",
    timestamp: "2025-03-03T15:15:00Z",
    ip_address: "192.168.1.100",
    status: "Success",
    details: "Updated profile picture.",
  },
];

const UserLogsPage = () => {
  const [data, setData] = useState(sampleData);
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Logs</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border border-gray-300 rounded"
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border border-collapse border-gray-200">
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
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key} className="border p-3">
                    {item[column.key]}
                  </td>
                ))}
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
    </div>
  );
};

export default UserLogsPage;
