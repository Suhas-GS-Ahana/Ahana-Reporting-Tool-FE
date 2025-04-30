// This Configurations component handles the configuration of data source connections such as databases.
// This allows a user to: Fetch and view existing data source connections, Select one to view its details,
// Add a new connection, Proceed to the next step (process creation)

// API called - /connection, /connection-view, /connection-save

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useConnection } from "@/contexts/ConnectionContext";
import Link from "next/link";
import ConnectionForm from "./ConnectionForm";
import ConnectionDetails from "./ConnectionDetails";
import { BadgePlus, PlusCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function Configurations() {
  // State Variables
  const [connections, setConnections] = useState([]); //  all data source connections
  const [selectedConnection, setSelectedConnection] = useState(null); // selected connection ID
  const [connectionsDetails, setConnectionsDetails] = useState(null); // selected connection details
  const [loading, setLoading] = useState(false);
  const [showConnectionForm, setShowConnectionForm] = useState(false); // For Add Form visibility

  // updates the context so other components can access connection details
  const { connectionDetails, setConnectionDetails } = useConnection(); // selected connection details (global)
  const { toast } = useToast();
  const router = useRouter();

  // To run fetchConnections function on load
  useEffect(() => {
    fetchConnections();
  }, []);

  // Fetches existing connections from the backend (/connection)
  // sets - connections
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/connection`);
      if (!response.ok) {
        throw new Error("Failed to fetch connections"); //-----------------(doubt)
      }
      const { data } = await response.json();
      setConnections(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connections",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Connection Selection  (/connection-view)
  // (setting - selectedConnection,connectionDetails,connectionsDetails)
  const handleConnectionSelect = async (dataSourcesId) => {
    setLoading(true);
    setSelectedConnection(dataSourcesId);
    try {
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${dataSourcesId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch connection details");
      }
      const { data } = await response.json();
      setConnectionsDetails(data); //save details in state
      setConnectionDetails(data); //save details in context
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connection details",
      });
    } finally {
      setLoading(false);
    }
  };

  // Saving a New Connection (/connection-save)
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

        setShowConnectionForm(false);
        router.push(`/configurations`);
      } else if (response.status === 400) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Connection already exists",
        });
      } else if (response.status === 500) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid connection",
        });
      } else {
        throw new Error("Unexpected error");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save connection",
      });
    }
  };

  // Show Connection Form (Add New)
  if (showConnectionForm) {
    return (
      <ConnectionForm
        onSaveConnection={handleSaveConnection}
        onSkip={() => setShowConnectionForm(false)}
        onBack={() => setShowConnectionForm(false)}
      />
    );
  }

  return (
    <div className="relative space-y-6 px-6 py-6 ">
      {/* Back Button */}
      <div className="absolute top-0 left-0">
        <BackButton />
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configure Your Data Source
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose an existing data source or add a new one to begin.
        </p>
      </div>

      {/* Card */}
      <div>
        <Card className="rounded-md shadow-md hover:shadow-lg transition">
          {/* Header */}
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="space-y-1">
              <CardTitle>Data Source Configuration</CardTitle>
              <CardDescription>Select your database</CardDescription>
            </div>
            {/* Add New Connection Button */}
            <div>
              <Button
                onClick={() => setShowConnectionForm(true)}
                className="shadow-sm hover:bg-gray-500 rounded-full px-4 py-2 transition"
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Connection
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-6">
            {/* Dropdown & Connection Details */}
            <div className="grid gap-4">
              {/* Dropdown to Select Connection */}
              <div className="grid gap-2">
                <Select
                  onValueChange={handleConnectionSelect}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((connection) => (
                      <SelectItem
                        key={connection.data_sources_id}
                        value={String(connection.data_sources_id)}
                      >
                        {connection.connection_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Display connection details */}
              {connectionsDetails && (
                <ConnectionDetails connectionDetails={connectionDetails} />
              )}
            </div>

            {/* Process Button */}
            <Link href={`/new-process?connectionName=${selectedConnection}`}>
              <Button
                disabled={!selectedConnection || loading}
                className="mt-5 hover:bg-gray-500 shadow-sm"
              >
                Click to Process
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// SchemaSelector.jsx currently not used
