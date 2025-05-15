// Connection Management Page
// Page to manage connection - edit & delete

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
  Loader,
  LoaderPinwheel,
  Trash,
  PlusCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { connection } from "next/server";

// API Setup
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;
const baseURL = `http://${host}:${port}`;

export default function ConnectionPage() {
  const router = useRouter();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage, setItemsPerPage] = useState(5); // Number of items per page

  // Sorting state
  const [sortField, setSortField] = useState("connection_name"); // Field to sort by
  const [sortDirection, setSortDirection] = useState("asc"); // Sort direction (asc/desc)

  // Filter state
  const [searchTerm, setSearchTerm] = useState(""); // Search/filter text

  // api - (/connection)
  // setting - connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseURL}/connection`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result.status === "success") {
          setConnections(result.data);
        } else {
          setError("Failed to fetch connections");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
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

  // Sort connections
  const sortedConnections = [...connections].sort((a, b) => {
    if (sortField === "inserted_date" || sortField === "modified_date") {
      return sortDirection === "asc"
        ? new Date(a[sortField]) - new Date(b[sortField])
        : new Date(b[sortField]) - new Date(a[sortField]);
    }

    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Filter connections
  const filteredConnections = sortedConnections.filter((connection) =>
    connection.connection_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConnections.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  //Handle add
  const handleAdd = () =>{
    router.push(`/connections/add`);
  }

  // Handle edit
  const handleEdit = (id) => {
    router.push(`/connections/edit/${id}`);
  };

  // Handle delete
  const handleDelete = (id) => {
    alert(`Connection with ID deleted ${id}`);
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
          {/* Header */}
          <CardHeader className="bg-gray-1 rounded-t-md flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-xl">Connection Management</CardTitle>
              <CardDescription>
                View, edit and delete connections
              </CardDescription>
            </div>
            <div>
              <Button
                onClick={() => {handleAdd()}}
                className="shadow-sm bg-blue-500 hover:bg-blue-600 rounded-full px-4 py-2 transition"
              >
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Connection
              </Button>
            </div>
          </CardHeader>
          {/* Main Content */}
          <CardContent className="pt-6">
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Connection */}
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search connections..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Set page row limit */}
              <div className="flex gap-2">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
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
                {/* Connection table */}
                <div className="overflow-x-auto">
                  <Table className="w-full">
                    {/* Heading */}
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSort("connection_name")}
                        >
                          Connection Name
                          {sortField === "connection_name" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="inline ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="inline ml-1 h-4 w-4" />
                            ))}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-gray-200"
                          onClick={() => handleSort("data_sources_id")}
                        >
                          Connection ID
                          {sortField === "data_sources_id" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="inline ml-1 h-4 w-4" />
                            ) : (
                              <ChevronDown className="inline ml-1 h-4 w-4" />
                            ))}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    {/* Body */}
                    <TableBody>
                      {currentItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-10 text-gray-500"
                          >
                            No connections found
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentItems.map((connection) => (
                          <TableRow
                            key={connection.connection_name}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="font-medium">
                              {connection.connection_name}
                            </TableCell>
                            <TableCell>{connection.data_sources_id}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2"
                                  onClick={() =>
                                    handleEdit(connection.data_sources_id)
                                  }
                                >
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8 px-2 bg-gray-400 hover:bg-gray-600"
                                  onClick={() =>
                                    handleDelete(connection.data_sources_id)
                                  }
                                >
                                  <Trash className="h-4 w-4 mr-1" /> Delete
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
                {filteredConnections.length > 0 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
                          />
                        </PaginationItem>

                        {paginationItems}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : ""
                            }
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
