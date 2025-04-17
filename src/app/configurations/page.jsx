"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { useConnection } from "@/contexts/ConnectionContext"
import ConnectionForm from "./ConnectionForm"
import ConnectionDetails from "./ConnectionDetails"
import { BadgePlus } from "lucide-react"


const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function Configurations() {
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connectionDetails, setConnectionDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showConnectionForm, setShowConnectionForm] = useState(false)
  const { setConnectionsDetails } = useConnection()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${baseURL}/connection`)
      if (!response.ok) {
        throw new Error("Failed to fetch connections")
      }
      const data = await response.json()
      setConnections(data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connections",
      })
    } finally {
      setLoading(false)
    }
  }
  console.log(connections)

  const handleConnectionSelect = async (dataSourcesId) => {
    setLoading(true)
    setSelectedConnection(dataSourcesId)
    try {
      const response = await fetch(`${baseURL}/connection-view?conn_id=${dataSourcesId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch connection details")
      }
      const data = await response.json()
      setConnectionDetails(data.data)
      setConnectionsDetails(data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connection details",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async (formData) => {
    const existingConnection = connections.find(connection => connection.connection_name === formData.connectionName)
    const url = existingConnection ? `http://localhost:8000/test_connection?conn_id=${existingConnection.id}` : "http://localhost:8000/test_connection"
    const payload = existingConnection ? {} : formData

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to test connection")
      }

      toast({
        title: "Testing Connection",
        description: "Connection test initiated...",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to test connection",
      })
    }
  }

  const handleSaveConnection = async (formData) => {
    const payload = {
      p_inserted_by: 1,
      p_modified_by: 1,
      p_connection_name: formData.connectionName,
      p_database_type: "postgresql",
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
    }
    try {
      const response = await fetch(`${baseURL}/connection-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error("Failed to save connection")
      }
    
      toast({
        title: "Saving Connection",
        description: "Connection details saved successfully",
      })

      // Reset form data
      setShowConnectionForm(false)

      // Redirect to process page with connectionName as query parameter
      router.push(`/new-process?connectionName=${formData.connectionName}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save connection",
      })
    }
  }

  if (showConnectionForm) {
    return (
      <ConnectionForm
        onTestConnection={handleTestConnection}
        onSaveConnection={handleSaveConnection}
        onSkip={() => setShowConnectionForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Select DataSource & Table</h1>
        <p className="text-muted-foreground">Configure your data source and select tables for processing.</p>
      </div>
      <div className="">
        <Card>
          <CardHeader className='flex flex-row justify-between items-center'>
            <div>
            <CardTitle>Data Source Configuration</CardTitle>
            <CardDescription>Select your database</CardDescription>
            </div>
            <div>
            <Button onClick={() => setShowConnectionForm(true)} className="bg-blue-950 hover:bg-blue-900">
            <BadgePlus /> Add New Data Source
            </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Select onValueChange={handleConnectionSelect} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((connection) => (
                      <SelectItem key={connection.data_sources_id} value={String(connection.data_sources_id)}>
                        {connection.connection_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {connectionDetails && <ConnectionDetails connectionDetails={connectionDetails} />}
            </div>

            <Link href={`/new-process?connectionName=${selectedConnection}`}>
              <Button disabled={!selectedConnection || loading} className="mt-5">
                Click to Process
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}