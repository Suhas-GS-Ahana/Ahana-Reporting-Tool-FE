import { ArrowRight } from "lucide-react"
import SourceDBCard from "./SourceDBCard"
import DestinationDBCard from "./DestinationDBCard"
import { Button } from "@/components/ui/button"

export default function ImportExportStep({
  connectionsDetails,
  schemaDetails,
  handleSchemaSelect,
  selectedSchema,
  tableDetails,
  connections,
  handleConnectionSelect,
  connectionDetails,
  selectedTables,
  toggleTableSelection,
  toggleColumnSelection,
  removeColumn,
  expandedTables,
  toggleTableExpansion,
  selectedDestinationTables,
  toggleDestinationTableSelection,
  toggleDestinationColumnSelection,
  removeDestinationColumn,
  expandedDestinationTables,
  toggleDestinationTableExpansion,
  destinationSchemaDetails,
  destinationTableDetails,
  selectedDestinationSchema,
  handleDestinationSchemaSelect,
  handleDestinationConnectionSelect,
  destinationConnectionDetails,
  getSelectionSummary,
  getAllSelectedColumns,
  stepCardId,
}) {
  return (
    <div>
    <div className="flex gap-4 items-stretch">
      <SourceDBCard
        connectionsDetails={connectionsDetails}
        schemaDetails={schemaDetails}
        handleSchemaSelect={handleSchemaSelect}
        selectedSchema={selectedSchema}
        tableDetails={tableDetails}
        selectedTables={selectedTables}
        toggleTableSelection={toggleTableSelection}
        toggleColumnSelection={toggleColumnSelection}
        removeColumn={removeColumn}
        expandedTables={expandedTables}
        toggleTableExpansion={toggleTableExpansion}
        getSelectionSummary={getSelectionSummary}
        getAllSelectedColumns={getAllSelectedColumns}
        cardId={`${stepCardId}-source`}
        stepCardId={stepCardId}
      />

      <div className="flex items-center">
        <div className="bg-gray-100 rounded-full p-2">
          <ArrowRight className="h-6 w-6 text-gray-500" />
        </div>
      </div>

      <DestinationDBCard
        connections={connections}
        handleDestinationConnectionSelect={handleDestinationConnectionSelect}
        destinationConnectionDetails={destinationConnectionDetails}
        destinationSchemaDetails={destinationSchemaDetails}
        selectedDestinationSchema={selectedDestinationSchema}
        handleDestinationSchemaSelect={handleDestinationSchemaSelect}
        destinationTableDetails={destinationTableDetails}
        selectedDestinationTables={selectedDestinationTables}
        toggleDestinationTableSelection={toggleDestinationTableSelection}
        toggleDestinationColumnSelection={toggleDestinationColumnSelection}
        removeDestinationColumn={removeDestinationColumn}
        expandedDestinationTables={expandedDestinationTables}
        toggleDestinationTableExpansion={toggleDestinationTableExpansion}
        getSelectionSummary={getSelectionSummary}
        getAllSelectedColumns={getAllSelectedColumns}
        cardId={`${stepCardId}-destination`}
        stepCardId={stepCardId}
      />
    </div>
      <div className="flex items-center mt-5 flex-row-reverse">
      <Button className="bg-blue-950 hover:bg-blue-900">Submit</Button>
      </div>
    </div>
  )
}

