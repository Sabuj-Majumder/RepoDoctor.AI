import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate UUID format to prevent injection
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: 'Invalid report ID format' },
        { status: 400 }
      )
    }

    const scan = await prisma.scan.findUnique({
      where: { id },
    })

    if (!scan) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    const report = JSON.parse(scan.report)

    return NextResponse.json({
      id: scan.id,
      repoUrl: scan.repoUrl,
      owner: scan.owner,
      repo: scan.repo,
      overallScore: scan.overallScore,
      breakdown: {
        readme: scan.readmeScore,
        structure: scan.structureScore,
        activity: scan.activityScore,
        maintainability: scan.maintainabilityScore,
        bestPractices: scan.bestPracticesScore,
      },
      ...report,
      createdAt: scan.createdAt,
    })
  } catch (error) {
    console.error('Error fetching report:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}
