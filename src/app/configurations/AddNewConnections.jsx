import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const AddNewConnections = () => {
  return (
    <div>
        <h1>Add a new data source</h1>
        <form>
            <label>Enter Connection Name </label>
           <Input placeholder="Connection Name"></Input>

           <label>Database Host </label>
           <Input placeholder="Host name"></Input>

           <label>Database Port </label>
           <Input placeholder="Database port"></Input>

           <label>Database Name </label>
           <Input placeholder="Database name"></Input>

        <div className='flex items-center space-x-4'>
           <label>Database User Name </label>
           <Input placeholder="Database user"></Input>

           <label>Database Password </label>
           <Input placeholder="Password"></Input>
        </div>
        <div className='flex items-center space-x-4'>
        <Button>Test Connection</Button>
        <Button>Save Connection</Button>
        <Button variant="destructive">Save Continue</Button>
        </div>
        </form>

        
    </div>
  )
}

export default AddNewConnections