"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen p-6">
      {/* Heading */}
      <div className="mb-10 ">
        <h1 className="text-2xl font-semibold text-black mb-4 tracking-tight">
          OMPD - Orchestrated Multi-source Processing & Delivery
        </h1>
        <p className="text-sm text-gray-700 max-w-3xl">
          Enabling seamless data extraction, transformation, and loading
          from multiple external sources. Build and automate robust data
          workflows with easy configuration and execution.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Card */}
        <Card
          className="rounded-md shadow-md cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/connections")}
        >
          <CardContent className="p-6 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold">Configuration</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add and manage data source connections. Create ETL processes to
              automate data flow.
            </p>
            <Button className="bg-gray-700">Go to Data Configuration</Button>
          </CardContent>
        </Card>

        {/* Process Card */}
        <Card
          className="rounded-md shadow-md cursor-pointer hover:shadow-lg transition"
          onClick={() => router.push("/process")}
        >
          <CardContent className="p-6 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-blue-500" />
              <h2 className="text-lg font-semibold">Process</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage and execute business processes like NPA analysis with
              robust reporting options.
            </p>  
            <Button className="bg-gray-700">Go to Process Configuration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

