"use client";

import BackButton from "@/components/BackButton";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function EditConnection() {
  // State Variables
  const [connectionData, setConnectionData] = useState({
    connectionName: "",
    hostName: "",
    portNumber: "",
    databaseName: "",
    userName: "",
    password: "",
  }); // holds the values for all the input fields
  const [isSubmitting, setIsSubmitting] = useState(false); // prevents multiple submissions
  const [isLoading, setIsLoading] = useState(true); // loading state for initial data fetch
  const [errors, setErrors] = useState({}); // stores validation errors for each input field

  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const connectionId = params.id;

  // Fetch existing connection data
  useEffect(() => {
    const fetchConnectionData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${baseURL}/connection-view?conn_id=${connectionId}`
        );

        if (response.ok) {
          const result = await response.json();
          if (result.status === "success" && result.data) {
            setConnectionData({
              connectionName: result.data.connection_name || "",
              hostName: result.data.server_name || "",
              portNumber: result.data.port_number?.toString() || "",
              databaseName: result.data.database_name || "",
              userName: "", // Username not returned by API, keep empty
              password: "",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch connection data",
          });
          router.push("/connections");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch connection data - network error",
        });
        router.push("/connections");
      } finally {
        setIsLoading(false);
      }
    };

    if (connectionId) {
      fetchConnectionData();
    }
  }, [connectionId, toast, router]);

  // Updates the form data when any input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConnectionData({
      ...connectionData,
      [name]: value,
    });
  };

  // Checks if all required fields are filled
  const validateForm = () => {
    const newErrors = {};
    if (!connectionData.connectionName)
      newErrors.connectionName = "Connection Name is required";
    if (!connectionData.hostName) newErrors.hostName = "Host Name is required";
    if (!connectionData.portNumber)
      newErrors.portNumber = "Port Number is required";
    if (!connectionData.databaseName)
      newErrors.databaseName = "Database Name is required";
    if (!connectionData.userName) newErrors.userName = "User Name is required";
    if (!connectionData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  // Handle connection update
  const handleUpdateConnection = async (formData) => {
    const payload = {
      p_inserted_by: 0,
      p_modified_by: 1,
      p_connection_name: formData.connectionName,
      p_database_type: "PostgreSQL",
      p_server_name: formData.hostName,
      p_port_number: parseInt(formData.portNumber, 10),
      p_database_name: formData.databaseName,
      p_server_login: formData.userName,
      p_password: formData.password,
      p_filepath: "/path/to/database/file",
      p_expiry_date: "2025-12-31T23:59:59.999Z",
      p_is_cloud: false,
      p_is_onpremise: true,
      p_is_connection_encrypted: true,
      p_is_deleted: false,
      p_is_active: true,
    };

    try {
      const response = await fetch(
        `${baseURL}/connection-update?con_id=${connectionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 200) {
        toast({
          title: "Connection Updated",
          description: "Connection details updated successfully",
        });

        router.push(`/connections`);
        return; // Success - no error thrown
      } else if (response.status === 400) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid connection data",
        });
        throw new Error("Invalid connection data");
      } else if (response.status === 500) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update connection",
        });
        throw new Error("Failed to update connection");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unexpected error occurred",
        });
        throw new Error(`Unexpected error: ${response.status}`);
      }
    } catch (error) {
      // Handle network errors or re-throw API errors
      if (
        error.message.includes("Invalid connection data") ||
        error.message.includes("Failed to update connection") ||
        error.message.includes("Unexpected error")
      ) {
        throw error; // Re-throw API errors
      }

      // Handle network/fetch errors
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update connection - network error",
      });
      throw new Error("Network error occurred");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await handleUpdateConnection(connectionData);
      setErrors({});
    } catch (error) {
      // Set form error to display to user
      setErrors({
        submit: error.message || "Failed to update connection",
      });
    } finally {
      // Always reset submitting state
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/connections`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative">
        <BackButton />
        <div className="relative max-w-3xl mx-auto bg-white shadow-md rounded-md p-8 border">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">
              Loading connection data...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back Button */}
      <BackButton />

      {/* Edit Data Source Form Card*/}
      <div className="relative max-w-3xl mx-auto bg-white shadow-md rounded-md p-8 border">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Edit Data Source Connection
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Connection Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Name
            </label>
            <Input
              name="connectionName"
              placeholder="Enter connection name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={connectionData.connectionName}
              onChange={handleChange}
            />
            {errors.connectionName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.connectionName}
              </p>
            )}
          </div>

          {/* Database Host */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Host
            </label>
            <Input
              name="hostName"
              placeholder="e.g., 127.0.0.1"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={connectionData.hostName}
              onChange={handleChange}
            />
            {errors.hostName && (
              <p className="text-sm text-red-600 mt-1">{errors.hostName}</p>
            )}
          </div>

          {/* Database Port */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Port
            </label>
            <Input
              name="portNumber"
              placeholder="e.g., 5432"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={connectionData.portNumber}
              onChange={handleChange}
            />
            {errors.portNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.portNumber}</p>
            )}
          </div>

          {/* Database Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database Name
            </label>
            <Input
              name="databaseName"
              placeholder="e.g., my_database"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={connectionData.databaseName}
              onChange={handleChange}
            />
            {errors.databaseName && (
              <p className="text-sm text-red-600 mt-1">{errors.databaseName}</p>
            )}
          </div>

          {/* User Name and Password */}
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User Name
              </label>
              <Input
                name="userName"
                placeholder="e.g., postgres"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={connectionData.userName}
                onChange={handleChange}
              />
              {errors.userName && (
                <p className="text-sm text-red-600 mt-1">{errors.userName}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Enter password"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={connectionData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Display general submit errors */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Update & Cancel Buttons */}
          <div className="flex space-x-4 mt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Connection"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-2 rounded-lg shadow-sm border border-gray-300"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
