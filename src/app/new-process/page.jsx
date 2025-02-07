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
          queries: [
            { id: 1, name: "select", query: "select * from table" },
            { id: 2, name: "delete", query: "delete from table" },
          ],
        },
        {
          id: 2,
          name: "Sub Process 2",
          queries: [{ id: 3, name: "", query: "" }],
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
            queries: [],
          })
        }
        return process
      }),
    )
  }

  const handleAddQuery = (processId, subProcessId) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          process.subProcesses = process.subProcesses.map((subProcess) => {
            if (subProcess.id === subProcessId) {
              subProcess.queries.push({
                id: Date.now(),
                name: "",
                query: "",
              })
            }
            return subProcess
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

  const handleDeleteQuery = (processId, subProcessId, queryId) => {
    setProcesses(
      processes.map((process) => {
        if (process.id === processId) {
          process.subProcesses = process.subProcesses.map((subProcess) => {
            if (subProcess.id === subProcessId) {
              subProcess.queries = subProcess.queries.filter((query) => query.id !== queryId)
            }
            return subProcess
          })
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
        <Card key={process.id} >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>{process.name}</CardTitle>
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
          <CardContent className="space-y-4" >
            {process.subProcesses.map((subProcess) => (
              <Card key={subProcess.id} className={getSubProcessBgColor(subProcess.id)}>
                <Collapsible>
                  <CardHeader className="pb-3">
                    <CollapsibleTrigger asChild className="flex w-full items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{subProcess.name}</CardTitle>
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
                      {subProcess.queries.map((query) => (
                        <div key={query.id} className="space-y-2">
                          <div className="flex gap-2">
                            <Input placeholder="Query Name" value={query.name} className="flex-1 bg-white" readOnly/>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteQuery(process.id, subProcess.id, query.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea placeholder="Enter SQL query" value={query.query} rows={3} className=" bg-white" readOnly/>
                        </div>
                      ))}
                      <Button variant="outline" onClick={() => handleAddQuery(process.id, subProcess.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Query
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

