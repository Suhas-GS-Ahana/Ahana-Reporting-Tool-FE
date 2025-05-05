"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Plus, Trash, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

// This component allows users to: Create a new process with a name, Add multiple subprocesses to the process,
// Add multiple steps to each subprocess, Configure each step with different types and properties,
// Save the entire process structure to an API endpoint
export default function CreateProcess() {
  //to get the connection ID
  const searchParams = useSearchParams();
  const connectionId = searchParams.get("connectionName");

  const [processName, setProcessName] = useState(""); //Stores the name of the overall process
  const [subprocesses, setSubprocesses] = useState([]); //An array that contains all subprocess objects
  const [loading, setLoading] = useState(false); //Boolean flag for tracking API call status
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  }); //Boolean flag for tracking API call status

  //Subprocess Management - addSubprocess, updateSubprocessName, deleteSubprocess

  // Function to add a new subprocess
  const addSubprocess = () => {
    const newSubprocess = {
      id: Date.now(),
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
        step_no: `Step ${newSteps.length + 1}`,
        step_type: "import", // Default type
        source_tables: [],
        destination_tables: [],
        description: "",
        query: "",
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
      // Renumber steps
      const renamedSteps = updatedSteps.map((step, index) => ({
        ...step,
        step_no: `Step ${index + 1}`,
      }));

      const updatedSubprocesses = [...subprocesses];
      updatedSubprocesses[subprocessIndex].steps = renamedSteps;
      setSubprocesses(updatedSubprocesses);
    }
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

    // Format data for API
    const formattedData = {
      process_name: processName,
      subprocess: subprocesses.map((sp) => ({
        subprocess_name: sp.subprocess_name,
        steps: sp.steps.map((step) => {
          if (step.step_type === "import") {
            return {
              step_no: step.step_no,
              step_type: step.step_type,
              source_tables: step.source_tables,
              destination_tables: step.destination_tables,
            };
          } else {
            return {
              step_no: step.step_no,
              step_type: step.step_type,
              description: step.description,
              query: step.query,
            };
          }
        }),
      })),
    };

    //transform function
    function transformFormat(inputData) {
      const { process_name, subprocess } = inputData;

      // Create the new format structure
      const outputData = {
        process: {
          p_inserted_by: 1,
          p_modified_by: 1,
          p_process_name: process_name,
          p_process_version: 1,
          p_rerun: true,
        },
        subprocesses: [],
      };

      // Transform each subprocess
      subprocess.forEach((sp, index) => {
        const transformedSubprocess = {
          "subprocess data": {
            p_inserted_by: 1,
            p_modified_by: 1,
            p_sub_process_order: index + 1,
            p_sub_process_name: sp.subprocess_name,
          },
          steps: [],
        };

        // Transform each step in the subprocess
        sp.steps.forEach((step) => {
          const transformedStep = {
            p_inserted_by: 1,
            p_modified_by: 1,
            p_data_source_id: "int",
            p_process_step_order: step.step_no,
            p_process_step_action: step.step_type,
            p_process_step_description:
              step.step_type === "import"
                ? JSON.stringify(step.source_tables)
                : step.description,
            p_process_step_query:
              step.step_type === "import"
                ? JSON.stringify(step.destination_tables)
                : step.query,
          };

          transformedSubprocess.steps.push(transformedStep);
        });

        outputData.subprocesses.push(transformedSubprocess);
      });

      return outputData;
    }

    setLoading(true);

    console.log(transformFormat(formattedData));
    setNotification({
      show: true,
      message: JSON.stringify(formattedData),
      type: "error",
    });

    setLoading(false);

    // try {
    //   // Replace with your actual API endpoint
    //   const response = await fetch("/api/create-process", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formattedData),
    //   });

    //   if (response.ok) {
    //     setNotification({
    //       show: true,
    //       message: "Process created successfully!",
    //       type: "success"
    //     });
    //     // Optional: Reset form or redirect
    //   } else {
    //     const errorData = await response.json();
    //     setNotification({
    //       show: true,
    //       message: errorData.message || "Failed to create process",
    //       type: "error"
    //     });
    //   }
    // } catch (error) {
    //   console.error("Error creating process:", error);
    //   setNotification({
    //     show: true,
    //     message: "An error occurred while saving the process",
    //     type: "error"
    //   });
    // } finally {
    //   setLoading(false);
    //   // Hide notification after 5 seconds
    //   setTimeout(() => {
    //     setNotification({ show: false, message: "", type: "" });
    //   }, 5000);
    // }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
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
            notification.type === "error" ? "bg-red-50" : "bg-green-50"
          }`}
        >
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      )}

      {/* Main Process Card - function caleld - addSubprocess */}
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
        </CardContent>
        <CardFooter>
          <Button onClick={addSubprocess} className="w-full" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Subprocess
          </Button>
        </CardFooter>
      </Card>

      {/* SubProcess Card */}
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

//this component receives several props for displaying and managing a subprocess and its steps
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
      {/* Subprocess name & delete subprocess */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <Input
              value={subprocess.subprocess_name}
              onChange={(e) =>
                updateSubprocessName(subprocess.id, e.target.value)
              }
              placeholder="Enter subprocess name"
              className="text-lg font-semibold"
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

      {/* steps */}
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

      {/* add steps */}
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
          <CardTitle className="text-md font-medium">{step.step_no}</CardTitle>
          <div className="flex items-center space-x-2">
            <Select
              value={step.step_type}
              onValueChange={(value) =>
                updateStep(subprocessId, step.id, "step_type", value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select step type" />
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
        ) : (
          <QueryStepContent
            step={step}
            subprocessId={subprocessId}
            stepId={step.id}
            updateStep={updateStep}
          />
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
  const [destinationTables, setDestinationTables] = useState([]);

  // Fetch source schemas
  useEffect(() => {
    if (connectionId) {
      fetchSourceSchemas();
    }
  }, [connectionId]);

  // Fetch destination tables (fixed connection and schema)
  useEffect(() => {
    fetchDestinationTables();
  }, []);

  // When source schema changes, fetch tables
  useEffect(() => {
    if (selectedSourceSchema) {
      fetchSourceTables();
    }
  }, [selectedSourceSchema]);

  const fetchSourceSchemas = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://10.235.20.52:8001/connection-schema?conn_id=${connectionId}`
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
        `http://10.235.20.52:8001/connection-tables?conn_id=${connectionId}&schema_name=${selectedSourceSchema}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          setSourceTables(data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinationTables = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://10.235.20.52:8001/connection-tables?conn_id=${destinationConnectionId}&schema_name=${destinationSchema}`
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
  };

  const handleSourceTableChange = (tableName, isChecked) => {
    let updatedTables = [...step.source_tables];

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
                      <ScrollArea className="h-60 border rounded-md p-4">
                        <div className="space-y-2">
                          {sourceTables.map((table) => (
                            <div
                              key={table.table_name}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`source-${table.table_name}`}
                                checked={step.source_tables.includes(
                                  table.table_name
                                )}
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

                      {step.source_tables.length > 0 && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-2">
                            Selected Tables
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {step.source_tables.map((tableName) => (
                              <Badge
                                key={tableName}
                                variant="outline"
                                className="bg-blue-50"
                              >
                                {tableName}
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
                {step.destination_tables.length > 0 ? (
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
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Input
          value={step.description}
          onChange={(e) =>
            updateStep(subprocessId, stepId, "description", e.target.value)
          }
          placeholder="Enter step description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Query</label>
        <Textarea
          value={step.query}
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
