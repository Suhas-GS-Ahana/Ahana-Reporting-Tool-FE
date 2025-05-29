"use client";

import BackButton from "@/components/BackButton";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function AddConnection() {
  // State Variables
  const [newConnectionData, setNewConnectionData] = useState({
    connectionName: "",
    hostName: "",
    portNumber: "",
    databaseName: "",
    userName: "",
    password: "",
  }); //holds the values for all the input fields
  const [isSubmitting, setIsSubmitting] = useState(false); //prevents multiple submissions
  const [errors, setErrors] = useState({}); //stores validation errors for each input field

  const {toast} = useToast();
  const router = useRouter();

  // Updates the form data when any input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewConnectionData({
      ...newConnectionData,
      [name]: value,
    });
  };

  // Checks if all required fields are filled
  const validateForm = () => {
    const newErrors = {};
    if (!newConnectionData.connectionName)
      newErrors.connectionName = "Connection Name is required";
    if (!newConnectionData.hostName)
      newErrors.hostName = "Host Name is required";
    if (!newConnectionData.portNumber)
      newErrors.portNumber = "Port Number is required";
    if (!newConnectionData.databaseName)
      newErrors.databaseName = "Database Name is required";
    if (!newConnectionData.userName)
      newErrors.userName = "User Name is required";
    if (!newConnectionData.password)
      newErrors.password = "Password is required";
    return newErrors;
  };

  //---------------------
  const handleSaveConnection = async (formData) => {
    const payload = {
      p_inserted_by: 1,
      p_modified_by: 1,
      p_connection_name: formData.connectionName,
      p_database_type: "PostgreSQL",
      p_server_name: formData.hostName,
      p_port_number: parseInt(formData.portNumber, 10),
      p_database_name: formData.databaseName,
      p_server_login: formData.userName,
      p_password: formData.password,
      p_filepath: "/path/to/database/file",
      p_is_cloud: false,
      p_is_onpremise: true,
      p_is_connection_encrypted: true,
      p_is_active: true,
      p_is_deleted: false,
      p_expiry_date: "2025-12-31T23:59:59.999Z",
    };

    try {
      const response = await fetch(`${baseURL}/connection-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 200) {
        toast({
          title: "Saving Connection",
          description: "Connection details saved successfully",
        });

        router.push(`/connections`);
        return; // Success - no error thrown
      } else if (response.status === 400) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Connection already exists",
        });
        throw new Error("Connection already exists");
      } else if (response.status === 500) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid connection",
        });
        throw new Error("Invalid connection");
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
        error.message.includes("Connection already exists") ||
        error.message.includes("Invalid connection") ||
        error.message.includes("Unexpected error")
      ) {
        throw error; // Re-throw API errors
      }

      // Handle network/fetch errors
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save connection - network error",
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
      await handleSaveConnection(newConnectionData);

      // Only reset form and clear errors on successful save
      setNewConnectionData({
        connectionName: "",
        hostName: "",
        portNumber: "",
        databaseName: "",
        userName: "",
        password: "",
      });
      setErrors({});
    } catch (error) {
      // Set form error to display to user
      setErrors({
        submit: error.message || "Failed to save connection",
      });
    } finally {
      // Always reset submitting state
      setIsSubmitting(false);
    }
  };

  const handleSkip = ()=>{
    router.push(`/connections`)
  }

  // Saving a New Connection (/connection-save)
  // const handleSaveConnection = async (formData) => {
  //   const payload = {
  //     p_inserted_by: 1,
  //     p_modified_by: 1,
  //     p_connection_name: formData.connectionName,
  //     p_database_type: "PostgreSQL",
  //     p_server_name: formData.hostName,
  //     p_port_number: parseInt(formData.portNumber, 10),
  //     p_database_name: formData.databaseName,
  //     p_server_login: formData.userName,
  //     p_password: formData.password,
  //     p_filepath: "/path/to/database/file",
  //     p_is_cloud: false,
  //     p_is_onpremise: true,
  //     p_is_connection_encrypted: true,
  //     p_is_active: true,
  //     p_is_deleted: false,
  //     p_expiry_date: "2025-12-31T23:59:59.999Z",
  //   };

  //   try {
  //     const response = await fetch(`${baseURL}/connection-save`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.status === 200) {
  //       toast({
  //         title: "Saving Connection",
  //         description: "Connection details saved successfully",
  //       });

  //       setShowConnectionForm(false);
  //       router.push(`/configurations`);
  //     } else if (response.status === 400) {
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: "Connection already exists",
  //       });
  //     } else if (response.status === 500) {
  //       toast({
  //         variant: "destructive",
  //         title: "Error",
  //         description: "Invalid connection",
  //       });
  //     } else {
  //       throw new Error("Unexpected error");
  //     }
  //   } catch (error) {
  //     toast({
  //       variant: "destructive",
  //       title: "Error",
  //       description: "Failed to save connection",
  //     });
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formErrors = validateForm();
  //   if (Object.keys(formErrors).length > 0) {
  //     setErrors(formErrors);
  //     return;
  //   }
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);

  //   await handleSaveConnection(newConnectionData);

  //   setIsSubmitting(false);
  //   setNewConnectionData({
  //     connectionName: "",
  //     hostName: "",
  //     portNumber: "",
  //     databaseName: "",
  //     userName: "",
  //     password: "",
  //   });
  //   setErrors({});
  // };

  return (
    <div className="relative">
      {/* Back Button */}
      <BackButton />

      {/* Add Data Source Form Card*/}
      <div className="relative max-w-3xl mx-auto bg-white shadow-md rounded-md p-8 border">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Add a New Data Source
        </h1>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Connection Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connection Name
            </label>
            <Input
              name="connectionName"
              placeholder="Enter connection name"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newConnectionData.connectionName}
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
              value={newConnectionData.hostName}
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
              value={newConnectionData.portNumber}
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
              value={newConnectionData.databaseName}
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
                value={newConnectionData.userName}
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
                value={newConnectionData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Submit & Skip Butttons */}
          <div className="flex space-x-4 mt-6">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm"
              disabled={isSubmitting}
            >
              Save Connection
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="bg-gray-500 hover:bg-gray-700 text-white font-medium px-6 py-2 rounded-lg shadow-sm"
              onClick={handleSkip}
            >
              Skip & Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
