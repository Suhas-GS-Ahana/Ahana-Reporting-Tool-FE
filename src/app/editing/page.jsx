"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function page() {

    const router = useRouter()
    const handleClick = () =>{
        router.push('editing/edit-process?id=1')
    }


  return (
    <div className='flex flex-auto'>
        <Button onClick={handleClick}>
            Go to Edit
        </Button>
    </div>
  )
}
