'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, Pencil, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

interface Question {
  id: string
  questionText: string
  questionType: string
  options: string
  correctAnswer: string
  points: number
  orderIndex: number
}

interface QuizData {
  id: string
  title: string
  duration: number
  questions: Question[]
}

function CircularTimer({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  const isLow = timeLeft < 60
  const isCritical = timeLeft < 30

  const radius = 22
  const strokeWidth = 4
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative" style={{ width: 52, height: 52 }}>
        <svg width={52} height={52} className="-rotate-90">
          <circle
            cx={26}
            cy={26}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={isCritical ? 'text-red-100' : isLow ? 'text-amber-100' : 'text-orange-100'}
          />
          <motion.circle
            cx={26}
            cy={26}
            r={radius}
            fill="none"
            stroke={isCritical ? '#EF4444' : isLow ? '#F97316' : '#F97316'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className={`w-4 h-4 ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-orange-500'}`} />
        </div>
      </div>
      <span className={`font-mono text-sm font-bold ${
        isCritical ? 'text-red-600 animate-pulse' : isLow ? 'text-amber-600' : 'text-orange-700'
      }`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  )
}

export function QuizView() {
  const { selectedQuizId, studentInfo, setQuizResult, goBack } = useAppStore()
  const { toast } = useToast()

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const questionAreaRef = useRef<HTMLDivElement>(null)

  // Fetch quiz data
  useEffect(() => {
    if (!selectedQuizId) return

    const fetchQuiz = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/quizzes/${selectedQuizId}`)
        if (!res.ok) throw new Error('Không thể tải bài kiểm tra')
        const data = await res.json()
        setQuiz(data)
        const totalSecs = data.duration * 60
        setTimeLeft(totalSecs)
        setTotalTime(totalSecs)
      } catch (err) {
        setError('Không thể tải bài kiểm tra. Vui lòng thử lại.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [selectedQuizId])

  // Timer
  useEffect(() => {
    if (!quiz || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Auto submit when time is up
          handleSubmit(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz, timeLeft > 0])

  // Scroll to top when changing questions
  useEffect(() => {
    if (questionAreaRef.current) {
      questionAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    // Also scroll the window to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentQuestion])

  const parseOptions = (optionsStr: string): string[] => {
    try {
      return JSON.parse(optionsStr)
    } catch {
      return []
    }
  }

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (!quiz || !studentInfo) return

    if (!autoSubmit) {
      const unanswered = quiz.questions.filter((q) => !answers[q.id])
      if (unanswered.length > 0) {
        setShowConfirm(true)
        return
      }
    }

    setSubmitting(true)

    try {
      // Calculate score
      let earnedPoints = 0
      let totalPoints = 0
      quiz.questions.forEach((q) => {
        totalPoints += q.points
        const userAnswer = answers[q.id]?.trim()
        if (userAnswer && userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()) {
          earnedPoints += q.points
        }
      })

      const scoreOutOf10 = totalPoints > 0 ? (earnedPoints / totalPoints) * 10 : 0
      const timeTaken = quiz.duration * 60 - timeLeft

      // Submit to backend
      const res = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentInfo.name,
          className: studentInfo.className,
          schoolName: studentInfo.schoolName,
          quizId: quiz.id,
          answers,
          timeTaken,
          score: Math.round(scoreOutOf10 * 10) / 10,
          totalPoints,
        }),
      })

      if (!res.ok) {
        throw new Error('Không thể nộp bài')
      }

      setQuizResult({
        score: Math.round(scoreOutOf10 * 10) / 10,
        totalPoints,
        answers,
        quizId: quiz.id,
        timeTaken,
      })
    } catch (err) {
      toast({
        title: 'Lỗi nộp bài',
        description: 'Không thể nộp bài. Vui lòng thử lại.',
        variant: 'destructive',
      })
      console.error(err)
    } finally {
      setSubmitting(false)
      setShowConfirm(false)
    }
  }, [quiz, studentInfo, answers, timeLeft, setQuizResult, toast])

  if (!selectedQuizId || !studentInfo) return null

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="text-4xl animate-float">📝</div>
        <p className="text-muted-foreground">Đang tải bài kiểm tra...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 text-lg">{error}</p>
        <Button variant="outline" className="mt-4" onClick={goBack}>
          Quay lại
        </Button>
      </div>
    )
  }

  if (!quiz) return null

  const questions = [...quiz.questions].sort((a, b) => a.orderIndex - b.orderIndex)
  const q = questions[currentQuestion]
  const options = q.questionType === 'multiple_choice' ? parseOptions(q.options) : []
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = questions.filter((qu) => answers[qu.id]).length

  return (
    <div className="space-y-4">
      {/* Confirm dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setShowConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Bạn chưa trả lời hết câu hỏi!
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Bạn còn {questions.length - answeredCount} câu chưa trả lời.
                Bạn có muốn nộp bài không?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowConfirm(false)}
                >
                  Làm tiếp
                </Button>
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => handleSubmit(true)}
                >
                  Nộp bài
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz header with student name */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-sm border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-[family-name:var(--font-patrick-hand)] text-lg text-orange-700 truncate">
                {quiz.title}
              </span>
            </div>
            <CircularTimer timeLeft={timeLeft} totalTime={totalTime} />
          </div>
          <div className="flex items-center justify-between gap-2">
            {studentInfo && (
              <span className="text-xs text-muted-foreground truncate">
                👤 {studentInfo.name} - Lớp {studentInfo.className}
              </span>
            )}
            <span className="text-xs text-muted-foreground shrink-0">
              {answeredCount}/{questions.length} câu
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question area */}
      <AnimatePresence mode="wait">
        <motion.div
          ref={questionAreaRef}
          key={currentQuestion}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-5 sm:p-8 shadow-md border relative overflow-hidden"
        >
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-50 to-transparent rounded-tr-3xl pointer-events-none" />

          {/* Question number, type indicator, and text */}
          <div className="mb-6 relative">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                Câu {currentQuestion + 1}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                q.questionType === 'multiple_choice'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-violet-100 text-violet-700'
              }`}>
                {q.questionType === 'multiple_choice' ? '📌 Trắc nghiệm' : '✏️ Điền đáp án'}
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed">
              {q.questionText}
            </h3>
          </div>

          {/* Multiple choice */}
          {q.questionType === 'multiple_choice' && options.length > 0 && (
            <div className="space-y-3">
              {options.map((option, idx) => {
                const optionKey = String.fromCharCode(65 + idx) // A, B, C, D
                const isSelected = answers[q.id] === optionKey
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [q.id]: optionKey }))
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-orange-400 bg-orange-50 shadow-md'
                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : optionKey}
                      </span>
                      <span className="text-base">{option.replace(/^[A-D]\.\s*/, '')}</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Fill in the blank with pencil icon */}
          {q.questionType === 'fill_blank' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">
                    <Pencil className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={answers[q.id] || ''}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    placeholder="Nhập câu trả lời của bạn..."
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none text-lg focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Pencil className="w-3 h-3" />
                Nhập câu trả lời ngắn gọn vào ô trên
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="gap-1 shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Câu trước</span>
        </Button>

        {/* Question navigation with answered indicators */}
        <div className="flex items-center gap-1 flex-wrap justify-center overflow-x-auto max-w-[60%]">
          {questions.map((_, idx) => {
            const isAnswered = !!answers[questions[idx].id]
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
                  idx === currentQuestion
                    ? 'bg-orange-500 text-white shadow-md'
                    : isAnswered
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {idx + 1}
                {isAnswered && idx !== currentQuestion && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" />
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {currentQuestion < questions.length - 1 ? (
          <Button
            onClick={() => setCurrentQuestion((prev) => Math.min(questions.length - 1, prev + 1))}
            className="gap-1 bg-orange-500 hover:bg-orange-600 text-white shrink-0"
          >
            <span className="hidden sm:inline">Câu sau</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={() => handleSubmit()}
            disabled={submitting}
            className="gap-1 bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Đang nộp...' : 'Nộp bài'}
          </Button>
        )}
      </div>
    </div>
  )
}
