// AI Integration - Ollama API with fallback

export interface AIAnalysis {
  summary: string
  readmeSuggestions: string[]
  refactorSuggestions: string[]
  contributorAdvice: string[]
}

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434'
const DEFAULT_MODEL = 'llama3'

interface OllamaResponse {
  response: string
  done: boolean
}

async function queryOllama(prompt: string, model: string = DEFAULT_MODEL): Promise<string | null> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      return null
    }

    const data: OllamaResponse = await response.json()
    return data.response
  } catch (error) {
    // Ollama not available
    return null
  }
}

export async function generateRepoSummary(
  repoName: string,
  description: string | null,
  language: string | null,
  topics: string[],
  readmeContent: string
): Promise<string> {
  const prompt = `Analyze this GitHub repository and provide a brief professional summary (2-3 sentences):

Repository: ${repoName}
Description: ${description || 'N/A'}
Primary Language: ${language || 'N/A'}
Topics: ${topics.join(', ') || 'N/A'}

README Preview (first 1000 chars):
${readmeContent.slice(0, 1000)}

Provide a concise summary highlighting what this project does and its key features. Be professional and objective.`

  const response = await queryOllama(prompt)
  
  if (response) {
    return response.trim()
  }

  // Fallback summary
  return generateFallbackSummary(repoName, description, language, topics)
}

function generateFallbackSummary(
  repoName: string,
  description: string | null,
  language: string | null,
  topics: string[]
): string {
  const parts: string[] = []
  
  parts.push(`${repoName} is a`)
  
  if (language) {
    parts.push(`${language}-based`)
  }
  
  parts.push('project')
  
  if (description) {
    parts.push(`that ${description.toLowerCase()}`)
  }
  
  if (topics.length > 0) {
    parts.push(`It focuses on ${topics.slice(0, 3).join(', ')}.`)
  }
  
  return parts.join(' ') + '.'
}

export async function generateReadmeSuggestions(
  readmeContent: string,
  projectType: string
): Promise<string[]> {
  const prompt = `Analyze this README and suggest 3-5 specific improvements:

Project Type: ${projectType}
README Content (first 2000 chars):
${readmeContent.slice(0, 2000)}

Provide concise, actionable suggestions for improving the README. Format as a bulleted list.`

  const response = await queryOllama(prompt)
  
  if (response) {
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 10)
      .slice(0, 5)
  }

  return generateFallbackReadmeSuggestions(readmeContent)
}

function generateFallbackReadmeSuggestions(readmeContent: string): string[] {
  const suggestions: string[] = []
  const content = readmeContent.toLowerCase()

  if (!content.includes('installation') && !content.includes('install')) {
    suggestions.push('Add clear installation instructions')
  }
  if (!content.includes('usage') && !content.includes('example')) {
    suggestions.push('Include usage examples with code snippets')
  }
  if (!content.includes('contributing')) {
    suggestions.push('Add a contributing section for open source collaboration')
  }
  if (!content.includes('license')) {
    suggestions.push('Include license information')
  }
  if (!content.includes('badge') && !content.includes('shields.io')) {
    suggestions.push('Add relevant badges (build status, version, license)')
  }

  return suggestions.length > 0 ? suggestions : ['README looks good! Consider adding more examples.']
}

export async function generateRefactorSuggestions(
  fileTree: { path: string; type: string }[],
  largestFiles: { path: string; size: number }[]
): Promise<string[]> {
  const filePaths = fileTree.map(f => f.path).slice(0, 50)
  const largeFiles = largestFiles.slice(0, 5)

  const prompt = `Analyze this project structure and suggest 3-5 refactoring improvements:

File Structure (sample):
${filePaths.join('\n')}

Largest Files:
${largeFiles.map(f => `${f.path} (${Math.round(f.size / 1024)}KB)`).join('\n')}

Suggest specific refactoring improvements for better code organization and maintainability. Format as a bulleted list.`

  const response = await queryOllama(prompt)
  
  if (response) {
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 10)
      .slice(0, 5)
  }

  return generateFallbackRefactorSuggestions(largeFiles)
}

function generateFallbackRefactorSuggestions(largestFiles: { path: string; size: number }[]): string[] {
  const suggestions: string[] = []

  const oversizedFiles = largestFiles.filter(f => f.size > 50000)
  if (oversizedFiles.length > 0) {
    suggestions.push(`Consider breaking down large files: ${oversizedFiles.map(f => f.path.split('/').pop()).join(', ')}`)
  }

  suggestions.push('Ensure consistent file naming conventions across the project')
  suggestions.push('Consider organizing files by feature rather than type')
  suggestions.push('Add inline documentation for complex functions')

  return suggestions
}

export async function generateContributorAdvice(
  projectType: string,
  hasContributing: boolean
): Promise<string[]> {
  const prompt = `Provide 3-4 tips for new contributors to a ${projectType} project:

${hasContributing ? 'The project has a CONTRIBUTING.md file.' : 'The project lacks a CONTRIBUTING.md file.'}

Format as actionable advice for someone wanting to contribute to this open source project.`

  const response = await queryOllama(prompt)
  
  if (response) {
    return response
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^[-•\d.\s]*/, '').trim())
      .filter(line => line.length > 10)
      .slice(0, 4)
  }

  return generateFallbackContributorAdvice(hasContributing)
}

function generateFallbackContributorAdvice(hasContributing: boolean): string[] {
  const advice: string[] = []

  if (!hasContributing) {
    advice.push('Create a CONTRIBUTING.md file with guidelines for contributors')
  }

  advice.push('Start with small issues labeled "good first issue"')
  advice.push('Read the README and documentation thoroughly before contributing')
  advice.push('Follow existing code style and formatting conventions')
  advice.push('Write clear commit messages and PR descriptions')

  return advice
}

// Check if Ollama is available
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    })
    return response.ok
  } catch {
    return false
  }
}

// Main AI analysis function
export async function generateAIAnalysis(params: {
  repoName: string
  description: string | null
  language: string | null
  topics: string[]
  readmeContent: string
  fileTree: { path: string; type: string }[]
  largestFiles: { path: string; size: number }[]
  projectType: string
  hasContributing: boolean
}): Promise<AIAnalysis> {
  const [summary, readmeSuggestions, refactorSuggestions, contributorAdvice] = await Promise.all([
    generateRepoSummary(params.repoName, params.description, params.language, params.topics, params.readmeContent),
    generateReadmeSuggestions(params.readmeContent, params.projectType),
    generateRefactorSuggestions(params.fileTree, params.largestFiles),
    generateContributorAdvice(params.projectType, params.hasContributing),
  ])

  return {
    summary,
    readmeSuggestions,
    refactorSuggestions,
    contributorAdvice,
  }
}
