"use client"

import React, { useState, useEffect } from 'react';
import { Play, ChevronDown, ChevronRight, CheckCircle, XCircle, Clock, Download, Eye, AlertCircle } from 'lucide-react';

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

const ProcessExecutionUI = () => {
  const [processData, setProcessData] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [expandedSubprocesses, setExpandedSubprocesses] = useState({});
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // API Configuration - Replace with your actual base URL


  const router = useRouter();
      const searchParams = useSearchParams();
      const processId = searchParams.get("id");

  useEffect(() => {
    fetchProcessData();
  }, []);

  const fetchProcessData = async () => {
    try {
      const response = await fetch(`${baseURL}/get-full-hierarchy/${processId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProcessData(data);
      
      // Expand all subprocesses by default
      const expanded = {};
      data.subprocesses.forEach(subprocess => {
        expanded[subprocess.subprocess_data.sub_process_id] = true;
      });
      setExpandedSubprocesses(expanded);
    } catch (error) {
      console.error('Error fetching process data:', error);
      // You might want to show an error message to the user here
      alert('Failed to load process data. Please check your API configuration.');
    }
  };

  const executeProcess = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch(`${baseURL}/execute-hierarchy?process_id=${processId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setExecutionResult(data);
    } catch (error) {
      console.error('Error executing process:', error);
      setExecutionResult({
        status: 'error',
        message: 'Process execution failed',
        summary: { subprocesses: [] }
      });
      // You might want to show an error message to the user here
      alert('Failed to execute process. Please check your API configuration.');
    } finally {
      setIsExecuting(false);
    }
  };

  const toggleSubprocess = (subprocessId) => {
    setExpandedSubprocesses(prev => ({
      ...prev,
      [subprocessId]: !prev[subprocessId]
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'failed':
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'running':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStepStatus = (stepId) => {
    if (!executionResult) return null;
    
    for (const subprocess of executionResult.summary.subprocesses) {
      const step = subprocess.steps.find(s => s.step_id === stepId);
      if (step) return step;
    }
    return null;
  };

  const viewResults = (results) => {
    setSelectedResult(results);
    setShowResultModal(true);
  };

  const downloadResults = (results) => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'process_results.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!processData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading process data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{processData.process.process_name}</h1>
              <p className="text-sm text-gray-500">Process ID: {processData.process.process_master_id}</p>
            </div>
            <button
              onClick={executeProcess}
              disabled={isExecuting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Execute Process
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Process Status */}
        {executionResult && (
          <div className={`mb-6 p-4 rounded-lg ${getStatusColor(executionResult.status)}`}>
            <div className="flex items-center">
              {getStatusIcon(executionResult.status)}
              <span className="ml-2 font-medium">{executionResult.message}</span>
            </div>
          </div>
        )}

        {/* Process Hierarchy */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Process Hierarchy</h2>
            
            {processData.subprocesses.map((subprocess) => (
              <div key={subprocess.subprocess_data.sub_process_id} className="mb-4 border rounded-lg">
                <div 
                  className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleSubprocess(subprocess.subprocess_data.sub_process_id)}
                >
                  <div className="flex items-center">
                    {expandedSubprocesses[subprocess.subprocess_data.sub_process_id] ? 
                      <ChevronDown className="w-4 h-4 mr-2" /> : 
                      <ChevronRight className="w-4 h-4 mr-2" />
                    }
                    <span className="font-medium text-gray-900">
                      {subprocess.subprocess_data.sub_process_name}
                    </span>
                    {executionResult && (
                      <span className="ml-4">
                        {getStatusIcon(executionResult.summary.subprocesses.find(s => s.subprocess_id === subprocess.subprocess_data.sub_process_id)?.status)}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {subprocess.steps.length} steps
                  </span>
                </div>

                {expandedSubprocesses[subprocess.subprocess_data.sub_process_id] && (
                  <div className="border-t">
                    {subprocess.steps.map((step, index) => {
                      const stepStatus = getStepStatus(step.steps.process_step_id);
                      return (
                        <div key={step.steps.process_step_id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                          <div className="flex items-center">
                            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {step.steps.process_step_order}
                            </span>
                            <div>
                              <span className="font-medium text-gray-900 capitalize">
                                {step.steps.process_step_action}
                              </span>
                              {step.steps.process_step_description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {step.steps.process_step_description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {stepStatus && (
                              <>
                                {getStatusIcon(stepStatus.status)}
                                {stepStatus.select_results && (
                                  <div className="flex space-x-1 ml-2">
                                    <button
                                      onClick={() => viewResults(stepStatus.select_results)}
                                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                      <Eye className="w-3 h-3 mr-1" />
                                      View
                                    </button>
                                    <button
                                      onClick={() => downloadResults(stepStatus.select_results)}
                                      className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                      <Download className="w-3 h-3 mr-1" />
                                      Download
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results Modal */}
      {showResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Step Results</h3>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-80">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(selectedResult, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessExecutionUI;