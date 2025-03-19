"use client"

import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export default function ProcessStep({ step, stepId }) {
  // Maintain state for this specific process step
  const [stepData, setStepData] = useState({
    description: step.description || "",
    query: step.query || "",
  })

  const handleDescriptionChange = (e) => {
    setStepData((prev) => ({
      ...prev,
      description: e.target.value,
    }))
  }

  const handleQueryChange = (e) => {
    setStepData((prev) => ({
      ...prev,
      query: e.target.value,
    }))
  }

  return (
    <Card className="p-4 space-y-4 bg-blue-50 border border-blue-100">
      <div className="space-y-2">
        <Label className="text-blue-700">Description</Label>
        <Input
          placeholder="Step description"
          value={stepData.description}
          onChange={handleDescriptionChange}
          className="bg-white border-blue-200 focus-visible:ring-blue-400"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-blue-700">SQL Query</Label>
        <Textarea
          placeholder="Enter SQL query"
          value={stepData.query}
          onChange={handleQueryChange}
          rows={5}
          className="bg-white font-mono text-sm border-blue-200 focus-visible:ring-blue-400"
        />
      </div>

      <Button className="bg-blue-600 hover:bg-blue-700">
        <Play className="mr-2 h-4 w-4" />
        Run Query
      </Button>
    </Card>
  )
}

