"use client"

import { Database, Server, Globe, Plug, LayoutList, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import SchemaSelector from "@/app/configurations/SchemaSelector"
import TableSelector from "./TableSelector"

export default function SourceDBCard({
  connectionsDetails,
  schemaDetails,
  handleSchemaSelect,
  selectedSchema,
  tableDetails,
  selectedTables,
  toggleTableSelection,
  toggleColumnSelection,
  removeColumn,
  expandedTables,
  toggleTableExpansion,
  getSelectionSummary,
  getAllSelectedColumns,
  cardId,
}) {
  return (
    <Card className="flex-1 border-green-200 shadow-sm">
      <CardHeader className="bg-green-50 border-b border-green-100 pb-3">
        <CardTitle className="text-green-800 flex items-center gap-2">
          <Database className="h-5 w-5" />
          Source Database
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex flex-wrap gap-2 items-center">
              {connectionsDetails && (
                <>
                  {/* <Badge
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
                  </Badge> */}
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-100 text-purple-600 flex items-center gap-1 px-2 py-1"
                  >
                    <LayoutList className="w-3 h-3" /> Type: {connectionsDetails.database_type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs bg-red-100 text-red-600 flex items-center gap-1 px-2 py-1"
                  >
                    <Database className="w-3 h-3" /> Database: {connectionsDetails.connection_name}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          {schemaDetails && (
            <SchemaSelector
              schemaDetails={schemaDetails}
              onSchemaSelect={handleSchemaSelect}
              selectedSchema={selectedSchema}
            />
          )}
        </div>

        {tableDetails && tableDetails.length > 0 && (
          <div className="grid gap-2 mt-4">
            <Label>Select Tables and Columns</Label>
            <Input
              readOnly
              value={getSelectionSummary(selectedTables)}
              className="bg-white"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Display selected columns with remove option */}
            {Object.keys(selectedTables).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 mb-4">
                {getAllSelectedColumns(selectedTables).map(({ tableName, columnName }) => (
                  <Badge key={`${cardId}-${tableName}-${columnName}`} variant="secondary" className="px-2 py-1">
                    {tableName}.{columnName}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-red-100 hover:text-red-500"
                      onClick={() => removeColumn(tableName, columnName)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            <TableSelector
              tableDetails={tableDetails}
              selectedTables={selectedTables}
              toggleTableSelection={toggleTableSelection}
              toggleColumnSelection={toggleColumnSelection}
              expandedTables={expandedTables}
              toggleTableExpansion={toggleTableExpansion}
              cardId={cardId}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

