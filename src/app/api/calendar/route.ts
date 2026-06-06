import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface CalendarDay {
  date: string
  completed: boolean
  score: number | null
  quizCount: number
  subjects: string[]
}

interface MonthlySummary {
  month: string
  monthLabel: string
  totalDays: number
  totalQuizzes: number
  avgScore: number | null
}

interface CalendarStats {
  totalStudyDays: number
  currentStreak: number
  longestStreak: number
  totalQuizzes: number
  averageScore: number | null
  bestDay: string | null
}

interface CalendarResponse {
  calendar: CalendarDay[]
  stats: CalendarStats
  monthlySummary: MonthlySummary[]
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getVietnameseMonth(date: Date): string {
  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ]
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}

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

    // Get all results for this student
    const results = await db.studentResult.findMany({
      where: {
        studentName: studentName.trim(),
        className: className.trim(),
      },
      include: {
        quiz: {
          select: {
            subject: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Generate last 90 days
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const days: CalendarDay[] = []

    for (let i = 89; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date)

      // Find results for this date
      const dayResults = results.filter((r) => {
        const resultDate = new Date(r.createdAt)
        const resultDay = new Date(
          resultDate.getFullYear(),
          resultDate.getMonth(),
          resultDate.getDate()
        )
        return formatDate(resultDay) === dateStr
      })

      const quizCount = dayResults.length
      const subjects = [...new Set(dayResults.map((r) => r.quiz?.subject).filter(Boolean))] as string[]
      const scores = dayResults.map((r) => r.score)
      const avgScore = scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null

      days.push({
        date: dateStr,
        completed: quizCount > 0,
        score: avgScore,
        quizCount,
        subjects,
      })
    }

    // Calculate stats
    const studyDays = days.filter((d) => d.completed)
    const totalStudyDays = studyDays.length
    const totalQuizzes = results.length
    const allScores = results.map((r) => r.score)
    const averageScore = allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : null

    // Find best day (highest avg score with at least 1 quiz)
    let bestDay: string | null = null
    let bestDayScore = -1
    for (const d of days) {
      if (d.score !== null && d.score > bestDayScore) {
        bestDayScore = d.score
        bestDay = d.date
      }
    }

    // Calculate current streak (consecutive days ending today)
    let currentStreak = 0
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].completed) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate longest streak
    let longestStreak = 0
    let tempStreak = 0
    for (const d of days) {
      if (d.completed) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
    }

    // Monthly summary (last 3 months)
    const monthlySummary: MonthlySummary[] = []
    for (let m = 2; m >= 0; m--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - m, 1)
      const monthStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`
      const monthLabel = getVietnameseMonth(monthDate)

      const monthDays = days.filter((d) => d.date.startsWith(monthStr))
      const monthStudyDays = monthDays.filter((d) => d.completed)
      const monthQuizzes = monthDays.reduce((s, d) => s + d.quizCount, 0)
      const monthScores = monthDays
        .filter((d) => d.score !== null)
        .map((d) => d.score as number)
      const monthAvg = monthScores.length > 0
        ? Math.round((monthScores.reduce((a, b) => a + b, 0) / monthScores.length) * 10) / 10
        : null

      monthlySummary.push({
        month: monthStr,
        monthLabel,
        totalDays: monthStudyDays.length,
        totalQuizzes: monthQuizzes,
        avgScore: monthAvg,
      })
    }

    const response: CalendarResponse = {
      calendar: days,
      stats: {
        totalStudyDays,
        currentStreak,
        longestStreak,
        totalQuizzes,
        averageScore,
        bestDay,
      },
      monthlySummary,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json({ error: 'Failed to fetch calendar data' }, { status: 500 })
  }
}
