"use client"

import { useState } from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import ProcessCard from "./ProcessCard"

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

  let lastAssignedColor = ""
  const getSubProcessBgColor = (processId) => {
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
    const availableColors = colors.filter((color) => color !== lastAssignedColor)
    const selectedColor = availableColors[processId % availableColors.length]

    lastAssignedColor = selectedColor
    return selectedColor
  }

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
            steps: [
              {
                id: Date.now(),
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
      title: "Query Saved",
      description: "The query has been successfully saved.",
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

  const handleSubProcessTypeChange = (processId, subProcessId, newType) => {
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
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={handleAddProcess} className="bg-blue-950">
          <Plus className="mr-2 h-4 w-4" />
          Add Process
        </Button>
        <Button variant="secondary" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save & Continue
        </Button>
      </div>

      {processes.map((process) => (
        <ProcessCard
          key={process.id}
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
      ))}
      <Toaster />
    </div>
  )
}

export default ProcessList

