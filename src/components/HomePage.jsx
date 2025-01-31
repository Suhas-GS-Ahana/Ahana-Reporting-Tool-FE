"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { invoices } from "@/lib/utils"
import { Badge } from "./ui/badge"
import { Server, Database, Globe, Plug, LayoutList } from "lucide-react"

export default function HomePage() {
  const [connections, setConnections] = useState([])
  const [selectedConnection, setSelectedConnection] = useState(null)
  const [connectionDetails, setConnectionDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/connections/view_connections")
      if (!response.ok) {
        throw new Error("Failed to fetch connections")
      }
      const data = await response.json()
      setConnections(data.connections)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connections",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnectionSelect = async (connectionName) => {
    setLoading(true)
    setSelectedConnection(connectionName)
    try {
      const response = await fetch(`http://localhost:8000/connections/get_connection?name=${connectionName}`)
      if (!response.ok) {
        throw new Error("Failed to fetch connection details")
      }
      const data = await response.json()
      setConnectionDetails(data.connection.get_connectiondetails)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch connection details",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Select DataSource & Table</h1>
        <p className="text-muted-foreground">Configure your data source and select tables for processing.</p>
      </div>
      <div className="flex gap-6">
       
      <Card>
        <CardHeader>
          <CardTitle>Data Source Configuration</CardTitle>
          <CardDescription>Select your database and schema information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Select onValueChange={handleConnectionSelect} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  {connections.map((connection) => (
                    <SelectItem key={connection.connection_name} value={connection.connection_name}>
                      {connection.connection_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {connectionDetails && (
  <div className="flex flex-wrap gap-2 items-center">
    <Badge variant="outline" className="text-xs bg-blue-100 text-blue-600 flex items-center gap-1 px-2 py-1">
      <Server className="w-3 h-3" /> Name: {connectionDetails[0]}
    </Badge>
    <Badge variant="outline" className="text-xs bg-green-100 text-green-600 flex items-center gap-1 px-2 py-1">
      <Globe className="w-3 h-3" /> Server: {connectionDetails[1]}
    </Badge>
    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-600 flex items-center gap-1 px-2 py-1">
      <Plug className="w-3 h-3" /> Port: {connectionDetails[2]}
    </Badge>
    <Badge variant="outline" className="text-xs bg-purple-100 text-purple-600 flex items-center gap-1 px-2 py-1">
      <LayoutList className="w-3 h-3" /> Type: {connectionDetails[3]}
    </Badge>
    <Badge variant="outline" className="text-xs bg-red-100 text-red-600 flex items-center gap-1 px-2 py-1">
      <Database className="w-3 h-3" /> Database: {connectionDetails[4]}
    </Badge>
  </div>
)}
          </div>
          <div className="grid gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select schema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">public</SelectItem>
                  <SelectItem value="private">private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          <Button disabled={!selectedConnection || loading}>Fetch Schema Information</Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="temp-table" />
              <label htmlFor="temp-table">Create temporary table</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="convert-types" />
              <label htmlFor="convert-types">Convert data types</label>
            </div>
          </div>
          <div className="flex gap-3">
          <Button className='bg-blue-950'>Clear Selection</Button>
          <Button className='bg-blue-950'>Create Table</Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-[500px]">
        <CardHeader>
           <CardTitle>Selected table</CardTitle> </CardHeader>
      <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">DSN Name</TableHead>
          <TableHead>Schema</TableHead>
          <TableHead>Table Name</TableHead>
          <TableHead className="text-right">Count of Columns Selcted</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
      </Card>
     
      </div>

    </div>
  )
}

