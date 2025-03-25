"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

//Pages data
const allPages = [
  { name: "Dashboard", elements: ["Button 1", "Button 2", "Input 1"] },
  { name: "Users", elements: ["Add User", "Delete User", "Edit User"] },
  { name: "Settings", elements: ["Toggle Dark Mode", "Change Password"] },
  {
    name: "Reports",
    elements: ["Generate Report", "Download PDF", "Filter Data"],
  },
  {
    name: "Orders",
    elements: ["Create Order", "Cancel Order", "Track Order"],
  },
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


export default function EditRoleModal({ role, onClose, onUpdate }) {
  // State Variables
  const [roleName, setRoleName] = useState(role.name); // Stores the new name of the role
  const [selectedPages, setSelectedPages] = useState(role.permissions); // Keeps track of selected pages and their elements
  const [openDropdown, setOpenDropdown] = useState(null); // Controls which dropdown is open

   // Toggle dropdown for a page
  const toggleDropdown = (page) => {
    setOpenDropdown(openDropdown === page ? null : page);
  };
  
  // Select/Deselect All Pages & Elements
  const handleSelectAll = () => {
    const allSelected =
      Object.keys(selectedPages).length === allPages.length &&
      allPages.every(
        (page) => selectedPages[page.name]?.length === page.elements.length
      );

    if (allSelected) {
      setSelectedPages({});
    } else {
      const newSelection = {};
      allPages.forEach((page) => {
        newSelection[page.name] = page.elements;
      });
      setSelectedPages(newSelection);
    }

    // Close all dropdowns to force UI refresh
    setOpenDropdown(null);
  };

  // Select/Deselect a Page
  const handlePageSelect = (page) => {
    setSelectedPages((prev) => {
      const allElements = allPages.find((p) => p.name === page).elements;
      return prev[page]?.length === allElements.length
        ? { ...prev, [page]: [] }
        : { ...prev, [page]: allElements };
    });
  };

  // Select/Deselect an Individual Element
  const handleElementSelect = (page, element) => {
    setSelectedPages((prev) => {
      const updatedPage = prev[page] || [];
      return {
        ...prev,
        [page]: updatedPage.includes(element)
          ? updatedPage.filter((el) => el !== element)
          : [...updatedPage, element],
      };
    });
  };

  // Handle Save Role
  const handleSave = () => {
    if (!roleName.trim()) {
      alert("Please enter a role name.");
      return;
    }
    onUpdate({ ...role, name: roleName, permissions: selectedPages });
    onClose();
  };

    // Check if "Select All" should be checked
    const isAllSelected =
    Object.keys(selectedPages).length === allPages.length &&
    allPages.every(
      (page) => selectedPages[page.name]?.length === page.elements.length
    );


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Edit Role</h3>

        {/* Role Name Input */}
        <label className="block mb-2 font-medium">Role Name:</label>
        <input
          type="text"
          value={roleName ?? ""}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full border p-2 rounded-md mb-4"
          placeholder="Enter role name"
        />

        {/* Select All Pages & Elements */}
        <label className="block mb-2 font-medium flex items-center gap-2">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="cursor-pointer"
          />
          Select All Pages & Elements
        </label>

        {/* Page & Element Selection */}
        <div className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
          {allPages.map((page) => {
            const allElements = page.elements;
            const allSelected =
              selectedPages[page.name]?.length === allElements.length;

            return (
              <div key={page.name} className="relative border p-2 rounded-md">
                {/* Page Checkbox & Dropdown Toggle */}
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleDropdown(page.name)}
                >
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => handlePageSelect(page.name)}
                      className="cursor-pointer"
                    />
                    <span className="font-medium">{page.name}</span>
                  </label>
                  <ChevronDown className="w-4 h-4" />
                </div>

              {/* Elements Dropdown */}
              {openDropdown === page.name && (
                  <div className="mt-2 p-2 border rounded-md bg-gray-50">
                    {allElements.map((element) => (
                      <label key={element} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={(selectedPages[page.name] ?? []).includes(
                            element
                          )}
                          onChange={() =>
                            handleElementSelect(page.name, element)
                          }
                          className="cursor-pointer"
                        />
                        {element}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Save & Close Buttons */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
