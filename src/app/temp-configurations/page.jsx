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
import { toast } from "@/hooks/use-toast";

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
  // state variables
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

  // const {toast} = useToast();

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
    setSubprocesses(
      subprocesses.filter((subprocess) => subprocess.id !== subprocessId)
    );
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
        connection_id: "", //
        destination_connection_id: "", //
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

  // Function to update step details
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

  // Helper function to get connection details by ID
  const getConnectionDetails = (connectionId) => {
    return connections.find(
      (conn) => conn.data_sources_id.toString() === connectionId.toString()
    );
  };

  // Save Process function
  const saveProcess = async () => {
    if (!processName.trim()) {
      setNotification({
        show: true,
        message: "Please enter a process name",
        type: "error",
      });
      return;
    }

    // Validate that all steps have required connections
    for (const subprocess of subprocesses) {
      for (const step of subprocess.steps) {
        if (!step.connection_id) {
          setNotification({
            show: true,
            message: `Please select a connection for all steps in ${
              subprocess.subprocess_name ||
              "Subprocess " + subprocess.subprocess_no
            }`,
            type: "error",
          });
          return;
        }
        if (step.step_type === "import" && !step.destination_connection_id) {
          setNotification({
            show: true,
            message: `Please select a destination connection for import steps in ${
              subprocess.subprocess_name ||
              "Subprocess " + subprocess.subprocess_no
            }`,
            type: "error",
          });
          return;
        }
      }
    }

    const formattedData = {
      process: processName,
      subprocess: subprocesses,
    };

    setLoading(true);

    setNotification({
      show: true,
      message: JSON.stringify(formattedData),
      type: "error",
    });

    setLoading(false);

    // Simulate API call
    // setTimeout(() => {
    //   setNotification({
    //     show: true,
    //     message: "Process created successfully!",
    //     type: "success",
    //   });
    //   setLoading(false);

    //   // Reset form
    //   setProcessName("");
    //   setSubprocesses([]);
    // }, 2000);
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

      {/* Subprocess Card */}
      {subprocesses.map((subprocess) => (
        <SubprocessCard
          key={subprocess.id}
          subprocess={subprocess}
          connections={connections}
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

//this component receives several props for displaying and managing a subprocess and its steps
function SubprocessCard({
  subprocess,
  connections,
  updateSubprocessName,
  deleteSubprocess,
  addStep,
  updateStep,
  deleteStep,
}) {
  return (
    <Card className="mb-6">
      {/* function called - updateSubprocessName, deleteSubprocess */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex-1 mr-4">
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
            className="text-red-500 hover:text-red-700"
          >
            <Trash className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Steps Cards will appear here */}
      <CardContent>
        <div className="space-y-4">
          {subprocess.steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              subprocessId={subprocess.id}
              connections={connections}
              updateStep={updateStep}
              deleteStep={deleteStep}
            />
          ))}
        </div>
      </CardContent>

      {/* function called - addStep */}
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

// The StepCard component displays and manages a single step in the process management interface.
// It provides controls for selecting the step type and deleting the step, and renders different
// content based on the step type.
function StepCard({ step, subprocessId, connections, updateStep, deleteStep }) {
  return (
    <Card className="border border-gray-200">
      {/* function called - updatedStep, deleteStep */}
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

      {/* renders step cards */}
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
  );
}

// This Component manages the selection of database tables for an import operation. It allows users to:
// Select a schema from a source database, select tables from that schema to import
// Automatically mirror those selections to a destination database
function ImportStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  const [sourceSchemas, setSourceSchemas] = useState([]); //an array to store objects of source schema
  const [selectedSourceSchema, setSelectedSourceSchema] = useState(""); //stores currently selected source schema in dropdown
  const [sourceTables, setSourceTables] = useState([]); //an array to store objects of tables from selected source schema
  const [destinationSchemas, setDestinationSchemas] = useState([]); //an array to store objects of destination schema
  const [selectedDestinationSchema, setSelectedDestinationSchema] = useState(""); //stores currently selected destination schema in dropdown
  const [loading, setLoading] = useState(false); // loading state to manage API calls
  const [destinationTables, setDestinationTables] = useState([]); //

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
  // ------------

  const handleSourceSchemaChange = (schema) => {
    setSelectedSourceSchema(schema);
    // reset selected tables when schema changes
    updateStep(subprocessId, stepId, "selected_tables", []);
    updateStep(subprocessId, stepId, "source_tables", []);
    updateStep(subprocessId, stepId, "destination_tables", []);
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
          dest_schema_name: selectedDestinationSchema,
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
    updateStep(subprocessId, stepId, "destination_tables", [...updatedTables]);
    updateStep(subprocessId, stepId, "selected_tables", updatedSelectedTables);
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
      {/* Loading Screen */}
      {loading && <LoadingOverlay />}

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
                  onValueChange={(value) =>
                    updateStep(subprocessId, stepId, "connection_id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source connection" />
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

              {/* Source Schema Dropdown - function called - handleSourceSchemaChange */}
              {step.connection_id && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Schema
                  </label>
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

                      {step.selected_tables &&
                        step.selected_tables.length > 0 && (
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
                  onValueChange={(value) =>
                    updateStep(
                      subprocessId,
                      stepId,
                      "destination_connection_id",
                      value
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination connection" />
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

              {/* Destination Schema Dropdown */}
              {step.destination_connection_id && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Schema
                  </label>
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

              {/* Selected Tables Display */}
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
                        {selectedDestinationSchema
                          ? `${selectedDestinationSchema}.${tableName}`
                          : tableName}
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

      {/* Selected Tables Summary */}
      {step.selected_tables && step.selected_tables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selected Tables Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {step.selected_tables.map((table, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Component className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{table.table_name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{table.schema_name}</span>
                    <ChevronRight className="h-4 w-4" />
                    <span>{table.dest_schema_name || "Not selected"}</span>
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

function QueryStepContent({
  step,
  subprocessId,
  stepId,
  connections,
  updateStep,
}) {
  return (
    <div className="space-y-4">
      {/* Connection Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Connection</label>
        <Select
          value={step.connection_id}
          onValueChange={(value) =>
            updateStep(subprocessId, stepId, "connection_id", value)
          }
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

  return (
    <div className="space-y-4">
      {/* Connection Selection */}
      <div>
        <label className="block text-sm font-medium mb-1">Connection</label>
        <Select
          value={step.connection_id}
          onValueChange={(value) =>
            updateStep(subprocessId, stepId, "connection_id", value)
          }
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
