"use client"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SubProcessCard from "./SubProcessCard"
import { useState } from "react"

const ProcessCard = ({
  process,
  onProcessNameChange,
  onAddSubProcess,
  onDeleteProcess,
  onDeleteSubProcess,
  onSubProcessNameChange,
  onSubProcessTypeChange,
  onAddStep,
  onDeleteStep,
  getSubProcessBgColor,
  connectionsDetails,
  schemasDetails,
  schemaDetails,
  handleSchemaSelect,
  tableDetails,
  connections,
  handleConnectionSelect,
  connectionDetails,
}) => {
  // Each process card has its own state
  const [processState] = useState({
    id: process.id,
    // Add any process-specific state here if needed
  })

  return (
    <Card key={process.id} className="border-blue-100 shadow-sm">
      <CardHeader className="pb-3 bg-blue-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <Input
            value={process.name}
            onChange={(e) => onProcessNameChange(process.id, e.target.value)}
            className="text-xl font-semibold w-[300px] bg-white border-blue-200"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddSubProcess(process.id)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Sub-Process
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteProcess(process.id)}
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        {process.subProcesses.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-gray-500 mb-4">No sub-processes added yet</p>
            <Button
              variant="outline"
              onClick={() => onAddSubProcess(process.id)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Sub-Process
            </Button>
          </div>
        ) : (
          process.subProcesses.map((subProcess) => (
            <SubProcessCard
              key={`${process.id}-${subProcess.id}`}
              process={process}
              subProcess={subProcess}
              onSubProcessNameChange={onSubProcessNameChange}
              onDeleteSubProcess={onDeleteSubProcess}
              onSubProcessTypeChange={onSubProcessTypeChange}
              onAddStep={onAddStep}
              onDeleteStep={onDeleteStep}
              getSubProcessBgColor={getSubProcessBgColor}
              connectionsDetails={connectionsDetails}
              schemasDetails={schemasDetails}
              schemaDetails={schemaDetails}
              handleSchemaSelect={handleSchemaSelect}
              tableDetails={tableDetails}
              connections={connections}
              handleConnectionSelect={handleConnectionSelect}
              connectionDetails={connectionDetails}
              processId={process.id} // Pass process ID to ensure uniqueness
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default ProcessCard

