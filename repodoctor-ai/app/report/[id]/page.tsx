'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ScoreCard } from '@/components/score-card'
import { ScoreRadarChart } from '@/components/radar-chart'
import { RecommendationsList } from '@/components/recommendations-list'
import { RepoStatsCard } from '@/components/repo-stats-card'
import { LoadingSkeleton } from '@/components/loading-skeleton'
import { ErrorState } from '@/components/error-state'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Sparkles, 
  ArrowLeft,
  Copy,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { generateMarkdownReport, generatePDFReport, downloadFile, copyToClipboard } from '@/lib/report'

interface ReportData {
  id: string
  repoUrl: string
  owner: string
  repo: string
  overallScore: number
  breakdown: {
    readme: number
    structure: number
    activity: number
    maintainability: number
    bestPractices: number
  }
  metadata: {
    description: string | null
    stars: number
    forks: number
    openIssues: number
    language: string | null
    license: { name: string } | null
  }
  insights: {
    type: string
    primaryLanguage: string
    frameworks: string[]
    isMonorepo: boolean
    hasDocker: boolean
  }
  recommendations: string[]
  aiAnalysis?: {
    summary: string
    readmeSuggestions: string[]
    refactorSuggestions: string[]
    contributorAdvice: string[]
  }
  scoring: {
    details: {
      readme: Record<string, boolean>
      structure: Record<string, boolean>
      activity: Record<string, boolean>
      maintainability: Record<string, boolean>
      bestPractices: Record<string, boolean>
    }
  }
  createdAt: string
}

export default function ReportPage() {
  const params = useParams()
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(`/api/report/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to load report')
      }
      const data = await response.json()
      setReport(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }, [params.id])

  const hasFetched = useRef(false)
  
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchReport()
    }
  }, [fetchReport])

  const handleDownloadPDF = async () => {
    if (!report) return
    const blob = await generatePDFReport(report)
    downloadFile(blob, `${report.owner}-${report.repo}-report.pdf`)
  }

  const handleCopyMarkdown = async () => {
    if (!report) return
    const markdown = generateMarkdownReport(report)
    await copyToClipboard(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 75) return 'text-blue-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 75) return 'Good'
    if (score >= 60) return 'Fair'
    if (score >= 40) return 'Needs Work'
    return 'Poor'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black pt-24">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <ErrorState message={error || 'Report not found'} onRetry={fetchReport} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <Link
              href="/analyze"
              className="mb-4 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Analysis
            </Link>
            <h1 className="text-3xl font-bold text-white">
              {report.owner}/{report.repo}
            </h1>
            <p className="mt-1 text-white/50">
              Analyzed on {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownloadPDF}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyMarkdown}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              {copied ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-400" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Markdown'}
            </Button>
          </div>
        </motion.div>

        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 grid gap-6 lg:grid-cols-3"
        >
          <Card className="border-white/10 bg-white/5 lg:col-span-1">
            <CardContent className="flex flex-col items-center py-8">
              <div className="relative">
                <svg className="h-40 w-40 -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: '0 440' }}
                    animate={{ strokeDasharray: `${(report.overallScore / 100) * 440} 440` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(report.overallScore)}`}>
                    {report.overallScore}
                  </span>
                  <span className="text-sm text-white/50">/100</span>
                </div>
              </div>
              <Badge className="mt-4 bg-white/10 text-white">
                {getScoreLabel(report.overallScore)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 lg:col-span-2">
            <CardContent className="p-6">
              <ScoreRadarChart data={report.breakdown} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Score Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <ScoreCard
            title="README Quality"
            score={report.breakdown.readme}
            details={report.scoring.details.readme}
            delay={0.1}
          />
          <ScoreCard
            title="Project Structure"
            score={report.breakdown.structure}
            details={report.scoring.details.structure}
            delay={0.2}
          />
          <ScoreCard
            title="Activity"
            score={report.breakdown.activity}
            details={report.scoring.details.activity}
            delay={0.3}
          />
          <ScoreCard
            title="Maintainability"
            score={report.breakdown.maintainability}
            details={report.scoring.details.maintainability}
            delay={0.4}
          />
          <ScoreCard
            title="Best Practices"
            score={report.breakdown.bestPractices}
            details={report.scoring.details.bestPractices}
            delay={0.5}
          />
          <RepoStatsCard metadata={report.metadata} insights={report.insights} />
        </motion.div>

        {/* AI Summary */}
        {report.aiAnalysis?.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">{report.aiAnalysis.summary}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <RecommendationsList recommendations={report.recommendations} />
        </motion.div>

        {/* AI Suggestions */}
        {report.aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid gap-4 md:grid-cols-2"
          >
            {report.aiAnalysis.readmeSuggestions.length > 0 && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-white">README Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.aiAnalysis.readmeSuggestions.map((suggestion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-blue-400">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            {report.aiAnalysis.contributorAdvice.length > 0 && (
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-white">Contributor Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.aiAnalysis.contributorAdvice.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                        <span className="text-purple-400">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
