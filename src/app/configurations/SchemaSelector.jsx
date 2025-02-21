import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const SchemaSelector = ({ schemaDetails }) => {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select schema" />
      </SelectTrigger>
      <SelectContent>
        {schemaDetails.map((schema) => (
          <SelectItem key={schema.get_connectionschema} value={schema.get_connectionschema}>
            {schema.get_connectionschema}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SchemaSelector