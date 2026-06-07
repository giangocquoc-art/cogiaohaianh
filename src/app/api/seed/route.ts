import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { quizData } from '@/lib/quiz-data'
import { additionalQuestions } from '@/lib/additional-questions'

// Use a fresh PrismaClient for seeding to avoid stale connections
const db = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reset = searchParams.get('reset')

    // If reset=true, clear all existing data first
    if (reset === 'true') {
      await db.studentResult.deleteMany({})
      await db.question.deleteMany({})
      await db.quiz.deleteMany({})
    }

    // Check if data already exists
    const existingCount = await db.quiz.count()
    if (existingCount > 0) {
      // Data already seeded - add any new quizzes and additional questions
      let addedCount = 0
      let newQuizCount = 0

      for (const quiz of quizData) {
        // Find the quiz in the database
        const existingQuiz = await db.quiz.findFirst({
          where: { title: quiz.title },
          include: { questions: { select: { questionText: true } } },
        })

        if (!existingQuiz) {
          // This quiz doesn't exist yet - create it
          const extraQuestions = additionalQuestions[quiz.title] || []
          const allQuestions = [...quiz.questions, ...extraQuestions]

          await db.quiz.create({
            data: {
              grade: quiz.grade,
              subject: quiz.subject,
              chapter: quiz.chapter,
              chapterName: quiz.chapterName,
              title: quiz.title,
              description: quiz.description,
              duration: quiz.duration,
              questions: {
                create: allQuestions.map((q, idx) => ({
                  questionText: q.questionText,
                  questionType: q.questionType,
                  options: JSON.stringify(q.options),
                  correctAnswer: q.correctAnswer,
                  points: q.points,
                  orderIndex: idx,
                })),
              },
            },
          })
          newQuizCount++
          addedCount += allQuestions.length
          continue
        }

        // Update chapter name and other fields if they changed
        if (existingQuiz.chapterName !== quiz.chapterName || existingQuiz.description !== quiz.description || existingQuiz.duration !== quiz.duration) {
          await db.quiz.update({
            where: { id: existingQuiz.id },
            data: { chapterName: quiz.chapterName, description: quiz.description, duration: quiz.duration },
          })
        }

        // Add any new additional questions
        const extraQuestions = additionalQuestions[quiz.title]
        if (!extraQuestions || extraQuestions.length === 0) continue

        // Get existing question texts for dedup
        const existingTexts = new Set(existingQuiz.questions.map(q => q.questionText))

        // Find the max orderIndex
        const maxOrderResult = await db.question.findFirst({
          where: { quizId: existingQuiz.id },
          orderBy: { orderIndex: 'desc' },
          select: { orderIndex: true },
        })
        let nextOrderIndex = (maxOrderResult?.orderIndex ?? -1) + 1

        // Add only new questions that don't already exist
        for (const q of extraQuestions) {
          if (existingTexts.has(q.questionText)) continue

          await db.question.create({
            data: {
              quizId: existingQuiz.id,
              questionText: q.questionText,
              questionType: q.questionType,
              options: JSON.stringify(q.options),
              correctAnswer: q.correctAnswer,
              points: q.points,
              orderIndex: nextOrderIndex,
            },
          })
          nextOrderIndex++
          addedCount++
        }
      }

      if (addedCount > 0 || newQuizCount > 0) {
        return NextResponse.json({
          message: `Added ${newQuizCount} new quizzes and ${addedCount} new questions`,
          newQuizCount,
          addedCount,
        })
      }

      return NextResponse.json({ message: 'Data already seeded, no new questions to add', count: existingCount })
    }

    // Initial seed - create quizzes with both original and additional questions
    for (const quiz of quizData) {
      const extraQuestions = additionalQuestions[quiz.title] || []
      const allQuestions = [...quiz.questions, ...extraQuestions]

      await db.quiz.create({
        data: {
          grade: quiz.grade,
          subject: quiz.subject,
          chapter: quiz.chapter,
          chapterName: quiz.chapterName,
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          questions: {
            create: allQuestions.map((q, idx) => ({
              questionText: q.questionText,
              questionType: q.questionType,
              options: JSON.stringify(q.options),
              correctAnswer: q.correctAnswer,
              points: q.points,
              orderIndex: idx,
            })),
          },
        },
      })
    }

    const finalCount = await db.quiz.count()
    const totalQuestions = await db.question.count()
    return NextResponse.json({
      message: 'Data seeded successfully with additional questions',
      quizCount: finalCount,
      questionCount: totalQuestions,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
