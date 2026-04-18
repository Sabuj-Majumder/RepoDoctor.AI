import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  parseRepoUrl, 
  getRepoMetadata, 
  getRepoReadme, 
  getRepoTree, 
  getRecentCommits,
  getContributors,
  getWorkflows,
  getLanguages,
  getReleases,
  GitHubAPIError
} from '@/lib/github'
import { calculateScore, generateRecommendations } from '@/lib/scorer'
import { detectProjectType, calculateFileMetrics, generateTailoredSuggestions } from '@/lib/analyzer'
import { generateAIAnalysis } from '@/lib/ai'

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const maxRequests = 10

  const record = rateLimitStore.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

function sanitizeUrl(url: string): string {
  // Remove any potential dangerous characters
  return url.trim().replace(/[<>\"']/g, '')
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting - use headers as fallback for IP
    const ip = request.headers.get('x-forwarded-for') ?? 
               request.headers.get('x-real-ip') ?? 
               'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    let body: { url?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Repository URL is required' }, { status: 400 })
    }

    // Sanitize URL
    const sanitizedUrl = sanitizeUrl(url)

    // Validate URL length
    if (sanitizedUrl.length > 500) {
      return NextResponse.json({ error: 'URL too long' }, { status: 400 })
    }

    const parsed = parseRepoUrl(sanitizedUrl)
    if (!parsed) {
      return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 })
    }

    // Validate owner and repo names
    const { owner, repo } = parsed
    if (!/^[a-zA-Z0-9_.-]+$/.test(owner) || !/^[a-zA-Z0-9_.-]+$/.test(repo)) {
      return NextResponse.json({ error: 'Invalid repository name' }, { status: 400 })
    }

    // Fetch all data in parallel
    const [
      metadata,
      readmeContent,
      fileTree,
      commits,
      contributors,
      workflows,
      languages,
      releases,
    ] = await Promise.all([
      getRepoMetadata(owner, repo),
      getRepoReadme(owner, repo),
      getRepoTree(owner, repo),
      getRecentCommits(owner, repo),
      getContributors(owner, repo),
      getWorkflows(owner, repo),
      getLanguages(owner, repo),
      getReleases(owner, repo),
    ])

    // Calculate scores
    const scoringResult = calculateScore({
      readmeContent,
      fileTree,
      commits,
      openIssues: metadata.openIssues,
      stars: metadata.stars,
      releases,
      contributors,
      hasLicense: !!metadata.license,
      hasDocs: fileTree.some(f => f.path.toLowerCase().includes('docs')),
      workflows,
    })

    // Detect project type and generate insights
    const insights = detectProjectType(fileTree, languages)
    const fileMetrics = calculateFileMetrics(fileTree)

    // Generate recommendations
    const baseRecommendations = generateRecommendations(scoringResult)
    const tailoredSuggestions = generateTailoredSuggestions(insights)
    const allRecommendations = [...baseRecommendations, ...tailoredSuggestions]

    // Generate AI analysis (with fallback)
    const aiAnalysis = await generateAIAnalysis({
      repoName: `${owner}/${repo}`,
      description: metadata.description,
      language: metadata.language,
      topics: metadata.topics,
      readmeContent,
      fileTree,
      largestFiles: fileMetrics.largestFiles,
      projectType: insights.type,
      hasContributing: fileTree.some(f => f.path.toLowerCase().includes('contributing')),
    })

    // Create report object
    const report = {
      metadata: {
        description: metadata.description,
        stars: metadata.stars,
        forks: metadata.forks,
        openIssues: metadata.openIssues,
        language: metadata.language,
        license: metadata.license,
      },
      insights,
      fileMetrics,
      scoring: scoringResult,
      recommendations: allRecommendations,
      aiAnalysis,
      commits: commits.slice(0, 5),
      contributors: contributors.slice(0, 5),
    }

    // Save to database
    const scan = await prisma.scan.create({
      data: {
        repoUrl: url,
        owner,
        repo,
        overallScore: scoringResult.overall,
        readmeScore: scoringResult.breakdown.readme,
        structureScore: scoringResult.breakdown.structure,
        activityScore: scoringResult.breakdown.activity,
        maintainabilityScore: scoringResult.breakdown.maintainability,
        bestPracticesScore: scoringResult.breakdown.bestPractices,
        report: JSON.stringify(report),
      },
    })

    return NextResponse.json({ id: scan.id })
  } catch (error) {
    console.error('Analysis error:', error)

    if (error instanceof GitHubAPIError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 500 })
    }

    return NextResponse.json(
      { error: 'Failed to analyze repository. Please try again.' },
      { status: 500 }
    )
  }
}
