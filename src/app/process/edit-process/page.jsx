"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Plus, Trash, ChevronRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function EditProcess() {
  // Router setup for navigation
  const router = useRouter();
  const searchParams = useSearchParams();
  const processId = searchParams.get("processId");
  const connectionId = searchParams.get("connectionName");

  // State variables
  const [connectionsDetails, setConnectionsDetails] = useState(null);
  const [processName, setProcessName] = useState("");
  const [processVersion, setProcessVersion] = useState(1);
  const [rerun, setRerun] = useState(false);
  const [subprocesses, setSubprocesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Fetch process data and connection details on load
  useEffect(() => {
    if (processId) {
      fetchProcessData(processId);
    }
    if (connectionId) {
      fetchConnection(connectionId);
    }
  }, [processId, connectionId]);

  // Fetch connection details
  const fetchConnection = async (connectionId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-view?conn_id=${connectionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch connection details");
      }
      const { data } = await response.json();
      setConnectionsDetails(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connection details",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch process hierarchy data
  const fetchProcessData = async (processId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/get-full-hierarchy/${processId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch process data");
      }
      const data = await response.json();
      populateFormData(data);
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to load process data",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Populate form with fetched data
  const populateFormData = (data) => {
    if (!data) return;

    // Set process details
    setProcessName(data.process.process_name);
    setProcessVersion(data.process.process_version);
    setRerun(data.process.rerun);

    // Map and set subprocesses
    const mappedSubprocesses = data.subprocesses.map((sp) => {
      return {
        id: sp.sub_process_id,
        guid: sp.sub_process_guid,
        subprocess_no: sp.sub_process_order,
        subprocess_name: sp.sub_process_name,
        steps: sp.steps.map((step) => {
          let mappedStep = {
            id: step.process_step_id,
            guid: step.process_step_guid,
            step_no: step.process_step_order,
            step_type: step.process_step_action,
            description: step.process_step_description || "",
          };

          // Handle different step types
          if (step.process_step_action === "import") {
            // Map table configurations for import steps
            mappedStep.selected_tables = step.table_config.map((config) => ({
              schema_name: config.schema_name,
              table_name: config.table_name,
            }));

            // Create source_tables and destination_tables arrays for UI compatibility
            mappedStep.source_tables = step.table_config.map(
              (config) => config.table_name
            );
            mappedStep.destination_tables = step.table_mapping.map(
              (mapping) => mapping.dest_table
            );
            mappedStep.table_config = step.table_config;
            mappedStep.table_config_details = step.table_config_details;
            mappedStep.table_mapping = step.table_mapping;
          } else if (step.process_step_action === "process-query") {
            mappedStep.query = step.process_step_query || "";
          } else if (step.process_step_action === "export") {
            // For export steps, split query into multiple queries if needed
            mappedStep.queries = step.process_step_query
              ? [step.process_step_query]
              : [""];
          }

          return mappedStep;
        }),
      };
    });

    setSubprocesses(mappedSubprocesses);
  };

  // Subprocess Management
  const addSubprocess = () => {
    const newSubprocess = {
      id: Date.now(), // Temporary ID for new subprocesses
      subprocess_no: subprocesses.length + 1,
      subprocess_name: "",
      steps: [],
    };
    setSubprocesses([...subprocesses, newSubprocess]);
  };

  const updateSubprocessName = (subprocessId, name) => {
    setSubprocesses(
      subprocesses.map((subprocess) =>
        subprocess.id === subprocessId
          ? { ...subprocess, subprocess_name: name }
          : subprocess
      )
    );
  };

  const deleteSubprocess = (subprocessId) => {
    setSubprocesses(
      subprocesses.filter((subprocess) => subprocess.id !== subprocessId)
    );
  };

  // Step Management
  const addStep = (subprocessId) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const newSteps = [...subprocesses[subprocessIndex].steps];
      newSteps.push({
        id: Date.now(), // Temporary ID for new steps
        step_no: newSteps.length + 1,
        step_type: "",
        source_tables: [],
        destination_tables: [],
        description: "",
        query: "",
        selected_tables: [],
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
        updatedSubprocesses[subprocessIndex].steps[stepIndex][field] = value;
        setSubprocesses(updatedSubprocesses);
      }
    }
  };

  const deleteStep = (subprocessId, stepId) => {
    const subprocessIndex = subprocesses.findIndex(
      (sp) => sp.id === subprocessId
    );
    if (subprocessIndex !== -1) {
      const updatedSteps = subprocesses[subprocessIndex].steps.filter(
        (step) => step.id !== stepId
      );
      // Renumber steps
      const renamedSteps = updatedSteps.map((step, index) => ({
        ...step,
        step_no: index + 1,
      }));

      const updatedSubprocesses = [...subprocesses];
      updatedSubprocesses[subprocessIndex].steps = renamedSteps;
      setSubprocesses(updatedSubprocesses);
    }
  };

  // Function to update the process
  const updateProcess = async () => {
    // Validate that a process name is provided
    if (!processName.trim()) {
      setNotification({
        show: true,
        message: "Please enter a process name",
        type: "error",
      });
      return;
    }

    // Format data for API
    const formattedData = {
      process: {
        process_master_id: processId, // Include the process ID for update
        p_inserted_by: 1,
        p_modified_by: 1,
        p_process_name: processName,
        p_process_version: processVersion,
        p_rerun: rerun,
      },
      subprocesses: subprocesses.map((sp) => ({
        subprocess_data: {
          sub_process_id: sp.id > 1000000 ? null : sp.id, // Only include existing IDs
          p_inserted_by: 1,
          p_modified_by: 1,
          p_sub_process_order: sp.subprocess_no,
          p_sub_process_name: sp.subprocess_name,
        },
        steps: sp.steps.map((step) => {
          if (step.step_type === "import") {
            return {
              steps: {
                process_step_id: step.id > 1000000 ? null : step.id, // Only include existing IDs
                p_inserted_by: 1,
                p_modified_by: 1,
                p_data_source_id: Number(connectionId),
                p_process_step_order: step.step_no,
                p_process_step_action: step.step_type,
              },
              create_table: step.selected_tables,
              table_config_full: step.selected_tables.map(
                ({ schema_name, table_name }) => {
                  return {
                    table_config: {
                      p_inserted_by: 1,
                      p_modified_by: 1,
                      p_connection_name: connectionsDetails?.connection_name,
                      p_database_name: connectionsDetails?.database_name,
                      p_schema_name: schema_name,
                      p_table_name: table_name,
                      p_is_temp_table: false,
                      p_table_type: "staging",
                      p_table_category: "raw",
                      p_is_upsert: false,
                    },
                    details: [
                      {
                        p_inserted_by: 1,
                        p_modified_by: 1,
                        p_column_name: "id",
                        p_datatype: "int",
                        p_length: 0,
                        p_precision: 0,
                        p_scale: 0,
                        p_is_primary_key: true,
                        p_isautogenerated: true,
                        p_ordinal_position: 1,
                        p_nullable: false,
                      },
                      {
                        p_inserted_by: 1,
                        p_modified_by: 1,
                        p_column_name: "name",
                        p_datatype: "char",
                        p_length: 255,
                        p_precision: 0,
                        p_scale: 0,
                        p_is_primary_key: false,
                        p_isautogenerated: false,
                        p_ordinal_position: 2,
                        p_nullable: false,
                      },
                    ],
                  };
                }
              ),
              table_mapping: step.selected_tables.map(
                ({ schema_name, table_name }) => {
                  return {
                    p_inserted_by: 1,
                    p_modified_by: 1,
                    p_source_conn_id: connectionId,
                    p_source_db: connectionsDetails?.database_name,
                    p_source_schema: schema_name,
                    p_source_table: table_name,
                    p_source_column: "id",
                    p_source_data_type: "INTEGER",
                    p_dest_conn_id: 3,
                    p_dest_db: "ReportingToolDEV",
                    p_dest_schema: "destination_schema",
                    p_dest_table: "products",
                    p_dest_column: "prod_id",
                    p_dest_data_type: "INTEGER",
                    p_ordinal_position: 1,
                  };
                }
              ),
            };
          } else if (step.step_type === "process-query") {
            return {
              steps: {
                process_step_id: step.id > 1000000 ? null : step.id,
                p_inserted_by: 1,
                p_modified_by: 1,
                p_data_source_id: Number(connectionId),
                p_process_step_order: step.step_no,
                p_process_step_action: "process-query",
                p_process_step_description: step.description,
                p_process_step_query: step.query,
              },
            };
          } else if (step.step_type === "export") {
            return {
              steps: {
                process_step_id: step.id > 1000000 ? null : step.id,
                p_inserted_by: 1,
                p_modified_by: 1,
                p_data_source_id: Number(connectionId),
                p_process_step_order: step.step_no,
                p_process_step_action: "export",
                p_process_step_description: step.description,
                p_process_step_query: step.ex_queries ? step.ex_queries[0] : "",
              },
            };
          } else {
            return {
              steps: {
                process_step_id: step.id > 1000000 ? null : step.id,
                p_inserted_by: 1,
                p_modified_by: 1,
                p_data_source_id: Number(connectionId),
                p_process_step_order: step.step_no,
                p_process_step_action: step.step_type,
                p_process_step_description: step.description,
              },
            };
          }
        }),
      })),
    };

    setLoading(true);

    try {
      // Use update endpoint for existing process
      const response = await fetch(
        `${baseURL}/update-process-hierarchy/${processId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        setNotification({
          show: true,
          message: "Process updated successfully!",
          type: "success",
        });
        // Optional: Redirect to process list page after successful update
        // setTimeout(() => router.push('/processes'), 2000);
      } else {
        const errorData = await response.json();
        setNotification({
          show: true,
          message: errorData.message || "Failed to update process",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating process:", error);
      setNotification({
        show: true,
        message: "An error occurred while updating the process",
        type: "error",
      });
    } finally {
      setLoading(false);
      // Hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 5000);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button variant="ghost" onClick={navigateBack} className="mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Process</h1>
        </div>
        <Button onClick={updateProcess} disabled={loading}>
          {loading ? "Saving..." : "Update Process"}
        </Button>
      </div>

      {/* Notification */}
      {notification.show && (
        <Alert
          className={`mb-6 ${
            notification.type === "error" ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {/* Main Process Card */}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Process Version
                </label>
                <Input
                  type="number"
                  value={processVersion}
                  onChange={(e) => setProcessVersion(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Connection ID
                </label>
                <Input
                  value={connectionId || ""}
                  disabled
                  className="w-full bg-gray-50"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rerun" checked={rerun} onCheckedChange={setRerun} />
              <label
                htmlFor="rerun"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Allow Rerun
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addSubprocess} className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Subprocess
          </Button>
        </CardFooter>
      </Card>

      {/* SubProcess Cards */}
      {subprocesses.map((subprocess) => (
        <SubprocessCard
          key={subprocess.id}
          subprocess={subprocess}
          connectionId={connectionId}
          updateSubprocessName={updateSubprocessName}
          deleteSubprocess={deleteSubprocess}
          addStep={addStep}
          updateStep={updateStep}
          deleteStep={deleteStep}
        />
      ))}
    </div>
  );
}

function SubprocessCard({
  subprocess,
  connectionId,
  updateSubprocessName,
  deleteSubprocess,
  addStep,
  updateStep,
  deleteStep,
}) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              Subprocess Name
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteSubprocess(subprocess.id)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {subprocess.steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              subprocessId={subprocess.id}
              connectionId={connectionId}
              updateStep={updateStep}
              deleteStep={deleteStep}
            />
          ))}
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
  );
}

function StepCard({
  step,
  subprocessId,
  connectionId,
  updateStep,
  deleteStep,
}) {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-2 bg-gray-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium">
            Step {step.step_no}
          </CardTitle>
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
            connectionId={connectionId}
            updateStep={updateStep}
          />
        ) : step.step_type === "process-query" ? (
          <QueryStepContent
            step={step}
            subprocessId={subprocessId}
            stepId={step.id}
            updateStep={updateStep}
          />
        ) : step.step_type === "export" ? (
          <ExportStepContent
            step={step}
            subprocessId={subprocessId}
            stepId={step.id}
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
  );
}

function ImportStepContent({
  step,
  subprocessId,
  stepId,
  connectionId,
  updateStep,
}) {
  const [sourceSchemas, setSourceSchemas] = useState([]);
  const [selectedSourceSchema, setSelectedSourceSchema] = useState("");
  const [sourceTables, setSourceTables] = useState([]);
  const [loading, setLoading] = useState(false);

  // For destination - fixed values as per requirements
  const destinationConnectionId = "3";
  const destinationSchema = "destination_schema";

  // Fetch source schemas
  useEffect(() => {
    if (connectionId) {
      fetchSourceSchemas();
    }
  }, [connectionId]);

  // When source schema changes, fetch tables
  useEffect(() => {
    if (selectedSourceSchema) {
      fetchSourceTables();
    }
  }, [selectedSourceSchema]);

  // Load selected schema from step data if available
  useEffect(() => {
    if (step.selected_tables && step.selected_tables.length > 0) {
      // Extract unique schema names from selected_tables
      const schemas = [
        ...new Set(step.selected_tables.map((item) => item.schema_name)),
      ];
      if (schemas.length > 0 && schemas[0] && !selectedSourceSchema) {
        setSelectedSourceSchema(schemas[0]);
      }
    }
  }, [step.selected_tables]);

  const fetchSourceSchemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-schema?conn_id=${connectionId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setSourceSchemas(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching schemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSourceTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${baseURL}/connection-tables?conn_id=${connectionId}&schema_name=${selectedSourceSchema}`
      );
      if (response.status === 200) {
        const data = await response.json();
        if (data.status === "success") {
          setSourceTables(data.data);
        }
      } else {
        setSourceTables([]);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceSchemaChange = (schema) => {
    setSelectedSourceSchema(schema);
  };

  const handleSourceTableChange = (tableName, isChecked) => {
    // Update source_tables array (backward compatibility)
    let updatedTables = [...(step.source_tables || [])];

    if (isChecked) {
      if (!updatedTables.includes(tableName)) {
        updatedTables.push(tableName);
      }
    } else {
      updatedTables = updatedTables.filter((table) => table !== tableName);
    }

    updateStep(subprocessId, stepId, "source_tables", updatedTables);

    // Auto-copy to destination tables as per requirement
    updateStep(subprocessId, stepId, "destination_tables", [...updatedTables]);

    // Update selected_tables array with schema information
    let updatedSelectedTables = [...(step.selected_tables || [])];

    if (isChecked) {
      // Check if table already exists in selected_tables
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
      // Remove the table from selected_tables
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

  // Check if a table is selected based on both source_tables and selected_tables
  const isTableSelected = (tableName) => {
    // Check in source_tables (backward compatibility)
    if (step.source_tables && step.source_tables.includes(tableName)) {
      return true;
    }

    // Check in selected_tables with current schema
    if (step.selected_tables) {
      return step.selected_tables.some(
        (item) =>
          item.table_name === tableName &&
          item.schema_name === selectedSourceSchema
      );
    }

    return false;
  };

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
              <div>
                <label className="block text-sm font-medium mb-1">Schema</label>
                <Select
                  value={selectedSourceSchema}
                  onValueChange={handleSourceSchemaChange}
                  disabled={loading}
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
              </div>

              {selectedSourceSchema && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tables
                  </label>
                  {loading ? (
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

                      {/* list of selected tables */}
                      {step.selected_tables &&
                        step.selected_tables.length > 0 && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">
                              Selected Tables with Schema
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {step.selected_tables.map((tableInfo, index) => (
                                <Badge
                                  key={`${tableInfo.schema_name}-${tableInfo.table_name}-${index}`}
                                  variant="outline"
                                  className="bg-blue-50"
                                >
                                  {tableInfo.schema_name}.{tableInfo.table_name}
                                </Badge>
                              ))}
                            </div>
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
              <div>
                <label className="block text-sm font-medium mb-1">Schema</label>
                <Input
                  value={destinationSchema}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Selected Tables
                </label>
                {step.destination_tables &&
                step.destination_tables.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.destination_tables.map((tableName) => (
                      <Badge
                        key={tableName}
                        variant="outline"
                        className="bg-green-50"
                      >
                        {tableName}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    Tables will mirror your source selection
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QueryStepContent({ step, subprocessId, stepId, updateStep }) {
  return (
    <div className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={step.description || ""}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "description", e.target.value)
          }
          placeholder="Enter step description"
        />
      </div>

      {/* Query */}
      <div>
        <label className="block text-sm font-medium mb-1">Query</label>
        <Textarea
          value={step.query || ""}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "query", e.target.value)
          }
          placeholder="Enter SQL query"
          className="min-h-[150px]"
        />
      </div>
    </div>
  );
}

function ExportStepContent({ step, subprocessId, stepId, updateStep }) {
  // Use useEffect to initialize queries if needed
  useEffect(() => {
    if (!Array.isArray(step.queries) || step.queries.length === 0) {
      updateStep(subprocessId, stepId, "queries", [""]);
    }
  }, [step.queries, subprocessId, stepId, updateStep]);

  // Handler for updating a specific query by index
  const updateQuery = (index, value) => {
    const updatedQueries = [...(step.queries || [])];
    updatedQueries[index] = value;
    updateStep(subprocessId, stepId, "queries", updatedQueries);
  };

  // Handler for adding a new query
  const addQuery = () => {
    const updatedQueries = [...(step.queries || []), ""];
    updateStep(subprocessId, stepId, "queries", updatedQueries);
  };

  // Handler for removing a query by index
  const removeQuery = (index) => {
    // Prevent removing if it's the last query
    if (!step.queries || step.queries.length <= 1) return;

    const updatedQueries = step.queries.filter((_, i) => i !== index);
    updateStep(subprocessId, stepId, "queries", updatedQueries);
  };

  return (
    <div className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={step.description || ""}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "description", e.target.value)
          }
          placeholder="Enter step description"
        />
      </div>

      {/* Queries */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Queries</label>
          <Button onClick={addQuery} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Query
          </Button>
        </div>

        <div className="space-y-3">
          {Array.isArray(step.queries) &&
            step.queries.map((query, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-grow">
                  <Textarea
                    value={query || ""}
                    onChange={(e) => updateQuery(index, e.target.value)}
                    placeholder={`Enter query ${index + 1}`}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Only show delete button if there's more than one query */}
                {step.queries && step.queries.length > 1 && (
                  <Button
                    onClick={() => removeQuery(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash size={18} />
                  </Button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
