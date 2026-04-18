import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        repoUrl: true,
        owner: true,
        repo: true,
        overallScore: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ scans })
  } catch (error) {
    console.error('Error fetching history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    )
  }
}
