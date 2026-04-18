'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Code2, Loader2, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface RepoInputProps {
  onSubmit: (url: string) => void
  isLoading?: boolean
}

const exampleRepos = [
  { owner: 'vercel', repo: 'next.js' },
  { owner: 'facebook', repo: 'react' },
  { owner: 'tailwindlabs', repo: 'tailwindcss' },
]

export function RepoInput({ onSubmit, isLoading }: RepoInputProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validateUrl = (input: string): boolean => {
    const githubPattern = /github\.com\/[^\/]+\/[^\/]+/
    return githubPattern.test(input)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a repository URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid GitHub repository URL')
      return
    }

    onSubmit(url)
  }

  const handleExampleClick = (owner: string, repo: string) => {
    setUrl(`https://github.com/${owner}/${repo}`)
    setError('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Code2 className="absolute left-4 h-5 w-5 text-white/40" />
          <Input
            type="text"
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              setError('')
            }}
            className="h-14 border-white/10 bg-white/5 pl-12 pr-32 text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-blue-500/20"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-white/40">Try:</span>
        {exampleRepos.map(({ owner, repo }) => (
          <button
            key={`${owner}/${repo}`}
            onClick={() => handleExampleClick(owner, repo)}
            disabled={isLoading}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/60 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            {owner}/{repo}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
