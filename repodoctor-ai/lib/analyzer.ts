// Repository Analyzer - Detects project type and generates insights

export type ProjectType = 
  | 'nextjs' 
  | 'react' 
  | 'vue' 
  | 'angular' 
  | 'svelte'
  | 'node'
  | 'python'
  | 'go'
  | 'rust'
  | 'java'
  | 'docker'
  | 'monorepo'
  | 'unknown'

export interface ProjectInsights {
  type: ProjectType
  primaryLanguage: string
  frameworks: string[]
  isMonorepo: boolean
  hasDocker: boolean
  packageManager?: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'poetry' | 'cargo' | 'maven' | 'gradle'
  testingFrameworks: string[]
  lintingTools: string[]
  buildTools: string[]
}

export interface FileMetrics {
  totalFiles: number
  totalDirs: number
  codeFiles: number
  testFiles: number
  docFiles: number
  configFiles: number
  largestFiles: { path: string; size: number }[]
  deepestPath: number
}

// Detect project type based on files
export function detectProjectType(fileTree: { path: string }[], languages: Record<string, number>): ProjectInsights {
  const paths = fileTree.map(f => f.path.toLowerCase())
  const frameworks: string[] = []
  let type: ProjectType = 'unknown'
  let packageManager: ProjectInsights['packageManager']
  const testingFrameworks: string[] = []
  const lintingTools: string[] = []
  const buildTools: string[] = []

  // Check for monorepo
  const isMonorepo = paths.some(p => 
    p.includes('packages/') || 
    p.includes('apps/') || 
    p.includes('workspaces') ||
    paths.includes('pnpm-workspace.yaml') ||
    paths.includes('lerna.json')
  )

  // Check for Docker
  const hasDocker = paths.some(p => 
    p.includes('dockerfile') || 
    p.includes('docker-compose') ||
    p.includes('.dockerignore')
  )

  // Detect framework and type
  if (paths.includes('next.config.js') || paths.includes('next.config.ts') || paths.includes('next.config.mjs')) {
    type = 'nextjs'
    frameworks.push('Next.js')
  } else if (paths.includes('package.json')) {
    type = 'node'
    
    if (paths.some(p => p.includes('react'))) {
      frameworks.push('React')
      type = 'react'
    }
    if (paths.some(p => p.includes('vue'))) {
      frameworks.push('Vue')
      type = 'vue'
    }
    if (paths.some(p => p.includes('angular'))) {
      frameworks.push('Angular')
      type = 'angular'
    }
    if (paths.some(p => p.includes('svelte'))) {
      frameworks.push('Svelte')
      type = 'svelte'
    }
  }

  if (paths.includes('requirements.txt') || paths.includes('setup.py') || paths.includes('pyproject.toml')) {
    type = 'python'
    if (paths.some(p => p.includes('django'))) frameworks.push('Django')
    if (paths.some(p => p.includes('flask'))) frameworks.push('Flask')
    if (paths.some(p => p.includes('fastapi'))) frameworks.push('FastAPI')
  }

  if (paths.includes('go.mod')) {
    type = 'go'
  }

  if (paths.includes('cargo.toml')) {
    type = 'rust'
  }

  if (paths.includes('pom.xml') || paths.includes('build.gradle')) {
    type = 'java'
    if (paths.includes('pom.xml')) frameworks.push('Maven')
    if (paths.includes('build.gradle')) frameworks.push('Gradle')
  }

  // Detect package manager
  if (paths.includes('pnpm-lock.yaml')) packageManager = 'pnpm'
  else if (paths.includes('yarn.lock')) packageManager = 'yarn'
  else if (paths.includes('package-lock.json')) packageManager = 'npm'
  else if (paths.includes('poetry.lock')) packageManager = 'poetry'
  else if (paths.includes('pipfile.lock')) packageManager = 'pip'
  else if (paths.includes('cargo.lock')) packageManager = 'cargo'

  // Detect testing frameworks
  if (paths.some(p => p.includes('jest'))) testingFrameworks.push('Jest')
  if (paths.some(p => p.includes('vitest'))) testingFrameworks.push('Vitest')
  if (paths.some(p => p.includes('cypress'))) testingFrameworks.push('Cypress')
  if (paths.some(p => p.includes('playwright'))) testingFrameworks.push('Playwright')
  if (paths.some(p => p.includes('pytest'))) testingFrameworks.push('Pytest')
  if (paths.some(p => p.includes('unittest'))) testingFrameworks.push('unittest')

  // Detect linting tools
  if (paths.includes('.eslintrc') || paths.includes('.eslintrc.js') || paths.includes('.eslintrc.json')) {
    lintingTools.push('ESLint')
  }
  if (paths.includes('.prettierrc') || paths.includes('prettier.config.js')) {
    lintingTools.push('Prettier')
  }
  if (paths.includes('pyproject.toml') && paths.some(p => p.includes('black') || p.includes('flake8'))) {
    lintingTools.push('Black/Flake8')
  }

  // Detect build tools
  if (paths.includes('vite.config.ts') || paths.includes('vite.config.js')) buildTools.push('Vite')
  if (paths.includes('webpack.config.js')) buildTools.push('Webpack')
  if (paths.includes('rollup.config.js')) buildTools.push('Rollup')
  if (paths.includes('tsconfig.json')) buildTools.push('TypeScript')
  if (paths.includes('babel.config.js')) buildTools.push('Babel')

  // Get primary language
  const primaryLanguage = Object.entries(languages)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown'

  return {
    type: isMonorepo ? 'monorepo' : type,
    primaryLanguage,
    frameworks,
    isMonorepo,
    hasDocker,
    packageManager,
    testingFrameworks,
    lintingTools,
    buildTools,
  }
}

