"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight, Play, Check, X, Clock, AlertCircle } from 'lucide-react'

// Mock data structure
const mockProcessData = {
  id: "proc-001",
  name: "Data Pipeline Deployment",
  description: "Complete data pipeline deployment with validation and monitoring setup",
  status: "running",
  startTime: "2025-01-15T10:30:00Z",
  estimatedDuration: "25 minutes",
  subprocesses: [
    {
      id: "sub-001",
      name: "Environment Setup",
      description: "Initialize deployment environment and validate prerequisites",
      status: "completed",
      startTime: "2025-01-15T10:30:00Z",
      endTime: "2025-01-15T10:35:00Z",
      steps: [
        { id: "step-001", name: "Validate permissions", status: "completed", duration: "30s" },
        { id: "step-002", name: "Initialize workspace", status: "completed", duration: "45s" },
        { id: "step-003", name: "Load configuration", status: "completed", duration: "20s" },
        { id: "step-004", name: "Verify dependencies", status: "completed", duration: "1m 15s" }
      ]
    },
    {
      id: "sub-002",
      name: "Data Source Configuration",
      description: "Configure and test data source connections",
      status: "running",
      startTime: "2025-01-15T10:35:00Z",
      steps: [
        { id: "step-005", name: "Connect to primary database", status: "completed", duration: "1m 30s" },
        { id: "step-006", name: "Validate data schema", status: "completed", duration: "45s" },
        { id: "step-007", name: "Test connection pools", status: "running", duration: "2m 10s" },
        { id: "step-008", name: "Configure backup sources", status: "pending", duration: "" },
        { id: "step-009", name: "Run connectivity tests", status: "pending", duration: "" }
      ]
    },
    {
      id: "sub-003",
      name: "Pipeline Deployment",
      description: "Deploy data processing pipeline components",
      status: "pending",
      steps: [
        { id: "step-010", name: "Deploy processing containers", status: "pending", duration: "" },
        { id: "step-011", name: "Configure load balancers", status: "pending", duration: "" },
        { id: "step-012", name: "Initialize message queues", status: "pending", duration: "" },
        { id: "step-013", name: "Deploy monitoring agents", status: "pending", duration: "" }
      ]
    },
    {
      id: "sub-004",
      name: "Validation & Testing",
      description: "Validate deployment and run comprehensive tests",
      status: "pending",
      steps: [
        { id: "step-014", name: "Run smoke tests", status: "pending", duration: "" },
        { id: "step-015", name: "Validate data flow", status: "pending", duration: "" },
        { id: "step-016", name: "Performance benchmarks", status: "pending", duration: "" },
        { id: "step-017", name: "Security scan", status: "pending", duration: "" }
      ]
    }
  ]
}

export default function ExecutePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    
    const [processData, setProcessData] = useState(mockProcessData);
    const [expandedSubprocesses, setExpandedSubprocesses] = useState(new Set(['sub-001', 'sub-002']));
    const [currentTime, setCurrentTime] = useState(new Date());

    // Simulate real-time updates
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <Check className="w-4 h-4 text-green-600" />;
            case 'running':
                return <Play className="w-4 h-4 text-blue-600" />;
            case 'failed':
                return <X className="w-4 h-4 text-red-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-gray-400" />;
            default:
                return <AlertCircle className="w-4 h-4 text-yellow-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'running':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'pending':
                return 'bg-gray-100 text-gray-600 border-gray-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getProgressPercentage = () => {
        const totalSteps = processData.subprocesses.reduce((acc, sub) => acc + sub.steps.length, 0);
        const completedSteps = processData.subprocesses.reduce((acc, sub) => 
            acc + sub.steps.filter(step => step.status === 'completed').length, 0);
        return Math.round((completedSteps / totalSteps) * 100);
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
        if (!endTime) return "In progress...";
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diff = Math.round((end - start) / 1000);
        return `${diff}s`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => router.back()}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Processes
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <h1 className="text-2xl font-semibold text-gray-900">Process Execution</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Process ID: {id}</span>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(processData.status)}`}>
                            {processData.status.charAt(0).toUpperCase() + processData.status.slice(1)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Process Overview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{processData.name}</h2>
                                <p className="text-gray-600 mb-4">{processData.description}</p>
                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                    <span>Started: {new Date(processData.startTime).toLocaleString()}</span>
                                    <span>Estimated Duration: {processData.estimatedDuration}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {getStatusIcon(processData.status)}
                                <span className="text-sm font-medium text-gray-700">
                                    {processData.status === 'running' ? 'In Progress' : processData.status}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Overall Progress</span>
                                <span>{getProgressPercentage()}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${getProgressPercentage()}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{processData.subprocesses.length}</div>
                                <div className="text-sm text-gray-500">Total Subprocesses</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {processData.subprocesses.filter(s => s.status === 'completed').length}
                                </div>
                                <div className="text-sm text-gray-500">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {processData.subprocesses.filter(s => s.status === 'running').length}
                                </div>
                                <div className="text-sm text-gray-500">Running</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-400">
                                    {processData.subprocesses.filter(s => s.status === 'pending').length}
                                </div>
                                <div className="text-sm text-gray-500">Pending</div>
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
                                            <p className="text-sm text-gray-600">{subprocess.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">
                                                {subprocess.steps.filter(s => s.status === 'completed').length} / {subprocess.steps.length} steps
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {subprocess.endTime ? 
                                                    `Completed in ${formatDuration(subprocess.startTime, subprocess.endTime)}` :
                                                    subprocess.status === 'running' ? 'In progress...' : 'Pending'
                                                }
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
                                                            {stepIndex + 1}
                                                        </span>
                                                        {getStatusIcon(step.status)}
                                                        <span className="text-sm text-gray-900">{step.name}</span>
                                                        {step.status === 'running' && (
                                                            <div className="flex space-x-1">
                                                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                                                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                                                <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {step.duration || (step.status === 'running' ? 'Running...' : '-')}
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
            </div>
        </div>
    );
}