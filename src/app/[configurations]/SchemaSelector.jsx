import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Description } from '@radix-ui/react-toast'

const SchemaSelector = ({ schemaDetails, onSchemaSelect }) => {
  const [selectedSchema, setSelectedSchema] = useState(null)
  const { toast } = useToast()

  const handleSchemaChange = async (schema) => {
    setSelectedSchema(schema)
    if (onSchemaSelect) {
      onSchemaSelect(schema)
    }
  }

  return (
    <Select onValueChange={handleSchemaChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select schema" />
      </SelectTrigger>
      <SelectContent>
        {schemaDetails.map((schema, index) => (
          <SelectItem key={index} value={schema}>
            {schema.schema_name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SchemaSelector



// {
//   process_name:"string",
//   subprocess:{
//     {
//       subprocess_name:"string",
//       steps:{
//         {
//           step_no:"string",
//           step_type:"string", //import
//           source_tables:"[array]",
//           destination_tables:"[array]"
//         },
//         {
//           step_no:"string",
//           step_type:"string", //process-query or export
//           description:"string",
//           query:"string"
//         },
//         {},{},{}..etc
//       }
//     },
//     {},{},{}...etc
//   },
// }