'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { Trophy, Star, ThumbsUp, Dumbbell, ArrowRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface Question {
  id: string
  questionText: string
  questionType: string
  options: string
  correctAnswer: string
  points: number
  orderIndex: number
}

interface QuizInfo {
  id: string
  title: string
  questions: Question[]
}

export function ResultView() {
  const { quizResult, selectedQuizId, goBack, goHome } = useAppStore()
  const [quiz, setQuiz] = useState<QuizInfo | null>(null)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    if (!selectedQuizId) return

    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quizzes/${selectedQuizId}`)
        if (res.ok) {
          const data = await res.json()
          setQuiz(data)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchQuiz()
  }, [selectedQuizId])

  if (!quizResult) return null

  const score = quizResult.score
  const totalQuestions = Object.keys(quizResult.answers).length || (quiz?.questions?.length ?? 0)

  const getMessage = (s: number) => {
    if (s >= 9) return { text: 'Xuất sắc!', emoji: '🌟', color: 'text-amber-600', bg: 'bg-amber-50' }
    if (s >= 7) return { text: 'Giỏi lắm!', emoji: '⭐', color: 'text-emerald-600', bg: 'bg-emerald-50' }
    if (s >= 5) return { text: 'Khá tốt!', emoji: '👍', color: 'text-orange-600', bg: 'bg-orange-50' }
    return { text: 'Cố gắng hơn nhé!', emoji: '💪', color: 'text-rose-600', bg: 'bg-rose-50' }
  }

  const msg = getMessage(score)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} phút ${secs} giây`
  }

  const parseOptions = (optionsStr: string): string[] => {
    try {
      return JSON.parse(optionsStr)
    } catch {
      return []
    }
  }

  const getGradeEmoji = () => {
    if (score >= 9) return '🏆'
    if (score >= 7) return '🥇'
    if (score >= 5) return '🥈'
    return '📚'
  }

  return (
    <div className="space-y-6">
      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`${msg.bg} rounded-3xl p-6 sm:p-8 text-center shadow-lg border-2`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-6xl sm:text-7xl mb-3"
        >
          {getGradeEmoji()}
        </motion.div>

        <h2 className={`font-[family-name:var(--font-patrick-hand)] text-4xl sm:text-5xl ${msg.color} mb-2`}>
          {msg.emoji} {msg.text}
        </h2>

        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="bg-white rounded-2xl px-6 py-3 shadow-md">
            <div className={`font-[family-name:var(--font-patrick-hand)] text-5xl ${msg.color}`}>
              {score.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">trên 10 điểm</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <span>⏱️ Thời gian: {quizResult.timeTaken ? formatTime(quizResult.timeTaken) : 'N/A'}</span>
          <span>📝 Số câu: {totalQuestions}</span>
        </div>

        {/* Animated progress bar */}
        <div className="mt-6 mx-auto max-w-xs">
          <div className="h-4 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / 10) * 100}%` }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                score >= 9 ? 'bg-amber-400' :
                score >= 7 ? 'bg-emerald-400' :
                score >= 5 ? 'bg-orange-400' : 'bg-rose-400'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        <Button
          onClick={() => setShowReview(!showReview)}
          variant="outline"
          className="gap-2 text-base py-3"
        >
          {showReview ? 'Ẩn đáp án' : 'Xem đáp án'} 📋
        </Button>
        <Button
          onClick={goBack}
          className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base py-3"
        >
          <RotateCcw className="w-4 h-4" />
          Quay lại chương
        </Button>
        <Button
          onClick={goHome}
          variant="outline"
          className="gap-2 text-base py-3"
        >
          Về trang chủ 🏠
        </Button>
      </motion.div>

      {/* Answer review */}
      {showReview && quiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground">
            Chi tiết đáp án 📝
          </h3>
          {[...quiz.questions]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((q, idx) => {
              const userAnswer = quizResult.answers[q.id] || ''
              const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
              const options = q.questionType === 'multiple_choice' ? parseOptions(q.options) : []

              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`rounded-2xl p-4 border-2 ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        Câu {idx + 1}: {q.questionText}
                      </p>

                      {q.questionType === 'multiple_choice' && options.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {options.map((opt, oi) => {
                            const optKey = String.fromCharCode(65 + oi)
                            const isThisCorrect = optKey === q.correctAnswer
                            const isThisUser = optKey === userAnswer
                            return (
                              <div
                                key={oi}
                                className={`text-sm px-3 py-1.5 rounded-lg ${
                                  isThisCorrect
                                    ? 'bg-emerald-100 text-emerald-700 font-semibold'
                                    : isThisUser && !isThisCorrect
                                      ? 'bg-rose-100 text-rose-700 line-through'
                                      : 'text-muted-foreground'
                                }`}
                              >
                                {opt} {isThisCorrect && '✓'} {isThisUser && !isThisCorrect && '✗'}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {q.questionType === 'fill_blank' && (
                        <div className="mt-2 space-y-1">
                          <p className={`text-sm ${userAnswer ? (isCorrect ? 'text-emerald-600' : 'text-rose-600') : 'text-muted-foreground'}`}>
                            Trả lời của bạn: <span className="font-semibold">{userAnswer || '(chưa trả lời)'}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-emerald-600">
                              Đáp án đúng: <span className="font-semibold">{q.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {!isCorrect && q.questionType === 'multiple_choice' && (
                        <p className="text-sm text-emerald-600 mt-1">
                          Đáp án đúng: {q.correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </motion.div>
      )}

      {/* Achievement section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="rounded-3xl overflow-hidden shadow-md"
      >
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-6 text-center">
          <div className="text-3xl mb-2">
            {score >= 9 ? '🎉🎊🌟' : score >= 7 ? '🌟⭐' : score >= 5 ? '👍✨' : '💪📚'}
          </div>
          <p className="text-amber-800 font-semibold">
            {score >= 9
              ? 'Bạn thật xuất sắc! Hãy tiếp tục phát huy nhé!'
              : score >= 7
                ? 'Bạn làm rất tốt! Cố gắng thêm chút nữa nhé!'
                : score >= 5
                  ? 'Kết quả khá tốt! Ôn tập thêm để tốt hơn nhé!'
                  : 'Đừng buồn nhé! Hãy ôn tập lại và thử lại!'}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