// Calculate file metrics
export function calculateFileMetrics(fileTree: { path: string; type: string; size?: number }[]): FileMetrics {
  const files = fileTree.filter(f => f.type === 'file')
  const dirs = fileTree.filter(f => f.type === 'dir')
  
  const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.rs', '.java', '.cpp', '.c', '.h', '.php', '.rb']
  const testPatterns = ['.test.', '.spec.', '_test.', '_spec.', '__tests__', 'test_', 'spec_']
  const docExtensions = ['.md', '.mdx', '.rst', '.txt']
  const configPatterns = ['.json', '.yml', '.yaml', '.toml', '.ini', '.cfg', 'config.', '.config.']

  const codeFiles = files.filter(f => 
    codeExtensions.some(ext => f.path.endsWith(ext))
  ).length

  const testFiles = files.filter(f => 
    testPatterns.some(pattern => f.path.includes(pattern))
  ).length

  const docFiles = files.filter(f => 
    docExtensions.some(ext => f.path.endsWith(ext))
  ).length

  const configFiles = files.filter(f => 
    configPatterns.some(pattern => f.path.includes(pattern))
  ).length

  // Get largest files
  const largestFiles = files
    .filter(f => f.size)
    .sort((a, b) => (b.size || 0) - (a.size || 0))
    .slice(0, 5)
    .map(f => ({ path: f.path, size: f.size || 0 }))

  // Calculate deepest path
  const deepestPath = Math.max(...fileTree.map(f => f.path.split('/').length))

  return {
    totalFiles: files.length,
    totalDirs: dirs.length,
    codeFiles,
    testFiles,
    docFiles,
    configFiles,
    largestFiles,
    deepestPath,
  }
}

// Generate tailored suggestions based on project type
export function generateTailoredSuggestions(insights: ProjectInsights): string[] {
  const suggestions: string[] = []

  switch (insights.type) {
    case 'nextjs':
      if (!insights.testingFrameworks.length) {
        suggestions.push('Add Jest or Vitest for testing Next.js components')
      }
      if (!insights.lintingTools.includes('ESLint')) {
        suggestions.push('Configure ESLint with Next.js recommended rules')
      }
      break

    case 'node':
    case 'react':
      if (!insights.packageManager) {
        suggestions.push('Add a lockfile (package-lock.json, yarn.lock, or pnpm-lock.yaml)')
      }
      if (!insights.testingFrameworks.length) {
        suggestions.push('Set up a testing framework like Jest or Vitest')
      }
      break

    case 'python':
      if (!insights.packageManager) {
        suggestions.push('Add a requirements.txt or pyproject.toml with dependencies')
      }
      if (!insights.lintingTools.length) {
        suggestions.push('Add Black and Flake8 for code formatting and linting')
      }
      if (!insights.testingFrameworks.length) {
        suggestions.push('Set up pytest for testing')
      }
      break

    case 'go':
      suggestions.push('Ensure go.mod and go.sum are committed')
      if (!insights.testingFrameworks.length) {
        suggestions.push('Add Go tests with proper coverage')
      }
      break

    case 'rust':
      if (!insights.testingFrameworks.length) {
        suggestions.push('Add Rust tests and documentation tests')
      }
      break

    case 'java':
      if (!insights.testingFrameworks.length) {
        suggestions.push('Set up JUnit for testing')
      }
      break

    case 'monorepo':
      suggestions.push('Ensure workspace configuration is properly documented')
      suggestions.push('Add root-level scripts for common tasks')
      break
  }

  if (insights.hasDocker) {
    suggestions.push('Add .dockerignore to optimize build context')
  }

  if (!insights.lintingTools.length) {
    suggestions.push('Add linting tools to maintain code quality')
  }

  return suggestions
}

// Get project type icon/color
export function getProjectTypeInfo(type: ProjectType): { icon: string; color: string; label: string } {
  const typeMap: Record<ProjectType, { icon: string; color: string; label: string }> = {
    nextjs: { icon: '⚡', color: '#000000', label: 'Next.js' },
    react: { icon: '⚛️', color: '#61DAFB', label: 'React' },
    vue: { icon: '💚', color: '#4FC08D', label: 'Vue' },
    angular: { icon: '🅰️', color: '#DD0031', label: 'Angular' },
    svelte: { icon: '🔥', color: '#FF3E00', label: 'Svelte' },
    node: { icon: '🟢', color: '#339933', label: 'Node.js' },
    python: { icon: '🐍', color: '#3776AB', label: 'Python' },
    go: { icon: '🔵', color: '#00ADD8', label: 'Go' },
    rust: { icon: '🦀', color: '#DEA584', label: 'Rust' },
    java: { icon: '☕', color: '#007396', label: 'Java' },
    docker: { icon: '🐳', color: '#2496ED', label: 'Docker' },
    monorepo: { icon: '📦', color: '#CB3837', label: 'Monorepo' },
    unknown: { icon: '📁', color: '#6B7280', label: 'Unknown' },
  }

  return typeMap[type]
}
