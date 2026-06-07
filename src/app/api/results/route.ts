import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const className = searchParams.get('className')
    const quizId = searchParams.get('quizId')

    const where: Record<string, unknown> = {}
    if (quizId) where.quizId = quizId
    if (grade) {
      where.quiz = { grade: parseInt(grade) }
    }
    if (className) where.className = className

    const results = await db.studentResult.findMany({
      where,
      include: {
        quiz: {
          select: {
            title: true,
            subject: true,
            grade: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(results)
  } catch (error) {
    console.error('Get results error:', error)
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentName, className, schoolName, quizId, answers, timeTaken, score, totalPoints } = body

    if (!studentName || !className || !quizId) {
      return NextResponse.json(
        { error: 'Missing required fields: studentName, className, quizId' },
        { status: 400 }
      )
    }

    const result = await db.studentResult.create({
      data: {
        studentName,
        className,
        schoolName: schoolName || '',
        quizId,
        score: score || 0,
        totalPoints: totalPoints || 0,
        answers: JSON.stringify(answers || {}),
        timeTaken: timeTaken || null,
      },
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Create result error:', error)
    return NextResponse.json({ error: 'Failed to create result' }, { status: 500 })
  }
}
