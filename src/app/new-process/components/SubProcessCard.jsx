"use client"

import { Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import StepCard from "./StepCard"
import { Plus } from "lucide-react"

const SubProcessCard = ({
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
}) => {
  return (
    <Card key={subProcess.id} className={getSubProcessBgColor(subProcess.id)}>
      <Collapsible>
        <CardHeader className="pb-3">
          <CollapsibleTrigger asChild className="flex w-full items-center justify-between">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-4 items-center">
                <Input
                  value={subProcess.name}
                  onChange={(e) => onSubProcessNameChange(process.id, subProcess.id, e.target.value)}
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
                    onDeleteSubProcess(process.id, subProcess.id)
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
              <StepCard
                key={step.id}
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
            ))}
            <Button variant="outline" onClick={() => onAddStep(process.id, subProcess.id)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Step
            </Button>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

export default SubProcessCard

