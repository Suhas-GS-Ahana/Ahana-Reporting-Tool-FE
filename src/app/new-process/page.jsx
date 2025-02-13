"use client"

import { useState } from "react"
import { Plus, Save, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Play } from "lucide-react"

export default function NewProcess() {
  const { toast } = useToast()
  const [processes, setProcesses] = useState([
    {
      id: 1,
      name: "Process 1",
      subProcesses: [
        {
          id: 1,
          name: "Sub Process 1",
          type: "import", // Added type
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
            type: "import",
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
            })
          }
        }
        return process
      })
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
        <h3 className="font-semibold">Step {index + 1}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleDeleteStep(process.id, subProcess.id, step.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
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

