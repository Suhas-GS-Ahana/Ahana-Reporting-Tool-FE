"use client"

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"

export default function BackButton() {
    const router = useRouter();
  return (
    <button 
    onClick={()=>router.back()} 
    className="flex items-center space-x-1 border bg-transparent shadow-sm hover:shadow-md text-xs  rounded-sm p-2 h-6">
        <ArrowLeft size={16} />
        <span>Back</span>
    </button>
  )
}
