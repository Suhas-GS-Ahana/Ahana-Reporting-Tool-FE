"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import React, { useState } from "react";

//Pages data

//Page Name, Elements

const columns = [
  { key: "name", label: "Page Name" },
  { key: "elements", label: "Elements" },
];

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

export default function page() {
  //
  const [pages, setPages] = useState(allPages);

  //
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredData = pages.filter((item) =>
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
      <h2 className="text-2xl font-bold">Pages</h2>

      {/* Pages Stats - Displays the total number of pages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Pages</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <FileText className="h-8 w-8 text-blue-500" />
            <span className="text-2xl font-bold">{allPages.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Pages Table */}
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
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((page, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.key} className="border p-3">
                    {column.key === "elements"
                      ? page.elements.join(", ") // Handle array formatting for elements
                      : page[column.key] || "N/A"}
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
}
