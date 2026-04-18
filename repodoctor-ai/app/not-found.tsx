'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
            <FileQuestion className="h-10 w-10 text-white/40" />
          </div>
        </div>
        
        <h1 className="mb-2 text-6xl font-bold text-white">404</h1>
        
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Page Not Found
        </h2>
        
        <p className="mb-8 text-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <Link href="/">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  )
}
