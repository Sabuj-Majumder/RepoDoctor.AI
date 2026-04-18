// Scoring Engine - Analyzes repository and assigns scores

export interface ScoreBreakdown {
  readme: number
  structure: number
  activity: number
  maintainability: number
  bestPractices: number
}

export interface ScoreDetails {
  readme: {
    hasTitle: boolean
    hasDescription: boolean
    hasInstallSteps: boolean
    hasUsage: boolean
    hasScreenshots: boolean
    hasBadges: boolean
    hasContributing: boolean
    hasLicense: boolean
  }
  structure: {
    hasSrcDir: boolean
    hasTestsDir: boolean
    hasDocsDir: boolean
    hasExamplesDir: boolean
    hasConfigFiles: boolean
    isOrganized: boolean
  }
  activity: {
    recentCommits: boolean
    healthyIssueRatio: boolean
    hasReleases: boolean
    activeContributors: boolean
  }
  maintainability: {
    noGiantFiles: boolean
    hasDocumentation: boolean
    goodNaming: boolean
    noDuplicates: boolean
    hasEnvExample: boolean
  }
  bestPractices: {
    hasLicense: boolean
    hasGitignore: boolean
    hasCiCd: boolean
    hasSecurityPolicy: boolean
    hasIssueTemplates: boolean
    hasPrTemplate: boolean
  }
}

export interface ScoringResult {
  overall: number
  breakdown: ScoreBreakdown
  details: ScoreDetails
  maxScore: number
}

