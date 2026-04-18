'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, MinusCircle } from 'lucide-react'

interface ScoreCardProps {
  title: string
  score: number
  maxScore?: number
  details: Record<string, boolean>
  delay?: number
}

export function ScoreCard({ title, score, maxScore = 20, details, delay = 0 }: ScoreCardProps) {
  const percentage = (score / maxScore) * 100
  
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return 'text-green-400'
    if (pct >= 60) return 'text-blue-400'
    if (pct >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return 'bg-green-500'
    if (pct >= 60) return 'bg-blue-500'
    if (pct >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
            <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
              {score}<span className="text-sm text-white/40">/{maxScore}</span>
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: delay + 0.3 }}
              className={`h-full rounded-full ${getProgressColor(percentage)}`}
            />
          </div>
          
          <div className="space-y-2">
            {Object.entries(details).map(([key, value], i) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                {value ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-400" />
                )}
                <span className={value ? 'text-white/70' : 'text-white/40'}>
                  {formatLabel(key)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/([a-z])([A-Z])/g, '$1 $2')
}
