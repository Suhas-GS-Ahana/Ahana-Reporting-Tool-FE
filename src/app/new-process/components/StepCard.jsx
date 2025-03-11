"use client"

import { useState } from "react"
import { Trash2, Database, ArrowRight, Server, Globe, Plug, LayoutList, Play, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import ConnectionDetails from "@/app/configurations/ConnectionDetails"
import SchemaSelector from "@/app/configurations/SchemaSelector"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

const StepCard = ({
  process,
  subProcess,
  step,
  index,
  onSubProcessTypeChange,
  onDeleteStep,
  connectionsDetails,
  schemasDetails,
  schemaDetails,
  handleSchemaSelect,
  tableDetails,
  connections,
  handleConnectionSelect,
  connectionDetails,
}) => {
  const [selectedTables, setSelectedTables] = useState({})
  const [expandedTables, setExpandedTables] = useState({})
  const [selectedDestinationTables, setSelectedDestinationTables] = useState({})
  const [expandedDestinationTables, setExpandedDestinationTables] = useState({})
  const [destinationSchemaDetails, setDestinationSchemaDetails] = useState([])
  const [destinationTableDetails, setDestinationTableDetails] = useState([])
  const [selectedDestinationSchema, setSelectedDestinationSchema] = useState(null)
  const [selectedDestinationConnection, setSelectedDestinationConnection] = useState(null)
  const [destinationConnectionDetails, setDestinationConnectionDetails] = useState(null)
  const { toast } = useToast()

  // Parse columns from the columns_with_types string
  const parseColumns = (columnsString) => {
    if (!columnsString) return []
    return columnsString.split(", ").map((column) => {
      const [name, type] = column.split(" ")
      return { name, type }
    })
  }

  // Toggle table selection
  const toggleTableSelection = (tableName) => {
    setSelectedTables((prev) => {
      const newSelection = { ...prev }

      if (!newSelection[tableName]) {
        // If table wasn't selected, select it with all columns
        const tableData = tableDetails.find((t) => t.table_name === tableName)
        if (tableData) {
          const columns = parseColumns(tableData.columns_with_types)
          newSelection[tableName] = columns.map((col) => col.name)
        }
      } else {
        // If table was selected, deselect it
        delete newSelection[tableName]
      }

      return newSelection
    })
  }

  // Toggle column selection
  const toggleColumnSelection = (tableName, columnName) => {
    setSelectedTables((prev) => {
      const newSelection = { ...prev }

      if (!newSelection[tableName]) {
        newSelection[tableName] = [columnName]
      } else {
        if (newSelection[tableName].includes(columnName)) {
          // Remove column if already selected
          newSelection[tableName] = newSelection[tableName].filter((col) => col !== columnName)
          // Remove table if no columns are selected
          if (newSelection[tableName].length === 0) {
            delete newSelection[tableName]
          }
        } else {
          // Add column if not selected
          newSelection[tableName] = [...newSelection[tableName], columnName]
        }
      }

      return newSelection
    })
  }

  // Toggle table expansion
  const toggleTableExpansion = (tableName) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }))
  }

  // Toggle destination table selection
  const toggleDestinationTableSelection = (tableName) => {
    setSelectedDestinationTables((prev) => {
      const newSelection = { ...prev }

      if (!newSelection[tableName]) {
        // If table wasn't selected, select it with all columns
        const tableData = destinationTableDetails.find((t) => t.table_name === tableName)
        if (tableData) {
          const columns = parseColumns(tableData.columns_with_types)
          newSelection[tableName] = columns.map((col) => col.name)
        }
      } else {
        // If table was selected, deselect it
        delete newSelection[tableName]
      }

      return newSelection
    })
  }

  // Toggle destination column selection
  const toggleDestinationColumnSelection = (tableName, columnName) => {
    setSelectedDestinationTables((prev) => {
      const newSelection = { ...prev }

      if (!newSelection[tableName]) {
        newSelection[tableName] = [columnName]
      } else {
        if (newSelection[tableName].includes(columnName)) {
          // Remove column if already selected
          newSelection[tableName] = newSelection[tableName].filter((col) => col !== columnName)
          // Remove table if no columns are selected
          if (newSelection[tableName].length === 0) {
            delete newSelection[tableName]
          }
        } else {
          // Add column if not selected
          newSelection[tableName] = [...newSelection[tableName], columnName]
        }
      }

      return newSelection
    })
  }

  // Toggle destination table expansion
  const toggleDestinationTableExpansion = (tableName) => {
    setExpandedDestinationTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }))
  }

  // Get a summary of selected tables and columns
  const getSelectionSummary = (selectedTables) => {
    const tableCount = Object.keys(selectedTables).length
    const columnCount = Object.values(selectedTables).flat().length

    if (tableCount === 0) return "No tables selected"
    return `${tableCount} table${tableCount > 1 ? "s" : ""}, ${columnCount} column${columnCount > 1 ? "s" : ""} selected`
  }

  // Handle schema selection for destination
  const handleDestinationSchemaSelect = async (schema) => {
    setSelectedDestinationSchema(schema)
    try {
      const response = await fetch(`http://localhost:8000/get_tables?conn_name=${selectedDestinationConnection}&schema_name=${schema}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tables")
      }
      const data = await response.json()
      setDestinationTableDetails(data.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tables",
      })
    }
  }

  // Handle connection selection for destination
  const handleDestinationConnectionSelect = async (connectionName) => {
    setSelectedDestinationConnection(connectionName)
    try {
      const response = await fetch(`http://localhost:8000/get_connectionschema?name=${connectionName}`)
      if (!response.ok) {
        throw new Error("Failed to fetch connection schema")
      }
      const data = await response.json()
      setDestinationSchemaDetails(data.data)

      // Fetch connection details
      const connectionResponse = await fetch(`http://localhost:8000/view_connection?name=${connectionName}`)
      if (!connectionResponse.ok) {
        throw new Error("Failed to fetch connection details")
      }
      const connectionData = await connectionResponse.json()
      setDestinationConnectionDetails(connectionData.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connection schema or details",
      })
    }
  }

  return (
    <div key={step.id} className="space-y-2 p-4 border rounded-lg">
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
        <Button variant="ghost" size="icon" onClick={() => onDeleteStep(process.id, subProcess.id, step.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {subProcess.type === "import" || subProcess.type === "export" ? (
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Source DB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                <div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge
                      variant="outline"
                      className="text-xs bg-blue-100 text-blue-600 flex items-center gap-1 px-2 py-1"
                    >
                      <Server className="w-3 h-3" /> Name: {connectionsDetails?.[0]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs bg-green-100 text-green-600 flex items-center gap-1 px-2 py-1"
                    >
                      <Globe className="w-3 h-3" /> Server: {connectionsDetails?.[1]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs bg-yellow-100 text-yellow-600 flex items-center gap-1 px-2 py-1"
                    >
                      <Plug className="w-3 h-3" /> Port: {connectionsDetails?.[2]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs bg-purple-100 text-purple-600 flex items-center gap-1 px-2 py-1"
                    >
                      <LayoutList className="w-3 h-3" /> Type: {connectionsDetails?.[3]}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs bg-red-100 text-red-600 flex items-center gap-1 px-2 py-1"
                    >
                      <Database className="w-3 h-3" /> Database: {connectionsDetails?.[4]}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid gap-2 mt-8">
                {schemaDetails && <SchemaSelector schemaDetails={schemaDetails} onSchemaSelect={handleSchemaSelect} />}
              </div>

              {tableDetails && tableDetails.length > 0 && (
                <div className="grid gap-2 mt-8">
                  <Label>Select Tables and Columns</Label>
                  <Input
                    readOnly
                    value={getSelectionSummary(selectedTables)}
                    className="bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <Card className="border border-gray-200">
                    <ScrollArea className="h-[100px] p-4">
                      {tableDetails.map((table) => (
                        <div key={table.table_name} className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={`table-${table.table_name}`}
                              checked={!!selectedTables[table.table_name]}
                              onCheckedChange={() => toggleTableSelection(table.table_name)}
                            />
                            <div className="flex items-center justify-between w-full">
                              <Label htmlFor={`table-${table.table_name}`} className="font-medium cursor-pointer">
                                {table.table_name}
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleTableExpansion(table.table_name)}
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${expandedTables[table.table_name] ? "" : "rotate-180"}`}
                                />
                              </Button>
                            </div>
                          </div>

                          {expandedTables[table.table_name] && (
                            <div className="ml-6 pl-2 border-l border-gray-200">
                              {parseColumns(table.columns_with_types).map((column) => (
                                <div key={column.name} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    id={`column-${table.table_name}-${column.name}`}
                                    checked={selectedTables[table.table_name]?.includes(column.name) || false}
                                    onCheckedChange={() => toggleColumnSelection(table.table_name, column.name)}
                                  />
                                  <Label
                                    htmlFor={`column-${table.table_name}-${column.name}`}
                                    className="text-sm cursor-pointer flex justify-between w-full"
                                  >
                                    <span>{column.name}</span>
                                    <span className="text-gray-500 text-xs">{column.type}</span>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
          <ArrowRight className="h-6 w-6 self-center" />
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Destination DB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                <div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Select onValueChange={handleDestinationConnectionSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          {connections &&
                            connections.map((connection) => (
                              <SelectItem key={connection.connection_name} value={connection.connection_name}>
                                {connection.connection_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {destinationConnectionDetails && <ConnectionDetails connectionDetails={destinationConnectionDetails} />}
                  </div>
                </div>
              </div>
              <div className="grid gap-2 mt-8">
                {destinationSchemaDetails && <SchemaSelector schemaDetails={destinationSchemaDetails} onSchemaSelect={handleDestinationSchemaSelect} />}
              </div>

              {destinationTableDetails && destinationTableDetails.length > 0 && (
                <div className="grid gap-2 mt-8">
                  <Label>Select Tables and Columns</Label>
                  <Input
                    readOnly
                    value={getSelectionSummary(selectedDestinationTables)}
                    className="bg-white"
                    onClick={(e) => e.stopPropagation()}
                  />

                  <Card className="border border-gray-200">
                    <ScrollArea className="h-[100px] p-4">
                      {destinationTableDetails.map((table) => (
                        <div key={table.table_name} className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Checkbox
                              id={`destination-table-${table.table_name}`}
                              checked={!!selectedDestinationTables[table.table_name]}
                              onCheckedChange={() => toggleDestinationTableSelection(table.table_name)}
                            />
                            <div className="flex items-center justify-between w-full">
                              <Label htmlFor={`destination-table-${table.table_name}`} className="font-medium cursor-pointer">
                                {table.table_name}
                              </Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleDestinationTableExpansion(table.table_name)}
                              >
                                <ChevronDown
                                  className={`h-4 w-4 transition-transform ${expandedDestinationTables[table.table_name] ? "" : "rotate-180"}`}
                                />
                              </Button>
                            </div>
                          </div>

                          {expandedDestinationTables[table.table_name] && (
                            <div className="ml-6 pl-2 border-l border-gray-200">
                              {parseColumns(table.columns_with_types).map((column) => (
                                <div key={column.name} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    id={`destination-column-${table.table_name}-${column.name}`}
                                    checked={selectedDestinationTables[table.table_name]?.includes(column.name) || false}
                                    onCheckedChange={() => toggleDestinationColumnSelection(table.table_name, column.name)}
                                  />
                                  <Label
                                    htmlFor={`destination-column-${table.table_name}-${column.name}`}
                                    className="text-sm cursor-pointer flex justify-between w-full"
                                  >
                                    <span>{column.name}</span>
                                    <span className="text-gray-500 text-xs">{column.type}</span>
                                  </Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </ScrollArea>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : subProcess.type === "process" ? (
        <div className="space-y-2">
          <Label>Description</Label>
          <Input placeholder="Step description" value={step.description} className="bg-white" />
          <Label className="pt-5">SQL Query</Label>
          <Textarea placeholder="Enter SQL query" value={step.query} rows={3} className="bg-white" />
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Run Query
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default StepCard