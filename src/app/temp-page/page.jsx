"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

export default function TemPage() {
    const id=9;
    const router = useRouter();

    const handleClick = () => {
        router.push(`/temp-page/temp-edit?id=${id}`);
    }
    
  return (
    <div>
        <h1>Edit button for ID: {id}</h1>
        <Button onClick={handleClick}>Edit Process</Button>
    </div>
  )
}
