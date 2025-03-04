"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Plus, Save, Trash2, ChevronDown, Database, ArrowRight, Server, Globe, Plug, LayoutList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Play } from "lucide-react"
import { useConnection } from "@/contexts/ConnectionContext"
import SchemaSelector from "../configurations/SchemaSelector"
import ConnectionDetails from "../configurations/ConnectionDetails"

export default function NewProcess() {
  const [schemaDetails, setSchemaDetails] = useState([])
  const [tableDetails, setTableDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const { setSchemasDetails } = useConnection()
  const { toast } = useToast()
  const { connectionsDetails, schemasDetails } = useConnection()
  const searchParams = useSearchParams()
  const connectionName = searchParams.get("connectionName")
  const [connectionDetails, setConnectionDetails] = useState(null)
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [processes, setProcesses] = useState([
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

  const handleAddProcess = () => {
    const newProcess = {
      id: Date.now(),
      name: `Process ${processes.length + 1}`,
      subProcesses: [],
    }
    setProcesses([...processes, newProcess])
  }

  const handleAddSubProcess = (processId) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          const subProcessId = process.subProcesses.length + 1
          process.subProcesses.push({
            id: Date.now(),
            name: `Sub Process ${subProcessId}`,
            type: "",
            steps: [{
              id: Date.now(),
              description: "",
              query: "",
            }],
          })
        }
        return process
      }),
    )
  }

  const handleDeleteProcess = (processId) => {
    setProcesses(processes.filter((process) => process.id !== processId))
  }

  const handleDeleteSubProcess = (processId, subProcessId) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          process.subProcesses = process.subProcesses.filter((subProcess) => subProcess.id !== subProcessId)
        }
        return process
      }),
    )
  }

  const handleSave = () => {
    toast({
      title: "Query Saved",
      description: "The query has been successfully saved.",
    })
  }

  let lastAssignedColor = "";
  const getSubProcessBgColor = (processId) => {
    const colors = ["bg-red-50", 
    "bg-yellow-50", 
    "bg-green-50", 
    "bg-blue-50", 
    "bg-purple-50", 
    "bg-pink-50", 
    "bg-orange-50", 
    "bg-teal-50", 
    "bg-indigo-50", 
    "bg-cyan-50"];
    let availableColors = colors.filter(color => color !== lastAssignedColor); // Exclude the last used color
  let selectedColor = availableColors[processId % availableColors.length]; // Pick a color

  lastAssignedColor = selectedColor; // Update the last used color
  return selectedColor;
  };
  

  const handleProcessNameChange = (processId, newName) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          return { ...process, name: newName }
        }
        return process
      })
    )
  }

  const handleSubProcessNameChange = (processId, subProcessId, newName) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          return {
            ...process,
            subProcesses: process.subProcesses.map((subProcess) => {
              if (subProcess.id === subProcessId) {
                return { ...subProcess, name: newName }
              }
              return subProcess
            })
          }
        }
        return process
      })
    )
  }

  const handleSubProcessTypeChange = async (processId, subProcessId, newType) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          return {
            ...process,
            subProcesses: process.subProcesses.map((subProcess) => {
              if (subProcess.id === subProcessId) {
                return { ...subProcess, type: newType }
              }
              return subProcess
            })
          }
        }
        return process
      })
    )

    // if(newType === "import") {
    //   await callImportAPI()
    // }
  }

  const callImportAPI = async () => {

    const payload = {
      ds_name: connectionsDetails[0],
      ds_server: connectionsDetails[1],
      ds_port: connectionsDetails[2],
      ds_type: connectionsDetails[3],
      ds_db: connectionsDetails[4],
      ds_schema: schemasDetails.map(schema => schema.get_connectionschema)
    }
    try {
        const response = await fetch("http://localhost:8000/save_connection", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload)
        })

        if(!response.ok) {
          throw new Error("Failed to save connection")
        }

        const data = await response.json()
        console.log("Import API response:", data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to call import API",
      })
    }
  }
 


  const handleAddStep = (processId, subProcessId) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          return {
            ...process,
            subProcesses: process.subProcesses.map((subProcess) => {
              if (subProcess.id === subProcessId) {
                return {
                  ...subProcess,
                  steps: [...subProcess.steps, {
                    id: Date.now(),
                    description: "",
                    query: "",
                  }]
                }
              }
              return subProcess
            })
          }
        }
        return process
      })
    )
  }

  const handleDeleteStep = (processId, subProcessId, stepId) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          return {
            ...process,
            subProcesses: process.subProcesses.map((subProcess) => {
              if (subProcess.id === subProcessId) {
                return {
                  ...subProcess,
                  steps: subProcess.steps.filter((step) => step.id !== stepId)
                }
              }
              return subProcess
            })
          }
        }
        return process
      })
    )
  }

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
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={handleAddProcess} className='bg-blue-950'>
          <Plus className="mr-2 h-4 w-4" />
          Add Process
        </Button>
        <Button variant="secondary" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save & Continue
        </Button>
      </div>

      {processes.map((process) => (
        <Card key={process.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Input 
                value={process.name}
                onChange={(e) => handleProcessNameChange(process.id, e.target.value)}
                className="text-xl font-semibold w-[200px]"
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleAddSubProcess(process.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteProcess(process.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.subProcesses.map((subProcess) => (
              <Card key={subProcess.id} className={getSubProcessBgColor(subProcess.id)}>
                <Collapsible>
                  <CardHeader className="pb-3">
                    <CollapsibleTrigger asChild className="flex w-full items-center justify-between">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex gap-4 items-center">
                          <Input 
                            value={subProcess.name}
                            onChange={(e) => handleSubProcessNameChange(process.id, subProcess.id, e.target.value)}
                            className="text-base font-semibold w-[200px] bg-white"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSubProcess(process.id, subProcess.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {subProcess.steps.map((step, index) => (
                        <div key={step.id} className="space-y-2 p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <h3 className="font-semibold">Step {index + 1}</h3>
                              <Select 
                                value={subProcess.type} 
                                onValueChange={(value) => handleSubProcessTypeChange(process.id, subProcess.id, value)}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <SelectTrigger className="w-[180px] bg-white">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="import">Import</SelectItem>
                                  <SelectItem value="process">Process</SelectItem>
                                  <SelectItem value="export">Export</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteStep(process.id, subProcess.id, step.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {subProcess.type === "import" || subProcess.type === "export" ? (
                            <div className="flex gap-4">
                              <Card className="flex-1">
                                <CardHeader>
                                  <CardTitle>Source DB</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center gap-2">
                                    <Database className="h-6 w-6" />
                                    <div>
                                      <div className="flex flex-wrap gap-2 items-center">
                                        <Badge variant="outline" className="text-xs bg-blue-100 text-blue-600 flex items-center gap-1 px-2 py-1">
                                          <Server className="w-3 h-3" /> Name: {connectionsDetails[0]}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs bg-green-100 text-green-600 flex items-center gap-1 px-2 py-1">
                                          <Globe className="w-3 h-3" /> Server: {connectionsDetails[1]}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-600 flex items-center gap-1 px-2 py-1">
                                          <Plug className="w-3 h-3" /> Port: {connectionsDetails[2]}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs bg-purple-100 text-purple-600 flex items-center gap-1 px-2 py-1">
                                          <LayoutList className="w-3 h-3" /> Type: {connectionsDetails[3]}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs bg-red-100 text-red-600 flex items-center gap-1 px-2 py-1">
                                          <Database className="w-3 h-3" /> Database: {connectionsDetails[4]}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid gap-2 mt-8">
                                    <SchemaSelector schemaDetails={schemaDetails} onSchemaSelect={handleSchemaSelect} />
                                  </div>
                                  {tableDetails.length > 0 && (
                                    <div className="grid gap-2 mt-8">
                                      <Select multiple>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select tables" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {tableDetails.map((table) => (
                                            <SelectItem key={table.table_name} value={table.table_name}>
                                              {table.table_name}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                              <ArrowRight className="h-6 w-6 self-center" />
                              <Card className="flex-1">
                                <CardHeader>
                                  <CardTitle>Destination DB</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center gap-2">
                                    <Database className="h-6 w-6" />
                                    <div>
                                    <div className="grid gap-4">
              <div className="grid gap-2">
                <Select onValueChange={handleConnectionSelect} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((connection) => (
                      <SelectItem key={connection.connection_name} value={connection.connection_name}>
                        {connection.connection_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {connectionDetails && <ConnectionDetails connectionDetails={connectionDetails} />}
            </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ) : subProcess.type === "process" ? (
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Input placeholder="Step description" value={step.description} className="bg-white" />
                              <Label className='pt-5'>SQL Query</Label>
                              <Textarea placeholder="Enter SQL query" value={step.query} rows={3} className="bg-white" />
                              <Button>
                                <Play className="mr-2 h-4 w-4" />
                                Run Query
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      ))}
                      <Button variant="outline" onClick={() => handleAddStep(process.id, subProcess.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Step
                      </Button>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
      <Toaster />
    </div>
  )
}