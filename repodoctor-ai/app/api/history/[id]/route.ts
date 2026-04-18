import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Validate UUID format to prevent injection
    if (!UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: 'Invalid scan ID format' },
        { status: 400 }
      )
    }

    await prisma.scan.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting scan:', error)
    return NextResponse.json(
      { error: 'Failed to delete scan' },
      { status: 500 }
    )
  }
}
