"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Plus, Trash, ChevronRight, Component, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function CreateProcess() {
  const [processName, setProcessName] = useState("");
  const [subprocesses, setSubprocesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [connections, setConnections] = useState([]);

  const router = useRouter();

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-lg font-medium">Process getting saved...</p>
      </div>
    </div>
  );

  // Fetch connections on component mount
  useEffect(() => {
    fetchConnections();
  }, []);

  // Fetch all connections
  const fetchConnections = async () => {
    try {
      const response = await fetch(`${baseURL}/connection`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setConnections(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connections",
      });
    }
  };

  // Get connection details by ID
  const getConnectionById = (connectionId) => {
    return connections.find(conn => conn.data_sources_id === parseInt(connectionId));
  };

  // Subprocess Management
  const addSubprocess = () => {
    const newSubprocess = {
      id: Date.now(),
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
        id: Date.now(),
        step_no: newSteps.length + 1,
        step_type: "",
        connection_id: "", // Add connection_id field
        destination_connection_id: "", // Add destination_connection_id field for import steps
        source_tables: [],
        destination_tables: [],
        selected_tables: [],
        pq_description: "",
        pq_query: "",
        ex_description: "",
        ex_query: [],
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
      const renamedSteps = updatedSteps.map((step, index) => ({
        ...step,
        step_no: index + 1,
      }));

      const updatedSubprocesses = [...subprocesses];
      updatedSubprocesses[subprocessIndex].steps = renamedSteps;
      setSubprocesses(updatedSubprocesses);
    }
  };

  // Save process function (simplified for now)
  const saveProcess = async () => {
    if (!processName.trim()) {
      setNotification({
        show: true,
        message: "Please enter a process name",
        type: "default",
      });
      return;
    }

    // Validate that all steps have connection IDs
    for (const subprocess of subprocesses) {
      for (const step of subprocess.steps) {
        if (!step.connection_id) {
          setNotification({
            show: true,
            message: "Please select a connection for all steps",
            type: "error",
          });
          return;
        }
        if (step.step_type === "import" && !step.destination_connection_id) {
          setNotification({
            show: true,
            message: "Please select a destination connection for all import steps",
            type: "error",
          });
          return;
        }
      }
    }

    setLoading(true);

    try {
      // Create the formatted data structure
      const formattedData = {
        process: {
          p_inserted_by: 1,
          p_modified_by: 1,
          p_process_name: processName,
          p_process_version: 1,
          p_rerun: true,
        },
        subprocesses: subprocesses.map((sp) => ({
          subprocess_data: {
            p_inserted_by: 1,
            p_modified_by: 1,
            p_sub_process_order: sp.subprocess_no,
            p_sub_process_name: sp.subprocess_name,
          },
          steps: sp.steps.map((step) => {
            const baseStep = {
              p_inserted_by: 1,
              p_modified_by: 1,
              p_data_source_id: Number(step.connection_id),
              p_process_step_order: step.step_no,
              p_process_step_action: step.step_type,
            };

            if (step.step_type === "import") {
              return {
                steps: baseStep,
                create_table: step.selected_tables.map(
                  ({ schema_name, table_name }) => ({
                    table_name: table_name,
                    schema_name: schema_name,
                    is_table_exist: false,
                  })
                ),
                table_config: [],
                table_config_details: [],
                table_mapping: [],
              };
            } else if (step.step_type === "process-query") {
              return {
                steps: {
                  ...baseStep,
                  p_process_step_description: step.pq_description,
                  p_process_step_query: step.pq_query,
                },
                create_table: [],
                table_config: [],
                table_config_details: [],
                table_mapping: [],
              };
            } else {
              return {
                steps: {
                  ...baseStep,
                  p_process_step_description: step.ex_description,
                  p_process_step_query: step.ex_query.join(","),
                },
                create_table: [],
                table_config: [],
                table_config_details: [],
                table_mapping: [],
              };
            }
          }),
        })),
      };

      const response = await fetch(`${baseURL}/process-hierarchy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        setNotification({
          show: true,
          message: "Process created successfully!",
          type: "success",
        });

        setTimeout(() => {
          router.push("/process");
        }, 500);
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
      {loading && <LoadingOverlay />}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Process</h1>
        <Button onClick={saveProcess} disabled={loading}>
          {loading ? "Saving..." : "Save Process"}
        </Button>
      </div>

      {notification.show && (
        <Alert
          className={`mb-6 ${
            notification.type === "error" ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

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

      {subprocesses.map((subprocess) => (
        <SubprocessCard
          key={subprocess.id}
          subprocess={subprocess}
          connections={connections}
          getConnectionById={getConnectionById}
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
  connections,
  getConnectionById,
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
              connections={connections}
              getConnectionById={getConnectionById}
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
  connections,
  getConnectionById,
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
            connections={connections}
            getConnectionById={getConnectionById}
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
  );
}

function ImportStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  getConnectionById,
  updateStep,
}) {
  const [sourceSchemas, setSourceSchemas] = useState([]);
  const [selectedSourceSchema, setSelectedSourceSchema] = useState("");
  const [sourceTables, setSourceTables] = useState([]);
  const [destinationSchemas, setDestinationSchemas] = useState([]);
  const [selectedDestinationSchema, setSelectedDestinationSchema] = useState("");
  const [destinationTables, setDestinationTables] = useState([]);
  const [loading, setLoading] = useState(false);

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
        }
      }
    } catch (error) {
      console.error("Error fetching destination tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSourceSchemaChange = (schema) => {
    setSelectedSourceSchema(schema);
    // Reset selected tables when schema changes
    updateStep(subprocessId, stepId, "source_tables", []);
    updateStep(subprocessId, stepId, "selected_tables", []);
  };

  const handleDestinationSchemaChange = (schema) => {
    setSelectedDestinationSchema(schema);
    // Reset destination tables when schema changes
    updateStep(subprocessId, stepId, "destination_tables", []);
  };

  const handleSourceTableChange = (tableName, isChecked) => {
    let updatedTables = [...step.source_tables];
    let updatedSelectedTables = [...(step.selected_tables || [])];

    if (isChecked) {
      if (!updatedTables.includes(tableName)) {
        updatedTables.push(tableName);
      }
      
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
      updatedTables = updatedTables.filter((table) => table !== tableName);
      updatedSelectedTables = updatedSelectedTables.filter(
        (item) =>
          !(
            item.table_name === tableName &&
            item.schema_name === selectedSourceSchema
          )
      );
    }

    updateStep(subprocessId, stepId, "source_tables", updatedTables);
    updateStep(subprocessId, stepId, "selected_tables", updatedSelectedTables);
    
    // Auto-copy to destination tables
    updateStep(subprocessId, stepId, "destination_tables", [...updatedTables]);
  };

  const isTableSelected = (tableName) => {
    if (step.source_tables && step.source_tables.includes(tableName)) {
      return true;
    }

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
              {/* Source Connection Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Connection</label>
                <Select
                  value={step.connection_id}
                  onValueChange={(value) =>
                    updateStep(subprocessId, stepId, "connection_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((connection) => (
                      <SelectItem
                        key={connection.data_sources_id}
                        value={connection.data_sources_id.toString()}
                      >
                        {connection.connection_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Source Schema Dropdown */}
              {step.connection_id && (
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
              )}

              {/* Source Tables */}
              {selectedSourceSchema && (
                <div>
                  <label className="block text-sm font-medium mb-2">Tables</label>
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

                      {step.selected_tables && step.selected_tables.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">
                            Selected Tables
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
            <CardTitle className="text-green-700">Destination Database</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {/* Destination Connection Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Connection</label>
                <Select
                  value={step.destination_connection_id}
                  onValueChange={(value) =>
                    updateStep(subprocessId, stepId, "destination_connection_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination connection" />
                  </SelectTrigger>
                  <SelectContent>
                    {connections.map((connection) => (
                      <SelectItem
                        key={connection.data_sources_id}
                        value={connection.data_sources_id.toString()}
                      >
                        {connection.connection_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Destination Schema Dropdown */}
              {step.destination_connection_id && (
                <div>
                  <label className="block text-sm font-medium mb-1">Schema</label>
                  <Select
                    value={selectedDestinationSchema}
                    onValueChange={handleDestinationSchemaChange}
                    disabled={loading}
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
                </div>
              )}

              {/* Destination Tables Display */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Selected Tables
                </label>
                {step.destination_tables.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {step.destination_tables.map((tableName) => (
                      <Badge
                        key={tableName}
                        variant="outline"
                        className="bg-green-50"
                      >
                        {selectedDestinationSchema ? `${selectedDestinationSchema}.${tableName}` : tableName}
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
          value={step.pq_description}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "pq_description", e.target.value)
          }
          placeholder="Enter step description"
        />
      </div>

      {/* Query */}
      <div>
        <label className="block text-sm font-medium mb-1">Query</label>
        <Textarea
          value={step.pq_query}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "pq_query", e.target.value)
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
    if (!Array.isArray(step.ex_query) || step.ex_query.length === 0) {
      updateStep(subprocessId, stepId, "ex_query", [""]);
    }
  }, [step.ex_query, subprocessId, stepId, updateStep]);

  // Handler for updating a specific query by index
  const updateQuery = (index, value) => {
    const updatedQueries = [...step.ex_query];
    updatedQueries[index] = value;
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  // Handler for adding a new query
  const addQuery = () => {
    const updatedQueries = [...step.ex_query, ""];
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  // Handler for removing a query by index
  const removeQuery = (index) => {
    // Prevent removing if it's the last query
    if (step.ex_query.length <= 1) return;

    const updatedQueries = step.ex_query.filter((_, i) => i !== index);
    updateStep(subprocessId, stepId, "ex_query", updatedQueries);
  };

  return (
    <div className="space-y-4">
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={step.ex_description || ""}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "ex_description", e.target.value)
          }
          placeholder="Enter step description"
        />
      </div>

      {/* Queries */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium">Queries</label>
          <Button
            onClick={addQuery}
            variant="outline"
            // className="h-8"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Query
          </Button>
        </div>

        <div className="space-y-3">
          {Array.isArray(step.ex_query) &&
            step.ex_query.map((query, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-grow">
                  <Textarea
                    value={query}
                    onChange={(e) => updateQuery(index, e.target.value)}
                    placeholder={`Enter query ${index + 1}`}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Only show delete button if there's more than one query */}
                {step.ex_query.length > 1 && (
                  <Button
                    onClick={() => removeQuery(index)}
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 transisition"
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