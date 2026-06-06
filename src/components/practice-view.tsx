'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Star, ChevronRight, Home, RotateCcw, CheckCircle2, XCircle,
  ArrowRight, Trophy, Flame, BookOpen, Sparkles, Eye, EyeOff
} from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { playCorrectSound, playWrongSound, playClickSound, playCompleteSound } from '@/lib/sounds'
import { triggerXPGain } from '@/components/xp-widget'

// Types
interface PracticeQuestion {
  id: string
  questionText: string
  questionType: string
  options: string
  correctAnswer: string
  points: number
  subject: string
  grade: number
  chapterName: string
  explanation: string
}

type Phase = 'setup' | 'practice' | 'results'

const gradeEmojis = ['🌸', '🍊', '🌻', '🌿', '🐬']
const gradeColors = [
  { bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-300 dark:border-rose-700', text: 'text-rose-700 dark:text-rose-300', hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/40', accent: 'bg-rose-500', gradient: 'from-rose-400 to-pink-500' },
  { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/40', accent: 'bg-orange-500', gradient: 'from-orange-400 to-amber-500' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-300', hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40', accent: 'bg-amber-500', gradient: 'from-amber-400 to-yellow-500' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-300', hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40', accent: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-500' },
  { bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-300', hover: 'hover:bg-teal-100 dark:hover:bg-teal-900/40', accent: 'bg-teal-500', gradient: 'from-teal-400 to-cyan-500' },
]

const streakMessages = [
  { min: 0, messages: ['Cố lên! 💪', 'Tiếp tục nào! 🌟', 'Bạn làm được! 🎯'] },
  { min: 2, messages: ['Tốt lắm! 👏', 'Giỏi quá! 🌈', 'Xuất sắc! ✨'] },
  { min: 4, messages: ['Siêu giỏi! 🔥', 'Không thể dừng! 💫', 'Tuyệt vời! 🏆'] },
  { min: 6, messages: ['Bậc thầy! 👑', 'Vô đối! 🎖️', 'Thần đồng! 🌟'] },
]

function getStreakMessage(streak: number): string {
  const applicable = streakMessages.filter((s) => streak >= s.min)
  const group = applicable[applicable.length - 1]
  return group.messages[Math.floor(Math.random() * group.messages.length)]
}

function parseOptions(optionsStr: string): string[] {
  try {
    return JSON.parse(optionsStr)
  } catch {
    return []
  }
}

// Circular progress component for results
function CircularProgress({ percentage, size = 140, strokeWidth = 10 }: { percentage: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  let color = 'text-emerald-500'
  let strokeColor = '#10b981'
  if (percentage < 40) { color = 'text-rose-500'; strokeColor = '#f43f5e' }
  else if (percentage < 70) { color = 'text-amber-500'; strokeColor = '#f59e0b' }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-orange-100 dark:text-orange-900/30" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={strokeColor} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`font-[family-name:var(--font-patrick-hand)] text-4xl ${color}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.span>
        <span className="text-xs text-muted-foreground">Chính xác</span>
      </div>
    </div>
  )
}

export function PracticeView() {
  const { goHome, setView } = useAppStore()
  const [phase, setPhase] = useState<Phase>('setup')
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [questionCount, setQuestionCount] = useState(5)
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [answers, setAnswers] = useState<Array<{ questionId: string; selected: string; correct: string; isCorrect: boolean }>>([])
  const [streakMessage, setStreakMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showDetailedAnswers, setShowDetailedAnswers] = useState(false)
  const [fillBlankAnswer, setFillBlankAnswer] = useState('')

  // Encouraging message when streak updates
  useEffect(() => {
    if (currentStreak >= 2) {
      setStreakMessage(getStreakMessage(currentStreak))
    }
  }, [currentStreak])

  const startPractice = useCallback(async () => {
    if (!selectedGrade || !selectedSubject) return
    setLoading(true)
    try {
      const res = await fetch(`/api/practice?grade=${selectedGrade}&subject=${selectedSubject}&count=${questionCount}`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data)
        setPhase('practice')
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setCorrectCount(0)
        setCurrentStreak(0)
        setMaxStreak(0)
        setAnswers([])
        setStreakMessage('')
        setFillBlankAnswer('')
      }
    } catch (err) {
      console.error('Failed to load practice questions:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedGrade, selectedSubject, questionCount])

  const handleAnswer = useCallback((answer: string) => {
    if (isAnswered) return
    playClickSound()
    setSelectedAnswer(answer)
  }, [isAnswered])

  const submitAnswer = useCallback(() => {
    if (isAnswered || (!selectedAnswer && !fillBlankAnswer)) return

    const currentQuestion = questions[currentIndex]
    const answer = currentQuestion.questionType === 'fill_blank'
      ? fillBlankAnswer.trim()
      : selectedAnswer!

    const correct = currentQuestion.questionType === 'fill_blank'
      ? answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
      : answer === currentQuestion.correctAnswer

    setIsAnswered(true)
    setIsCorrect(correct)

    if (correct) {
      playCorrectSound()
      setCorrectCount((prev) => prev + 1)
      setCurrentStreak((prev) => {
        const newStreak = prev + 1
        setMaxStreak((max) => Math.max(max, newStreak))
        return newStreak
      })
      // Award XP
      triggerXPGain(5)
    } else {
      playWrongSound()
      setCurrentStreak(0)
    }

    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, selected: answer, correct: currentQuestion.correctAnswer, isCorrect: correct },
    ])
  }, [isAnswered, selectedAnswer, fillBlankAnswer, questions, currentIndex])

  const nextQuestion = useCallback(() => {
    playClickSound()
    if (currentIndex + 1 >= questions.length) {
      // Finish practice
      playCompleteSound()
      setPhase('results')
    } else {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setIsCorrect(false)
      setStreakMessage('')
      setFillBlankAnswer('')
    }
  }, [currentIndex, questions.length])

  const restartPractice = useCallback(() => {
    playClickSound()
    setPhase('setup')
    setSelectedGrade(null)
    setSelectedSubject(null)
    setQuestionCount(5)
    setQuestions([])
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setCorrectCount(0)
    setCurrentStreak(0)
    setMaxStreak(0)
    setAnswers([])
    setShowDetailedAnswers(false)
    setFillBlankAnswer('')
  }, [])

  const sameSettingsRestart = useCallback(async () => {
    playClickSound()
    setLoading(true)
    try {
      const res = await fetch(`/api/practice?grade=${selectedGrade}&subject=${selectedSubject}&count=${questionCount}`)
      if (res.ok) {
        const data = await res.json()
        setQuestions(data)
        setPhase('practice')
        setCurrentIndex(0)
        setSelectedAnswer(null)
        setIsAnswered(false)
        setCorrectCount(0)
        setCurrentStreak(0)
        setMaxStreak(0)
        setAnswers([])
        setStreakMessage('')
        setFillBlankAnswer('')
      }
    } catch (err) {
      console.error('Failed to reload practice questions:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedGrade, selectedSubject, questionCount])

  // ==================== SETUP PHASE ====================
  if (phase === 'setup') {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg mb-4"
            >
              <Zap className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-foreground mb-2">
              Luyện Tập Nhanh ⚡
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Luyện tập từng câu hỏi một, không có áp lực thời gian!
            </p>
          </div>

          {/* Grade Selection */}
          <div className="mb-6">
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-orange-500" />
              Chọn lớp học
            </h3>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
              {[1, 2, 3, 4, 5].map((grade) => {
                const colors = gradeColors[grade - 1]
                const emoji = gradeEmojis[grade - 1]
                const isSelected = selectedGrade === grade
                return (
                  <motion.button
                    key={grade}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playClickSound()
                      setSelectedGrade(grade)
                    }}
                    className={`${colors.bg} ${colors.border} ${isSelected ? 'ring-2 ring-orange-400 dark:ring-orange-500 shadow-lg' : ''} border-2 rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-1.5 transition-all cursor-pointer relative overflow-hidden`}
                  >
                    {isSelected && (
                      <div className="absolute top-1 right-1">
                        <CheckCircle2 className="w-4 h-4 text-orange-500" />
                      </div>
                    )}
                    <span className="text-2xl sm:text-3xl">{emoji}</span>
                    <span className={`font-[family-name:var(--font-patrick-hand)] text-base sm:text-lg ${colors.text}`}>
                      Lớp {grade}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Subject Selection */}
          <div className="mb-6">
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Chọn môn học
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'toan', label: 'Toán', emoji: '🔢', color: 'from-orange-400 to-amber-400', bgSelected: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-400 dark:border-orange-500' },
                { key: 'ngu-van', label: 'Ngữ văn', emoji: '📖', color: 'from-pink-400 to-rose-400', bgSelected: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-400 dark:border-pink-500' },
              ].map((subject) => (
                <motion.button
                  key={subject.key}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    playClickSound()
                    setSelectedSubject(subject.key)
                  }}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedSubject === subject.key
                      ? subject.bgSelected + ' shadow-lg'
                      : 'bg-white dark:bg-card border-gray-200 dark:border-border hover:border-orange-200 dark:hover:border-orange-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-md`}>
                      <span className="text-2xl">{subject.emoji}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
                        {subject.label}
                      </span>
                      {selectedSubject === subject.key && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 text-orange-500 text-xs mt-0.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đã chọn</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Question Count Selector */}
          <div className="mb-8">
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Số câu hỏi
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[5, 8, 10].map((count) => (
                <motion.button
                  key={count}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    playClickSound()
                    setQuestionCount(count)
                  }}
                  className={`p-3 sm:p-4 rounded-xl border-2 font-[family-name:var(--font-patrick-hand)] text-xl transition-all cursor-pointer ${
                    questionCount === count
                      ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white border-orange-400 shadow-lg'
                      : 'bg-white dark:bg-card border-gray-200 dark:border-border text-foreground hover:border-orange-300 dark:hover:border-orange-700'
                  }`}
                >
                  {count} câu
                </motion.button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={startPractice}
              disabled={!selectedGrade || !selectedSubject || loading}
              className="w-full h-14 text-lg font-[family-name:var(--font-patrick-hand)] bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Bắt đầu luyện tập
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // ==================== PRACTICE PHASE ====================
  if (phase === 'practice' && questions.length > 0) {
    const currentQuestion = questions[currentIndex]
    const options = parseOptions(currentQuestion.options)
    const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100
    const xpEarned = correctCount * 5

    return (
      <div className="max-w-2xl mx-auto relative">
        {/* Sticky Score Counter */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-2 z-40 flex items-center justify-between bg-white/90 dark:bg-[#1a1208]/90 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-lg border border-orange-100 dark:border-orange-900/30 mb-4"
        >
          <div className="flex items-center gap-3">
            {/* Score badge */}
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full px-3 py-1.5">
              <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
              <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">{correctCount}/{currentIndex + (isAnswered ? 1 : 0)}</span>
            </div>

            {/* XP earned */}
            <div className="flex items-center gap-1 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-full px-3 py-1.5">
              <span className="text-sm">⭐</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">+{xpEarned} XP</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Streak counter */}
            {currentStreak >= 2 && (
              <motion.div
                key={currentStreak}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full px-3 py-1.5"
              >
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-orange-600 dark:text-orange-400 text-sm">{currentStreak}</span>
                <span className="text-orange-500 text-xs">🔥</span>
              </motion.div>
            )}

            {/* Progress text */}
            <span className="text-muted-foreground text-sm font-medium">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 via-yellow-400 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Streak message */}
        <AnimatePresence>
          {streakMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="text-center mb-4"
            >
              <span className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-4 py-2 rounded-full font-[family-name:var(--font-patrick-hand)] text-amber-700 dark:text-amber-300 text-lg shadow-sm">
                {streakMessage}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Card */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          {/* Gradient border wrapper */}
          <div className="rounded-3xl p-[3px] bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 dark:from-orange-700 dark:via-amber-700 dark:to-yellow-700 shadow-lg">
            <div className="bg-white dark:bg-[#1a1208] rounded-3xl p-5 sm:p-7">
              {/* Question type badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                  {currentQuestion.questionType === 'fill_blank' ? '✏️ Điền đáp án' : '📌 Trắc nghiệm'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentQuestion.chapterName}
                </span>
              </div>

              {/* Question text */}
              <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground leading-relaxed mb-6">
                {currentQuestion.questionText}
              </h2>

              {/* Multiple choice options */}
              {currentQuestion.questionType === 'multiple_choice' && (
                <div className="space-y-3">
                  {options.map((option, idx) => {
                    const optionKey = String.fromCharCode(65 + idx) // A, B, C, D
                    const isSelected = selectedAnswer === optionKey
                    const showCorrect = isAnswered && optionKey === currentQuestion.correctAnswer
                    const showWrong = isAnswered && isSelected && !isCorrect && optionKey === selectedAnswer

                    return (
                      <motion.button
                        key={idx}
                        whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                        onClick={() => handleAnswer(optionKey)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                          showCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-500 shadow-md animate-[correctPulse_0.5s_ease-in-out]'
                            : showWrong
                            ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-500 shadow-md animate-[wrongShake_0.4s_ease-in-out]'
                            : isSelected && !isAnswered
                            ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-400 dark:border-orange-500 shadow-md'
                            : 'bg-white dark:bg-card border-gray-200 dark:border-border hover:border-orange-300 dark:hover:border-orange-700'
                        } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        {/* Option letter circle */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm transition-all ${
                          showCorrect
                            ? 'bg-emerald-500 text-white'
                            : showWrong
                            ? 'bg-rose-500 text-white'
                            : isSelected && !isAnswered
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {showCorrect ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : showWrong ? (
                            <XCircle className="w-5 h-5" />
                          ) : (
                            optionKey
                          )}
                        </div>

                        {/* Option text */}
                        <span className={`text-sm sm:text-base ${
                          showCorrect
                            ? 'text-emerald-700 dark:text-emerald-300 font-semibold'
                            : showWrong
                            ? 'text-rose-700 dark:text-rose-300 font-semibold'
                            : 'text-foreground'
                        }`}>
                          {option.replace(/^[A-D][.)\s]+/, '')}
                        </span>

                        {/* Correct/Wrong indicator */}
                        {showCorrect && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-emerald-500 text-sm font-semibold"
                          >
                            ✓ Đúng
                          </motion.span>
                        )}
                        {showWrong && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-rose-500 text-sm font-semibold"
                          >
                            ✗ Sai
                          </motion.span>
                        )}
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Fill in the blank */}
              {currentQuestion.questionType === 'fill_blank' && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={fillBlankAnswer}
                      onChange={(e) => !isAnswered && setFillBlankAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isAnswered && fillBlankAnswer.trim()) {
                          submitAnswer()
                        }
                      }}
                      disabled={isAnswered}
                      placeholder="Nhập đáp án của bạn..."
                      className={`w-full p-4 rounded-xl border-2 text-lg font-[family-name:var(--font-patrick-hand)] transition-all outline-none ${
                        isAnswered && isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : isAnswered && !isCorrect
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-300'
                          : 'bg-white dark:bg-card border-gray-200 dark:border-border focus:border-orange-400 dark:focus:border-orange-500 text-foreground'
                      } ${isAnswered ? 'cursor-default' : ''}`}
                    />
                    {isAnswered && isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      </motion.div>
                    )}
                    {isAnswered && !isCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        <XCircle className="w-6 h-6 text-rose-500" />
                      </motion.div>
                    )}
                  </div>
                  {isAnswered && !isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                    >
                      <span className="text-emerald-700 dark:text-emerald-300 text-sm">
                        Đáp án đúng: <strong>{currentQuestion.correctAnswer}</strong>
                      </span>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Submit / Next button area */}
              <div className="mt-6 flex justify-end">
                {!isAnswered ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={currentQuestion.questionType === 'multiple_choice' ? !selectedAnswer : !fillBlankAnswer.trim()}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    Kiểm tra
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    {currentIndex + 1 >= questions.length ? 'Xem kết quả' : 'Câu tiếp theo'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Explanation card after answering */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <div className={`p-4 rounded-2xl border-2 ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                }`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg shrink-0">{isCorrect ? '💡' : '📖'}</span>
                    <div>
                      <p className={`font-semibold text-sm mb-1 ${
                        isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
                      }`}>
                        {isCorrect ? 'Chính xác!' : 'Ghi nhớ nhé!'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentQuestion.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Correct answer celebration animation */}
          <AnimatePresence>
            {isAnswered && isCorrect && (
              <motion.div
                initial={{ opacity: 1, scale: 0.5 }}
                animate={{ opacity: 0, scale: 2, y: -30 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-4xl"
              >
                ✅
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )
  }

  // ==================== RESULTS PHASE ====================
  if (phase === 'results') {
    const totalQuestions = questions.length
    const incorrectCount = totalQuestions - correctCount
    const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0
    const totalXP = correctCount * 5

    let resultEmoji = '😊'
    let resultMessage = 'Cố gắng hơn nhé!'
    let resultColor = 'text-amber-600 dark:text-amber-400'
    if (accuracy >= 90) { resultEmoji = '🏆'; resultMessage = 'Xuất sắc! Bạn thật giỏi!'; resultColor = 'text-emerald-600 dark:text-emerald-400' }
    else if (accuracy >= 70) { resultEmoji = '🌟'; resultMessage = 'Tốt lắm! Tiếp tục phát huy!'; resultColor = 'text-emerald-600 dark:text-emerald-400' }
    else if (accuracy >= 50) { resultEmoji = '👍'; resultMessage = 'Khá tốt! Luyện tập thêm nhé!'; resultColor = 'text-amber-600 dark:text-amber-400' }
    else if (accuracy >= 30) { resultEmoji = '💪'; resultMessage = 'Cố gắng hơn nhé!'; resultColor = 'text-orange-600 dark:text-orange-400' }
    else { resultEmoji = '📚'; resultMessage = 'Hãy ôn lại bài nhé!'; resultColor = 'text-rose-600 dark:text-rose-400' }

    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 150 }}
        >
          {/* Results Card */}
          <div className="bg-white dark:bg-card rounded-3xl shadow-xl border-2 border-orange-100 dark:border-orange-900/30 overflow-hidden">
            {/* Gradient top bar */}
            <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400" />

            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="text-5xl sm:text-6xl inline-block"
                >
                  {resultEmoji}
                </motion.span>
                <h2 className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl mt-3 ${resultColor}`}>
                  {resultMessage}
                </h2>
              </div>

              {/* Circular Progress + Stats */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <CircularProgress percentage={accuracy} />

                <div className="flex-1 grid grid-cols-2 gap-3 w-full sm:w-auto">
                  {/* Correct */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3 text-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">{correctCount}</span>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Đúng</p>
                  </div>

                  {/* Incorrect */}
                  <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-3 text-center">
                    <XCircle className="w-6 h-6 text-rose-500 mx-auto mb-1" />
                    <span className="font-bold text-rose-700 dark:text-rose-300 text-lg">{incorrectCount}</span>
                    <p className="text-xs text-rose-600 dark:text-rose-400">Sai</p>
                  </div>

                  {/* Streak */}
                  <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 text-center">
                    <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                    <span className="font-bold text-orange-700 dark:text-orange-300 text-lg">{maxStreak}</span>
                    <p className="text-xs text-orange-600 dark:text-orange-400">Chuỗi dài nhất</p>
                  </div>

                  {/* XP */}
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 text-center">
                    <Star className="w-6 h-6 text-amber-500 mx-auto mb-1" fill="currentColor" />
                    <span className="font-bold text-amber-700 dark:text-amber-300 text-lg">+{totalXP}</span>
                    <p className="text-xs text-amber-600 dark:text-amber-400">XP</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <Button
                  onClick={sameSettingsRestart}
                  disabled={loading}
                  className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-[family-name:var(--font-patrick-hand)]"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Luyện tập lại
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    playClickSound()
                    goHome()
                  }}
                  variant="outline"
                  className="flex-1 h-12 rounded-xl border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-950/30 font-[family-name:var(--font-patrick-hand)]"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>

              {/* Detailed Answers Section */}
              <div className="border-t border-orange-100 dark:border-orange-900/30 pt-4">
                <button
                  onClick={() => {
                    playClickSound()
                    setShowDetailedAnswers(!showDetailedAnswers)
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors"
                >
                  <span className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Xem đáp án chi tiết
                  </span>
                  {showDetailedAnswers ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                <AnimatePresence>
                  {showDetailedAnswers && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 max-h-96 overflow-y-auto mt-2 pr-1">
                        {questions.map((q, idx) => {
                          const answer = answers[idx]
                          const options = parseOptions(q.options)
                          return (
                            <motion.div
                              key={q.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`p-4 rounded-xl border-2 ${
                                answer?.isCorrect
                                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-sm font-bold text-muted-foreground shrink-0 mt-0.5">
                                  Câu {idx + 1}:
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-foreground mb-1">{q.questionText}</p>

                                  {q.questionType === 'multiple_choice' && options.length > 0 && (
                                    <div className="text-xs space-y-0.5 mb-1">
                                      {options.map((opt, oi) => {
                                        const optKey = String.fromCharCode(65 + oi)
                                        const isCorrectOpt = optKey === q.correctAnswer
                                        const isUserSelected = optKey === answer?.selected
                                        return (
                                          <div
                                            key={oi}
                                            className={`flex items-center gap-1.5 ${
                                              isCorrectOpt ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : isUserSelected && !isCorrectOpt ? 'text-rose-600 dark:text-rose-400 line-through' : 'text-muted-foreground'
                                            }`}
                                          >
                                            {isCorrectOpt ? '✓' : isUserSelected && !isCorrectOpt ? '✗' : '○'}
                                            {opt}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-2 text-xs">
                                    {answer?.isCorrect ? (
                                      <span className="text-emerald-600 dark:text-emerald-400">✓ Đúng</span>
                                    ) : (
                                      <>
                                        <span className="text-rose-600 dark:text-rose-400">✗ Bạn chọn: {answer?.selected}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">| Đáp án: {q.correctAnswer}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Fallback
  return null
}
