"use client"

import { useState } from "react"
import { Trash2, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import StepCard from "./StepCard"

export default function SubProcessCard({
  process,
  subProcess,
  onSubProcessNameChange,
  onDeleteSubProcess,
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
  processId, // Use this to ensure uniqueness
}) {
  // Each subprocess has its own state
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Card key={`${processId}-${subProcess.id}`} className={getSubProcessBgColor(subProcess.id)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild className="flex w-full items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-4 items-center">
                <Input
                  value={subProcess.name}
                  onChange={(e) => onSubProcessNameChange(process.id, subProcess.id, e.target.value)}
                  className="text-base font-semibold w-[250px] bg-white"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSubProcess(process.id, subProcess.id)
                  }}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {subProcess.steps.length === 0 ? (
              <div className="text-center p-6 border border-dashed rounded-lg">
                <p className="text-gray-500 mb-4">No steps added yet</p>
                <Button variant="outline" onClick={() => onAddStep(process.id, subProcess.id)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Step
                </Button>
              </div>
            ) : (
              subProcess.steps.map((step, index) => (
                <StepCard
                  key={`${processId}-${subProcess.id}-${step.id}`}
                  process={process}
                  subProcess={subProcess}
                  step={step}
                  index={index}
                  onSubProcessTypeChange={onSubProcessTypeChange}
                  onDeleteStep={onDeleteStep}
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
            <Button
              variant="outline"
              onClick={() => onAddStep(process.id, subProcess.id)}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Step
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

