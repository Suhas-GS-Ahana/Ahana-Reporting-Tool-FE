"use client"

const userLogs = [
  {
    log_id: 1,
    user_id: 1,
    user_email: "john@example.com",
    action_type: "Login",
    timestamp: "2025-03-03T08:30:00Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 2,
    user_id: 2,
    user_email: "jane@example.com",
    action_type: "Login",
    timestamp: "2025-03-03T08:45:12Z",
    ip_address: "192.168.1.15",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 3,
    user_id: 3,
    user_email: "bob@example.com",
    action_type: "Login",
    timestamp: "2025-03-03T09:00:30Z",
    ip_address: "192.168.1.20",
    status: "Failed",
    details: "Incorrect password attempt.",
  },
  {
    log_id: 4,
    user_id: 1,
    user_email: "john@example.com",
    action_type: "Logout",
    timestamp: "2025-03-03T09:15:45Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "User logged out.",
  },
  {
    log_id: 5,
    user_id: 2,
    user_email: "jane@example.com",
    action_type: "Update Profile",
    timestamp: "2025-03-03T09:30:25Z",
    ip_address: "192.168.1.15",
    status: "Success",
    details: "Updated profile information.",
  },
  {
    log_id: 6,
    user_id: 3,
    user_email: "bob@example.com",
    action_type: "Failed Login",
    timestamp: "2025-03-03T10:05:42Z",
    ip_address: "192.168.1.20",
    status: "Failed",
    details: "Incorrect password attempt.",
  },
  {
    log_id: 7,
    user_id: 1,
    user_email: "john@example.com",
    action_type: "Password Change",
    timestamp: "2025-03-03T10:20:33Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "User changed password successfully.",
  },
  {
    log_id: 8,
    user_id: 2,
    user_email: "jane@example.com",
    action_type: "Logout",
    timestamp: "2025-03-03T10:45:50Z",
    ip_address: "192.168.1.15",
    status: "Success",
    details: "User logged out.",
  },
  {
    log_id: 9,
    user_id: 3,
    user_email: "bob@example.com",
    action_type: "Login",
    timestamp: "2025-03-03T11:10:12Z",
    ip_address: "192.168.1.20",
    status: "Success",
    details: "User logged in successfully.",
  },
  {
    log_id: 10,
    user_id: 1,
    user_email: "john@example.com",
    action_type: "File Upload",
    timestamp: "2025-03-03T11:30:00Z",
    ip_address: "192.168.1.10",
    status: "Success",
    details: "Uploaded report.pdf.",
  },
];

export default function UserLogs() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Logs</h2>

      {/* Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full border border-collapse border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Id</th>
              <th className="border p-3 text-left">User Id</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Action</th>
              <th className="border p-3 text-left">Timestamp</th>
              <th className="border p-3 text-left">IP Address</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {userLogs.map((userlog) => (
              <tr key={userlog.log_id} className="hover:bg-gray-50">
                <td className="border p-3">{userlog.log_id}</td>
                <td className="border p-3">{userlog.user_id}</td>
                <td className="border p-3">{userlog.user_email}</td>
                <td className="border p-3">{userlog.action_type}</td>
                <td className="border p-3">{userlog.timestamp}</td>
                <td className="border p-3">{userlog.ip_address}</td>
                <td className="border p-3">{userlog.status}</td>
                <td className="border p-3">{userlog.details}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
