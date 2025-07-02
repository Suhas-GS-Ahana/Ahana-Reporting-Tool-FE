export default function EditProcess() {

  // Add sensors for subprocess drag and drop
  const subprocessSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Subprocess Management Functions
  const addSubprocess = () => {
    const newSubprocess = {
      id: Date.now(),
      sub_process_id: null, // New subprocess, no existing ID
      subprocess_no: subprocesses.length + 1,
      subprocess_name: "",
      is_deleted:false,
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
    const updatedSubprocesses = subprocesses.filter(
      (subprocess) => subprocess.id !== subprocessId
    );
    const renumberedSubprocesses = updatedSubprocesses.map(
      (subprocess, index) => ({
        ...subprocess,
        subprocess_no: index + 1,
      })
    );
    setSubprocesses(renumberedSubprocesses);
  };

  const handleSubprocessDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = subprocesses.findIndex(
        (subprocess) => subprocess.id === active.id
      );
      const newIndex = subprocesses.findIndex(
        (subprocess) => subprocess.id === over.id
      );

      const reorderedSubprocesses = arrayMove(subprocesses, oldIndex, newIndex);
      const updatedSubprocesses = reorderedSubprocesses.map(
        (subprocess, index) => ({
          ...subprocess,
          subprocess_no: index + 1,
        })
      );

      setSubprocesses(updatedSubprocesses);
    }
  };

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
          <Button variant="outline" onClick={() => router.push("/process")}>
            Cancel
          </Button>
          <Button onClick={saveProcess} disabled={loadingSave}>
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
          items={subprocesses.map((subprocess) => subprocess.id)}
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
      const oldIndex = subprocess.steps.findIndex(
        (step) => step.id === active.id
      );
      const newIndex = subprocess.steps.findIndex(
        (step) => step.id === over.id
      );

      // Reorder the steps array
      const reorderedSteps = arrayMove(subprocess.steps, oldIndex, newIndex);

      // Update step numbers based on new positions
      const updatedSteps = reorderedSteps.map((step, index) => ({
        ...step,
        step_no: index + 1,
      }));

      // Update the subprocess with new step order
      updateSubprocessSteps(subprocess.id, updatedSteps);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`mb-6 ${isDragging ? "shadow-lg" : ""}`}>
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
                  Subprocess {subprocess.subprocess_no}
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
                items={subprocess.steps.map((step) => step.id)}
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