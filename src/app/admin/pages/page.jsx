import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import React from 'react'

//Pages data
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
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Page Name</th>
              <th className="border p-3 text-left">Elements</th>
            </tr>
          </thead>
          <tbody>
            {allPages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="border p-3">{page.name}</td>
                <td  className="border p-3">{page.elements.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
