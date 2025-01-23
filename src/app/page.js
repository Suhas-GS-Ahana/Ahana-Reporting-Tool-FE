import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Select DataSource & Table</h1>
        <p className="text-muted-foreground">Configure your data source and select tables for processing.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Data Source Configuration</CardTitle>
          <CardDescription>Select your database and schema information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="con12">con12</SelectItem>
                  <SelectItem value="con13">con13</SelectItem>
                </SelectContent>
              </Select>
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
          </div>
          <Button>Fetch Schema Information</Button>
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
        </CardContent>
      </Card>
    </div>
  )
}

