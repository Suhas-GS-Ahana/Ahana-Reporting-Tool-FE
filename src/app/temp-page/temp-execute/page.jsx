"use client"

import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Play, Check, X, Clock, AlertCircle, RefreshCw } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function ExecutePage() {
    // Mock process ID for demonstration - replace with actual prop or URL param
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    
    const [executionState, setExecutionState] = useState('idle'); // idle, executing, completed, failed
    const [executionLogs, setExecutionLogs] = useState([]);
    const [processData, setProcessData] = useState(null);
    const [isPolling, setIsPolling] = useState(false);
    const [expandedSubprocesses, setExpandedSubprocesses] = useState(new Set());
    const [error, setError] = useState(null);

    // Parse execution logs into structured data
    const parseExecutionLogs = (logs) => {
        if (!logs || logs.length === 0) return null;

        // Group logs by type
        const processLogs = logs.filter(log => !log.sub_process_id && !log.process_step_id);
        const subProcessLogs = logs.filter(log => log.sub_process_id && !log.process_step_id);
        const stepLogs = logs.filter(log => log.process_step_id);

        // Get main process info
        const mainProcess = processLogs.find(log => log.step_status === 'started') || processLogs[0];
        const processComplete = processLogs.find(log => log.step_status === 'completed');

        // Group steps by subprocess
        const subprocesses = {};
        subProcessLogs.forEach(subLog => {
            const subSteps = stepLogs
                .filter(step => step.sub_process_id === subLog.sub_process_id)
                .sort((a, b) => (a.process_step_order || 0) - (b.process_step_order || 0));

            subprocesses[subLog.sub_process_id] = {
                id: subLog.sub_process_id,
                name: `Subprocess ${subLog.sub_process_id}`,
                status: subLog.step_status,
                startTime: subLog.start_time,
                endTime: subLog.end_time,
                message: subLog.exec_msg,
                steps: subSteps.map(step => ({
                    id: step.process_step_id,
                    name: `Step ${step.process_step_id}`,
                    status: step.step_status,
                    startTime: step.start_time,
                    endTime: step.end_time,
                    duration: step.end_time ? 
                        `${((new Date(step.end_time) - new Date(step.start_time)) / 1000).toFixed(2)}s` : 
                        null,
                    message: step.exec_msg,
                    order: step.process_step_order,
                    rowsProcessed: step.no_of_rows
                }))
            };
        });

        return {
            id: mainProcess?.process_master_id || id,
            name: `Process ${mainProcess?.process_master_id || id}`,
            status: processComplete ? 'completed' : (mainProcess?.step_status === 'started' ? 'running' : 'pending'),
            startTime: mainProcess?.start_time,
            endTime: processComplete?.end_time,
            batchId: mainProcess?.batch_id,
            executionDate: mainProcess?.execution_date,
            subprocesses: Object.values(subprocesses).sort((a, b) => a.id - b.id)
        };
    };

    // Execute the process
    const executeProcess = async () => {
        setExecutionState('executing');
        setError(null);
        
        try {
            const response = await fetch(`${baseURL}/execute-hierarchy?process_id=${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === 'success') {
                    setExecutionState('completed');
                    startPolling();
                } else {
                    throw new Error(result.message || 'Process execution failed');
                }
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (err) {
            setError(err.message);
            setExecutionState('failed');
        }
    };

    // Fetch execution logs
    const fetchExecutionLogs = async () => {
        try {
            const response = await fetch(`${baseURL}/get-execute-hierarchy-log?process_id=${id}`);
            
            if (response.ok) {
                const result = await response.json();
                if (result.status === 'success' && result.data) {
                    setExecutionLogs(result.data);
                    const parsed = parseExecutionLogs(result.data);
                    setProcessData(parsed);
                    
                    // Stop polling if process is completed
                    if (parsed && parsed.status === 'completed') {
                        setIsPolling(false);
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching execution logs:', err);
        }
    };

    // Start polling for logs
    const startPolling = () => {
        setIsPolling(true);
        fetchExecutionLogs(); // Fetch immediately
    };

    // Polling effect
    useEffect(() => {
        let interval;
        if (isPolling) {
            interval = setInterval(fetchExecutionLogs, 2000); // Poll every 2 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPolling]);

    // Auto-expand subprocesses when data is available
    useEffect(() => {
        if (processData && processData.subprocesses.length > 0) {
            setExpandedSubprocesses(new Set(processData.subprocesses.map(sub => sub.id)));
        }
    }, [processData]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
            case 'completed':
                return <Check className="w-4 h-4 text-green-600" />;
            case 'running':
            case 'started':
                return <Play className="w-4 h-4 text-blue-600" />;
            case 'failed':
            case 'error':
                return <X className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'success':
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'running':
            case 'started':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'failed':
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    const toggleSubprocess = (subprocessId) => {
        const newExpanded = new Set(expandedSubprocesses);
        if (newExpanded.has(subprocessId)) {
            newExpanded.delete(subprocessId);
        } else {
            newExpanded.add(subprocessId);
        }
        setExpandedSubprocesses(newExpanded);
    };

    const formatDuration = (startTime, endTime) => {
        if (!startTime) return '-';
        if (!endTime) return 'Running...';
        const duration = (new Date(endTime) - new Date(startTime)) / 1000;
        return `${duration.toFixed(2)}s`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => window.history.back()}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Processes
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <h1 className="text-2xl font-semibold text-gray-900">Process Execution</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Process ID: {id}</span>
                        {processData && (
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(processData.status)}`}>
                                {processData.status.charAt(0).toUpperCase() + processData.status.slice(1)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Execute Button or Process Overview */}
                {executionState === 'idle' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="mb-4">
                                <Play className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready to Execute Process</h2>
                                <p className="text-gray-600">Click the button below to start the execution of Process {id}</p>
                            </div>
                            <button
                                onClick={executeProcess}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Execute Process
                            </button>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <span className="text-red-800 font-medium">Execution Error</span>
                        </div>
                        <p className="text-red-700 mt-1">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                setExecutionState('idle');
                            }}
                            className="mt-3 text-red-600 hover:text-red-800 font-medium"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Executing State */}
                {executionState === 'executing' && !processData && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <RefreshCw className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Executing Process</h2>
                        <p className="text-gray-600">Process execution has started. Waiting for execution logs...</p>
                    </div>
                )}

                {/* Process Data Display */}
                {processData && (
                    <>
                        {/* Process Overview */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex-1">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{processData.name}</h2>
                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Batch ID:</span> {processData.batchId}
                                            </div>
                                            <div>
                                                <span className="font-medium">Execution Date:</span> {processData.executionDate ? new Date(processData.executionDate).toLocaleString() : '-'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Started:</span> {processData.startTime ? new Date(processData.startTime).toLocaleString() : '-'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Duration:</span> {formatDuration(processData.startTime, processData.endTime)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {isPolling && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
                                        {getStatusIcon(processData.status)}
                                        <span className="text-sm font-medium text-gray-700">
                                            {processData.status.charAt(0).toUpperCase() + processData.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">{processData.subprocesses.length}</div>
                                        <div className="text-sm text-gray-500">Subprocesses</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {processData.subprocesses.filter(s => s.status === 'success').length}
                                        </div>
                                        <div className="text-sm text-gray-500">Completed</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {processData.subprocesses.reduce((acc, sub) => acc + sub.steps.length, 0)}
                                        </div>
                                        <div className="text-sm text-gray-500">Total Steps</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subprocesses */}
                        <div className="space-y-4">
                            {processData.subprocesses.map((subprocess, index) => (
                                <div key={subprocess.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div 
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleSubprocess(subprocess.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-2">
                                                    {expandedSubprocesses.has(subprocess.id) ? 
                                                        <ChevronDown className="w-5 h-5 text-gray-400" /> : 
                                                        <ChevronRight className="w-5 h-5 text-gray-400" />
                                                    }
                                                    <span className="text-sm font-medium text-gray-500">
                                                        {index + 1}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{subprocess.name}</h3>
                                                    <p className="text-sm text-gray-600">{subprocess.message}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">
                                                        {subprocess.steps.filter(s => s.status === 'success').length} / {subprocess.steps.length} steps
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {formatDuration(subprocess.startTime, subprocess.endTime)}
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subprocess.status)}`}>
                                                    {subprocess.status.charAt(0).toUpperCase() + subprocess.status.slice(1)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Steps */}
                                    {expandedSubprocesses.has(subprocess.id) && (
                                        <div className="border-t border-gray-200 bg-gray-50">
                                            <div className="p-4">
                                                <div className="space-y-2">
                                                    {subprocess.steps.map((step, stepIndex) => (
                                                        <div key={step.id} className="flex items-center justify-between py-2 px-3 bg-white rounded border border-gray-100">
                                                            <div className="flex items-center space-x-3">
                                                                <span className="text-xs font-medium text-gray-400 w-6">
                                                                    {step.order || stepIndex + 1}
                                                                </span>
                                                                {getStatusIcon(step.status)}
                                                                <div>
                                                                    <span className="text-sm text-gray-900">{step.name}</span>
                                                                    {step.rowsProcessed > 0 && (
                                                                        <div className="text-xs text-gray-500">
                                                                            {step.rowsProcessed.toLocaleString()} rows processed
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {step.duration || '-'}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Raw Logs (for debugging) */}
                {executionLogs.length > 0 && (
                    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Execution Logs</h3>
                        </div>
                        <div className="p-4 max-h-60 overflow-y-auto">
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                                {JSON.stringify(executionLogs, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}