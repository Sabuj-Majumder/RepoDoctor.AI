'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity, History, Code2 } from 'lucide-react'

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-white">RepoDoctor</span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/analyze"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Analyze</span>
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Code2 className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
