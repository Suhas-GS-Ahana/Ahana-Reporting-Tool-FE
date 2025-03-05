"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useConnection } from "@/contexts/ConnectionContext"
import ProcessList from "./components/ProcessList"

export default function NewProcess() {
  const [schemaDetails, setSchemaDetails] = useState([])
  const [tableDetails, setTableDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const [connectionDetails, setConnectionDetails] = useState(null)
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const { toast } = useToast()
  const { connectionsDetails, schemasDetails, setSchemasDetails } = useConnection()
  const searchParams = useSearchParams()
  const connectionName = searchParams.get("connectionName")
  const [initialProcesses, setInitialProcesses] = useState([
    {
      id: 1,
      name: "Process 1",
      subProcesses: [
        {
          id: 1,
          name: "Sub Process 1",
          type: "", // Initially no type selected
          steps: [
            {
              id: 1,
              description: "",
              query: "",
            }
          ],
        },
      ],
    },
  ])

  useEffect(() => {
    if (connectionName) {
      fetchSchemaDetails(connectionName)
    }
  }, [connectionName])

  const fetchSchemaDetails = async (connectionName) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/get_connectionschema?name=${connectionName}`)
      if (!response.ok) {
        throw new Error("Failed to fetch connection schema")
      }
      const data = await response.json()
      setSchemaDetails(data.data)
      setSchemasDetails(data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connection schema",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSchemaSelect = async (schema) => {
    try {
      const response = await fetch(`http://localhost:8000/get_tables?conn_name=${connectionName}&schema_name=${schema}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tables")
      }
      const data = await response.json()
      setTableDetails(data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tables",
      })
    }
  }

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/view_all_connections")
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

  const handleConnectionSelect = async (connectionName) => {
    setLoading(true)
    setSelectedConnection(connectionName)
    try {
      const response = await fetch(`http://localhost:8000/view_connection?name=${connectionName}`)
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

  return (
   <ProcessList 
      initialProcesses={initialProcesses}
      connectionsDetails={connectionsDetails}
      schemasDetails={schemasDetails}
      schemaDetails={schemaDetails}
      handleSchemaSelect={handleSchemaSelect}
      tableDetails={tableDetails}
      connections={connections}
      handleConnectionSelect={handleConnectionSelect}
      connectionDetails={connectionDetails}
    />
  )
}

