import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const ConnectionForm = ({ onTestConnection, onSaveConnection, onSkip }) => {
    const [connectionData, setConnectionData] = useState({
        connectionName: "",
        host: "",
        port: "",
        database: "",
        user: "",
        password: "",
    })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Data Source</h1>
      <form className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Enter Connection Name</label>
          <Input placeholder="Connection Name" className="w-full" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Database Host</label>
          <Input placeholder="Host name" className="w-full" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Database Port</label>
          <Input placeholder="Database port" className="w-full" />
        </div>

        <div>
          <label className="block font-semibold mb-1">Database Name</label>
          <Input placeholder="Database name" className="w-full" />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Database User Name</label>
            <Input placeholder="Database user" className="w-full" />
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Database Password</label>
            <Input type="password" placeholder="Password" className="w-full" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button onClick={onTestConnection}>Test Connection</Button>
          <Button onClick={onSaveConnection}>Save Connection</Button>
          <Button variant="destructive" onClick={onSkip}>
            Skip & Continue
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ConnectionForm