'use client'

import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

interface RadarChartProps {
  data: {
    readme: number
    structure: number
    activity: number
    maintainability: number
    bestPractices: number
  }
}

export function ScoreRadarChart({ data }: RadarChartProps) {
  const chartData = [
    { subject: 'README', A: data.readme, fullMark: 20 },
    { subject: 'Structure', A: data.structure, fullMark: 20 },
    { subject: 'Activity', A: data.activity, fullMark: 20 },
    { subject: 'Maintain', A: data.maintainability, fullMark: 20 },
    { subject: 'Best Prac', A: data.bestPractices, fullMark: 20 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 20]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickCount={5}
          />
          <Radar
            name="Score"
            dataKey="A"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="#8b5cf6"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
