import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const subject = searchParams.get('subject')
    const className = searchParams.get('className')

    const where: Record<string, unknown> = {}
    if (grade) where.grade = parseInt(grade)
    if (subject) where.subject = subject
    if (className) where.className = className

    const scores = await db.scoreEntry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(scores)
  } catch (error) {
    console.error('Get scores error:', error)
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentName, className, schoolName, subject, grade, testTitle, score, notes } = body

    if (!studentName || !className || !subject || !grade || !testTitle || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, className, subject, grade, testTitle, score' },
        { status: 400 }
      )
    }

    if (score < 0 || score > 10) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 10' },
        { status: 400 }
      )
    }

    const entry = await db.scoreEntry.create({
      data: {
        studentName,
        className,
        schoolName: schoolName || '',
        subject,
        grade,
        testTitle,
        score,
        notes: notes || null,
      },
    })

    return NextResponse.json(entry, { status: 201 })
  } catch (error) {
    console.error('Create score error:', error)
    return NextResponse.json({ error: 'Failed to create score entry' }, { status: 500 })
  }
}
