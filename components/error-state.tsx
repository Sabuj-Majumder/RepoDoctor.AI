'use client'

import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-md"
    >
      <Card className="border-red-500/20 bg-red-500/10">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-white">Analysis Failed</h3>
          <p className="mb-6 text-sm text-white/60">{message}</p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
