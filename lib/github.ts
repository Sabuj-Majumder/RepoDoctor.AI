// GitHub API Service
const GITHUB_API_BASE = 'https://api.github.com'

export interface RepoMetadata {
  owner: string
  repo: string
  description: string | null
  stars: number
  forks: number
  openIssues: number
  language: string | null
  createdAt: string
  updatedAt: string
  pushedAt: string
  size: number
  defaultBranch: string
  topics: string[]
  hasWiki: boolean
  hasPages: boolean
  hasDiscussions: boolean
  archived: boolean
  fork: boolean
  license: { name: string; spdx_id: string } | null
}

export interface CommitInfo {
  sha: string
  message: string
  author: string
  date: string
}

export interface ContributorInfo {
  login: string
  contributions: number
  avatar_url: string
}

export interface FileNode {
  name: string
  path: string
  type: 'file' | 'dir'
  size?: number
}

export interface WorkflowInfo {
  name: string
  path: string
  state: string
}

class GitHubAPIError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'GitHubAPIError'
  }
}

async function fetchGitHub(endpoint: string, options?: RequestInit): Promise<Response> {
  const url = `${GITHUB_API_BASE}${endpoint}`
  const headers = new Headers({
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'RepoDoctor-AI',
  })

  // Add any additional headers from options
  if (options?.headers) {
    const additionalHeaders = new Headers(options.headers)
    additionalHeaders.forEach((value, key) => {
      headers.set(key, value)
    })
  }

  // Add GitHub token if available for higher rate limits
  if (process.env.GITHUB_TOKEN) {
    headers.set('Authorization', `token ${process.env.GITHUB_TOKEN}`)
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 403) {
    const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
    if (rateLimitRemaining === '0') {
      const resetTime = response.headers.get('X-RateLimit-Reset')
      const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000).toLocaleTimeString() : 'soon'
      throw new GitHubAPIError(`GitHub API rate limit exceeded. Resets at ${resetDate}`, 403)
    }
  }

  if (response.status === 404) {
    throw new GitHubAPIError('Repository not found', 404)
  }

  if (!response.ok) {
    throw new GitHubAPIError(`GitHub API error: ${response.statusText}`, response.status)
  }

  return response
}

export async function getRepoMetadata(owner: string, repo: string): Promise<RepoMetadata> {
  const response = await fetchGitHub(`/repos/${owner}/${repo}`)
  const data = await response.json()

  return {
    owner,
    repo,
    description: data.description,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    language: data.language,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    pushedAt: data.pushed_at,
    size: data.size,
    defaultBranch: data.default_branch,
    topics: data.topics || [],
    hasWiki: data.has_wiki,
    hasPages: data.has_pages,
    hasDiscussions: data.has_discussions,
    archived: data.archived,
    fork: data.fork,
    license: data.license ? { name: data.license.name, spdx_id: data.license.spdx_id } : null,
  }
}

export async function getRepoReadme(owner: string, repo: string, branch: string = 'main'): Promise<string> {
  try {
    const response = await fetchGitHub(`/repos/${owner}/${repo}/readme`)
    const data = await response.json()
    // Decode base64 content
    const content = Buffer.from(data.content, 'base64').toString('utf-8')
    return content
  } catch (error) {
    if (error instanceof GitHubAPIError && error.status === 404) {
      return ''
    }
    throw error
  }
}

export async function getRepoTree(owner: string, repo: string, branch: string = 'main'): Promise<FileNode[]> {
  const response = await fetchGitHub(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`)
  const data = await response.json()

  if (!data.tree) {
    return []
  }

  return data.tree.map((item: { path: string; type: string; size?: number }) => ({
    name: item.path.split('/').pop() || item.path,
    path: item.path,
    type: item.type === 'tree' ? 'dir' : 'file',
    size: item.size,
  }))
}

export async function getRecentCommits(owner: string, repo: string, perPage: number = 30): Promise<CommitInfo[]> {
  const response = await fetchGitHub(`/repos/${owner}/${repo}/commits?per_page=${perPage}`)
  const data = await response.json()

  return data.map((commit: { sha: string; commit: { message: string; author: { name: string; date: string } } }) => ({
    sha: commit.sha,
    message: commit.commit.message,
    author: commit.commit.author?.name || 'Unknown',
    date: commit.commit.author?.date || '',
  }))
}

export async function getContributors(owner: string, repo: string): Promise<ContributorInfo[]> {
  try {
    const response = await fetchGitHub(`/repos/${owner}/${repo}/contributors?per_page=100`)
    const data = await response.json()

    return data.map((contributor: { login: string; contributions: number; avatar_url: string }) => ({
      login: contributor.login,
      contributions: contributor.contributions,
      avatar_url: contributor.avatar_url,
    }))
  } catch (error) {
    // Some repos may not have contributor info available
    return []
  }
}

export async function getWorkflows(owner: string, repo: string): Promise<WorkflowInfo[]> {
  try {
    const response = await fetchGitHub(`/repos/${owner}/${repo}/actions/workflows`)
    const data = await response.json()

    return data.workflows?.map((workflow: { name: string; path: string; state: string }) => ({
      name: workflow.name,
      path: workflow.path,
      state: workflow.state,
    })) || []
  } catch (error) {
    return []
  }
}

export async function getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  const response = await fetchGitHub(`/repos/${owner}/${repo}/languages`)
  const data = await response.json()
  return data
}

export async function getReleases(owner: string, repo: string): Promise<{ tag_name: string; published_at: string }[]> {
  try {
    const response = await fetchGitHub(`/repos/${owner}/${repo}/releases?per_page=10`)
    const data = await response.json()
    return data.map((release: { tag_name: string; published_at: string }) => ({
      tag_name: release.tag_name,
      published_at: release.published_at,
    }))
  } catch (error) {
    return []
  }
}

export async function checkFileExists(owner: string, repo: string, path: string): Promise<boolean> {
  try {
    await fetchGitHub(`/repos/${owner}/${repo}/contents/${path}`)
    return true
  } catch (error) {
    if (error instanceof GitHubAPIError && error.status === 404) {
      return false
    }
    throw error
  }
}

export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,
    /github\.com\/([^\/]+)\/([^\/]+)\/.*/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/, ''),
      }
    }
  }

  return null
}

export { GitHubAPIError }
