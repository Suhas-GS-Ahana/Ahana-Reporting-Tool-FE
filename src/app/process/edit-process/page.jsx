"use client"

import React, { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter, useSearchParams } from 'next/navigation';
import { useSensors, useSensor, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { arrayMove } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, GripVertical, Trash, Settings, Database, Play, Upload, Component, ChevronRight, Badge, Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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

export default function EditProcess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [processName, setProcessName] = useState("");
  const [processMasterId, setProcessMasterId] = useState(null);
  const [subprocesses, setSubprocesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [connections, setConnections] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  
  const { toast } = useToast();
  
  // Add sensors for subprocess drag and drop
  const subprocessSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  // Mock data
  const mockData = {
  "process": {
    "process_master_id": 2,
    "process_name": "Process for Edit",
  },
  "subprocesses": [
    {
      "subprocess_data": {
        "sub_process_id": 2,
        "process_master_id": 2,
        "sub_process_order": 1,
        "sub_process_name": "Sub1",
      },
      "steps": [
        {
          "steps": {
            "process_step_id": 4,
            "process_master_id": 2,
            "sub_process_id": 2,
            "process_step_order": 1,
            "process_step_action": "import",
            "source_conn_id": 4,
            "dest_conn_id": 5
          },
          "create_table": [
                        {
                            "table_name": "exception_master",
                            "source_schema_name": "public",
                            "dest_schema_name": "source_schema",
                            "is_table_exist": true
                        },
                        {
                            "table_name": "npa_auto_tech_write_off",
                            "source_schema_name": "public",
                            "dest_schema_name": "source_schema",
                            "is_table_exist": false
                        }
                    ],
        },
        {
          "steps": {
            "process_step_id": 5,
            "process_master_id": 2,
            "sub_process_id": 2,
            "process_step_order": 2,
            "process_step_query": [
              "Subprocess 1 query"
            ],
            "process_step_action": "process-query",
            "process_step_description": "Subprocess 1 description",
            "source_conn_id": 4,
          },
        },
        {
          "steps": {
            "process_step_id": 6,
            "process_master_id": 2,
            "sub_process_id": 2,
            "process_step_order": 3,
            "process_step_query": [
              "ex query 1",
              "ex query 2"
            ],
            "process_step_action": "export",
            "process_step_description": "export description",
            "source_conn_id": 4,
          },
        }
      ]
    },
    {
      "subprocess_data": {
        "sub_process_id": 3,
        "process_master_id": 2,
        "sub_process_order": 2,
        "sub_process_name": "Sub2",
      },
      "steps": [
        {
          "steps": {
            "process_step_id": 7,
            "process_master_id": 2,
            "sub_process_id": 3,
            "process_step_order": 1,
            "process_step_query": [
              "Subprocess 2 query"
            ],
            "process_step_action": "process-query",
            "process_step_description": "Subprocess 2 description",
            "source_conn_id": 5,
          },
        }
      ]
    }
  ]
}

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


  // Load mock data on component mount
  useEffect(() => {
    if (id) {
      loadMockData();
    }
  }, [id]);

  // Load mock data instead of API call
  const loadMockData = () => {
    setLoadingData(true);
    
    // Simulate loading delay
    setTimeout(() => {
      try {
        const processData = mockData;
        
        // Set process details
        setProcessName(processData.process.process_name);
        setProcessMasterId(processData.process.process_master_id);
        
        // Transform and set subprocesses data
        const transformedSubprocesses = processData.subprocesses.map((sp, spIndex) => ({
          id: sp.subprocess_data.sub_process_id || Date.now() + spIndex,
          sub_process_id: sp.subprocess_data.sub_process_id,
          subprocess_no: sp.subprocess_data.sub_process_order,
          subprocess_name: sp.subprocess_data.sub_process_name,
          steps: sp.steps.map((step, stepIndex) => ({
            id: step.steps.process_step_id || Date.now() + stepIndex,
            process_step_id: step.steps.process_step_id,
            step_no: step.steps.process_step_order,
            step_type: step.steps.process_step_action,
            connection_id: step.steps.source_conn_id?.toString() || "",
            destination_connection_id: step.steps.dest_conn_id?.toString() || "",
            source_tables: [],
            destination_tables: [],
            selected_tables: [],
            pq_description: step.steps.process_step_description || "",
            pq_query: step.steps.process_step_query || [],
            ex_description: step.steps.process_step_description || "",
            ex_query: step.steps.process_step_query || [],
            source_details: null,
            destination_details: null,
            create_table: step.create_table || [],
          }))
        }));
        
        setSubprocesses(transformedSubprocesses);
        // setConnections(mockConnections);
        
      } catch (error) {
        console.error("Error loading mock data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load process data",
        });
      } finally {
        setLoadingData(false);
      }
    }, 500); // Simulate 500ms loading time
  };

  // Subprocess Management Functions
  const addSubprocess = () => {
    const newSubprocess = {
      id: Date.now(),
      sub_process_id: null, // New subprocess, no existing ID
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
    const updatedSubprocesses = subprocesses.filter((subprocess) => subprocess.id !== subprocessId);
    const renumberedSubprocesses = updatedSubprocesses.map((subprocess, index) => ({
      ...subprocess,
      subprocess_no: index + 1,
    }));
    setSubprocesses(renumberedSubprocesses);
  };

  const handleSubprocessDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subprocesses.findIndex(subprocess => subprocess.id === active.id);
      const newIndex = subprocesses.findIndex(subprocess => subprocess.id === over.id);
      
      const reorderedSubprocesses = arrayMove(subprocesses, oldIndex, newIndex);
      const updatedSubprocesses = reorderedSubprocesses.map((subprocess, index) => ({
        ...subprocess,
        subprocess_no: index + 1
      }));

      setSubprocesses(updatedSubprocesses);
    }
  };

  // Step Management Functions
  const addStep = (subprocessId) => {
    const subprocessIndex = subprocesses.findIndex((sp) => sp.id === subprocessId);
    if (subprocessIndex !== -1) {
      const newSteps = [...subprocesses[subprocessIndex].steps];
      newSteps.push({
        id: Date.now(),
        process_step_id: null, // New step, no existing ID
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
    const subprocessIndex = subprocesses.findIndex((sp) => sp.id === subprocessId);
    if (subprocessIndex !== -1) {
      const stepIndex = subprocesses[subprocessIndex].steps.findIndex(
        (step) => step.id === stepId
      );
      if (stepIndex !== -1) {
        const updatedSubprocesses = [...subprocesses];

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

  const deleteStep = (subprocessId, stepId) => {
    const subprocessIndex = subprocesses.findIndex((sp) => sp.id === subprocessId);
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

  const updateSubprocessSteps = (subprocessId, newSteps) => {
    setSubprocesses(
      subprocesses.map((subprocess) =>
        subprocess.id === subprocessId
          ? { ...subprocess, steps: newSteps }
          : subprocess
      )
    );
  };

  const getConnectionDetails = (connectionId) => {
    return connections.find(
      (conn) => conn.data_sources_id.toString() === connectionId.toString()
    );
  };

  // Save/Update Process Function (Mock implementation)
  const saveProcess = async () => {
    if (!processName.trim()) {
      setNotification({
        show: true,
        message: "Please enter a process name",
        type: "default",
      });
      return;
    }

    setLoadingSave(true);

    // Simulate save operation
    setTimeout(() => {
      console.log("Mock save - Process data:", {
        processName,
        processMasterId,
        subprocesses
      });

      setNotification({
        show: true,
        message: "Process updated successfully! (Mock)",
        type: "success",
      });

      setTimeout(() => {
        router.push("/process");
      }, 500);

      setLoadingSave(false);
    }, 1000);
  };

  // Show loading screen while loading initial data
  if (loadingData) {
    return <LoadingOverlay />;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Loading Screen */}
      {(loading || loadingSave) && <LoadingOverlay />}
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Process</h1>
          <p className="text-gray-600 mt-1">Process ID: {id}</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => router.push("/process")}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveProcess} 
            disabled={loadingSave}
          >
            {loadingSave ? "Updating..." : "Update Process"}
          </Button>
        </div>
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
          </div>
        </CardContent>
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

      <Button onClick={addSubprocess} className="w-full" variant="outline">
        <Plus className="mr-2 h-4 w-4" /> Add Subprocess
      </Button>
    </div>
  );
}

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
      <Card className={` mb-6 ${isDragging ? 'shadow-lg border-blue-300' : 'border-gray-200'} transition-all duration-200`}>
        <CardHeader className="pb-2 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 flex-1 mr-4">
              {/* Drag handle for subprocess */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded-md transition-colors"
                title="Drag to reorder subprocess"
              >
                <GripVertical className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subprocess {subprocess.subprocess_no}
                </label>
                <Input
                  value={subprocess.subprocess_name}
                  onChange={(e) =>
                    updateSubprocessName(subprocess.id, e.target.value)
                  }
                  placeholder="Enter subprocess name"
                  className="w-full font-medium"
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteSubprocess(subprocess.id)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Delete subprocess"
            >
              <Trash className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="space-y-4">
            {subprocess.steps.length > 0 ? (
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
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <div className="mb-2">
                  <Plus className="h-8 w-8 mx-auto text-gray-400" />
                </div>
                <p className="text-sm">No steps added yet</p>
                <p className="text-xs text-gray-400">Click "Add Step" to get started</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className=" rounded-b-lg pt-3 pb-4">
          <Button
            onClick={() => addStep(subprocess.id)}
            variant="outline"
            className="w-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Step
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

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

  // Get step type icon and color
  const getStepTypeIcon = (stepType) => {
    switch (stepType) {
      case 'import':
        return <Database className="h-4 w-4 text-blue-600" />;
      case 'process-query':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'export':
        return <Upload className="h-4 w-4 text-purple-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepTypeColor = (stepType) => {
    switch (stepType) {
      case 'import':
        return 'border-l-blue-500 bg-blue-50';
      case 'process-query':
        return 'border-l-green-500 bg-green-50';
      case 'export':
        return 'border-l-purple-500 bg-purple-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card 
        className={`mb-6 ${isDragging ? 'shadow-lg' : ''}`}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Drag handle */}
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-200 rounded-md transition-colors"
                title="Drag to reorder step"
              >
                <GripVertical className="h-4 w-4 text-gray-500" />
              </div>
              
              <div className="flex items-center space-x-2">
                {getStepTypeIcon(step.step_type)}
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Step {step.step_no}
                </CardTitle>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select
                value={step.step_type}
                onValueChange={(value) =>
                  updateStep(subprocessId, step.id, "step_type", value)
                }
              >
                <SelectTrigger className="w-[200px] bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500">
                  <SelectValue placeholder="Select step type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import" className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      <span>Import</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="process-query" className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <Play className="h-4 w-4 text-green-600" />
                      <span>Process Query</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="export" className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <Upload className="h-4 w-4 text-purple-600" />
                      <span>Export</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteStep(subprocessId, step.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                title="Delete step"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
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
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <Settings className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Configure Step
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please select a step type to configure this step
                </p>
                <div className="flex justify-center space-x-2">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 rounded-full text-xs text-blue-700">
                    <Database className="h-3 w-3" />
                    <span>Import</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 rounded-full text-xs text-green-700">
                    <Play className="h-3 w-3" />
                    <span>Process</span>
                  </div>
                  <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 rounded-full text-xs text-purple-700">
                    <Upload className="h-3 w-3" />
                    <span>Export</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

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







// ------------------------------------


// function ImportStepContent({
//   step,
//   subprocessId,
//   stepId,
//   connections,
//   updateStep,
// }) {
//   const [sourceSchemas, setSourceSchemas] = useState([]);
//   const [selectedSourceSchema, setSelectedSourceSchema] = useState("");
//   const [sourceTables, setSourceTables] = useState([]);
//   const [destinationSchemas, setDestinationSchemas] = useState([]);
//   const [selectedDestinationSchema, setSelectedDestinationSchema] =
//     useState("");
//   const [loading, setLoading] = useState(false);
//   const [destinationTables, setDestinationTables] = useState([]);

//   // Handle source connection change with connection details fetch
//   const handleSourceConnectionChange = async (connectionId) => {
//     try {
//       // Update connection_id
//       updateStep(subprocessId, stepId, "connection_id", connectionId);

//       // Fetch and store source connection details
//       const response = await fetch(
//         `${baseURL}/connection-view?conn_id=${connectionId}`
//       );
//       const data = await response.json();
//       updateStep(subprocessId, stepId, "source_details", data.data);
//     } catch (error) {
//       console.error("Error fetching source connection details:", error);
//     }
//   };

//   // Handle destination connection change with connection details fetch
//   const handleDestinationConnectionChange = async (connectionId) => {
//     try {
//       // Update destination_connection_id
//       updateStep(
//         subprocessId,
//         stepId,
//         "destination_connection_id",
//         connectionId
//       );

//       // Fetch and store destination connection details
//       const response = await fetch(
//         `${baseURL}/connection-view?conn_id=${connectionId}`
//       );
//       const data = await response.json();
//       updateStep(subprocessId, stepId, "destination_details", data.data);
//     } catch (error) {
//       console.error("Error fetching destination connection details:", error);
//     }
//   };

//   // Fetch source schemas when source connection changes
//   useEffect(() => {
//     if (step.connection_id) {
//       fetchSourceSchemas();
//     } else {
//       setSourceSchemas([]);
//       setSelectedSourceSchema("");
//       setSourceTables([]);
//     }
//   }, [step.connection_id]);

//   // Fetch destination schemas when destination connection changes
//   useEffect(() => {
//     if (step.destination_connection_id) {
//       fetchDestinationSchemas();
//     } else {
//       setDestinationSchemas([]);
//       setSelectedDestinationSchema("");
//       setDestinationTables([]);
//       // Clear destination_tables when destination connection changes
//       updateStep(subprocessId, stepId, "destination_tables", []);
//     }
//   }, [step.destination_connection_id]);

//   // Fetch source tables when source schema changes
//   useEffect(() => {
//     if (selectedSourceSchema && step.connection_id) {
//       fetchSourceTables();
//     }
//   }, [selectedSourceSchema, step.connection_id]);

//   // Fetch destination tables when destination schema changes
//   useEffect(() => {
//     if (selectedDestinationSchema && step.destination_connection_id) {
//       fetchDestinationTables();
//     }
//   }, [selectedDestinationSchema, step.destination_connection_id]);

//   const fetchSourceSchemas = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${baseURL}/connection-schema?conn_id=${step.connection_id}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === "success") {
//           setSourceSchemas(data.data);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching source schemas:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDestinationSchemas = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${baseURL}/connection-schema?conn_id=${step.destination_connection_id}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === "success") {
//           setDestinationSchemas(data.data);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching destination schemas:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchSourceTables = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${baseURL}/connection-tables?conn_id=${step.connection_id}&schema_name=${selectedSourceSchema}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === "success") {
//           setSourceTables(data.data);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching source tables:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDestinationTables = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `${baseURL}/connection-tables?conn_id=${step.destination_connection_id}&schema_name=${selectedDestinationSchema}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         if (data.status === "success") {
//           setDestinationTables(data.data);
//           // Update step with destination tables (only table names)
//           const tableNames = data.data.map((table) => table.table_name);
//           updateStep(subprocessId, stepId, "destination_tables", tableNames);
//           // Update create_table after destination tables are fetched
//           updateCreateTable();
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching destination tables:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to update create_table array
//   const updateCreateTable = () => {
//     if (step.selected_tables && step.selected_tables.length > 0) {
//       const createTableData = step.selected_tables.map((selectedTable) => ({
//         table_name: selectedTable.table_name,
//         schema_name: selectedTable.schema_name,
//         dest_schema_name: selectedDestinationSchema,
//         is_table_exist: step.destination_tables.includes(
//           selectedTable.table_name
//         ),
//       }));
//       updateStep(subprocessId, stepId, "create_table", createTableData);
//     }
//   };

//   // Update create_table whenever selected_tables or destination_tables change
//   useEffect(() => {
//     updateCreateTable();
//   }, [
//     step.selected_tables,
//     step.destination_tables,
//     selectedDestinationSchema,
//   ]);

//   // Check if any tables are selected
//   const hasSelectedTables =
//     step.selected_tables && step.selected_tables.length > 0;

//   const handleSourceSchemaChange = (schema) => {
//     setSelectedSourceSchema(schema);
//     // Clear source tables and selected tables when schema changes
//     // updateStep(subprocessId, stepId, "selected_tables", []);
//     // updateStep(subprocessId, stepId, "create_table", []);
//   };

//   const handleDestSchemaChange = (schema) => {
//     setSelectedDestinationSchema(schema);
//     // Update create_table when destination schema changes
//     setTimeout(() => updateCreateTable(), 100);
//   };

//   const handleSourceTableChange = (tableName, isChecked) => {
//     let updatedSelectedTables = [...(step.selected_tables || [])];

//     if (isChecked) {
//       const tableExists = updatedSelectedTables.some(
//         (item) =>
//           item.table_name === tableName &&
//           item.schema_name === selectedSourceSchema
//       );

//       if (!tableExists) {
//         updatedSelectedTables.push({
//           table_name: tableName,
//           schema_name: selectedSourceSchema,
//         });
//       }
//     } else {
//       updatedSelectedTables = updatedSelectedTables.filter(
//         (item) =>
//           !(
//             item.table_name === tableName &&
//             item.schema_name === selectedSourceSchema
//           )
//       );
//     }

//     updateStep(subprocessId, stepId, "selected_tables", updatedSelectedTables);
//   };

//   const isTableSelected = (tableName) => {
//     if (step.selected_tables) {
//       return step.selected_tables.some(
//         (item) =>
//           item.table_name === tableName &&
//           item.schema_name === selectedSourceSchema
//       );
//     }
//     return false;
//   };

//   // Check if table selection should be available
//   const isTableSelectionAvailable =
//     step.connection_id &&
//     selectedSourceSchema &&
//     step.destination_connection_id &&
//     selectedDestinationSchema;

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Source Database Section */}
//         <Card className="border border-blue-200">
//           <CardHeader className="bg-blue-50">
//             <CardTitle className="text-blue-700">Source Database</CardTitle>
//           </CardHeader>
//           <CardContent className="pt-4">
//             <div className="space-y-4">
//               {/* Source Connection Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Connection
//                 </label>
//                 <Select
//                   value={step.connection_id}
//                   onValueChange={handleSourceConnectionChange}
//                   disabled={hasSelectedTables}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select source connection" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {connections
//                       .filter(
//                         (conn) =>
//                           conn.data_sources_id.toString() !==
//                           step.destination_connection_id
//                       )
//                       .map((conn) => (
//                         <SelectItem
//                           key={conn.data_sources_id}
//                           value={conn.data_sources_id.toString()}
//                         >
//                           {conn.connection_name}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//                 {hasSelectedTables && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     Uncheck all tables to change connection
//                   </p>
//                 )}
//               </div>

//               {/* Display Source Connection Details */}
//               {step.source_details && (
//                 <div className="bg-blue-50 p-3 rounded-md">
//                   <h4 className="text-sm font-medium mb-2 text-blue-700">
//                     Source Connection Details:
//                   </h4>
//                   <div className="text-sm text-blue-600 space-y-1">
//                     <p>
//                       <span className="font-medium">Database:</span>{" "}
//                       {step.source_details.database_name}
//                     </p>
//                     <p>
//                       <span className="font-medium">Server:</span>{" "}
//                       {step.source_details.server_name}:
//                       {step.source_details.port_number}
//                     </p>
//                     <p>
//                       <span className="font-medium">Type:</span>{" "}
//                       {step.source_details.database_type}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Source Schema Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Schema</label>
//                 <Select
//                   value={selectedSourceSchema}
//                   onValueChange={handleSourceSchemaChange}
//                   disabled={!step.connection_id || loading}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select schema" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {sourceSchemas.map((schema) => (
//                       <SelectItem
//                         key={schema.schema_name}
//                         value={schema.schema_name}
//                       >
//                         {schema.schema_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {hasSelectedTables && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     Uncheck all tables to change schema
//                   </p>
//                 )}
//               </div>

//               {/* Source Tables */}
//               {selectedSourceSchema && (
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Tables
//                   </label>
//                   {!isTableSelectionAvailable ? (
//                     <div className="py-3 px-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700 text-sm">
//                       Please select both source and destination connections and
//                       schemas to view tables
//                     </div>
//                   ) : loading ? (
//                     <div className="text-center py-4">Loading tables...</div>
//                   ) : (
//                     <>
//                       {sourceTables.length > 0 ? (
//                         <ScrollArea className="h-60 border rounded-md p-4">
//                           <div className="space-y-2">
//                             {sourceTables.map((table) => (
//                               <div
//                                 key={table.table_name}
//                                 className="flex items-center space-x-2"
//                               >
//                                 <Checkbox
//                                   id={`source-${table.table_name}`}
//                                   checked={isTableSelected(table.table_name)}
//                                   onCheckedChange={(checked) =>
//                                     handleSourceTableChange(
//                                       table.table_name,
//                                       checked
//                                     )
//                                   }
//                                 />
//                                 <label
//                                   htmlFor={`source-${table.table_name}`}
//                                   className="text-sm cursor-pointer"
//                                 >
//                                   {table.table_name}
//                                 </label>
//                               </div>
//                             ))}
//                           </div>
//                         </ScrollArea>
//                       ) : (
//                         <div className="py-3 px-4 bg-gray-100 rounded text-gray-600 text-sm">
//                           No tables exist in this schema
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Destination Database Section */}
//         <Card className="border border-green-200">
//           <CardHeader className="bg-green-50">
//             <CardTitle className="text-green-700">
//               Destination Database
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-4">
//             <div className="space-y-4">
//               {/* Destination Connection Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Connection
//                 </label>
//                 <Select
//                   value={step.destination_connection_id}
//                   onValueChange={handleDestinationConnectionChange}
//                   disabled={hasSelectedTables}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select destination connection" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {connections
//                       .filter(
//                         (conn) =>
//                           conn.data_sources_id.toString() !== step.connection_id
//                       )
//                       .map((conn) => (
//                         <SelectItem
//                           key={conn.data_sources_id}
//                           value={conn.data_sources_id.toString()}
//                         >
//                           {conn.connection_name}
//                         </SelectItem>
//                       ))}
//                   </SelectContent>
//                 </Select>
//                 {hasSelectedTables && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     Uncheck all tables to change connection
//                   </p>
//                 )}
//               </div>

//               {/* Display Destination Connection Details */}
//               {step.destination_details && (
//                 <div className="bg-green-50 p-3 rounded-md">
//                   <h4 className="text-sm font-medium mb-2 text-green-700">
//                     Destination Connection Details:
//                   </h4>
//                   <div className="text-sm text-green-600 space-y-1">
//                     <p>
//                       <span className="font-medium">Database:</span>{" "}
//                       {step.destination_details.database_name}
//                     </p>
//                     <p>
//                       <span className="font-medium">Server:</span>{" "}
//                       {step.destination_details.server_name}:
//                       {step.destination_details.port_number}
//                     </p>
//                     <p>
//                       <span className="font-medium">Type:</span>{" "}
//                       {step.destination_details.database_type}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Destination Schema Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium mb-1">Schema</label>
//                 <Select
//                   value={selectedDestinationSchema}
//                   onValueChange={handleDestSchemaChange}
//                   disabled={
//                     !step.destination_connection_id ||
//                     loading ||
//                     hasSelectedTables
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select schema" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {destinationSchemas.map((schema) => (
//                       <SelectItem
//                         key={schema.schema_name}
//                         value={schema.schema_name}
//                       >
//                         {schema.schema_name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 {hasSelectedTables && (
//                   <p className="text-xs text-amber-600 mt-1">
//                     Uncheck all tables to change schema
//                   </p>
//                 )}
//               </div>

//               {/* Destination Tables Display */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Available Tables in Destination Schema
//                 </label>
//                 {destinationTables.length > 0 ? (
//                   <ScrollArea className="h-40 border rounded-md p-4">
//                     <div className="space-y-1">
//                       {destinationTables.map((table) => (
//                         <div
//                           key={table.table_name}
//                           className="text-sm text-gray-600"
//                         >
//                           {table.table_name}
//                         </div>
//                       ))}
//                     </div>
//                   </ScrollArea>
//                 ) : selectedDestinationSchema ? (
//                   <div className="py-3 px-4 bg-gray-100 rounded text-gray-600 text-sm">
//                     No tables exist in this destination schema
//                   </div>
//                 ) : (
//                   <div className="text-sm text-gray-500 italic">
//                     Select a destination schema to view available tables
//                   </div>
//                 )}
//               </div>

//               {/* Selected Tables Display */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Selected Tables for Import
//                 </label>
//                 {step.selected_tables && step.selected_tables.length > 0 ? (
//                   <div className="flex flex-wrap gap-2">
//                     {step.selected_tables.map((table, index) => (
//                       <Badge
//                         key={index}
//                         variant="outline"
//                         className="bg-green-50"
//                       >
//                         {table.table_name}
//                       </Badge>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-sm text-gray-500 italic">
//                     Tables will appear here when selected from source
//                   </div>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Table Creation Summary */}
//       {step.create_table && step.create_table.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="text-lg">Table Creation Summary</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {step.create_table.map((table, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <Component className="h-4 w-4 text-blue-500" />
//                     <span className="font-medium">{table.table_name}</span>
//                   </div>
//                   <div className="flex items-center space-x-4 text-sm">
//                     <div className="flex items-center space-x-2 text-gray-600">
//                       <span>{table.schema_name}</span>
//                       <ChevronRight className="h-4 w-4" />
//                       <span>{table.dest_schema_name}</span>
//                     </div>
//                     <Badge
//                       variant={table.is_table_exist ? "default" : "secondary"}
//                       className={
//                         table.is_table_exist
//                           ? "bg-green-100 text-green-800"
//                           : "bg-orange-100 text-orange-800"
//                       }
//                     >
//                       {table.is_table_exist ? "Exists" : "Will Create"}
//                     </Badge>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

