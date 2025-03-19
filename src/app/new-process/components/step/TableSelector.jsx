"use client"

import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TableSelector({
  tableDetails,
  selectedTables,
  toggleTableSelection,
  toggleColumnSelection,
  expandedTables,
  toggleTableExpansion,
  cardId,
}) {
  // Parse columns from the columns_with_types string
  const parseColumns = (columnsString) => {
    if (!columnsString) return []
    return columnsString.split(", ").map((column) => {
      const [name, type] = column.split(" ")
      return { name, type }
    })
  }

  return (
    <Card className="border border-gray-200">
      <ScrollArea className="h-[200px] p-4">
        {tableDetails && tableDetails.length > 0 ? (
          tableDetails.map((table) => (
            <div key={`${cardId}-table-${table.table_name}`} className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Checkbox
                  id={`${cardId}-table-${table.table_name}`}
                  checked={!!selectedTables[table.table_name]}
                  onCheckedChange={() => toggleTableSelection(table.table_name)}
                />
                <div className="flex items-center justify-between w-full">
                  <Label htmlFor={`${cardId}-table-${table.table_name}`} className="font-medium cursor-pointer">
                    {table.table_name}
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleTableExpansion(table.table_name)}
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedTables[table.table_name] ? "rotate-180" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              {expandedTables[table.table_name] && (
                <div className="ml-6 pl-2 border-l border-gray-200">
                  {parseColumns(table.columns_with_types).map((column) => (
                    <div
                      key={`${cardId}-column-${table.table_name}-${column.name}`}
                      className="flex items-center space-x-2 py-1"
                    >
                      <Checkbox
                        id={`${cardId}-column-${table.table_name}-${column.name}`}
                        checked={selectedTables[table.table_name]?.includes(column.name) || false}
                        onCheckedChange={() => toggleColumnSelection(table.table_name, column.name)}
                      />
                      <Label
                        htmlFor={`${cardId}-column-${table.table_name}-${column.name}`}
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
          ))
        ) : (
          <div className="text-center p-4 text-gray-500">No tables available. Please select a schema first.</div>
        )}
      </ScrollArea>
    </Card>
  )
}

