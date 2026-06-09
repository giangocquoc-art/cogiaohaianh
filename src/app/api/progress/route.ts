import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentName = searchParams.get('studentName')
    const className = searchParams.get('className')

    if (!studentName || !className) {
      return NextResponse.json(
        { error: 'Missing required query params: studentName, className' },
        { status: 400 }
      )
    }

    const results = await db.studentResult.findMany({
      where: {
        studentName: studentName.trim(),
        className: className.trim(),
      },
      include: {
        quiz: {
          select: {
            title: true,
            subject: true,
            grade: true,
            chapter: true,
            chapterName: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Get progress error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
