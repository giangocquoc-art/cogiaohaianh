import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolName = searchParams.get('schoolName')
    const className = searchParams.get('className')

    if (!schoolName) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tên trường!' },
        { status: 400 }
      )
    }

    // Build where clause for StudentResult
    const resultWhere: Record<string, unknown> = {
      schoolName: { contains: schoolName },
    }
    if (className) {
      resultWhere.className = { contains: className }
    }

    // Build where clause for ScoreEntry
    const scoreWhere: Record<string, unknown> = {
      schoolName: { contains: schoolName },
    }
    if (className) {
      scoreWhere.className = { contains: className }
    }

    // Fetch all StudentResults
    const results = await db.studentResult.findMany({
      where: resultWhere,
      include: {
        quiz: {
          select: {
            subject: true,
            grade: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Fetch all ScoreEntries
    const scores = await db.scoreEntry.findMany({
      where: scoreWhere,
      orderBy: { createdAt: 'desc' },
    })

    if (results.length === 0 && scores.length === 0) {
      return NextResponse.json({
        totalStudents: 0,
        totalQuizzes: 0,
        averageScore: 0,
        passRate: 0,
        subjectBreakdown: { toan: { count: 0, avgScore: 0 }, 'ngu-van': { count: 0, avgScore: 0 } },
        gradeBreakdown: [],
        topStudents: [],
        recentActivity: [],
        scoreDistribution: { excellent: 0, good: 0, average: 0, poor: 0 },
      })
    }

    // Calculate total unique students
    const studentNames = new Set<string>()
    results.forEach(r => studentNames.add(r.studentName.toLowerCase().trim()))
    scores.forEach(s => studentNames.add(s.studentName.toLowerCase().trim()))
    const totalStudents = studentNames.size

    // Total quiz completions
    const totalQuizzes = results.length

    // Average score across all results
    const allScores = results.map(r => r.score)
    const averageScore = allScores.length > 0
      ? Math.round((allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10) / 10
      : 0

    // Pass rate (score >= 5)
    const passCount = allScores.filter(s => s >= 5).length
    const passRate = allScores.length > 0 ? Math.round((passCount / allScores.length) * 100) : 0

    // Subject breakdown
    const toanResults = results.filter(r => r.quiz.subject === 'toan')
    const nguVanResults = results.filter(r => r.quiz.subject === 'ngu-van')

    const subjectBreakdown = {
      toan: {
        count: toanResults.length,
        avgScore: toanResults.length > 0
          ? Math.round((toanResults.reduce((a, b) => a + b.score, 0) / toanResults.length) * 10) / 10
          : 0,
      },
      'ngu-van': {
        count: nguVanResults.length,
        avgScore: nguVanResults.length > 0
          ? Math.round((nguVanResults.reduce((a, b) => a + b.score, 0) / nguVanResults.length) * 10) / 10
          : 0,
      },
    }

    // Grade breakdown
    const gradeMap = new Map<number, { scores: number[]; count: number }>()
    results.forEach(r => {
      const g = r.quiz.grade
      if (!gradeMap.has(g)) {
        gradeMap.set(g, { scores: [], count: 0 })
      }
      const entry = gradeMap.get(g)!
      entry.scores.push(r.score)
      entry.count++
    })

    const gradeBreakdown = Array.from(gradeMap.entries())
      .map(([grade, data]) => ({
        grade,
        count: data.count,
        avgScore: Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10,
      }))
      .sort((a, b) => a.grade - b.grade)

    // Top 10 students by average score (minimum 2 quizzes)
    const studentScores = new Map<string, { scores: number[]; className: string; total: number }>()
    results.forEach(r => {
      const key = r.studentName.toLowerCase().trim()
      if (!studentScores.has(key)) {
        studentScores.set(key, { scores: [], className: r.className, total: 0 })
      }
      const entry = studentScores.get(key)!
      entry.scores.push(r.score)
      entry.total++
    })

    const topStudents = Array.from(studentScores.entries())
      .filter(([_, data]) => data.total >= 2)
      .map(([name, data]) => ({
        name: name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        className: data.className,
        quizCount: data.total,
        avgScore: Math.round((data.scores.reduce((a, b) => a + b, 0) / data.scores.length) * 10) / 10,
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10)

    // Recent activity (last 10)
    const recentActivity = results.slice(0, 10).map(r => ({
      studentName: r.studentName,
      className: r.className,
      quizTitle: r.quiz.title,
      subject: r.quiz.subject,
      grade: r.quiz.grade,
      score: r.score,
      date: r.createdAt,
    }))

    // Score distribution
    const scoreDistribution = {
      excellent: allScores.filter(s => s >= 8).length,
      good: allScores.filter(s => s >= 6 && s < 8).length,
      average: allScores.filter(s => s >= 5 && s < 6).length,
      poor: allScores.filter(s => s < 5).length,
    }

    return NextResponse.json({
      totalStudents,
      totalQuizzes,
      averageScore,
      passRate,
      subjectBreakdown,
      gradeBreakdown,
      topStudents,
      recentActivity,
      scoreDistribution,
    })
  } catch (error) {
    console.error('Teacher API error:', error)
    return NextResponse.json(
      { error: 'Không thể tải dữ liệu. Vui lòng thử lại!' },
      { status: 500 }
    )
  }
}
