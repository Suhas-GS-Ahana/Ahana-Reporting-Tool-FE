"use client"

import { useState } from "react"
import { Plus, Save, FileText, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import ProcessCard from "./ProcessCard"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ProcessList = ({
  initialProcesses,
  connectionsDetails,
  schemasDetails,
  schemaDetails,
  handleSchemaSelect,
  tableDetails,
  connections,
  handleConnectionSelect,
  connectionDetails,
}) => {
  const { toast } = useToast()
  const [processes, setProcesses] = useState(initialProcesses || [])
  const [activeTab, setActiveTab] = useState("processes")

  // Create a map of process colors to ensure each process has its own color
  const [processColors] = useState(() => {
    const colors = [
      "bg-red-50",
      "bg-yellow-50",
      "bg-green-50",
      "bg-blue-50",
      "bg-purple-50",
      "bg-pink-50",
      "bg-orange-50",
      "bg-teal-50",
      "bg-indigo-50",
      "bg-cyan-50",
    ]

    const colorMap = {}
    initialProcesses.forEach((process, index) => {
      colorMap[process.id] = colors[index % colors.length]
    })

    return colorMap
  })

  const getSubProcessBgColor = (subProcessId) => {
    // Use a deterministic approach based on subProcessId
    const colors = [
      "bg-red-50",
      "bg-yellow-50",
      "bg-green-50",
      "bg-blue-50",
      "bg-purple-50",
      "bg-pink-50",
      "bg-orange-50",
      "bg-teal-50",
      "bg-indigo-50",
      "bg-cyan-50",
    ]

    return colors[subProcessId % colors.length]
  }

  const handleAddProcess = () => {
    const newProcessId = Date.now()
    const newProcess = {
      id: newProcessId,
      name: `Process ${processes.length + 1}`,
      subProcesses: [],
    }

    // Assign a color to the new process
    const colors = [
      "bg-red-50",
      "bg-yellow-50",
      "bg-green-50",
      "bg-blue-50",
      "bg-purple-50",
      "bg-pink-50",
      "bg-orange-50",
      "bg-teal-50",
      "bg-indigo-50",
      "bg-cyan-50",
    ]
    processColors[newProcessId] = colors[Object.keys(processColors).length % colors.length]

    setProcesses([...processes, newProcess])
  }

  const handleAddSubProcess = (processId) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          const subProcessId = Date.now()
          process.subProcesses.push({
            id: subProcessId,
            name: `Sub Process ${process.subProcesses.length + 1}`,
            type: "",
            steps: [
              {
                id: Date.now() + 1,
                description: "",
                query: "",
              },
            ],
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
      title: "Process Saved",
      description: "Your process has been successfully saved.",
      variant: "success",
    })
  }

  const handleProcessNameChange = (processId, newName) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          return { ...process, name: newName }
        }
        return process
      }),
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
            }),
          }
        }
        return process
      }),
    )
  }

  const handleSubProcessTypeChange = (processId, subProcessId, stepId, newType) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          return {
            ...process,
            subProcesses: process.subProcesses.map((subProcess) => {
              if (subProcess.id === subProcessId) {
                return {
                  ...subProcess,
                  steps: subProcess.steps.map((step) => {
                    if (step.id === stepId) {
                      return { ...step, type: newType }
                    }
                    return step
                  }),
                }
              }
              return subProcess
            }),
          }
        }
        return process
      }),
    )
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
                  steps: [
                    ...subProcess.steps,
                    {
                      id: Date.now(),
                      type: "", // Initialize with empty type
                      description: "",
                      query: "",
                    },
                  ],
                }
              }
              return subProcess
            }),
          }
        }
        return process
      }),
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
                  steps: subProcess.steps.filter((step) => step.id !== stepId),
                }
              }
              return subProcess
            }),
          }
        }
        return process
      }),
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-100 shadow-sm">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-800">ETL Process Designer</CardTitle>
              <CardDescription>Create and manage your data transformation processes</CardDescription>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddProcess} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Process
              </Button>
              <Button variant="outline" onClick={handleSave} className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Save className="mr-2 h-4 w-4" />
                Save & Continue
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="processes" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-blue-50">
              <TabsTrigger value="processes" className="data-[state=active]:bg-white">
                <FileText className="mr-2 h-4 w-4" />
                Processes
              </TabsTrigger>
              <TabsTrigger value="connections" className="data-[state=active]:bg-white">
                <Database className="mr-2 h-4 w-4" />
                Connections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="processes" className="space-y-6">
              {processes.length === 0 ? (
                <div className="text-center p-12 border border-dashed rounded-lg">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Processes Yet</h3>
                  <p className="text-gray-500 mb-4">Create your first process to get started</p>
                  <Button onClick={handleAddProcess} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Process
                  </Button>
                </div>
              ) : (
                processes.map((process) => (
                  <ProcessCard
                    key={`process-${process.id}`}
                    process={process}
                    onProcessNameChange={handleProcessNameChange}
                    onAddSubProcess={handleAddSubProcess}
                    onDeleteProcess={handleDeleteProcess}
                    onDeleteSubProcess={handleDeleteSubProcess}
                    onSubProcessNameChange={handleSubProcessNameChange}
                    onSubProcessTypeChange={handleSubProcessTypeChange}
                    onAddStep={handleAddStep}
                    onDeleteStep={handleDeleteStep}
                    getSubProcessBgColor={getSubProcessBgColor}
                    connectionsDetails={connectionsDetails}
                    schemasDetails={schemasDetails}
                    schemaDetails={schemaDetails}
                    handleSchemaSelect={handleSchemaSelect}
                    tableDetails={tableDetails}
                    connections={connections}
                    handleConnectionSelect={handleConnectionSelect}
                    connectionDetails={connectionDetails}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="connections" className="space-y-4">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-medium mb-4">Connection Details</h3>
                {connectionsDetails ? (
                  <div className="space-y-2">
                    <p>
                      <strong>Name:</strong> {connectionsDetails?.[0]}
                    </p>
                    <p>
                      <strong>Server:</strong> {connectionsDetails?.[1]}
                    </p>
                    <p>
                      <strong>Port:</strong> {connectionsDetails?.[2]}
                    </p>
                    <p>
                      <strong>Type:</strong> {connectionsDetails?.[3]}
                    </p>
                    <p>
                      <strong>Database:</strong> {connectionsDetails?.[4]}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No connection selected</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}

export default ProcessList

