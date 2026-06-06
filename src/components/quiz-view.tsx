'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, Pencil, Check, Lightbulb, Loader2, Star, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useEffect, useState, useCallback, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { playClickSound } from '@/lib/sounds'
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
  grade: number
  subject: string
  questions: Question[]
}

interface HintState {
  hintsUsed: number
  hints: string[]
  loading: boolean
}

function CircularTimer({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0
  const isLow = timeLeft < 60
  const isCritical = timeLeft < 30

  const radius = 24
  const strokeWidth = 5
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  // Gradient color from orange to green as time remaining
  const strokeColor = isCritical ? '#EF4444' : isLow ? '#F97316' : percentage > 50 ? '#22C55E' : '#F97316'

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative" style={{ width: 56, height: 56 }}>
        <svg width={56} height={56} className="-rotate-90">
          <defs>
            <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isCritical ? '#EF4444' : '#F97316'} />
              <stop offset="100%" stopColor={isCritical ? '#DC2626' : isLow ? '#EA580C' : '#22C55E'} />
            </linearGradient>
          </defs>
          <circle
            cx={28}
            cy={28}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className={isCritical ? 'text-red-100 dark:text-red-900/30' : isLow ? 'text-amber-100 dark:text-amber-900/30' : 'text-orange-100 dark:text-orange-900/30'}
          />
          <motion.circle
            cx={28}
            cy={28}
            r={radius}
            fill="none"
            stroke="url(#timer-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className={`w-4.5 h-4.5 ${isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-green-500'}`} />
        </div>
      </div>
      <span className={`font-mono text-sm font-bold ${
        isCritical ? 'text-red-600 dark:text-red-400 animate-pulse' : isLow ? 'text-amber-600 dark:text-amber-400 animate-pulse-soft-gentle' : 'text-green-700 dark:text-green-400'
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
  const [hintStates, setHintStates] = useState<Record<string, HintState>>({})
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

  // Scroll to top when changing questions & play click sound
  useEffect(() => {
    playClickSound()
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

  const handleRequestHint = async () => {
    if (!quiz || !q) return
    const hintState = hintStates[q.id] || { hintsUsed: 0, hints: [], loading: false }
    if (hintState.hintsUsed >= 2 || hintState.loading) return

    setHintStates((prev) => ({
      ...prev,
      [q.id]: { ...hintState, loading: true },
    }))

    try {
      const res = await fetch('/api/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionText: q.questionText,
          questionType: q.questionType,
          grade: quiz.grade,
          subject: quiz.subject,
          hintNumber: hintState.hintsUsed + 1,
        }),
      })

      if (!res.ok) throw new Error('Failed to get hint')
      const data = await res.json()

      setHintStates((prev) => {
        const current = prev[q.id] || { hintsUsed: 0, hints: [], loading: false }
        return {
          ...prev,
          [q.id]: {
            hintsUsed: current.hintsUsed + 1,
            hints: [...current.hints, data.hint],
            loading: false,
          },
        }
      })
    } catch {
      toast({
        title: 'Không thể lấy gợi ý',
        description: 'Con hãy thử lại sau nhé!',
        variant: 'destructive',
      })
      setHintStates((prev) => ({
        ...prev,
        [q.id]: { ...hintState, loading: false },
      }))
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

  // Keyboard shortcuts - uses useCallback to avoid conditional hook call
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!quiz) return
    const currentQuestions = [...quiz.questions].sort((a, b) => a.orderIndex - b.orderIndex)
    const currentQ = currentQuestions[currentQuestion]
    if (!currentQ) return
    const currentOptions = currentQ.questionType === 'multiple_choice' ? parseOptions(currentQ.options) : []

    // 1-4 for A-D selection in multiple choice
    if (currentQ.questionType === 'multiple_choice' && currentOptions.length > 0) {
      const num = parseInt(e.key)
      if (num >= 1 && num <= currentOptions.length) {
        const optionKey = String.fromCharCode(64 + num) // 1=A, 2=B, 3=C, 4=D
        setAnswers((prev) => ({ ...prev, [currentQ.id]: optionKey }))
        playClickSound()
        return
      }
    }
    // Enter for next question
    if (e.key === 'Enter') {
      if (currentQuestion < currentQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      }
    }
    // Arrow keys for navigation
    if (e.key === 'ArrowLeft' && currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
    if (e.key === 'ArrowRight' && currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }, [quiz, currentQuestion])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

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
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
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
              className="bg-white dark:bg-card rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
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
      <div className="sticky top-16 z-40 bg-white/90 dark:bg-card/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-sm border dark:border-border">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
              <span className="font-[family-name:var(--font-patrick-hand)] text-lg text-orange-700 dark:text-orange-300 truncate">
                {quiz.title}
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Mini-map of answered/unanswered questions */}
              <div className="hidden sm:flex items-center gap-0.5">
                {questions.map((qu, idx) => {
                  const isAnswered = !!answers[qu.id]
                  const isCurrent = idx === currentQuestion
                  return (
                    <button
                      key={qu.id}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`w-4 h-4 rounded-sm transition-all ${
                        isCurrent
                          ? 'bg-orange-500 ring-2 ring-orange-300 dark:ring-orange-600 shadow-sm'
                          : isAnswered
                            ? 'bg-green-400 dark:bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                      title={`Câu ${idx + 1}${isAnswered ? ' ✓' : ''}`}
                    />
                  )
                })}
              </div>
              <CircularTimer timeLeft={timeLeft} totalTime={totalTime} />
            </div>
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
          {/* Progress ring bar - gradient from orange to green */}
          <div className="relative h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full relative"
              style={{
                background: 'linear-gradient(to right, #F97316, #EAB308, #22C55E)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            >
              {/* Shimmer effect on progress */}
              <div className="absolute inset-0 animate-shimmer-enhanced rounded-full" />
            </motion.div>
          </div>
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
          className="bg-white dark:bg-card rounded-2xl p-6 sm:p-8 shadow-md border dark:border-border relative overflow-hidden"
        >
          {/* Decorative corner elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-50 dark:from-orange-950/30 to-transparent rounded-bl-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-amber-50 dark:from-amber-950/30 to-transparent rounded-tr-3xl pointer-events-none" />

          {/* Question number, type indicator, and text */}
          <div className="mb-8 relative">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-bold px-3 py-1 rounded-full">
                Câu {currentQuestion + 1}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                q.questionType === 'multiple_choice'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
              }`}>
                {q.questionType === 'multiple_choice' ? '📌 Trắc nghiệm' : '✏️ Điền đáp án'}
              </span>
              {/* Difficulty indicator */}
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                q.points >= 3
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : q.points >= 2
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
              }`}>
                <span className="inline-flex items-center gap-0.5">
                  {Array.from({ length: q.points >= 3 ? 3 : q.points >= 2 ? 2 : 1 }).map((_, si) => (
                    <Star key={si} className="w-3 h-3 fill-current" />
                  ))}
                </span>
                <span className="ml-1">{q.points >= 3 ? 'Khó' : q.points >= 2 ? 'Trung bình' : 'Dễ'}</span>
              </span>
              <span className="text-xs text-muted-foreground ml-auto">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed flex-1">
                {q.questionText}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRequestHint}
                disabled={hintStates[q.id]?.loading || (hintStates[q.id]?.hintsUsed ?? 0) >= 2}
                className={`shrink-0 gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  (hintStates[q.id]?.hintsUsed ?? 0) >= 2
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : hintStates[q.id]?.loading
                      ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 active:scale-95'
                }`}
                title={(hintStates[q.id]?.hintsUsed ?? 0) >= 2 ? 'Đã hết gợi ý cho câu này' : 'Nhận gợi ý từ cô giáo'}
              >
                {hintStates[q.id]?.loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span className="animate-thinking-dots">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </span>
                  </>
                ) : (
                  <Lightbulb className="w-3.5 h-3.5" />
                )}
                {!hintStates[q.id]?.loading && <span>
                  {(hintStates[q.id]?.hintsUsed ?? 0) >= 2
                    ? 'Hết gợi ý'
                    : `Gợi ý (${(hintStates[q.id]?.hintsUsed ?? 0) + 1}/2)`}
                </span>}
              </Button>
            </div>
          </div>

          {/* Hint cards */}
          {hintStates[q.id] && hintStates[q.id].hints.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 space-y-2 overflow-hidden"
            >
              {hintStates[q.id].hints.map((hint, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4"
                >
                  <span className="text-xl shrink-0 mt-0.5">💡</span>
                  <div className="flex-1">
                    <span className="text-xs text-amber-600 dark:text-amber-400 block mb-1">
                      Gợi ý {idx + 1}
                    </span>
                    <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">{hint}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Multiple choice */}
          {q.questionType === 'multiple_choice' && options.length > 0 && (
            <div className="space-y-3 mt-2">
              {options.map((option, idx) => {
                const optionKey = String.fromCharCode(65 + idx) // A, B, C, D
                const isSelected = answers[q.id] === optionKey
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playClickSound()
                      setAnswers((prev) => ({ ...prev, [q.id]: optionKey }))
                    }}
                    aria-label={`Đáp án ${optionKey}: ${option.replace(/^[A-D]\.\s*/, '')}`}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 ${
                      isSelected
                        ? 'bg-orange-100 border-orange-500 ring-2 ring-orange-300 shadow-md dark:bg-orange-900/40 dark:border-orange-500 dark:ring-orange-600 animate-answer-pop'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:shadow-md hover:scale-[1.02] dark:hover:bg-orange-950/30 dark:hover:border-orange-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-200 ${
                          isSelected
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : optionKey}
                      </span>
                      <span className="text-base leading-relaxed">{option.replace(/^[A-D]\.\s*/, '')}</span>
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
                    className="w-full pl-10 pr-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-xl focus:border-orange-400 dark:focus:border-orange-500 focus:outline-none text-lg bg-white dark:bg-card input-focus"
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

        {/* Keyboard shortcuts hint (desktop only) */}
        <div className="hidden sm:flex items-center justify-center gap-4 text-xs text-muted-foreground mt-1">
          <span className="flex items-center gap-1"><Keyboard className="w-3 h-3" /> Phím tắt:</span>
          <span className="flex items-center gap-1"><span className="kbd-hint">1-4</span> Chọn đáp án</span>
          <span className="flex items-center gap-1"><span className="kbd-hint">←→</span> Chuyển câu</span>
          <span className="flex items-center gap-1"><span className="kbd-hint">Enter</span> Câu tiếp</span>
        </div>

      {/* Question navigation with answered indicators */}
      <div className="flex items-center gap-1.5 flex-wrap justify-center overflow-x-auto max-w-[60%]">
        {questions.map((_, idx) => {
          const isAnswered = !!answers[questions[idx].id]
          return (
            <button
              key={idx}
              onClick={() => {
                playClickSound()
                setCurrentQuestion(idx)
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 relative focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-1 btn-ripple ${
                idx === currentQuestion
                  ? 'bg-orange-100 border-2 border-orange-500 text-orange-700 shadow-md dark:bg-orange-900/40 dark:border-orange-500 dark:text-orange-300'
                  : isAnswered
                    ? 'bg-green-100 border-2 border-green-400 text-green-700 dark:bg-green-900/40 dark:border-green-600 dark:text-green-300'
                    : 'bg-gray-50 border-2 border-gray-200 text-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {isAnswered && idx !== currentQuestion ? '✓' : idx + 1}
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
            className="gap-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shrink-0 animate-submit-gradient shadow-lg hover:shadow-xl"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Đang nộp...' : 'Nộp bài'}
          </Button>
        )}
      </div>
    </div>
  )
}
