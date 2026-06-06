import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// XP calculation (same rules as xp route)
function calculateXPForResult(
  score: number,
  isDailyChallenge: boolean = false,
  streak: number = 0
): number {
  let xp = 10 // base

  if (score >= 10) xp += 15
  else if (score >= 9) xp += 10
  else if (score >= 7) xp += 5

  if (isDailyChallenge) {
    xp += 20
    xp += Math.min(streak, 5) * 5
  }

  return xp
}

function hashDate(dateStr: string): number {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash)
}

function getLevelName(lvl: number): string {
  if (lvl === 1) return 'Học sinh mới'
  if (lvl === 2) return 'Học sinh chăm chỉ'
  if (lvl === 3) return 'Học sinh giỏi'
  if (lvl === 4) return 'Học sinh xuất sắc'
  return 'Cao thủ'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const gradeFilter = searchParams.get('grade')

    // Get all results with quiz info
    const whereClause: Record<string, unknown> = {}
    if (gradeFilter) {
      whereClause.quiz = { grade: parseInt(gradeFilter) }
    }

    const results = await db.studentResult.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : {},
      include: {
        quiz: {
          select: {
            id: true,
            subject: true,
            grade: true,
            title: true,
          },
        },
      },
    })

    // Get all quizzes for daily challenge detection
    const allQuizzes = await db.quiz.findMany({
      select: { id: true },
    })

    // Group results by studentName + className
    const studentMap = new Map<string, {
      studentName: string
      className: string
      results: typeof results
    }>()

    for (const result of results) {
      const key = `${result.studentName.trim()}|${result.className.trim()}`
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          studentName: result.studentName.trim(),
          className: result.className.trim(),
          results: [],
        })
      }
      studentMap.get(key)!.results.push(result)
    }

    const now = new Date()
    const vietnamOffset = 7 * 60
    const vietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + vietnamOffset) * 60000)

    // Calculate XP for each student
    const leaderboard = Array.from(studentMap.entries()).map(([key, student]) => {
      const studentResults = student.results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      // Find daily challenge dates
      const dailyChallengeDates = new Set<string>()
      const resultDates = new Map<string, Set<string>>()

      for (const result of studentResults) {
        const resultDate = new Date(result.createdAt)
        const rvnTime = new Date(resultDate.getTime() + (resultDate.getTimezoneOffset() + vietnamOffset) * 60000)
        const dateStr = `${rvnTime.getFullYear()}-${String(rvnTime.getMonth() + 1).padStart(2, '0')}-${String(rvnTime.getDate()).padStart(2, '0')}`

        if (!resultDates.has(dateStr)) {
          resultDates.set(dateStr, new Set())
        }
        resultDates.get(dateStr)!.add(result.quizId)
      }

      for (const [dateStr, quizIds] of resultDates) {
        if (allQuizzes.length === 0) continue
        const hash = hashDate(dateStr)
        const quizIndex = hash % allQuizzes.length
        const dailyQuizId = allQuizzes[quizIndex].id

        if (quizIds.has(dailyQuizId)) {
          dailyChallengeDates.add(dateStr)
        }
      }

      // Calculate total XP
      let totalXP = 0
      for (const result of studentResults) {
        const resultDate = new Date(result.createdAt)
        const rvnTime = new Date(resultDate.getTime() + (resultDate.getTimezoneOffset() + vietnamOffset) * 60000)
        const dateStr = `${rvnTime.getFullYear()}-${String(rvnTime.getMonth() + 1).padStart(2, '0')}-${String(rvnTime.getDate()).padStart(2, '0')}`

        const isDaily = dailyChallengeDates.has(dateStr) && allQuizzes.length > 0 && allQuizzes[hashDate(dateStr) % allQuizzes.length]?.id === result.quizId

        // Calculate streak at time of result
        let streakAtTime = 0
        for (let i = 0; i < 365; i++) {
          const checkDate = new Date(rvnTime)
          checkDate.setDate(checkDate.getDate() - i)
          const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
          if (dailyChallengeDates.has(checkDateStr)) {
            streakAtTime++
          } else {
            break
          }
        }

        totalXP += calculateXPForResult(result.score, isDaily, isDaily ? streakAtTime : 0)
      }

      const level = Math.floor(totalXP / 100) + 1
      const avgScore = studentResults.length > 0
        ? Math.round((studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length) * 10) / 10
        : 0

      // Count badges (simplified - just count earned badges)
      const earnedBadges = countBadges(studentResults)

      return {
        key,
        studentName: student.studentName,
        className: student.className,
        totalXP,
        level,
        levelName: getLevelName(level),
        quizCount: studentResults.length,
        averageScore: avgScore,
        badgesCount: earnedBadges,
      }
    })

    // Sort by XP descending
    leaderboard.sort((a, b) => b.totalXP - a.totalXP)

    // Get top 20
    const top20 = leaderboard.slice(0, 20).map((entry, index) => {
      // Privacy: show first name only
      const nameParts = entry.studentName.split(' ')
      const displayName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : entry.studentName

      return {
        rank: index + 1,
        displayName,
        fullKey: entry.key,
        className: entry.className,
        totalXP: entry.totalXP,
        level: entry.level,
        levelName: entry.levelName,
        quizCount: entry.quizCount,
        averageScore: entry.averageScore,
        badgesCount: entry.badgesCount,
      }
    })

    return NextResponse.json({
      leaderboard: top20,
      totalStudents: leaderboard.length,
    })
  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Failed to get leaderboard' }, { status: 500 })
  }
}

// Simplified badge counting
function countBadges(results: Array<{ score: number; quiz: { subject: string; grade: number; title: string }; timeTaken: number | null }>): number {
  let count = 0

  // First quiz
  if (results.length >= 1) count++

  // Perfect score
  if (results.some(r => r.score >= 10)) count++

  // Math expert (3+ math quizzes with 9+)
  if (results.filter(r => r.quiz.subject === 'toan' && r.score >= 9).length >= 3) count++

  // Literature expert
  if (results.filter(r => r.quiz.subject === 'ngu-van' && r.score >= 9).length >= 3) count++

  // Versatile
  if (results.some(r => r.quiz.subject === 'toan') && results.some(r => r.quiz.subject === 'ngu-van')) count++

  // Speed demon
  if (results.some(r => r.timeTaken !== null && r.timeTaken < 300)) count++

  // Hard worker
  if (results.length >= 10) count++

  // Excellent student
  if (results.length >= 5) {
    const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length
    if (avg >= 8.0) count++
  }

  // Never give up
  if (results.filter(r => r.score < 5).length >= 3) count++

  // Improvement
  if (results.length >= 2) {
    for (let i = 1; i < results.length; i++) {
      if (results[i].score - results[i - 1].score >= 2) {
        count++
        break
      }
    }
  }

  return count
}
