// Page to manage process - edit & execute

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Play,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProcessPage() {
  const router = useRouter();
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // Sorting state
  const [sortField, setSortField] = useState("process_name");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://10.235.20.52:8001/process");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === "success") {
          setProcesses(result.data);
        } else {
          setError("Failed to fetch processes");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProcesses();
  }, []);

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort processes
  const sortedProcesses = [...processes].sort((a, b) => {
    if (sortField === "inserted_date" || sortField === "modified_date") {
      return sortDirection === "asc"
        ? new Date(a[sortField]) - new Date(b[sortField])
        : new Date(b[sortField]) - new Date(a[sortField]);
    }
    
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Filter processes
  const filteredProcesses = sortedProcesses.filter(process => 
    process.process_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProcesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle edit
  const handleEdit = (id) => {
    router.push(`/process/edit/${id}`);
  };

  // Handle execute
  const handleExecute = (id) => {
    router.push(`/process/execute/${id}`);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink 
          isActive={currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div className="flex min-h-screen flex-col ">
      <div className="p-6">
        <Card className="w-full shadow-md rounded-md">
          <CardHeader className="bg-gray-1 rounded-t-md">
            <CardTitle className="text-xl">Process Management</CardTitle>
            <CardDescription className="">
              View, edit and execute processes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search processes..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 per page</SelectItem>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                  </SelectContent>
                </Select>
                {/* <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" /> Filter
                </Button> */}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-800 p-4 mb-4 rounded">
                {error}
              </div>
            )}

            {/* Loading state */}
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {/* Process table */}
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSort("process_name")}
                        >
                          Process Name
                          {sortField === "process_name" && (
                            sortDirection === "asc" ? 
                            <ChevronUp className="inline ml-1 h-4 w-4" /> : 
                            <ChevronDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSort("process_version")}
                        >
                          Version
                          {sortField === "process_version" && (
                            sortDirection === "asc" ? 
                            <ChevronUp className="inline ml-1 h-4 w-4" /> : 
                            <ChevronDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSort("inserted_date")}
                        >
                          Created Date
                          {sortField === "inserted_date" && (
                            sortDirection === "asc" ? 
                            <ChevronUp className="inline ml-1 h-4 w-4" /> : 
                            <ChevronDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSort("modified_date")}
                        >
                          Modified Date
                          {sortField === "modified_date" && (
                            sortDirection === "asc" ? 
                            <ChevronUp className="inline ml-1 h-4 w-4" /> : 
                            <ChevronDown className="inline ml-1 h-4 w-4" />
                          )}
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                            No processes found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentItems.map((process) => (
                          <TableRow key={process.process_master_id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{process.process_name}</TableCell>
                            <TableCell>{process.process_version}</TableCell>
                            <TableCell>{formatDate(process.inserted_date)}</TableCell>
                            <TableCell>{formatDate(process.modified_date)}</TableCell>
                            <TableCell>
                              <span 
                                className={`px-2 py-1 rounded-full text-xs ${
                                  process.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {process.is_active ? "Active" : "Inactive"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 px-2"
                                  onClick={() => handleEdit(process.process_master_id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="h-8 px-2 bg-blue-600 hover:bg-blue-700"
                                  onClick={() => handleExecute(process.process_master_id)}
                                >
                                  <Play className="h-4 w-4 mr-1" /> Execute
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {filteredProcesses.length > 0 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {paginationItems}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}