"use client"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import SubProcessCard from "./SubProcessCard"

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
  return (
    <Card key={process.id}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Input
            value={process.name}
            onChange={(e) => onProcessNameChange(process.id, e.target.value)}
            className="text-xl font-semibold w-[200px]"
          />
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onAddSubProcess(process.id)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteProcess(process.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {process.subProcesses.map((subProcess) => (
          <SubProcessCard
            key={subProcess.id}
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
          />
        ))}
      </CardContent>
    </Card>
  )
}

export default ProcessCard

