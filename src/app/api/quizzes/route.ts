import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const subject = searchParams.get('subject')

    const where: Record<string, unknown> = {}
    if (grade) where.grade = parseInt(grade)
    if (subject) where.subject = subject

    const quizzes = await db.quiz.findMany({
      where,
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: [{ grade: 'asc' }, { subject: 'asc' }, { chapter: 'asc' }],
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error('Get quizzes error:', error)
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }
}
