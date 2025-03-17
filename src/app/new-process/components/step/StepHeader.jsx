"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StepHeader({ index, subProcess, process, onSubProcessTypeChange, onDeleteStep, step }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h3 className="font-semibold">Step {index + 1}</h3>
        <Select
          value={subProcess.type}
          onValueChange={(value) => onSubProcessTypeChange(process.id, subProcess.id, value)}
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
        onClick={() => onDeleteStep(process.id, subProcess.id, step.id)}
        className="hover:bg-red-50 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

