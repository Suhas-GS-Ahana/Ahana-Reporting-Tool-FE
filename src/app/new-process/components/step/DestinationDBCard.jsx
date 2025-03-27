"use client"

import { Database, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ConnectionDetails from "@/app/configurations/ConnectionDetails"
import SchemaSelector from "@/app/configurations/SchemaSelector"
import TableSelector from "./TableSelector"

export default function DestinationDBCard({
  connections,
  handleDestinationConnectionSelect,
  destinationConnectionDetails,
  destinationSchemaDetails,
  selectedDestinationSchema,
  handleDestinationSchemaSelect,
  destinationTableDetails,
  selectedDestinationTables,
  toggleDestinationTableSelection,
  toggleDestinationColumnSelection,
  removeDestinationColumn,
  expandedDestinationTables,
  toggleDestinationTableExpansion,
  getSelectionSummary,
  getAllSelectedColumns,
  cardId,
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
                        <SelectItem key={connection.data_sources_id} value={String(connection.data_sources_id)}>
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
            <SchemaSelector
              schemaDetails={destinationSchemaDetails}
              onSchemaSelect={handleDestinationSchemaSelect}
              selectedSchema={selectedDestinationSchema}
            />
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

            {/* Display selected columns with remove option */}
            {Object.keys(selectedDestinationTables).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {getAllSelectedColumns(selectedDestinationTables).map(({ tableName, columnName }) => (
                  <Badge key={`${cardId}-${tableName}-${columnName}`} variant="secondary" className="px-2 py-1">
                    {tableName}.{columnName}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-red-100 hover:text-red-500"
                      onClick={() => removeDestinationColumn(tableName, columnName)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <TableSelector
              tableDetails={destinationTableDetails}
              selectedTables={selectedDestinationTables}
              toggleTableSelection={toggleDestinationTableSelection}
              toggleColumnSelection={toggleDestinationColumnSelection}
              expandedTables={expandedDestinationTables}
              toggleTableExpansion={toggleDestinationTableExpansion}
              cardId={cardId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

