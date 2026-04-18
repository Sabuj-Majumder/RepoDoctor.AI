'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { History, ExternalLink, Trash2, Activity } from 'lucide-react'

interface Scan {
  id: string
  repoUrl: string
  owner: string
  repo: string
  overallScore: number
  createdAt: string
}

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const loadScans = async () => {
      try {
        const response = await fetch('/api/history')
        if (response.ok && mounted) {
          const data = await response.json()
          setScans(data.scans)
        }
      } catch (error) {
        console.error('Failed to fetch scans:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    
    loadScans()
    
    return () => {
      mounted = false
    }
  }, [])

  const deleteScan = async (id: string) => {
    try {
      const response = await fetch(`/api/history/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setScans(scans.filter(scan => scan.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete scan:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 text-green-400'
    if (score >= 75) return 'bg-blue-500/20 text-blue-400'
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-400'
    if (score >= 40) return 'bg-orange-500/20 text-orange-400'
    return 'bg-red-500/20 text-red-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Activity className="h-8 w-8 animate-pulse text-blue-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Analysis History</h1>
          <p className="mt-2 text-white/60">
            View your past repository analyses
          </p>
        </motion.div>

        {scans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center"
          >
            <History className="mx-auto h-12 w-12 text-white/20" />
            <h3 className="mt-4 text-lg font-semibold text-white">No analyses yet</h3>
            <p className="mt-2 text-white/50">
              Start by analyzing your first repository
            </p>
            <Link
              href="/analyze"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105"
            >
              Analyze Repository
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {scans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-white/10 bg-white/5 transition-all hover:border-white/20">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-lg font-bold ${getScoreColor(scan.overallScore)}`}>
                        {scan.overallScore}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {scan.owner}/{scan.repo}
                        </h3>
                        <p className="text-sm text-white/50">
                          {new Date(scan.createdAt).toLocaleDateString()} at{' '}
                          {new Date(scan.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/report/${scan.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white/60 hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteScan(scan.id)}
                        className="text-white/60 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
