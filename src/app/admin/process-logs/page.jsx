"use client"
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const executionData = [
  {
    executionId: "P1-001",
    processName: "Data Processing Pipeline",
    startTime: "2025-03-03 09:00:00",
    endTime: "2025-03-03 10:30:00",
    status: "Success",
    subProcesses: [
      {
        executionId: "P1-SP1-001",
        subProcessName: "Data Extraction",
        startTime: "2025-03-03 09:00:00",
        endTime: "2025-03-03 09:20:00",
        status: "Success",
        steps: [
          { executionId: "P1-SP1-S1-001", stepName: "Connect to Data Source", startTime: "09:00", endTime: "09:05", status: "Success" },
          { executionId: "P1-SP1-S2-001", stepName: "Retrieve Data Records", startTime: "09:05", endTime: "09:20", status: "Success" }
        ]
      },
      {
        executionId: "P1-SP2-001",
        subProcessName: "Data Transformation",
        startTime: "2025-03-03 09:20:00",
        endTime: "2025-03-03 10:30:00",
        status: "Failed",
        steps: [
          { executionId: "P1-SP2-S1-001", stepName: "Cleanse Data", startTime: "09:20", endTime: "09:40", status: "Success" },
          { executionId: "P1-SP2-S2-001", stepName: "Normalize Data", startTime: "09:40", endTime: "10:00", status: "Failed" },
          { executionId: "P1-SP2-S3-001", stepName: "Aggregate Data", startTime: "10:00", endTime: "10:30", status: "Failed" }
        ]
      }
    ]
  },
  {
    executionId: "P2-002",
    processName: "System Backup & Recovery",
    startTime: "2025-03-03 11:00:00",
    endTime: "2025-03-03 12:45:00",
    status: "Success",
    subProcesses: [
      {
        executionId: "P2-SP1-002",
        subProcessName: "Backup Initialization",
        startTime: "11:00",
        endTime: "11:30",
        status: "Success",
        steps: [
          { executionId: "P2-SP1-S1-002", stepName: "Identify Files for Backup", startTime: "11:00", endTime: "11:10", status: "Success" },
          { executionId: "P2-SP1-S2-002", stepName: "Create Backup Snapshot", startTime: "11:10", endTime: "11:20", status: "Success" },
          { executionId: "P2-SP1-S3-002", stepName: "Validate Snapshot Integrity", startTime: "11:20", endTime: "11:30", status: "Success" }
        ]
      }
    ]
  },
  {
    executionId: "P1-003",
    processName: "Data Processing Pipeline",
    startTime: "2025-03-03 13:00:00",
    endTime: "2025-03-03 14:30:00",
    status: "Failed",
    subProcesses: [
      {
        executionId: "P1-SP1-003",
        subProcessName: "Data Extraction",
        startTime: "2025-03-03 13:00:00",
        endTime: "2025-03-03 13:20:00",
        status: "Failed",
        steps: [
          { executionId: "P1-SP1-S1-003", stepName: "Connect to Data Source", startTime: "13:00", endTime: "13:05", status: "Success" },
          { executionId: "P1-SP1-S2-003", stepName: "Retrieve Data Records", startTime: "13:05", endTime: "13:20", status: "Failed" }
        ]
      }
    ]
  }
];


export default function ExecutionTable() {
  const [expandedProcesses, setExpandedProcesses] = useState({});
  const [expandedSubProcesses, setExpandedSubProcesses] = useState({});

  // Toggle process rows
  const toggleProcess = (id) => {
    setExpandedProcesses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle sub-process rows
  const toggleSubProcess = (id) => {
    setExpandedSubProcesses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
      <table className="min-w-full border border-collapse border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3 text-left w-10"></th>
            <th className="border p-3 text-left">Id</th>
            <th className="border p-3 text-left">Process</th>
            <th className="border p-3 text-left">Start Time</th>
            <th className="border p-3 text-left">End Time</th>
            <th className="border p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {executionData.map((process) => (
            <>
              {/* Process Row */}
              <tr
                key={process.executionId}
                className="hover:bg-gray-50 cursor-pointer font-semibold"
                onClick={() => toggleProcess(process.executionId)}
              >
                <td className="border p-3 text-center h-10">
                  {expandedProcesses[process.executionId] ? <Minus className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                </td>
                <td className="border p-3">{process.executionId}</td>
                <td className="border p-3">{process.processName}</td>
                <td className="border p-3">{process.startTime}</td>
                <td className="border p-3">{process.endTime}</td>
                <td className="border p-3">{process.status}</td>
              </tr>

              {/* Sub-Processes */}
              {expandedProcesses[process.executionId] &&
                process.subProcesses.map((subProcess) => (
                  <>
                    <tr
                      key={subProcess.executionId}
                      className="hover:bg-gray-50 cursor-pointer bg-gray-50"
                      onClick={() => toggleSubProcess(subProcess.executionId)}
                    >
                      <td className="border p-3 text-center pl-6">
                        {expandedSubProcesses[subProcess.executionId] ? <Minus className="w-4 h-4"/> : <Plus className="w-4 h-4"/>}
                      </td>
                      <td className="border p-3 pl-6">{subProcess.executionId}</td>
                      <td className="border p-3 pl-6">{subProcess.subProcessName}</td>
                      <td className="border p-3">{subProcess.startTime}</td>
                      <td className="border p-3">{subProcess.endTime}</td>
                      <td className="border p-3">{subProcess.status}</td>
                    </tr>

                    {/* Steps */}
                    {expandedSubProcesses[subProcess.executionId] &&
                      subProcess.steps.map((step) => (
                        <tr key={step.executionId} className="bg-gray-100">
                          <td className="border p-3 text-center pl-12"></td>
                          <td className="border p-3 pl-12">{step.executionId}</td>
                          <td className="border p-3 pl-12">{step.stepName}</td>
                          <td className="border p-3">{step.startTime}</td>
                          <td className="border p-3">{step.endTime}</td>
                          <td className="border p-3">{step.status}</td>
                        </tr>
                      ))}
                  </>
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
