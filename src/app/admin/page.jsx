import { Users, Shield, FileText, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Users className="h-8 w-8 text-[hsl(var(--icon-color))]" />
            <span className="text-2xl font-bold">1,250</span>
          </CardContent>
        </Card>

        {/* Total Roles */}
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Roles</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Shield className="h-8 w-8 text-[hsl(var(--icon-color))]" />
            <span className="text-2xl font-bold">12</span>
          </CardContent>
        </Card>

        {/* Pages Managed */}
        <Card className="shadow-md hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Pages Managed</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <FileText className="h-8 w-8 text-[hsl(var(--icon-color))]" />
            <span className="text-2xl font-bold">50</span>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/users">
          <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--button-color))]  text-white rounded-lg shadow-md hover:bg-[hsl(var(--button-color-hover))] transition">
          <Users className="w-4 h-4" /> Manage Users
          </button>
        </Link>
        <Link href="/admin/roles">
          <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--button-color))]  text-white rounded-lg shadow-md hover:bg-[hsl(var(--button-color-hover))] transition">
            <Shield className="w-4 h-4" /> Manage Roles
          </button>
        </Link>
        <Link href="/admin/pages">
          <button className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--button-color))]  text-white rounded-lg shadow-md hover:bg-[hsl(var(--button-color-hover))] transition">
            <FileText className="w-4 h-4" /> Edit Page Access
          </button>
        </Link>
      </div>
    </div>
  );
}
