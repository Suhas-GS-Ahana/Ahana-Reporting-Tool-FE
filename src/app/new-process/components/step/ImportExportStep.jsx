import { ArrowRight } from "lucide-react"
import SourceDBCard from "./SourceDBCard"
import DestinationDBCard from "./DestinationDBCard"

export default function ImportExportStep({
  connectionsDetails,
  schemaDetails,
  handleSchemaSelect,
  tableDetails,
  connections,
  handleConnectionSelect,
  connectionDetails,
  selectedTables,
  toggleTableSelection,
  toggleColumnSelection,
  expandedTables,
  toggleTableExpansion,
  selectedDestinationTables,
  toggleDestinationTableSelection,
  toggleDestinationColumnSelection,
  expandedDestinationTables,
  toggleDestinationTableExpansion,
  destinationSchemaDetails,
  destinationTableDetails,
  handleDestinationSchemaSelect,
  handleDestinationConnectionSelect,
  destinationConnectionDetails,
  getSelectionSummary,
}) {
  return (
    <div className="flex gap-4 items-stretch">
      <SourceDBCard
        connectionsDetails={connectionsDetails}
        schemaDetails={schemaDetails}
        handleSchemaSelect={handleSchemaSelect}
        tableDetails={tableDetails}
        selectedTables={selectedTables}
        toggleTableSelection={toggleTableSelection}
        toggleColumnSelection={toggleColumnSelection}
        expandedTables={expandedTables}
        toggleTableExpansion={toggleTableExpansion}
        getSelectionSummary={getSelectionSummary}
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
        handleDestinationSchemaSelect={handleDestinationSchemaSelect}
        destinationTableDetails={destinationTableDetails}
        selectedDestinationTables={selectedDestinationTables}
        toggleDestinationTableSelection={toggleDestinationTableSelection}
        toggleDestinationColumnSelection={toggleDestinationColumnSelection}
        expandedDestinationTables={expandedDestinationTables}
        toggleDestinationTableExpansion={toggleDestinationTableExpansion}
        getSelectionSummary={getSelectionSummary}
      />
    </div>
  )
}

