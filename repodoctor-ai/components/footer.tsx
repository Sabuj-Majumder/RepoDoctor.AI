'use client'

import Link from 'next/link'
import { Activity, Code2, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">RepoDoctor</span>
          </div>

          <p className="text-center text-sm text-white/50">
            Built with <Heart className="inline h-4 w-4 text-red-500" /> for the open source community
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition-colors hover:text-white"
            >
              <Code2 className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 transition-colors hover:text-white"
            >
              <span className="text-sm font-bold">𝕏</span>
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-white/40">
          <Link href="/" className="hover:text-white/70">Home</Link>
          <Link href="/analyze" className="hover:text-white/70">Analyze</Link>
          <Link href="/history" className="hover:text-white/70">History</Link>
          <a href="#" className="hover:text-white/70">Privacy</a>
          <a href="#" className="hover:text-white/70">Terms</a>
        </div>

        <p className="mt-8 text-center text-xs text-white/30">
          © {new Date().getFullYear()} RepoDoctor AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