// README Score (20 points)
function scoreReadme(readmeContent: string): { score: number; details: ScoreDetails['readme'] } {
  const content = readmeContent.toLowerCase()
  const lines = readmeContent.split('\n')
  
  const details: ScoreDetails['readme'] = {
    hasTitle: /^#\s+.+/.test(readmeContent.trim()),
    hasDescription: content.length > 200,
    hasInstallSteps: /install|setup|getting started|npm install|pip install|yarn add/.test(content),
    hasUsage: /usage|how to use|example|getting started/.test(content),
    hasScreenshots: /!\[|screenshot|preview|demo|image/.test(content),
    hasBadges: /!\[.*\]\(https:\/\/img\.shields\.io|badge|build|coverage|version/.test(content),
    hasContributing: /contributing|contribute|pull request|development/.test(content),
    hasLicense: /license|licence|mit|apache|gpl/.test(content),
  }

  const score = Object.values(details).filter(Boolean).length * 2.5
  return { score: Math.min(20, score), details }
}

// Structure Score (20 points)
function scoreStructure(fileTree: { name: string; path: string; type: string }[]): { score: number; details: ScoreDetails['structure'] } {
  const paths = fileTree.map(f => f.path.toLowerCase())
  const rootItems = fileTree.filter(f => !f.path.includes('/'))
  
  const details: ScoreDetails['structure'] = {
    hasSrcDir: paths.some(p => p.startsWith('src/') || p === 'src'),
    hasTestsDir: paths.some(p => p.startsWith('test/') || p.startsWith('tests/') || p.includes('.test.') || p.includes('.spec.')),
    hasDocsDir: paths.some(p => p.startsWith('docs/') || p === 'docs' || p === 'documentation'),
    hasExamplesDir: paths.some(p => p.startsWith('example/') || p.startsWith('examples/')),
    hasConfigFiles: paths.some(p => /package\.json|tsconfig\.json|\.gitignore|dockerfile|makefile|setup\.py|cargo\.toml|go\.mod/.test(p)),
    isOrganized: rootItems.length < 20 && paths.filter(p => p.includes('/')).length > 3,
  }

  const score = Object.values(details).filter(Boolean).length * (20 / 6)
  return { score: Math.min(20, score), details }
}

// Activity Score (20 points)
function scoreActivity(
  commits: { date: string }[],
  openIssues: number,
  stars: number,
  releases: { published_at: string }[],
  contributors: { contributions: number }[]
): { score: number; details: ScoreDetails['activity'] } {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  
  const recentCommits = commits.some(c => new Date(c.date) > thirtyDaysAgo)
  const issueRatio = stars > 0 ? openIssues / stars : 0
  const healthyIssueRatio = issueRatio < 0.1 || openIssues < 50
  const hasReleases = releases.length > 0 && new Date(releases[0].published_at) > ninetyDaysAgo
  const activeContributors = contributors.filter(c => c.contributions > 5).length >= 2

  const details: ScoreDetails['activity'] = {
    recentCommits,
    healthyIssueRatio,
    hasReleases,
    activeContributors,
  }

  const score = Object.values(details).filter(Boolean).length * 5
  return { score, details }
}

// Maintainability Score (20 points)
function scoreMaintainability(
  fileTree: { path: string; size?: number; type: string }[],
  readmeContent: string,
  hasDocs: boolean
): { score: number; details: ScoreDetails['maintainability'] } {
  const files = fileTree.filter(f => f.type === 'file' && f.size)
  const giantFiles = files.filter(f => (f.size || 0) > 100000).length // > 100KB
  const noGiantFiles = giantFiles === 0 || giantFiles / files.length < 0.05
  
  const paths = fileTree.map(f => f.path)
  const hasDocumentation = hasDocs || readmeContent.length > 1000
  
  // Check for good naming conventions
  const hasGoodNaming = paths.every(p => 
    !p.includes(' ') && // No spaces
    !p.includes('copy') && // No copy files
    !p.includes('temp') && // No temp files
    !/\d{8}/.test(p) // No date-stamped files
  )
  
  // Check for duplicate folder patterns
  const folderNames = paths
    .filter(p => p.includes('/'))
    .map(p => p.split('/')[0])
  const uniqueFolders = new Set(folderNames)
  const noDuplicates = uniqueFolders.size === folderNames.length
  
  const hasEnvExample = paths.some(p => 
    p.toLowerCase().includes('.env.example') || 
    p.toLowerCase().includes('env.example') ||
    p.toLowerCase() === '.env.sample'
  )

  const details: ScoreDetails['maintainability'] = {
    noGiantFiles,
    hasDocumentation,
    goodNaming: hasGoodNaming,
    noDuplicates,
    hasEnvExample,
  }

  const score = Object.values(details).filter(Boolean).length * 4
  return { score: Math.min(20, score), details }
}

// Best Practices Score (20 points)
function scoreBestPractices(
  hasLicense: boolean,
  fileTree: { path: string }[],
  workflows: { name: string }[]
): { score: number; details: ScoreDetails['bestPractices'] } {
  const paths = fileTree.map(f => f.path.toLowerCase())
  
  const details: ScoreDetails['bestPractices'] = {
    hasLicense,
    hasGitignore: paths.includes('.gitignore'),
    hasCiCd: workflows.length > 0 || paths.some(p => p.includes('.github/workflows')),
    hasSecurityPolicy: paths.some(p => p.includes('security.md') || p.includes('security_policy.md')),
    hasIssueTemplates: paths.some(p => p.includes('.github/issue_template') || p.includes('.github/ISSUE_TEMPLATE')),
    hasPrTemplate: paths.some(p => p.includes('pull_request_template.md') || p.includes('PULL_REQUEST_TEMPLATE.md')),
  }

  const score = Object.values(details).filter(Boolean).length * (20 / 6)
  return { score: Math.min(20, score), details }
}

// Main scoring function
export function calculateScore(params: {
  readmeContent: string
  fileTree: { name: string; path: string; type: string; size?: number }[]
  commits: { date: string }[]
  openIssues: number
  stars: number
  releases: { published_at: string }[]
  contributors: { contributions: number }[]
  hasLicense: boolean
  hasDocs: boolean
  workflows: { name: string }[]
}): ScoringResult {
  const readmeResult = scoreReadme(params.readmeContent)
  const structureResult = scoreStructure(params.fileTree)
  const activityResult = scoreActivity(params.commits, params.openIssues, params.stars, params.releases, params.contributors)
  const maintainabilityResult = scoreMaintainability(params.fileTree, params.readmeContent, params.hasDocs)
  const bestPracticesResult = scoreBestPractices(params.hasLicense, params.fileTree, params.workflows)

  const breakdown: ScoreBreakdown = {
    readme: Math.round(readmeResult.score),
    structure: Math.round(structureResult.score),
    activity: Math.round(activityResult.score),
    maintainability: Math.round(maintainabilityResult.score),
    bestPractices: Math.round(bestPracticesResult.score),
  }

  const overall = Object.values(breakdown).reduce((sum, score) => sum + score, 0)

  return {
    overall,
    breakdown,
    details: {
      readme: readmeResult.details,
      structure: structureResult.details,
      activity: activityResult.details,
      maintainability: maintainabilityResult.details,
      bestPractices: bestPracticesResult.details,
    },
    maxScore: 100,
  }
}

// Get score label and color
export function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-500' }
  if (score >= 75) return { label: 'Good', color: 'text-blue-500' }
  if (score >= 60) return { label: 'Fair', color: 'text-yellow-500' }
  if (score >= 40) return { label: 'Needs Work', color: 'text-orange-500' }
  return { label: 'Poor', color: 'text-red-500' }
}

// Generate recommendations based on scores
export function generateRecommendations(result: ScoringResult): string[] {
  const recommendations: string[] = []

  // README recommendations
  if (!result.details.readme.hasTitle) {
    recommendations.push('Add a clear, descriptive title to your README')
  }
  if (!result.details.readme.hasDescription) {
    recommendations.push('Expand your README with a detailed project description')
  }
  if (!result.details.readme.hasInstallSteps) {
    recommendations.push('Include installation instructions in your README')
  }
  if (!result.details.readme.hasUsage) {
    recommendations.push('Add usage examples to help users get started')
  }
  if (!result.details.readme.hasBadges) {
    recommendations.push('Add badges for build status, version, and coverage')
  }

  // Structure recommendations
  if (!result.details.structure.hasSrcDir) {
    recommendations.push('Organize source code in a src/ directory')
  }
  if (!result.details.structure.hasTestsDir) {
    recommendations.push('Add a tests/ directory with test coverage')
  }
  if (!result.details.structure.hasDocsDir) {
    recommendations.push('Create a docs/ directory for documentation')
  }

  // Activity recommendations
  if (!result.details.activity.recentCommits) {
    recommendations.push('Make regular commits to show active maintenance')
  }
  if (!result.details.activity.hasReleases) {
    recommendations.push('Create releases to mark stable versions')
  }

  // Best practices recommendations
  if (!result.details.bestPractices.hasLicense) {
    recommendations.push('Add a LICENSE file to clarify usage rights')
  }
  if (!result.details.bestPractices.hasGitignore) {
    recommendations.push('Add a .gitignore file to exclude unnecessary files')
  }
  if (!result.details.bestPractices.hasCiCd) {
    recommendations.push('Set up CI/CD workflows for automated testing')
  }
  if (!result.details.bestPractices.hasSecurityPolicy) {
    recommendations.push('Add a SECURITY.md file for vulnerability reporting')
  }
  if (!result.details.bestPractices.hasIssueTemplates) {
    recommendations.push('Create issue templates for consistent bug reports')
  }

  return recommendations.slice(0, 8) // Limit to top 8 recommendations
}
