// This ConnectionForm component is used to collect database connection details
// from a user and handle three possible actions: Test, Save, and Skip

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import BackButton from "@/components/BackButton";

//three callback functions as props: onTestConnection, onSaveConnection, onSkip
const ConnectionForm = ({ onTestConnection, onSaveConnection, onSkip }) => {
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

  // If valid, calls onSaveConnection with the form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    await onSaveConnection(newConnectionData);
    setIsSubmitting(false);
    setNewConnectionData({
      connectionName: "",
      hostName: "",
      portNumber: "",
      databaseName: "",
      userName: "",
      password: "",
    });
    setErrors({});
  };

  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">Add a New Data Source</h1>
    //   <form className="space-y-4" onSubmit={handleSubmit}>
    //     <div>
    //       <label className="block font-semibold mb-1">Enter Connection Name</label>
    //       <Input
    //         name="connectionName"
    //         placeholder="Connection Name"
    //         className="w-full"
    //         value={newConnectionData.connectionName}
    //         onChange={handleChange}
    //       />
    //       {errors.connectionName && <p className="text-red-500 text-sm">{errors.connectionName}</p>}
    //     </div>

    //     <div>
    //       <label className="block font-semibold mb-1">Database Host</label>
    //       <Input
    //         name="hostName"
    //         placeholder="Host name"
    //         className="w-full"
    //         value={newConnectionData.hostName}
    //         onChange={handleChange}
    //       />
    //       {errors.hostName && <p className="text-red-500 text-sm">{errors.hostName}</p>}
    //     </div>

    //     <div>
    //       <label className="block font-semibold mb-1">Database Port</label>
    //       <Input
    //         name="portNumber"
    //         placeholder="Database port"
    //         className="w-full"
    //         value={newConnectionData.portNumber}
    //         onChange={handleChange}
    //       />
    //       {errors.portNumber && <p className="text-red-500 text-sm">{errors.portNumber}</p>}
    //     </div>

    //     <div>
    //       <label className="block font-semibold mb-1">Database Name</label>
    //       <Input
    //         name="databaseName"
    //         placeholder="Database name"
    //         className="w-full"
    //         value={newConnectionData.databaseName}
    //         onChange={handleChange}
    //       />
    //       {errors.databaseName && <p className="text-red-500 text-sm">{errors.databaseName}</p>}
    //     </div>

    //     <div className="flex items-center space-x-4">
    //       <div className="flex-1">
    //         <label className="block font-semibold mb-1">Database User Name</label>
    //         <Input
    //           name="userName"
    //           placeholder="Database user"
    //           className="w-full"
    //           value={newConnectionData.userName}
    //           onChange={handleChange}
    //         />
    //         {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
    //       </div>
    //       <div className="flex-1">
    //         <label className="block font-semibold mb-1">Database Password</label>
    //         <Input
    //           name="password"
    //           type="password"
    //           placeholder="Password"
    //           className="w-full"
    //           value={newConnectionData.password}
    //           onChange={handleChange}
    //         />
    //         {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
    //       </div>
    //     </div>

    //     <div className="flex items-center space-x-4">
    //       {/* <Button type="button" className='bg-blue-950 hover:bg-blue-900' onClick={() => onTestConnection(newConnectionData)}>Test Connection</Button> */}
    //       <Button type="submit" className='bg-blue-950 hover:bg-blue-900' disabled={isSubmitting}>Save Connection</Button>
    //       <Button type="button" variant="destructive" onClick={onSkip}>
    //         Skip & Continue
    //       </Button>
    //     </div>
    //   </form>
    // </div>

    <div className="relative">
      {/* <div className="absolute top-0 left-0">
        <BackButton />
      </div> */}
      <div className="relative max-w-3xl mx-auto bg-white shadow-md rounded-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Add a New Data Source
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              onClick={onSkip}
            >
              Skip & Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionForm;
