"use client"

import { useState } from "react"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

  const handleSave = () => {
    toast({
      title: "Query Saved",
      description: "The query has been successfully saved.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Process
        </Button>
        <Button variant="secondary" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save & Continue
        </Button>
      </div>

      {processes.map((process) => (
        <div key={process.id} className="space-y-4">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 font-medium">
              {process.name}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 p-4">
              {process.subProcesses.map((subProcess) => (
                <Collapsible key={subProcess.id}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4">
                    {subProcess.name}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 p-4">
                    {subProcess.queries.map((query) => (
                      <div key={query.id} className="grid gap-4">
                        <Input
                          placeholder="Query Name"
                          value={query.name}
                          onChange={(e) => {
                            // Handle query name change
                          }}
                        />
                        <Textarea
                          placeholder="Enter SQL query"
                          value={query.query}
                          onChange={(e) => {
                            // Handle query change
                          }}
                        />
                      </div>
                    ))}
                    <Button variant="outline" onClick={() => handleAddQuery(process.id, subProcess.id)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Query
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      ))}
      <Toaster />
    </div>
  )
}

