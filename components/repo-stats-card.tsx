'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, GitFork, AlertCircle, Code2, Package, Container } from 'lucide-react'

interface RepoStatsCardProps {
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
}

export function RepoStatsCard({ metadata, insights }: RepoStatsCardProps) {
  const stats = [
    { icon: Star, label: 'Stars', value: metadata.stars.toLocaleString() },
    { icon: GitFork, label: 'Forks', value: metadata.forks.toLocaleString() },
    { icon: AlertCircle, label: 'Issues', value: metadata.openIssues.toLocaleString() },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-white/10 bg-white/5">
        <CardContent className="p-6">
          {metadata.description && (
            <p className="mb-6 text-white/70">{metadata.description}</p>
          )}

          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-1 text-white/40">
                  <stat.icon className="h-4 w-4" />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <p className="mt-1 text-xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="h-4 w-4 text-white/40" />
              <span className="text-sm text-white/60">Language:</span>
              <Badge variant="secondary" className="bg-white/10 text-white">
                {metadata.language || insights.primaryLanguage || 'Unknown'}
              </Badge>
            </div>

            {metadata.license && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">License:</span>
                <Badge variant="secondary" className="bg-white/10 text-white">
                  {metadata.license.name}
                </Badge>
              </div>
            )}

            {insights.isMonorepo && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-white/40" />
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                  Monorepo
                </Badge>
              </div>
            )}

            {insights.hasDocker && (
              <div className="flex items-center gap-2">
                <Container className="h-4 w-4 text-white/40" />
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  Docker
                </Badge>
              </div>
            )}

            {insights.frameworks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-white/60">Frameworks:</span>
                {insights.frameworks.map((fw) => (
                  <Badge key={fw} variant="secondary" className="bg-white/10 text-white">
                    {fw}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
