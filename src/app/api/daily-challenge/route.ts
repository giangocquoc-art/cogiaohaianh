import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function hashDate(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentName = searchParams.get('studentName')
    const className = searchParams.get('className')

    // Get today's date string in Vietnam timezone
    const now = new Date()
    const vietnamOffset = 7 * 60 // UTC+7
    const vietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + vietnamOffset) * 60000)
    const dateStr = `${vietnamTime.getFullYear()}-${String(vietnamTime.getMonth() + 1).padStart(2, '0')}-${String(vietnamTime.getDate()).padStart(2, '0')}`

    // Get all quizzes
    const quizzes = await db.quiz.findMany({
      select: {
        id: true,
        title: true,
        subject: true,
        grade: true,
        chapter: true,
        chapterName: true,
        duration: true,
        _count: { select: { questions: true } },
      },
    })

    if (quizzes.length === 0) {
      return NextResponse.json({ error: 'No quizzes available' }, { status: 404 })
    }

    // Use date hash to deterministically pick a quiz
    const hash = hashDate(dateStr)
    const quizIndex = hash % quizzes.length
    const selectedQuiz = quizzes[quizIndex]

    // Check if the student already completed this challenge today
    let completed = false
    let streak = 0

    if (studentName && className) {
      // Check today's completion
      const todayStart = new Date(vietnamTime)
      todayStart.setHours(0, 0, 0, 0)
      const todayEnd = new Date(vietnamTime)
      todayEnd.setHours(23, 59, 59, 999)

      const todayResult = await db.studentResult.findFirst({
        where: {
          studentName: studentName.trim(),
          className: className.trim(),
          quizId: selectedQuiz.id,
          createdAt: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      })

      completed = !!todayResult

      // Calculate streak - check consecutive days
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(vietnamTime)
        checkDate.setDate(checkDate.getDate() - i)
        const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
        const checkHash = hashDate(checkDateStr)
        const checkIndex = checkHash % quizzes.length
        const checkQuiz = quizzes[checkIndex]

        const dayStart = new Date(checkDate)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(checkDate)
        dayEnd.setHours(23, 59, 59, 999)

        const dayResult = await db.studentResult.findFirst({
          where: {
            studentName: studentName.trim(),
            className: className.trim(),
            quizId: checkQuiz.id,
            createdAt: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
        })

        if (dayResult) {
          streak++
        } else {
          break
        }
      }
    }

    return NextResponse.json({
      quizId: selectedQuiz.id,
      title: selectedQuiz.title,
      subject: selectedQuiz.subject,
      grade: selectedQuiz.grade,
      chapter: selectedQuiz.chapter,
      chapterName: selectedQuiz.chapterName,
      duration: selectedQuiz.duration,
      questionCount: selectedQuiz._count.questions,
      date: dateStr,
      bonusPoints: 1,
      completed,
      streak,
    })
  } catch (error) {
    console.error('Daily challenge error:', error)
    return NextResponse.json({ error: 'Failed to get daily challenge' }, { status: 500 })
  }
}
