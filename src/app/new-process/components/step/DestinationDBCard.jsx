"use client"

import { Database } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConnectionDetails from "@/app/configurations/ConnectionDetails"
import SchemaSelector from "@/app/configurations/SchemaSelector"
import TableSelector from "./TableSelector"

export default function DestinationDBCard({
  connections,
  handleDestinationConnectionSelect,
  destinationConnectionDetails,
  destinationSchemaDetails,
  handleDestinationSchemaSelect,
  destinationTableDetails,
  selectedDestinationTables,
  toggleDestinationTableSelection,
  toggleDestinationColumnSelection,
  expandedDestinationTables,
  toggleDestinationTableExpansion,
  getSelectionSummary,
}) {
  return (
    <Card className="flex-1 border-blue-200 shadow-sm">
      <CardHeader className="bg-blue-50 border-b border-blue-100 pb-3">
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Destination Database
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-full">
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

        <div className="grid gap-2">
          {destinationSchemaDetails && (
            <SchemaSelector schemaDetails={destinationSchemaDetails} onSchemaSelect={handleDestinationSchemaSelect} />
          )}
        </div>

        {destinationTableDetails && destinationTableDetails.length > 0 && (
          <div className="grid gap-2 mt-4">
            <Label>Select Tables and Columns</Label>
            <Input
              readOnly
              value={getSelectionSummary(selectedDestinationTables)}
              className="bg-white"
              onClick={(e) => e.stopPropagation()}
            />

            <TableSelector
              tableDetails={destinationTableDetails}
              selectedTables={selectedDestinationTables}
              toggleTableSelection={toggleDestinationTableSelection}
              toggleColumnSelection={toggleDestinationColumnSelection}
              expandedTables={expandedDestinationTables}
              toggleTableExpansion={toggleDestinationTableExpansion}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

