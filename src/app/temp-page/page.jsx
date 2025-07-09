"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

export default function TemPage() {
    const id=13;
    const router = useRouter();

    const handleEdit = () => {
        router.push(`/temp-page/temp-edit?id=${id}`);
    }
    const handleExecute = () => {
        router.push(`/temp-page/temp-execute?id=${id}`);
    }
    
  return (
    <div>
        <h1>Edit button for ID: {id}</h1>
        <Button onClick={handleEdit}>Edit Process</Button>
        <h1>Execute button for ID: {id}</h1>
        <Button onClick={handleExecute}>Execute Process</Button>
    </div>
  )
}
