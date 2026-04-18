'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { RepoInput } from '@/components/repo-input'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ErrorState } from '@/components/error-state'
import { Activity, Sparkles } from 'lucide-react'

export default function AnalyzePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (url: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to analyze repository')
      }

      const data = await response.json()
      router.push(`/report/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-white/70">AI-Powered Analysis</span>
          </div>

          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Analyze Repository
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
            Enter a GitHub repository URL to get a comprehensive health report with AI-powered recommendations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-12 flex justify-center"
        >
          <RepoInput onSubmit={handleAnalyze} isLoading={isLoading} />
        </motion.div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16"
          >
            <div className="mb-8 text-center">
              <Activity className="mx-auto h-8 w-8 animate-pulse text-blue-400" />
              <p className="mt-4 text-white/60">Analyzing repository...</p>
            </div>
            <LoadingSkeleton />
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <ErrorState 
              message={error} 
              onRetry={() => setError(null)} 
            />
          </motion.div>
        )}

        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <h3 className="text-lg font-semibold text-white">What we analyze</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'README Quality', desc: 'Documentation completeness and clarity' },
                { title: 'Project Structure', desc: 'Organization and folder hierarchy' },
                { title: 'Activity Metrics', desc: 'Commit frequency and issue management' },
                { title: 'Maintainability', desc: 'Code quality and documentation' },
                { title: 'Best Practices', desc: 'CI/CD, licenses, and templates' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                  <div>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
