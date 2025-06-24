"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash,
  ChevronRight,
  Component,
  Trash2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

//new imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import  {useSortable}  from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

// on overlay UI to show while laoding
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
      <Loader2 className="h-8 w-8 mb-4 animate-spin text-blue-600" />
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

// This component allows users to: Create a new process with a name, Add multiple subprocesses to the process,
// Add multiple steps to each subprocess, Configure each step with different types and properties,
// Save the entire process structure to an API endpoint (/process-hierarchy)
export default function CreateProcess() {
  const [processName, setProcessName] = useState(""); //Stores the name of the overall process
  const [subprocesses, setSubprocesses] = useState([]); //An array that contains all subprocess objects
  const [loading, setLoading] = useState(false); //to handle loading state while API calls
  const [loadingSave, setLoadingSave] = useState(false); //to handle loading state while saving the process
  const [connections, setConnections] = useState([]); //An array of objects to store the connections (data sources)
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  }); // for displaying notification msgs

  const { toast } = useToast();

  // Add sensors for subprocess drag and drop
  const subprocessSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // run fetchConnections on load
  useEffect(() => {
    fetchConnections();
  }, []);

  //to fetch all available connections (/connection)
  const fetchConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/connection`);
      if (!response.ok) {
        throw new Error("Failed to fetch connections");
      }
      const { data } = await response.json();
      setConnections(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connections",
      });
    } finally {
      setLoading(false);
    }
  };

  //Subprocess Management - addSubprocess, updateSubprocessName, deleteSubprocess

  // Function to add a new subprocess
  const addSubprocess = () => {
    const newSubprocess = {
      id: Date.now(),
      subprocess_no: subprocesses.length + 1,
      subprocess_name: "",
      steps: [],
    };
    setSubprocesses([...subprocesses, newSubprocess]);
  };

  // Function to update subprocess name
  const updateSubprocessName = (subprocessId, name) => {
    setSubprocesses(
      subprocesses.map((subprocess) =>
        subprocess.id === subprocessId
          ? { ...subprocess, subprocess_name: name }
          : subprocess
      )
    );
  };

  // Function to delete subprocess
  const deleteSubprocess = (subprocessId) => {
    const updatedSubprocesses = subprocesses.filter((subprocess) => subprocess.id !== subprocessId);
    // Update subprocess numbers after deletion
    const renumberedSubprocesses = updatedSubprocesses.map((subprocess, index) => ({
      ...subprocess,
      subprocess_no: index + 1,
    }));
    setSubprocesses(renumberedSubprocesses);
  };

  // Function to handle subprocess drag end
  const handleSubprocessDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subprocesses.findIndex(subprocess => subprocess.id === active.id);
      const newIndex = subprocesses.findIndex(subprocess => subprocess.id === over.id);
      
      // Reorder the subprocesses array
      const reorderedSubprocesses = arrayMove(subprocesses, oldIndex, newIndex);
      
      // Update subprocess numbers based on new positions
      const updatedSubprocesses = reorderedSubprocesses.map((subprocess, index) => ({
        ...subprocess,
        subprocess_no: index + 1
      }));

      setSubprocesses(updatedSubprocesses);
    }
  };

  // Step Management - addStep, updateStep, deleteStep

  // Function to add a step to a subprocess
  const addStep = (subprocessId) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const newSteps = [...subprocesses[subprocessIndex].steps];
      newSteps.push({
        id: Date.now(),
        step_no: newSteps.length + 1,
        step_type: "",
        connection_id: "",
        destination_connection_id: "",
        source_tables: [],
        destination_tables: [],
        selected_tables: [],
        pq_description: "",
        pq_query: [],
        ex_description: "",
        ex_query: [],
        source_details: null,
        destination_details: null,
        create_table: [],
      });

      const updatedSubprocesses = [...subprocesses];
      updatedSubprocesses[subprocessIndex].steps = newSteps;
      setSubprocesses(updatedSubprocesses);
    }
  };

  const updateStep = (subprocessId, stepId, field, value) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const stepIndex = subprocesses[subprocessIndex].steps.findIndex(
        (step) => step.id === stepId
      );
      if (stepIndex !== -1) {
        const updatedSubprocesses = [...subprocesses];

        // Special handling for pq_query to ensure it's always an array
        if (field === "pq_query") {
          updatedSubprocesses[subprocessIndex].steps[stepIndex][field] =
            Array.isArray(value) ? value : [value];
        } else {
          updatedSubprocesses[subprocessIndex].steps[stepIndex][field] = value;
        }

        setSubprocesses(updatedSubprocesses);
      }
    }
  };

  // Function to delete a step
  const deleteStep = (subprocessId, stepId) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const updatedSteps = subprocesses[subprocessIndex].steps.filter(
        (step) => step.id !== stepId
      );
      const renamedSteps = updatedSteps.map((step, index) => ({
        ...step,
        step_no: index + 1,
      }));

      const updatedSubprocesses = [...subprocesses];
      updatedSubprocesses[subprocessIndex].steps = renamedSteps;
      setSubprocesses(updatedSubprocesses);
    }
  };

  // Function to update entire subprocess steps array (for drag and drop reordering)
  const updateSubprocessSteps = (subprocessId, newSteps) => {
    setSubprocesses(
      subprocesses.map((subprocess) =>
        subprocess.id === subprocessId
          ? { ...subprocess, steps: newSteps }
          : subprocess
      )
    );
  };

  // Helper function to get connection details by ID
  const getConnectionDetails = (connectionId) => {
    return connections.find(
      (conn) => conn.data_sources_id.toString() === connectionId.toString()
    );
  };

  // Function to save the entire process
  const saveProcess = async () => {
    // Validates that a process name is provided
    if (!processName.trim()) {
      setNotification({
        show: true,
        message: "Please enter a process name",
        type: "default",
      });
      return;
    }

    //begin-------------------------------------------------------------------------------

    // Helper function to fetch column details for a table
    const fetchColumnDetails = async (connectionId, schemaName, tableName) => {
      try {
        const response = await fetch(
          `${baseURL}/connection-columns?conn_id=${connectionId}&schema_name=${schemaName}&table_name=${tableName}`
        );
        const result = await response.json();

        if (result.status === "success") {
          return result.data.map((column, index) => ({
            p_inserted_by: 1,
            p_modified_by: 1,
            p_column_name: column.column_name,
            p_datatype: column.data_type,
            p_length: column.character_maximum_length,
            p_precision: column.numeric_precision,
            p_scale: column.numeric_scale,
            p_is_primary_key: column.is_primary_key,
            p_isautogenerated: column.is_identity,
            p_ordinal_position: column.ordinal_position,
            p_nullable: column.is_nullable,
          }));
        }
        return [];
      } catch (error) {
        console.error(
          `Error fetching columns for ${schemaName}.${tableName}:`,
          error
        );
        return [];
      }
    };

    // Helper function to create table mappings
    const createTableMappings = async (
      createTableData,
      sourceConnectionId,
      sourceConnectionDetails,
      destinationConnectionId,
      destinationConnectionDetails
    ) => {
      const tableMappings = await Promise.all(
        createTableData.map(
          async ({ schema_name, table_name, dest_schema_name }) => {
            // Fetch source columns
            const sourceColumns = await fetchColumnDetails(
              sourceConnectionId,
              schema_name,
              table_name
            );

            // Fetch destination columns (only if table exists)
            const destColumns = await fetchColumnDetails(
              destinationConnectionId,
              dest_schema_name,
              table_name
            );

            // Create mappings between source and destination columns
            const mappings = sourceColumns.map((sourceCol, index) => {
              // Try to find matching destination column by name or use index-based mapping
              const destCol =
                destColumns.find(
                  (col) =>
                    col.p_column_name.toLowerCase() ===
                    sourceCol.p_column_name.toLowerCase()
                ) ||
                destColumns[index] ||
                destColumns[0]; // Fallback to index or first column

              return {
                p_inserted_by: 1,
                p_modified_by: 1,
                p_source_conn_id: Number(sourceConnectionId),
                p_source_db: sourceConnectionDetails.database_name,
                p_source_schema: schema_name,
                p_source_table: table_name,
                p_source_column: sourceCol.p_column_name,
                p_source_data_type: sourceCol.p_datatype,
                p_dest_conn_id: Number(destinationConnectionId),
                p_dest_db: destinationConnectionDetails.database_name,
                p_dest_schema: dest_schema_name,
                p_dest_table: table_name,
                p_dest_column: destCol
                  ? destCol.p_column_name
                  : sourceCol.p_column_name,
                p_dest_data_type: destCol
                  ? destCol.p_datatype
                  : sourceCol.p_datatype,
                p_ordinal_position: sourceCol.p_ordinal_position,
              };
            });

            return mappings;
          }
        )
      );

      return tableMappings;
    };

    // Main function to format data
    const formatDataWithConfigDetails = async (processName, subprocesses) => {
      const formattedSubprocesses = await Promise.all(
        subprocesses.map(async (sp) => ({
          subprocess_data: {
            p_inserted_by: 1,
            p_modified_by: 1,
            p_sub_process_order: sp.subprocess_no,
            p_sub_process_name: sp.subprocess_name,
          },
          steps: await Promise.all(
            sp.steps.map(async (step) => {
              if (step.step_type === "import") {
                // Use create_table data which contains the complete mapping info
                const createTableData = step.create_table || [];

                // Fetch column details for each table - create pairs for source and destination
                const tableConfigDetails = await Promise.all(
                  createTableData.map(
                    async ({ schema_name, table_name, dest_schema_name }) => [
                      // First entry for source table
                      await fetchColumnDetails(
                        step.connection_id,
                        schema_name,
                        table_name
                      ),
                      // Second entry for destination table (or same source table if needed)
                      await fetchColumnDetails(
                        step.connection_id,
                        schema_name,
                        table_name
                      ),
                    ]
                  )
                );

                // Create table mappings using create_table data
                const tableMappings = await createTableMappings(
                  createTableData,
                  step.connection_id,
                  step.source_details,
                  step.destination_connection_id,
                  step.destination_details
                );

                return {
                  steps: {
                    p_inserted_by: 1,
                    p_modified_by: 1,
                    p_process_step_order: step.step_no,
                    p_process_step_action: step.step_type,
                    p_source_conn_id: Number(step.connection_id),
                    p_dest_conn_id: Number(step.destination_connection_id),
                  },
                  create_table: createTableData.map(
                    ({
                      schema_name,
                      table_name,
                      dest_schema_name,
                      is_table_exist,
                    }) => ({
                      table_name: table_name,
                      source_schema_name: schema_name,
                      dest_schema_name: dest_schema_name,
                      is_table_exist: is_table_exist,
                    })
                  ),
                  table_config: createTableData.map(
                    ({ schema_name, table_name, dest_schema_name }) => [
                      // Source table config
                      {
                        p_inserted_by: 1,
                        p_modified_by: 1,
                        p_connection_name: step.source_details.connection_name,
                        p_database_name: step.source_details.database_name,
                        p_schema_name: schema_name,
                        p_table_name: table_name,
                        p_is_temp_table: false,
                        p_table_type: "source",
                        p_table_category: "import",
                        p_is_upsert: false,
                      },
                      // Destination table config
                      {
                        p_inserted_by: 1,
                        p_modified_by: 1,
                        p_connection_name:
                          step.destination_details.connection_name,
                        p_database_name: step.destination_details.database_name,
                        p_schema_name: dest_schema_name,
                        p_table_name: table_name,
                        p_is_temp_table: false,
                        p_table_type: "destination",
                        p_table_category: "import",
                        p_is_upsert: true,
                      },
                    ]
                  ),
                  table_config_details: tableConfigDetails,
                  table_mapping: tableMappings,
                };
              } else if (step.step_type === "process-query") {
                return {
                  steps: {
                    p_inserted_by: 1,
                    p_modified_by: 1,
                    p_process_step_order: step.step_no,
                    p_process_step_action: "process-query",
                    p_process_step_description: step.pq_description,
                    p_process_step_query: step.pq_query,
                    p_source_conn_id: Number(step.connection_id),
                  },
                  create_table: [],
                  table_config: [],
                  table_config_details: [],
                  table_mapping: [],
                };
              } else {
                // Export step
                return {
                  steps: {
                    p_inserted_by: 1,
                    p_modified_by: 1,
                    p_process_step_order: step.step_no,
                    p_process_step_action: "export",
                    p_process_step_description: step.ex_description,
                    p_process_step_query: step.ex_query,
                    p_source_conn_id: Number(step.connection_id),
                  },
                  create_table: [],
                  table_config: [],
                  table_config_details: [],
                  table_mapping: [],
                };
              }
            })
          ),
        }))
      );

      return {
        process: {
          p_inserted_by: 1,
          p_modified_by: 1,
          p_process_name: processName,
          p_process_version: 1,
          p_rerun: true,
        },
        subprocesses: formattedSubprocesses,
      };
    };

    // Usage - simplified parameters since step data now contains all needed info
    const formattedData = await formatDataWithConfigDetails(
      processName,
      subprocesses
    );

    console.log(formattedData);

    //end---------------------------------------------------------------------------------

    setLoading(true);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${baseURL}/process-hierarchy-upsert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        console.log(formattedData);
        setNotification({
          show: true,
          message: "Process created successfully!",
          type: "success",
        });

        setTimeout(() => {
          router.push("/process");
        }, 500); // Redirect after 1.5 seconds
        // Optional: Reset form or redirect
      } else {
        const errorData = await response.json();
        setNotification({
          show: true,
          message: errorData.message || "Failed to create process",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating process:", error);
      setNotification({
        show: true,
        message: "An error occurred while saving the process",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Loading Screen */}
      {loading && <LoadingOverlay />}
      {/* Header - function called - saveProcess */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Process</h1>
        <Button onClick={saveProcess} disabled={loading}>
          {loading ? "Saving..." : "Save Process"}
        </Button>
      </div>
      {/* Notification */}
      {notification.show && (
        <Alert
          className={`mb-6 ${
            notification.type === "error"
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <AlertDescription
            className={
              notification.type === "error" ? "text-red-700" : "text-green-700"
            }
          >
            {notification.message}
          </AlertDescription>
        </Alert>
      )}
      {/* Main Process Card - function called - addSubprocess */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Process Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Process Name
              </label>
              <Input
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="Enter process name"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addSubprocess} className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Subprocess
          </Button>
        </CardFooter>
      </Card>

      {/* Draggable Subprocess Cards */}
      <DndContext
        sensors={subprocessSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSubprocessDragEnd}
      >
        <SortableContext
          items={subprocesses.map(subprocess => subprocess.id)}
          strategy={verticalListSortingStrategy}
        >
          {subprocesses.map((subprocess) => (
            <DraggableSubprocessCard
              key={subprocess.id}
              subprocess={subprocess}
              connections={connections}
              updateSubprocessName={updateSubprocessName}
              deleteSubprocess={deleteSubprocess}
              addStep={addStep}
              updateStep={updateStep}
              deleteStep={deleteStep}
              updateSubprocessSteps={updateSubprocessSteps}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}

// New Draggable SubprocessCard component
function DraggableSubprocessCard({
  subprocess,
  connections,
  updateSubprocessName,
  deleteSubprocess,
  addStep,
  updateStep,
  deleteStep,
  updateSubprocessSteps,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subprocess.id });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle drag end event for steps within this subprocess
  const handleStepDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subprocess.steps.findIndex(step => step.id === active.id);
      const newIndex = subprocess.steps.findIndex(step => step.id === over.id);
      
      // Reorder the steps array
      const reorderedSteps = arrayMove(subprocess.steps, oldIndex, newIndex);
      
      // Update step numbers based on new positions
      const updatedSteps = reorderedSteps.map((step, index) => ({
        ...step,
        step_no: index + 1
      }));

      // Update the subprocess with new step order
      updateSubprocessSteps(subprocess.id, updatedSteps);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`mb-6 ${isDragging ? 'shadow-lg' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 flex-1 mr-4">
              {/* Drag handle for subprocess */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Subprocess {subprocess.subprocess_no} Name
                </label>
                <Input
                  value={subprocess.subprocess_name}
                  onChange={(e) =>
                    updateSubprocessName(subprocess.id, e.target.value)
                  }
                  placeholder="Enter subprocess name"
                  className="w-full"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSubprocess(subprocess.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleStepDragEnd}
            >
              <SortableContext
                items={subprocess.steps.map(step => step.id)}
                strategy={verticalListSortingStrategy}
              >
                {subprocess.steps.map((step) => (
                  <DraggableStepCard
                    key={step.id}
                    step={step}
                    subprocessId={subprocess.id}
                    connections={connections}
                    updateStep={updateStep}
                    deleteStep={deleteStep}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => addStep(subprocess.id)}
            variant="outline"
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Step
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
// New Draggable StepCard component
function DraggableStepCard({ step, subprocessId, connections, updateStep, deleteStep }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`border border-gray-200 ${isDragging ? 'shadow-lg' : ''}`}>
        <CardHeader className="pb-2 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {/* Drag handle */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
              >
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <CardTitle className="text-md font-medium">
                Step {step.step_no}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={step.step_type}
                onValueChange={(value) =>
                  updateStep(subprocessId, step.id, "step_type", value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="process-query">Process Query</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteStep(subprocessId, step.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {step.step_type === "import" ? (
            <ImportStepContent
              step={step}
              subprocessId={subprocessId}
              stepId={step.id}
              connections={connections}
              updateStep={updateStep}
            />
          ) : step.step_type === "process-query" ? (
            <QueryStepContent
              step={step}
              subprocessId={subprocessId}
              stepId={step.id}
              connections={connections}
              updateStep={updateStep}
            />
          ) : step.step_type === "export" ? (
            <ExportStepContent
              step={step}
              subprocessId={subprocessId}
              stepId={step.id}
              connections={connections}
              updateStep={updateStep}
            />
          ) : (
            <div className="border">
              <div className="text-center text-sm text-gray-500 p-5">
                Please select the step type
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// This component configures table import between source & destination databases
// Key data fetched - create_table: [{table_name, schema_name, dest_schema_name, is_table_exist}]
function ImportStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  const [sourceSchemas, setSourceSchemas] = useState([]);
  const [selectedSourceSchema, setSelectedSourceSchema] = useState("");
  const [sourceTables, setSourceTables] = useState([]);
  const [destinationSchemas, setDestinationSchemas] = useState([]);
  const [selectedDestinationSchema, setSelectedDestinationSchema] =
    useState("");
  const [loading, setLoading] = useState(false);
  const [destinationTables, setDestinationTables] = useState([]);

  // Handle source connection change with connection details fetch
  const handleSourceConnectionChange = async (connectionId) => {
    try {
      // Update connection_id
      updateStep(subprocessId, stepId, "connection_id", connectionId);

      // Fetch and store source connection details
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();
      updateStep(subprocessId, stepId, "source_details", data.data);
    } catch (error) {
      console.error("Error fetching source connection details:", error);
    }
  };

  // Handle destination connection change with connection details fetch
  const handleDestinationConnectionChange = async (connectionId) => {
    try {
      // Update destination_connection_id
      updateStep(
        subprocessId,
        stepId,
        "destination_connection_id",
        connectionId
      );

      // Fetch and store destination connection details
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();
      updateStep(subprocessId, stepId, "destination_details", data.data);
    } catch (error) {
      console.error("Error fetching destination connection details:", error);
    }
  };

  // Fetch source schemas when source connection changes
  useEffect(() => {
    if (step.connection_id) {
      fetchSourceSchemas();
    } else {
      setSourceSchemas([]);
      setSelectedSourceSchema("");
      setSourceTables([]);
    }
  }, [step.connection_id]);

  // Fetch destination schemas when destination connection changes
  useEffect(() => {
    if (step.destination_connection_id) {
      fetchDestinationSchemas();
    } else {
      setDestinationSchemas([]);
      setSelectedDestinationSchema("");
      setDestinationTables([]);
      // Clear destination_tables when destination connection changes
      updateStep(subprocessId, stepId, "destination_tables", []);
    }
  }, [step.destination_connection_id]);

  // Fetch source tables when source schema changes
  useEffect(() => {
    if (selectedSourceSchema && step.connection_id) {
      fetchSourceTables();
    }
  }, [selectedSourceSchema, step.connection_id]);

  // Fetch destination tables when destination schema changes
  useEffect(() => {
    if (selectedDestinationSchema && step.destination_connection_id) {
      fetchDestinationTables();
    }
  }, [selectedDestinationSchema, step.destination_connection_id]);

  const fetchSourceSchemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-schema?conn_id=${step.connection_id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setSourceSchemas(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching source schemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationSchemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-schema?conn_id=${step.destination_connection_id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setDestinationSchemas(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching destination schemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSourceTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-tables?conn_id=${step.connection_id}&schema_name=${selectedSourceSchema}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setSourceTables(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching source tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-tables?conn_id=${step.destination_connection_id}&schema_name=${selectedDestinationSchema}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setDestinationTables(data.data);
          // Update step with destination tables (only table names)
          const tableNames = data.data.map((table) => table.table_name);
          updateStep(subprocessId, stepId, "destination_tables", tableNames);
          // Update create_table after destination tables are fetched
          updateCreateTable();
        }
      }
    } catch (error) {
      console.error("Error fetching destination tables:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to update create_table array
  const updateCreateTable = () => {
    if (step.selected_tables && step.selected_tables.length > 0) {
      const createTableData = step.selected_tables.map((selectedTable) => ({
        table_name: selectedTable.table_name,
        schema_name: selectedTable.schema_name,
        dest_schema_name: selectedDestinationSchema,
        is_table_exist: step.destination_tables.includes(
          selectedTable.table_name
        ),
      }));
      updateStep(subprocessId, stepId, "create_table", createTableData);
    }
  };

  // Update create_table whenever selected_tables or destination_tables change
  useEffect(() => {
    updateCreateTable();
  }, [
    step.selected_tables,
    step.destination_tables,
    selectedDestinationSchema,
  ]);

  // Check if any tables are selected
  const hasSelectedTables =
    step.selected_tables && step.selected_tables.length > 0;

  const handleSourceSchemaChange = (schema) => {
    setSelectedSourceSchema(schema);
    // Clear source tables and selected tables when schema changes
    // updateStep(subprocessId, stepId, "selected_tables", []);
    // updateStep(subprocessId, stepId, "create_table", []);
  };

  const handleDestSchemaChange = (schema) => {
    setSelectedDestinationSchema(schema);
    // Update create_table when destination schema changes
    setTimeout(() => updateCreateTable(), 100);
  };

  const handleSourceTableChange = (tableName, isChecked) => {
    let updatedSelectedTables = [...(step.selected_tables || [])];

    if (isChecked) {
      const tableExists = updatedSelectedTables.some(
        (item) =>
          item.table_name === tableName &&
          item.schema_name === selectedSourceSchema
      );

      if (!tableExists) {
        updatedSelectedTables.push({
          table_name: tableName,
          schema_name: selectedSourceSchema,
        });
      }
    } else {
      updatedSelectedTables = updatedSelectedTables.filter(
        (item) =>
          !(
            item.table_name === tableName &&
            item.schema_name === selectedSourceSchema
          )
      );
    }

    updateStep(subprocessId, stepId, "selected_tables", updatedSelectedTables);
  };

  const isTableSelected = (tableName) => {
    if (step.selected_tables) {
      return step.selected_tables.some(
        (item) =>
          item.table_name === tableName &&
          item.schema_name === selectedSourceSchema
      );
    }
    return false;
  };

  // Check if table selection should be available
  const isTableSelectionAvailable =
    step.connection_id &&
    selectedSourceSchema &&
    step.destination_connection_id &&
    selectedDestinationSchema;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Database Section */}
        <Card className="border border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-700">Source Database</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Source Connection Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Connection
                </label>
                <Select
                  value={step.connection_id}
                  onValueChange={handleSourceConnectionChange}
                  disabled={hasSelectedTables}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections
                      .filter(
                        (conn) =>
                          conn.data_sources_id.toString() !==
                          step.destination_connection_id
                      )
                      .map((conn) => (
                        <SelectItem
                          key={conn.data_sources_id}
                          value={conn.data_sources_id.toString()}
                        >
                          {conn.connection_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change connection
                  </p>
                )}
              </div>

              {/* Display Source Connection Details */}
              {step.source_details && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-blue-700">
                    Source Connection Details:
                  </h4>
                  <div className="text-sm text-blue-600 space-y-1">
                    <p>
                      <span className="font-medium">Database:</span>{" "}
                      {step.source_details.database_name}
                    </p>
                    <p>
                      <span className="font-medium">Server:</span>{" "}
                      {step.source_details.server_name}:
                      {step.source_details.port_number}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {step.source_details.database_type}
                    </p>
                  </div>
                </div>
              )}

              {/* Source Schema Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Schema</label>
                <Select
                  value={selectedSourceSchema}
                  onValueChange={handleSourceSchemaChange}
                  disabled={!step.connection_id || loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceSchemas.map((schema) => (
                      <SelectItem
                        key={schema.schema_name}
                        value={schema.schema_name}
                      >
                        {schema.schema_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change schema
                  </p>
                )}
              </div>

              {/* Source Tables */}
              {selectedSourceSchema && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tables
                  </label>
                  {!isTableSelectionAvailable ? (
                    <div className="py-3 px-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
                      Please select both source and destination connections and
                      schemas to view tables
                    </div>
                  ) : loading ? (
                    <div className="text-center py-4">Loading tables...</div>
                  ) : (
                    <>
                      {sourceTables.length > 0 ? (
                        <ScrollArea className="h-60 border rounded-md p-4">
                          <div className="space-y-2">
                            {sourceTables.map((table) => (
                              <div
                                key={table.table_name}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`source-${table.table_name}`}
                                  checked={isTableSelected(table.table_name)}
                                  onCheckedChange={(checked) =>
                                    handleSourceTableChange(
                                      table.table_name,
                                      checked
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`source-${table.table_name}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {table.table_name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="py-3 px-4 bg-gray-100 rounded text-gray-600 text-sm">
                          No tables exist in this schema
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Destination Database Section */}
        <Card className="border border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-700">
              Destination Database
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Destination Connection Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Connection
                </label>
                <Select
                  value={step.destination_connection_id}
                  onValueChange={handleDestinationConnectionChange}
                  disabled={hasSelectedTables}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections
                      .filter(
                        (conn) =>
                          conn.data_sources_id.toString() !== step.connection_id
                      )
                      .map((conn) => (
                        <SelectItem
                          key={conn.data_sources_id}
                          value={conn.data_sources_id.toString()}
                        >
                          {conn.connection_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change connection
                  </p>
                )}
              </div>

              {/* Display Destination Connection Details */}
              {step.destination_details && (
                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2 text-green-700">
                    Destination Connection Details:
                  </h4>
                  <div className="text-sm text-green-600 space-y-1">
                    <p>
                      <span className="font-medium">Database:</span>{" "}
                      {step.destination_details.database_name}
                    </p>
                    <p>
                      <span className="font-medium">Server:</span>{" "}
                      {step.destination_details.server_name}:
                      {step.destination_details.port_number}
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      {step.destination_details.database_type}
                    </p>
                  </div>
                </div>
              )}

              {/* Destination Schema Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Schema</label>
                <Select
                  value={selectedDestinationSchema}
                  onValueChange={handleDestSchemaChange}
                  disabled={
                    !step.destination_connection_id ||
                    loading ||
                    hasSelectedTables
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select schema" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinationSchemas.map((schema) => (
                      <SelectItem
                        key={schema.schema_name}
                        value={schema.schema_name}
                      >
                        {schema.schema_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasSelectedTables && (
                  <p className="text-xs text-amber-600 mt-1">
                    Uncheck all tables to change schema
                  </p>
                )}
              </div>

              {/* Destination Tables Display */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Available Tables in Destination Schema
                </label>
                {destinationTables.length > 0 ? (
                  <ScrollArea className="h-40 border rounded-md p-4">
                    <div className="space-y-1">
                      {destinationTables.map((table) => (
                        <div
                          key={table.table_name}
                          className="text-sm text-gray-600"
                        >
                          {table.table_name}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : selectedDestinationSchema ? (
                  <div className="py-3 px-4 bg-gray-100 rounded text-gray-600 text-sm">
                    No tables exist in this destination schema
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Select a destination schema to view available tables
                  </div>
                )}
              </div>

              {/* Selected Tables Display */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Selected Tables for Import
                </label>
                {step.selected_tables && step.selected_tables.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.selected_tables.map((table, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-green-50"
                      >
                        {table.table_name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Tables will appear here when selected from source
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Creation Summary */}
      {step.create_table && step.create_table.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Table Creation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {step.create_table.map((table, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Component className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{table.table_name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>{table.schema_name}</span>
                      <ChevronRight className="h-4 w-4" />
                      <span>{table.dest_schema_name}</span>
                    </div>
                    <Badge
                      variant={table.is_table_exist ? "default" : "secondary"}
                      className={
                        table.is_table_exist
                          ? "bg-green-100 text-green-800"
                          : "bg-orange-100 text-orange-800"
                      }
                    >
                      {table.is_table_exist ? "Exists" : "Will Create"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// This component manages the query, description & connection of a process query step
function QueryStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  // Handle connection selection and fetch details
  const handleConnectionChange = async (connectionId) => {
    try {
      // Update the connection_id first
      updateStep(subprocessId, stepId, "connection_id", connectionId);

      // Fetch connection details from API
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();

      // Update source_details with the fetched data
      updateStep(subprocessId, stepId, "source_details", data.data);
    } catch (error) {
      console.error("Error fetching connection details:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Connection</label>
        <Select
          value={step.connection_id}
          onValueChange={handleConnectionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select connection" />
          </SelectTrigger>
          <SelectContent>
            {connections.map((conn) => (
              <SelectItem
                key={conn.data_sources_id}
                value={conn.data_sources_id.toString()}
              >
                {conn.connection_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Connection Details (if available) */}
      {step.source_details && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Connection Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Database:</span>{" "}
              {step.source_details.database_name}
            </p>
            <p>
              <span className="font-medium">Server:</span>{" "}
              {step.source_details.server_name}:
              {step.source_details.port_number}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {step.source_details.database_type}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={step.pq_description}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "pq_description", e.target.value)
          }
          placeholder="Describe what this query does..."
          rows={3}
        />
      </div>

      {/* Query */}
      <div>
        <label className="block text-sm font-medium mb-1">SQL Query</label>
        <Textarea
          value={step.pq_query}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "pq_query", e.target.value)
          }
          placeholder="Enter your SQL query here..."
          rows={8}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

// This component manages the queries, description & connection of a export step
function ExportStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  const [queryList, setQueryList] = useState(step.ex_query || []);

  const addQuery = () => {
    const newQuery = "";
    const updatedQueries = [...queryList, newQuery];
    setQueryList(updatedQueries);
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  const updateQuery = (index, value) => {
    const updatedQueries = [...queryList];
    updatedQueries[index] = value;
    setQueryList(updatedQueries);
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  const removeQuery = (index) => {
    const updatedQueries = queryList.filter((_, i) => i !== index);
    setQueryList(updatedQueries);
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  // Handle connection selection and fetch details
  const handleConnectionChange = async (connectionId) => {
    try {
      // Update the connection_id first
      updateStep(subprocessId, stepId, "connection_id", connectionId);

      // Fetch connection details from API
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      const data = await response.json();

      // Update source_details with the fetched data
      updateStep(subprocessId, stepId, "source_details", data.data);
    } catch (error) {
      console.error("Error fetching connection details:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Connection</label>
        <Select
          value={step.connection_id}
          onValueChange={handleConnectionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select connection" />
          </SelectTrigger>
          <SelectContent>
            {connections.map((conn) => (
              <SelectItem
                key={conn.data_sources_id}
                value={conn.data_sources_id.toString()}
              >
                {conn.connection_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Display Connection Details (if available) */}
      {step.source_details && (
        <div className="bg-gray-50 p-3 rounded-md">
          <h4 className="text-sm font-medium mb-2">Connection Details:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Database:</span>{" "}
              {step.source_details.database_name}
            </p>
            <p>
              <span className="font-medium">Server:</span>{" "}
              {step.source_details.server_name}:
              {step.source_details.port_number}
            </p>
            <p>
              <span className="font-medium">Type:</span>{" "}
              {step.source_details.database_type}
            </p>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          value={step.ex_description}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "ex_description", e.target.value)
          }
          placeholder="Describe what this export does..."
          rows={3}
        />
      </div>

      {/* Queries */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Export Queries</label>
          <Button onClick={addQuery} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add Query
          </Button>
        </div>

        <div className="space-y-3">
          {queryList.map((query, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Query {index + 1}</span>
                <Button
                  onClick={() => removeQuery(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={query}
                onChange={(e) => updateQuery(index, e.target.value)}
                placeholder="Enter your export query here..."
                rows={4}
                className="font-mono text-sm"
              />
            </div>
          ))}

          {queryList.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No queries added yet. Click "Add Query" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
