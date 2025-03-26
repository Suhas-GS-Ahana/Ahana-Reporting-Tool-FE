"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import StepHeader from "./step/StepHeader"
import ProcessStep from "./step/ProcessStep"
import ImportExportStep from "./step/ImportExportStep"

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
  tableDetails: initialTableDetails,
  connections,
  handleConnectionSelect,
  connectionDetails,
}) => {
  // Separate state for source and destination
  const [selectedTables, setSelectedTables] = useState({})
  const [expandedTables, setExpandedTables] = useState({})
  const [selectedDestinationTables, setSelectedDestinationTables] = useState({})
  const [expandedDestinationTables, setExpandedDestinationTables] = useState({})
  const [destinationSchemaDetails, setDestinationSchemaDetails] = useState([])
  const [destinationTableDetails, setDestinationTableDetails] = useState([])
  const [selectedDestinationSchema, setSelectedDestinationSchema] = useState(null)
  const [selectedDestinationConnection, setSelectedDestinationConnection] = useState(null)
  const [destinationConnectionDetails, setDestinationConnectionDetails] = useState(null)
  const [selectedSchema, setSelectedSchema] = useState(null)
  const [tableDetails, setTableDetails] = useState(initialTableDetails || [])
  const [previousType, setPreviousType] = useState(subProcess.type)
  const { toast } = useToast()

  // Store the previous type to detect changes
  useEffect(() => {
    if (previousType !== subProcess.type) {
      setPreviousType(subProcess.type)
      // Don't reset selections when switching types
    }
  }, [subProcess.type, previousType])

  // Update local table details when props change
  useEffect(() => {
    if (initialTableDetails) {
      setTableDetails(initialTableDetails)
    }
  }, [initialTableDetails])

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

  // Remove a specific column
  const removeColumn = (tableName, columnName) => {
    setSelectedTables((prev) => {
      const newSelection = { ...prev }
      if (newSelection[tableName]) {
        newSelection[tableName] = newSelection[tableName].filter((col) => col !== columnName)
        if (newSelection[tableName].length === 0) {
          delete newSelection[tableName]
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

  // Toggle destination table selection - completely separate from source
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

  // Remove a specific destination column
  const removeDestinationColumn = (tableName, columnName) => {
    setSelectedDestinationTables((prev) => {
      const newSelection = { ...prev }
      if (newSelection[tableName]) {
        newSelection[tableName] = newSelection[tableName].filter((col) => col !== columnName)
        if (newSelection[tableName].length === 0) {
          delete newSelection[tableName]
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

  // Handle schema selection for source
  const handleLocalSchemaSelect = async (schema) => {
    setSelectedSchema(schema)
    try {
      // Directly fetch tables for the selected schema
      const response = await fetch(
        `http://localhost:8000/get_tables?id=2&schema_name=${encodeURIComponent(schema.schema_name)}`,
      )
      if (!response.ok) {
        throw new Error("Failed to fetch tables")
      }
      const data = await response.json()
      setTableDetails(data.data)

      // Also call the parent handler if provided
      if (handleSchemaSelect) {
        await handleSchemaSelect(schema)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tables for schema",
      })
    }
  }

  // Handle schema selection for destination
  const handleDestinationSchemaSelect = async (schema) => {
  console.log(schema)
    setSelectedDestinationSchema(schema)
    try {
      const response = await fetch(
       `http://localhost:8000/get_tables?id=${2}&schema_name=${encodeURIComponent(schema.schema_name)}`,
      )
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
  const handleDestinationConnectionSelect = async (dataSourcesId) => {
    setSelectedDestinationConnection(dataSourcesId)
    try {
      const response = await fetch(`http://localhost:8000/get_connectionschema?id=${dataSourcesId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch connection schema")
      }
      const data = await response.json()
      setDestinationSchemaDetails(data.data)

      // Fetch connection details
      const connectionResponse = await fetch(`http://localhost:8000/view_connection?id=${dataSourcesId}`)
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

  // Get all selected columns for display
  const getAllSelectedColumns = (selectedTables) => {
    const result = []
    Object.entries(selectedTables).forEach(([tableName, columns]) => {
      columns.forEach((columnName) => {
        result.push({ tableName, columnName })
      })
    })
    return result
  }

  // Generate a unique ID for this step card
  const stepCardId = `process-${process.id}-subprocess-${subProcess.id}-step-${step.id}`

  return (
    <div
      key={stepCardId}
      className="space-y-4 p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <StepHeader
        index={index}
        subProcess={subProcess}
        process={process}
        onSubProcessTypeChange={onSubProcessTypeChange}
        onDeleteStep={onDeleteStep}
        step={step}
      />

      <div className="mt-4">
        {subProcess.type === "import" || subProcess.type === "export" ? (
          <ImportExportStep
            connectionsDetails={connectionsDetails}
            schemaDetails={schemaDetails}
            handleSchemaSelect={handleLocalSchemaSelect}
            selectedSchema={selectedSchema}
            tableDetails={tableDetails}
            connections={connections}
            handleConnectionSelect={handleConnectionSelect}
            connectionDetails={connectionDetails}
            selectedTables={selectedTables}
            toggleTableSelection={toggleTableSelection}
            toggleColumnSelection={toggleColumnSelection}
            removeColumn={removeColumn}
            expandedTables={expandedTables}
            toggleTableExpansion={toggleTableExpansion}
            selectedDestinationTables={selectedDestinationTables}
            toggleDestinationTableSelection={toggleDestinationTableSelection}
            toggleDestinationColumnSelection={toggleDestinationColumnSelection}
            removeDestinationColumn={removeDestinationColumn}
            expandedDestinationTables={expandedDestinationTables}
            toggleDestinationTableExpansion={toggleDestinationTableExpansion}
            destinationSchemaDetails={destinationSchemaDetails}
            destinationTableDetails={destinationTableDetails}
            selectedDestinationSchema={selectedDestinationSchema}
            handleDestinationSchemaSelect={handleDestinationSchemaSelect}
            handleDestinationConnectionSelect={handleDestinationConnectionSelect}
            destinationConnectionDetails={destinationConnectionDetails}
            getSelectionSummary={getSelectionSummary}
            getAllSelectedColumns={getAllSelectedColumns}
            stepCardId={stepCardId}
          />
        ) : subProcess.type === "process" ? (
          <ProcessStep step={step} />
        ) : (
          <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
            Please select a step type to continue
          </div>
        )}
      </div>
    </div>
  )
}

export default StepCard

