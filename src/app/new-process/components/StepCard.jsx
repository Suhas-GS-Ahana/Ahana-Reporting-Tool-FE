"use client"

import { useState, useEffect, useRef } from "react"
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
  const { toast } = useToast()
  const [previousType, setPreviousType] = useState(step.type || "")

  // Generate a unique ID for this step card that will persist across renders
  const stepCardId = `process-${process.id}-subprocess-${subProcess.id}-step-${step.id}`

  // Create a ref to store step-specific state that persists across type changes
  const stepStateRef = useRef(new Map())

  // Initialize or get the state for the current step type
  const getStepState = (type) => {
    if (!stepStateRef.current.has(type)) {
      // Initialize state for this step type
      const initialState = {
        // Common state
        stepId: stepCardId,

        // Import/Export specific state
        selectedTables: {},
        expandedTables: {},
        selectedDestinationTables: {},
        expandedDestinationTables: {},
        destinationSchemaDetails: [],
        destinationTableDetails: [],
        selectedDestinationSchema: null,
        selectedDestinationConnection: null,
        destinationConnectionDetails: null,
        selectedSchema: null,
        tableDetails: initialTableDetails || [],

        // Process specific state
        description: step.description || "",
        query: step.query || "",
      }

      stepStateRef.current.set(type, initialState)
    }

    return stepStateRef.current.get(type)
  }

  // Get the current step state based on the current type
  const currentStepState = getStepState(step.type || "")

  // State for the current step type
  const [selectedTables, setSelectedTables] = useState(currentStepState.selectedTables)
  const [expandedTables, setExpandedTables] = useState(currentStepState.expandedTables)
  const [selectedDestinationTables, setSelectedDestinationTables] = useState(currentStepState.selectedDestinationTables)
  const [expandedDestinationTables, setExpandedDestinationTables] = useState(currentStepState.expandedDestinationTables)
  const [destinationSchemaDetails, setDestinationSchemaDetails] = useState(currentStepState.destinationSchemaDetails)
  const [destinationTableDetails, setDestinationTableDetails] = useState(currentStepState.destinationTableDetails)
  const [selectedDestinationSchema, setSelectedDestinationSchema] = useState(currentStepState.selectedDestinationSchema)
  const [selectedDestinationConnection, setSelectedDestinationConnection] = useState(
    currentStepState.selectedDestinationConnection,
  )
  const [destinationConnectionDetails, setDestinationConnectionDetails] = useState(
    currentStepState.destinationConnectionDetails,
  )
  const [selectedSchema, setSelectedSchema] = useState(currentStepState.selectedSchema)
  const [tableDetails, setTableDetails] = useState(currentStepState.tableDetails)

  // Update the step state ref when any state changes
  useEffect(() => {
    const updatedState = {
      stepId: stepCardId,
      selectedTables,
      expandedTables,
      selectedDestinationTables,
      expandedDestinationTables,
      destinationSchemaDetails,
      destinationTableDetails,
      selectedDestinationSchema,
      selectedDestinationConnection,
      destinationConnectionDetails,
      selectedSchema,
      tableDetails,
    }

    stepStateRef.current.set(subProcess.type, updatedState)
  }, [
    subProcess.type,
    stepCardId,
    selectedTables,
    expandedTables,
    selectedDestinationTables,
    expandedDestinationTables,
    destinationSchemaDetails,
    destinationTableDetails,
    selectedDestinationSchema,
    selectedDestinationConnection,
    destinationConnectionDetails,
    selectedSchema,
    tableDetails,
  ])

  // When the step type changes, load the state for that type
  useEffect(() => {
    if (previousType !== step.type) {
      setPreviousType(step.type)

      // Get the state for the new type
      const newTypeState = getStepState(step.type)

      // Update all state variables
      setSelectedTables(newTypeState.selectedTables)
      setExpandedTables(newTypeState.expandedTables)
      setSelectedDestinationTables(newTypeState.selectedDestinationTables)
      setExpandedDestinationTables(newTypeState.expandedDestinationTables)
      setDestinationSchemaDetails(newTypeState.destinationSchemaDetails)
      setDestinationTableDetails(newTypeState.destinationTableDetails)
      setSelectedDestinationSchema(newTypeState.selectedDestinationSchema)
      setSelectedDestinationConnection(newTypeState.selectedDestinationConnection)
      setDestinationConnectionDetails(newTypeState.destinationConnectionDetails)
      setSelectedSchema(newTypeState.selectedSchema)
      setTableDetails(newTypeState.tableDetails)
    }
  }, [step.type, previousType])

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
        {step.type === "import" || step.type === "export" ? (
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
        ) : step.type === "process" ? (
          <ProcessStep step={step} stepId={stepCardId} />
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

