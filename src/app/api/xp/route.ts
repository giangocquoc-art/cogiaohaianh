import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// XP calculation rules:
// - Complete any quiz: +10 XP base
// - Score >= 7: +5 bonus XP
// - Score >= 9: +10 bonus XP (replaces the +5)
// - Score 10/10 (perfect): +15 bonus XP (replaces the +10)
// - Daily challenge completion: +20 XP
// - Streak bonus: +5 XP per consecutive day (max +25)

function calculateXPForResult(
  score: number,
  isDailyChallenge: boolean = false,
  streak: number = 0
): { total: number; breakdown: { base: number; scoreBonus: number; dailyBonus: number; streakBonus: number } } {
  let base = 10
  let scoreBonus = 0
  let dailyBonus = 0
  let streakBonus = 0

  // Score bonus
  if (score >= 10) {
    scoreBonus = 15
  } else if (score >= 9) {
    scoreBonus = 10
  } else if (score >= 7) {
    scoreBonus = 5
  }

  // Daily challenge bonus
  if (isDailyChallenge) {
    dailyBonus = 20
    // Streak bonus
    streakBonus = Math.min(streak, 5) * 5
  }

  const total = base + scoreBonus + dailyBonus + streakBonus

  return {
    total,
    breakdown: { base, scoreBonus, dailyBonus, streakBonus },
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentName = searchParams.get('studentName')
    const className = searchParams.get('className')

    if (!studentName || !className) {
      return NextResponse.json({ error: 'studentName and className are required' }, { status: 400 })
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
            id: true,
            subject: true,
            grade: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Get all quizzes for daily challenge calculation
    const allQuizzes = await db.quiz.findMany({
      select: { id: true },
    })

    // Hash function for daily challenge (same as daily-challenge route)
    function hashDate(dateStr: string): number {
      let hash = 0
      for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
      }
      return Math.abs(hash)
    }

    // Calculate daily challenge results and streaks
    const dailyChallengeDates = new Set<string>()
    const now = new Date()
    const vietnamOffset = 7 * 60
    const vietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + vietnamOffset) * 60000)

    // Check which days the student completed a daily challenge
    // For each result, check if it was the daily challenge for that day
    const resultDates = new Map<string, Set<string>>() // dateStr -> set of quizIds

    for (const result of results) {
      const resultDate = new Date(result.createdAt)
      const resultVietnamTime = new Date(resultDate.getTime() + (resultDate.getTimezoneOffset() + vietnamOffset) * 60000)
      const dateStr = `${resultVietnamTime.getFullYear()}-${String(resultVietnamTime.getMonth() + 1).padStart(2, '0')}-${String(resultVietnamTime.getDate()).padStart(2, '0')}`

      if (!resultDates.has(dateStr)) {
        resultDates.set(dateStr, new Set())
      }
      resultDates.get(dateStr)!.add(result.quizId)
    }

    // For each date, check if the daily challenge quiz was completed
    for (const [dateStr, quizIds] of resultDates) {
      if (allQuizzes.length === 0) continue
      const hash = hashDate(dateStr)
      const quizIndex = hash % allQuizzes.length
      const dailyQuizId = allQuizzes[quizIndex].id

      if (quizIds.has(dailyQuizId)) {
        dailyChallengeDates.add(dateStr)
      }
    }

    // Calculate streak
    let currentStreak = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(vietnamTime)
      checkDate.setDate(checkDate.getDate() - i)
      const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`

      if (dailyChallengeDates.has(checkDateStr)) {
        currentStreak++
      } else {
        break
      }
    }

    // Calculate total XP
    let totalXP = 0
    const xpHistory: Array<{
      quizId: string
      quizTitle: string
      score: number
      xp: number
      breakdown: { base: number; scoreBonus: number; dailyBonus: number; streakBonus: number }
      isDaily: boolean
      date: string
    }> = []

    for (const result of results) {
      const resultDate = new Date(result.createdAt)
      const resultVietnamTime = new Date(resultDate.getTime() + (resultDate.getTimezoneOffset() + vietnamOffset) * 60000)
      const dateStr = `${resultVietnamTime.getFullYear()}-${String(resultVietnamTime.getMonth() + 1).padStart(2, '0')}-${String(resultVietnamTime.getDate()).padStart(2, '0')}`

      const isDaily = dailyChallengeDates.has(dateStr) && allQuizzes.length > 0 && allQuizzes[hashDate(dateStr) % allQuizzes.length]?.id === result.quizId

      // Calculate streak at the time of this result
      let streakAtTime = 0
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(resultVietnamTime)
        checkDate.setDate(checkDate.getDate() - i)
        const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`

        if (dailyChallengeDates.has(checkDateStr)) {
          streakAtTime++
        } else {
          break
        }
      }

      const xpResult = calculateXPForResult(result.score, isDaily, isDaily ? streakAtTime : 0)
      totalXP += xpResult.total

      xpHistory.push({
        quizId: result.quizId,
        quizTitle: result.quiz.title,
        score: result.score,
        xp: xpResult.total,
        breakdown: xpResult.breakdown,
        isDaily,
        date: dateStr,
      })
    }

    // Calculate level
    const level = Math.floor(totalXP / 100) + 1
    const xpInCurrentLevel = totalXP % 100
    const xpForNextLevel = 100

    // Level names in Vietnamese
    function getLevelName(lvl: number): string {
      if (lvl === 1) return 'Học sinh mới'
      if (lvl === 2) return 'Học sinh chăm chỉ'
      if (lvl === 3) return 'Học sinh giỏi'
      if (lvl === 4) return 'Học sinh xuất sắc'
      return 'Cao thủ'
    }

    function getLevelEmoji(lvl: number): string {
      if (lvl === 1) return '🌱'
      if (lvl === 2) return '📖'
      if (lvl === 3) return '⭐'
      if (lvl === 4) return '🏆'
      return '👑'
    }

    return NextResponse.json({
      studentName: studentName.trim(),
      className: className.trim(),
      totalXP,
      level,
      levelName: getLevelName(level),
      levelEmoji: getLevelEmoji(level),
      xpInCurrentLevel,
      xpForNextLevel,
      currentStreak,
      quizCount: results.length,
      averageScore: results.length > 0 ? Math.round((results.reduce((sum, r) => sum + r.score, 0) / results.length) * 10) / 10 : 0,
      xpHistory,
    })
  } catch (error) {
    console.error('XP calculation error:', error)
    return NextResponse.json({ error: 'Failed to calculate XP' }, { status: 500 })
  }
}

// Export the calculation function for reuse
export { calculateXPForResult }
