import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Server, Database, Globe, Plug, LayoutList } from 'lucide-react'

const ConnectionDetails = ({ connectionsDetails }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center ">
      <Badge variant="outline" className="text-xs text-gray-600 bg-slate-200 flex items-center gap-1 px-2 py-1">
        <LayoutList className="w-3 h-3" /> Type: {connectionsDetails.database_type}
      </Badge>
      <Badge variant="outline" className="text-xs text-gray-600 bg-slate-200 flex items-center gap-1 px-2 py-1">
        <Database className="w-3 h-3" /> Database: {connectionsDetails.database_name}
      </Badge>
    </div>
  )
}

export default ConnectionDetails