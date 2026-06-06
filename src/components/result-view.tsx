'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw, Home, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { Confetti } from '@/components/confetti'

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

function CircularProgress({ score, size = 160, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const center = size / 2

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedScore(score)
    }, 300)
    return () => clearTimeout(timeout)
  }, [score])

  const offset = circumference - (animatedScore / 10) * circumference

  const getColor = (s: number) => {
    if (s >= 9) return { stroke: '#F59E0B', bg: '#FEF3C7', text: '#92400E' }
    if (s >= 7) return { stroke: '#10B981', bg: '#D1FAE5', text: '#065F46' }
    if (s >= 5) return { stroke: '#F97316', bg: '#FFEDD5', text: '#9A3412' }
    return { stroke: '#EF4444', bg: '#FEE2E2', text: '#991B1B' }
  }

  const colors = getColor(score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      {/* Score text in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          className="font-[family-name:var(--font-patrick-hand)] text-5xl leading-none"
          style={{ color: colors.text }}
        >
          {score.toFixed(1)}
        </motion.span>
        <span className="text-sm text-muted-foreground mt-1">trên 10</span>
      </div>
    </div>
  )
}

function FloatingStars({ score }: { score: number }) {
  if (score < 7) return null

  const starCount = score >= 9 ? 8 : 5

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: starCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.8],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 2.5,
            delay: 0.5 + i * 0.2,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute text-xl"
          style={{
            left: `${10 + (i * 80 / starCount)}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
        >
          {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '✨' : '🌟'}
        </motion.div>
      ))}
    </div>
  )
}

function BouncingEmoji({ emoji, delay = 0 }: { emoji: string; delay?: number }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{
        scale: [0, 1.3, 1],
        y: [0, -8, 0],
      }}
      transition={{
        scale: { delay, duration: 0.5, type: 'spring' },
        y: { delay: delay + 0.5, duration: 1.5, repeat: Infinity, repeatType: 'reverse' },
      }}
      className="inline-block text-2xl"
    >
      {emoji}
    </motion.span>
  )
}

export function ResultView() {
  const { quizResult, selectedQuizId, goBack, goHome, startQuiz, studentInfo } = useAppStore()
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

  // Calculate correct/incorrect counts
  let correctCount = 0
  let incorrectCount = 0
  if (quiz) {
    quiz.questions.forEach((q) => {
      const userAnswer = quizResult.answers[q.id]?.trim()
      if (userAnswer && userAnswer.toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        correctCount++
      } else {
        incorrectCount++
      }
    })
  }

  const getMessage = (s: number) => {
    if (s >= 9) return { text: 'Xuất sắc!', emoji: '🌟', color: 'text-amber-600', bg: 'bg-gradient-to-br from-amber-50 to-yellow-50', border: 'border-amber-200' }
    if (s >= 7) return { text: 'Giỏi lắm!', emoji: '⭐', color: 'text-emerald-600', bg: 'bg-gradient-to-br from-emerald-50 to-teal-50', border: 'border-emerald-200' }
    if (s >= 5) return { text: 'Khá tốt!', emoji: '👍', color: 'text-orange-600', bg: 'bg-gradient-to-br from-orange-50 to-amber-50', border: 'border-orange-200' }
    return { text: 'Cố gắng hơn nhé!', emoji: '💪', color: 'text-rose-600', bg: 'bg-gradient-to-br from-rose-50 to-pink-50', border: 'border-rose-200' }
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

  const handleRetry = () => {
    if (selectedQuizId && studentInfo) {
      startQuiz(selectedQuizId, studentInfo)
    }
  }

  return (
    <div className="space-y-6">
      {/* Confetti for high scores */}
      {score >= 7 && <Confetti score={score} />}

      {/* Score card with circular progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`${msg.bg} rounded-3xl p-6 sm:p-8 text-center shadow-lg border-2 ${msg.border} relative overflow-hidden`}
      >
        <FloatingStars score={score} />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-5xl sm:text-6xl mb-2"
        >
          {getGradeEmoji()}
        </motion.div>

        <h2 className={`font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl ${msg.color} mb-4`}>
          {msg.emoji} {msg.text}
        </h2>

        {/* Circular progress with score */}
        <div className="flex justify-center mb-6">
          <CircularProgress score={score} />
        </div>

        {/* Correct/Incorrect count - prominent display */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="bg-white rounded-2xl px-4 py-3 shadow-md flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-[family-name:var(--font-patrick-hand)] text-xl text-emerald-700">
              {correctCount}/{totalQuestions}
            </span>
            <span className="text-sm text-emerald-600">câu đúng</span>
          </motion.div>

          {incorrectCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
              className="bg-white rounded-2xl px-4 py-3 shadow-md flex items-center gap-2"
            >
              <XCircle className="w-5 h-5 text-rose-400" />
              <span className="font-[family-name:var(--font-patrick-hand)] text-xl text-rose-600">
                {incorrectCount}
              </span>
              <span className="text-sm text-rose-500">câu sai</span>
            </motion.div>
          )}
        </div>

        {/* Time & question count */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">⏱️ {quizResult.timeTaken ? formatTime(quizResult.timeTaken) : 'N/A'}</span>
          <span className="flex items-center gap-1">📝 {totalQuestions} câu hỏi</span>
        </div>

        {/* Bouncing emojis for encouragement */}
        <div className="flex justify-center gap-2 mt-4">
          {score >= 9 ? (
            <>
              <BouncingEmoji emoji="🎉" delay={1.5} />
              <BouncingEmoji emoji="🎊" delay={1.7} />
              <BouncingEmoji emoji="🏆" delay={1.9} />
              <BouncingEmoji emoji="⭐" delay={2.1} />
            </>
          ) : score >= 7 ? (
            <>
              <BouncingEmoji emoji="🌟" delay={1.5} />
              <BouncingEmoji emoji="👏" delay={1.7} />
              <BouncingEmoji emoji="⭐" delay={1.9} />
            </>
          ) : score >= 5 ? (
            <>
              <BouncingEmoji emoji="👍" delay={1.5} />
              <BouncingEmoji emoji="💪" delay={1.7} />
            </>
          ) : (
            <BouncingEmoji emoji="💪" delay={1.5} />
          )}
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
          className="gap-2 text-base py-3 border-2"
        >
          <ClipboardList className="w-4 h-4" />
          {showReview ? 'Ẩn đáp án' : 'Xem đáp án'}
        </Button>
        <Button
          onClick={handleRetry}
          disabled={!studentInfo || !selectedQuizId}
          className="gap-2 bg-orange-500 hover:bg-orange-600 text-white text-base py-3"
        >
          <RotateCcw className="w-4 h-4" />
          Làm lại bài
        </Button>
        <Button
          onClick={goBack}
          variant="outline"
          className="gap-2 text-base py-3 border-2"
        >
          Quay lại chương
        </Button>
        <Button
          onClick={goHome}
          variant="outline"
          className="gap-2 text-base py-3 border-2"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Button>
      </motion.div>

      {/* Answer review */}
      {showReview && quiz && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground flex items-center gap-2">
            📝 Chi tiết đáp án
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
                  className={`rounded-2xl p-4 sm:p-5 border-2 transition-all ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                      : 'bg-rose-50 border-rose-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Status indicator */}
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          isCorrect ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'
                        }`}>
                          Câu {idx + 1}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {q.questionType === 'multiple_choice' ? '📌 Trắc nghiệm' : '✏️ Điền đáp án'}
                        </span>
                      </div>
                      <p className="font-semibold text-foreground text-base">
                        {q.questionText}
                      </p>

                      {q.questionType === 'multiple_choice' && options.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          {options.map((opt, oi) => {
                            const optKey = String.fromCharCode(65 + oi)
                            const isThisCorrect = optKey === q.correctAnswer
                            const isThisUser = optKey === userAnswer
                            return (
                              <div
                                key={oi}
                                className={`text-sm px-3 py-2 rounded-xl border ${
                                  isThisCorrect
                                    ? 'bg-emerald-100 text-emerald-700 font-semibold border-emerald-300'
                                    : isThisUser && !isThisCorrect
                                      ? 'bg-rose-100 text-rose-700 line-through border-rose-300'
                                      : 'text-muted-foreground border-gray-200'
                                }`}
                              >
                                <span className="font-bold mr-1">{optKey}.</span>
                                {opt.replace(/^[A-D]\.\s*/, '')}
                                {isThisCorrect && ' ✓'}
                                {isThisUser && !isThisCorrect && ' ✗'}
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {q.questionType === 'fill_blank' && (
                        <div className="mt-3 space-y-1.5">
                          <div className={`inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border ${
                            userAnswer
                              ? isCorrect
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                : 'bg-rose-100 text-rose-700 border-rose-300'
                              : 'text-muted-foreground border-gray-200'
                          }`}>
                            <span className="text-xs">✏️</span>
                            Trả lời của bạn: <span className="font-semibold">{userAnswer || '(chưa trả lời)'}</span>
                          </div>
                          {!isCorrect && (
                            <div className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border bg-emerald-100 text-emerald-700 border-emerald-300">
                              <span className="text-xs">✅</span>
                              Đáp án đúng: <span className="font-semibold">{q.correctAnswer}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {!isCorrect && q.questionType === 'multiple_choice' && (
                        <div className="mt-2 inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300">
                          ✅ Đáp án đúng: {q.correctAnswer}
                        </div>
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
        <div className={`${
          score >= 9
            ? 'bg-gradient-to-r from-amber-100 to-yellow-100'
            : score >= 7
              ? 'bg-gradient-to-r from-emerald-100 to-teal-100'
              : score >= 5
                ? 'bg-gradient-to-r from-orange-100 to-amber-100'
                : 'bg-gradient-to-r from-rose-100 to-pink-100'
        } p-6 text-center`}>
          <div className="text-3xl mb-2">
            {score >= 9 ? '🎉🎊🌟🏆' : score >= 7 ? '🌟⭐👏' : score >= 5 ? '👍✨💪' : '💪📚❤️'}
          </div>
          <p className={`font-semibold ${
            score >= 9 ? 'text-amber-800' : score >= 7 ? 'text-emerald-800' : score >= 5 ? 'text-orange-800' : 'text-rose-800'
          }`}>
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
