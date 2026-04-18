'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-white">
          Something went wrong
        </h1>
        
        <p className="mb-8 text-white/60">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-red-400">Error details:</p>
            <code className="break-all text-xs text-red-300">
              {error.message}
            </code>
          </div>
        )}
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
