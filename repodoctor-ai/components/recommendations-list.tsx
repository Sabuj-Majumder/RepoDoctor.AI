'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, ArrowRight } from 'lucide-react'

interface RecommendationsListProps {
  recommendations: string[]
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  if (recommendations.length === 0) {
    return (
      <Card className="border-white/10 bg-white/5">
        <CardContent className="py-8 text-center">
          <Lightbulb className="mx-auto h-12 w-12 text-green-400" />
          <p className="mt-4 text-white/70">Great job! No major recommendations.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-white">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/5 p-3"
            >
              <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-400" />
              <span className="text-sm text-white/70">{recommendation}</span>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
