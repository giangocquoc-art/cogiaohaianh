import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const grade = searchParams.get('grade')
    const subject = searchParams.get('subject')
    const countParam = searchParams.get('count')

    if (!grade || !subject) {
      return NextResponse.json(
        { error: 'Thiếu tham số grade hoặc subject' },
        { status: 400 }
      )
    }

    const gradeNum = parseInt(grade)
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 5) {
      return NextResponse.json(
        { error: 'Grade phải từ 1 đến 5' },
        { status: 400 }
      )
    }

    let count = 5
    if (countParam) {
      count = parseInt(countParam)
      if (isNaN(count) || count < 1) count = 5
      if (count > 10) count = 10
    }

    // Get all questions matching grade and subject
    const questions = await db.question.findMany({
      where: {
        quiz: {
          grade: gradeNum,
          subject: subject,
        },
      },
      include: {
        quiz: {
          select: {
            subject: true,
            grade: true,
            chapterName: true,
          },
        },
      },
    })

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy câu hỏi cho lớp và môn học này' },
        { status: 404 }
      )
    }

    // Randomly select questions (Fisher-Yates shuffle)
    const shuffled = [...questions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    const selected = shuffled.slice(0, Math.min(count, shuffled.length))

    // Generate brief explanations for practice questions
    const practiceQuestions = selected.map((q) => {
      let explanation = ''

      // Generate a simple explanation based on the question
      try {
        const options = JSON.parse(q.options)
        if (q.questionType === 'multiple_choice') {
          // Find the correct answer text
          const correctOption = options.find(
            (opt: string) =>
              opt.startsWith(q.correctAnswer + '.') ||
              opt.startsWith(q.correctAnswer + ')') ||
              opt.startsWith(q.correctAnswer + ' ')
          )
          if (correctOption) {
            const answerText = correctOption.replace(/^[A-D][.)\s]+/, '')
            explanation = `Đáp án đúng là ${q.correctAnswer}. ${answerText}`
          } else {
            explanation = `Đáp án đúng là ${q.correctAnswer}`
          }
        } else {
          explanation = `Đáp án đúng là: ${q.correctAnswer}`
        }
      } catch {
        explanation = `Đáp án đúng là ${q.correctAnswer}`
      }

      return {
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
        subject: q.quiz.subject,
        grade: q.quiz.grade,
        chapterName: q.quiz.chapterName,
        explanation,
      }
    })

    return NextResponse.json(practiceQuestions)
  } catch (error) {
    console.error('Practice API error:', error)
    return NextResponse.json(
      { error: 'Không thể tải câu hỏi luyện tập' },
      { status: 500 }
    )
  }
}
