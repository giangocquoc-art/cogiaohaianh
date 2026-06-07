import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/documents/contributors - Top contributing teachers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    // Group documents by authorName and count
    const contributors = await db.document.groupBy({
      by: ['authorName'],
      where: { isApproved: true },
      _count: {
        id: true,
      },
      _sum: {
        likes: true,
        downloads: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      take: limit,
    })

    // For each contributor, get their subjects
    const contributorsWithSubjects = await Promise.all(
      contributors.map(async (c) => {
        const subjects = await db.document.findMany({
          where: { authorName: c.authorName, isApproved: true },
          select: { subject: true },
          distinct: ['subject'],
        })

        return {
          name: c.authorName,
          documentCount: c._count.id,
          totalLikes: c._sum.likes || 0,
          totalDownloads: c._sum.downloads || 0,
          subjects: subjects.map((s) => s.subject),
        }
      })
    )

    return NextResponse.json({ contributors: contributorsWithSubjects })
  } catch (error) {
    console.error('Error fetching contributors:', error)
    return NextResponse.json(
      { error: 'Không thể tải danh sách giáo viên' },
      { status: 500 }
    )
  }
}
