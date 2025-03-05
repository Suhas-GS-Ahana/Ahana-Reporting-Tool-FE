import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

const ConnectionForm = ({ onTestConnection, onSaveConnection, onSkip }) => {
  const [newConnectionData, setNewConnectionData] = useState({
    connectionName: "",
    hostName: "",
    portNumber: "",
    databaseName: "",
    userName: "",
    password: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewConnectionData({
      ...newConnectionData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const newErrors = {}
    if (!newConnectionData.connectionName) newErrors.connectionName = "Connection Name is required"
    if (!newConnectionData.hostName) newErrors.hostName = "Host Name is required"
    if (!newConnectionData.portNumber) newErrors.portNumber = "Port Number is required"
    if (!newConnectionData.databaseName) newErrors.databaseName = "Database Name is required"
    if (!newConnectionData.userName) newErrors.userName = "User Name is required"
    if (!newConnectionData.password) newErrors.password = "Password is required"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    if (isSubmitting) return
    setIsSubmitting(true)
    await onSaveConnection(newConnectionData)
    setIsSubmitting(false)
    setNewConnectionData({
      connectionName: "",
      hostName: "",
      portNumber: "",
      databaseName: "",
      userName: "",
      password: "",
    })
    setErrors({})
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add a New Data Source</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold mb-1">Enter Connection Name</label>
          <Input
            name="connectionName"
            placeholder="Connection Name"
            className="w-full"
            value={newConnectionData.connectionName}
            onChange={handleChange}
          />
          {errors.connectionName && <p className="text-red-500 text-sm">{errors.connectionName}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Database Host</label>
          <Input
            name="hostName"
            placeholder="Host name"
            className="w-full"
            value={newConnectionData.hostName}
            onChange={handleChange}
          />
          {errors.hostName && <p className="text-red-500 text-sm">{errors.hostName}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Database Port</label>
          <Input
            name="portNumber"
            placeholder="Database port"
            className="w-full"
            value={newConnectionData.portNumber}
            onChange={handleChange}
          />
          {errors.portNumber && <p className="text-red-500 text-sm">{errors.portNumber}</p>}
        </div>

        <div>
          <label className="block font-semibold mb-1">Database Name</label>
          <Input
            name="databaseName"
            placeholder="Database name"
            className="w-full"
            value={newConnectionData.databaseName}
            onChange={handleChange}
          />
          {errors.databaseName && <p className="text-red-500 text-sm">{errors.databaseName}</p>}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Database User Name</label>
            <Input
              name="userName"
              placeholder="Database user"
              className="w-full"
              value={newConnectionData.userName}
              onChange={handleChange}
            />
            {errors.userName && <p className="text-red-500 text-sm">{errors.userName}</p>}
          </div>
          <div className="flex-1">
            <label className="block font-semibold mb-1">Database Password</label>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full"
              value={newConnectionData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button type="button" onClick={() => onTestConnection(newConnectionData)}>Test Connection</Button>
          <Button type="submit" disabled={isSubmitting}>Save Connection</Button>
          <Button type="button" variant="destructive" onClick={onSkip}>
            Skip & Continue
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ConnectionForm