import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizData } from '@/lib/quiz-data'

export async function POST() {
  try {
    // Check if data already exists
    const existingCount = await db.quiz.count()
    if (existingCount > 0) {
      return NextResponse.json({ message: 'Data already seeded', count: existingCount })
    }

    // Seed quizzes
    for (const quiz of quizData) {
      const createdQuiz = await db.quiz.create({
        data: {
          grade: quiz.grade,
          subject: quiz.subject,
          chapter: quiz.chapter,
          chapterName: quiz.chapterName,
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          questions: {
            create: quiz.questions.map((q, idx) => ({
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
    return NextResponse.json({ message: 'Data seeded successfully', count: finalCount })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}
