import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Server, Database, Globe, Plug, LayoutList } from 'lucide-react'

const ConnectionDetails = ({ connectionDetails }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* <Badge variant="outline" className="text-xs bg-blue-100 text-blue-600 flex items-center gap-1 px-2 py-1">
        <Server className="w-3 h-3" /> Name: {connectionDetails[0]}
      </Badge>
      <Badge variant="outline" className="text-xs bg-green-100 text-green-600 flex items-center gap-1 px-2 py-1">
        <Globe className="w-3 h-3" /> Server: {connectionDetails[1]}
      </Badge>
      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-600 flex items-center gap-1 px-2 py-1">
        <Plug className="w-3 h-3" /> Port: {connectionDetails[2]}
      </Badge> */}
      <Badge variant="outline" className="text-xs bg-purple-100 text-purple-600 flex items-center gap-1 px-2 py-1">
        <LayoutList className="w-3 h-3" /> Type: {connectionDetails.database_type}
      </Badge>
      <Badge variant="outline" className="text-xs bg-red-100 text-red-600 flex items-center gap-1 px-2 py-1">
        <Database className="w-3 h-3" /> Database: {connectionDetails.connection_name}
      </Badge>
    </div>
  )
}

export default ConnectionDetails