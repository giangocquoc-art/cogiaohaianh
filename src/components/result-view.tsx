'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw, Home, ClipboardList, Volume2, VolumeX, Printer, Share2, Award, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useCallback } from 'react'
import { Confetti } from '@/components/confetti'
import { playCorrectSound, playCompleteSound, getSoundMuted, toggleSoundMuted } from '@/lib/sounds'
import { useToast } from '@/hooks/use-toast'
import { evaluateBadges, getNewBadges, saveBadgesToStorage, type Badge, type QuizResultForBadge } from '@/lib/badges'
import { calculateQuizXP, triggerXPGain } from '@/components/xp-widget'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

function XPDisplay({ score }: { score: number }) {
  const [showXP, setShowXP] = useState(false)
  const xpResult = calculateQuizXP(score)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowXP(true)
      // Trigger XP gain event for the widget
      triggerXPGain(xpResult.total)
    }, 1200)
    return () => clearTimeout(timer)
  }, [xpResult.total])

  if (!showXP) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
        <span className="font-[family-name:var(--font-patrick-hand)] text-xl text-amber-800 dark:text-amber-200">
          +{xpResult.total} XP
        </span>
        <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
      </div>
      <div className="flex items-center justify-center gap-3 text-xs text-amber-600 dark:text-amber-400">
        <span>Cơ bản: +{xpResult.breakdown.base}</span>
        {xpResult.breakdown.scoreBonus > 0 && (
          <>
            <span className="text-amber-300">·</span>
            <span>
              {score >= 10 ? 'Hoàn hảo' : score >= 9 ? 'Xuất sắc' : 'Giỏi'}: +{xpResult.breakdown.scoreBonus}
            </span>
          </>
        )}
      </div>

      {/* Floating XP animation */}
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 0, y: -40 }}
        transition={{ duration: 2.5, ease: 'easeOut', delay: 0.5 }}
        className="absolute -top-4 left-1/2 -translate-x-1/2 text-amber-500 font-bold text-lg whitespace-nowrap pointer-events-none"
      >
        +{xpResult.total} XP! ⭐
      </motion.div>
    </motion.div>
  )
}

export function ResultView() {
  const { quizResult, selectedQuizId, goBack, goHome, startQuiz, studentInfo, selectedGrade, selectedSubject } = useAppStore()
  const [quiz, setQuiz] = useState<QuizInfo | null>(null)
  const [showReview, setShowReview] = useState(false)
  const [soundMuted, setSoundMuted] = useState(getSoundMuted)
  const [showCertificate, setShowCertificate] = useState(false)
  const [newBadges, setNewBadges] = useState<Badge[]>([])
  const [showBadgeNotification, setShowBadgeNotification] = useState(false)
  const { toast } = useToast()

  // Play sound when result loads based on score
  useEffect(() => {
    if (!quizResult) return
    const score = quizResult.score
    const timer = setTimeout(() => {
      if (score >= 7) {
        playCompleteSound()
      } else if (score >= 5) {
        playCorrectSound()
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [quizResult])

  const handleToggleSound = () => {
    const newMuted = toggleSoundMuted()
    setSoundMuted(newMuted)
  }

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

  // Check for new badges after quiz result
  useEffect(() => {
    if (!quizResult || !studentInfo) return

    const checkBadges = async () => {
      try {
        // Fetch all results for this student
        const res = await fetch(`/api/progress?studentName=${encodeURIComponent(studentInfo.name)}&className=${encodeURIComponent(studentInfo.className)}`)
        if (!res.ok) return

        const data = await res.json()
        const quizResults: QuizResultForBadge[] = data.map((r: { id: string; score: number; quiz: { subject: string; grade: number; title: string }; timeTaken: number | null; createdAt: string }) => ({
          id: r.id,
          score: r.score,
          subject: r.quiz.subject,
          grade: r.quiz.grade,
          quizTitle: r.quiz.title,
          timeTaken: r.timeTaken,
          createdAt: r.createdAt,
        }))

        // Load previously earned badges from localStorage
        const prevEarnedIds = JSON.parse(localStorage.getItem('earnedBadges') || '[]')
        const prevBadges = evaluateBadges(quizResults.slice(0, -1), studentInfo) // Exclude current result
        prevBadges.forEach(b => {
          if (prevEarnedIds.includes(b.id)) b.earned = true
        })

        // Evaluate current badges including the new result
        const currentBadges = evaluateBadges(quizResults, studentInfo)

        // Find newly earned badges
        const newlyEarned = getNewBadges(prevBadges, currentBadges)

        if (newlyEarned.length > 0) {
          setNewBadges(newlyEarned)
          setShowBadgeNotification(true)
          // Auto-hide after 8 seconds
          setTimeout(() => setShowBadgeNotification(false), 8000)
        }

        // Save current badges
        saveBadgesToStorage(currentBadges)
      } catch (err) {
        console.error('Badge check error:', err)
      }
    }

    checkBadges()
  }, [quizResult, studentInfo])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} phút ${secs} giây`
  }

  const getSubjectName = () => {
    return selectedSubject === 'toan' ? 'Toán' : 'Ngữ văn'
  }

  const getGradeName = () => {
    return selectedGrade ? `Lớp ${selectedGrade}` : ''
  }

  const getCompletionDate = () => {
    return new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getMotivationalMessage = (s: number) => {
    if (s >= 9) return 'Xuất sắc! Bạn đã đạt thành tích rất cao!'
    if (s >= 7) return 'Giỏi lắm! Bạn làm bài rất tốt!'
    if (s >= 5) return 'Khá tốt! Hãy cố gắng thêm nhé!'
    return 'Đừng nản lòng! Hãy ôn tập và thử lại!'
  }

  // Handle print - must be before early return
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Handle share - must be before early return
  const handleShare = useCallback(async () => {
    const qResult = quizResult
    if (!qResult) return

    const score = qResult.score
    const totalQuestions = Object.keys(qResult.answers).length
    let correctCount = 0
    if (quiz) {
      quiz.questions.forEach((q) => {
        const userAnswer = qResult.answers[q.id]?.trim()
        if (userAnswer && userAnswer.toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
          correctCount++
        }
      })
    }

    const getMessageText = (s: number) => {
      if (s >= 9) return 'Xuất sắc!'
      if (s >= 7) return 'Giỏi lắm!'
      if (s >= 5) return 'Khá tốt!'
      return 'Cố gắng hơn nhé!'
    }

    const getMessageEmoji = (s: number) => {
      if (s >= 9) return '🌟'
      if (s >= 7) return '⭐'
      if (s >= 5) return '👍'
      return '💪'
    }

    const shareText = [
      `📝 Kết quả kiểm tra - Cô Giáo Hải Anh`,
      `👤 ${studentInfo?.name || 'Học sinh'} - ${studentInfo?.className || ''}`,
      studentInfo?.schoolName ? `🏫 ${studentInfo.schoolName}` : '',
      `📚 ${quiz?.title || 'Kiểm tra'} (${getSubjectName()})`,
      `⭐ Điểm: ${score.toFixed(1)}/10`,
      `✅ ${correctCount}/${totalQuestions} câu đúng`,
      `${getMessageEmoji(score)} ${getMessageText(score)}`,
      `🔗 cogiaohaianh.io`,
    ].filter(Boolean).join('\n')

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kết quả kiểm tra - Cô Giáo Hải Anh',
          text: shareText,
        })
        return
      } catch {
        // User cancelled or error, fall back to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText)
      toast({
        title: '✅ Đã sao chép kết quả!',
        description: 'Kết quả đã được sao chép vào clipboard',
      })
    } catch {
      toast({
        title: '❌ Không thể sao chép',
        description: 'Vui lòng thử lại',
        variant: 'destructive',
      })
    }
  }, [quizResult, quiz, studentInfo, toast, selectedSubject])

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

  // Get star count for certificate
  const getStarCount = () => {
    if (score >= 9) return 5
    if (score >= 7) return 4
    if (score >= 5) return 3
    if (score >= 3) return 2
    return 1
  }

  return (
    <div className="space-y-6 relative">
      {/* Sound toggle button */}
      <button
        onClick={handleToggleSound}
        className="no-print fixed top-20 right-3 z-50 w-10 h-10 rounded-full bg-white/90 dark:bg-card/90 backdrop-blur-sm shadow-md border border-gray-200 dark:border-border flex items-center justify-center hover:bg-gray-50 dark:hover:bg-card transition-colors"
        title={soundMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
      >
        {soundMuted ? (
          <VolumeX className="w-4 h-4 text-gray-500" />
        ) : (
          <Volume2 className="w-4 h-4 text-orange-500" />
        )}
      </button>
      {/* Confetti for high scores */}
      {score >= 7 && <Confetti score={score} />}

      {/* Interactive result view (hidden in print) */}
      <div className="result-interactive">
        {/* Score card with circular progress */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`${msg.bg} dark:bg-opacity-30 rounded-3xl p-6 sm:p-8 text-center shadow-lg border-2 ${msg.border} dark:border-opacity-30 relative overflow-hidden`}
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
          <div className="flex justify-center mb-6 relative">
            <CircularProgress score={score} />
            {/* New badge indicator near score */}
            {newBadges.length > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                className="absolute -top-2 -right-2 sm:right-4"
              >
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg animate-bounce-in flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {newBadges.length} huy hiệu mới!
                </div>
              </motion.div>
            )}
          </div>

          {/* Badge notification */}
          {showBadgeNotification && newBadges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 2, type: 'spring', stiffness: 150 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-4 mb-4 shadow-md"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">🆕</span>
                <h4 className="font-[family-name:var(--font-patrick-hand)] text-lg text-amber-800 dark:text-amber-200">
                  Huy hiệu mới!
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {newBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white dark:bg-card rounded-xl px-3 py-2 shadow-sm flex items-center gap-2 border border-amber-200 dark:border-amber-800"
                  >
                    <span className="text-xl">{badge.emoji}</span>
                    <div>
                      <span className="font-semibold text-amber-800 dark:text-amber-200 text-sm">{badge.name}</span>
                      <p className="text-amber-600 text-[10px] leading-tight">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const { setView } = useAppStore.getState()
                  setView('badges')
                }}
                className="mt-2 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:text-amber-800 dark:hover:text-amber-200 underline underline-offset-2"
              >
                Xem tất cả huy hiệu →
              </button>
            </motion.div>
          )}

          {/* Correct/Incorrect count - prominent display */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="bg-white dark:bg-card rounded-2xl px-4 py-3 shadow-md flex items-center gap-2"
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
                className="bg-white dark:bg-card rounded-2xl px-4 py-3 shadow-md flex items-center gap-2"
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

          {/* XP Earned Display */}
          <XPDisplay score={score} />

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
          className="no-print flex flex-col sm:flex-row gap-3 justify-center flex-wrap"
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
            onClick={() => setShowCertificate(true)}
            variant="outline"
            className="gap-2 text-base py-3 border-2 border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Award className="w-4 h-4" />
            Xem chứng nhận
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="gap-2 text-base py-3 border-2"
          >
            <Share2 className="w-4 h-4" />
            Chia sẻ
          </Button>
          <Button
            onClick={handlePrint}
            variant="outline"
            className="gap-2 text-base py-3 border-2"
          >
            <Printer className="w-4 h-4" />
            In kết quả
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
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-sm'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 shadow-sm'
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
                                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-semibold border-emerald-300 dark:border-emerald-700'
                                      : isThisUser && !isThisCorrect
                                        ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 line-through border-rose-300 dark:border-rose-700'
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
                                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                                  : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                                : 'text-muted-foreground border-gray-200'
                            }`}>
                              <span className="text-xs">✏️</span>
                              Trả lời của bạn: <span className="font-semibold">{userAnswer || '(chưa trả lời)'}</span>
                            </div>
                            {!isCorrect && (
                              <div className="inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-xl border bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700">
                                <span className="text-xs">✅</span>
                                Đáp án đúng: <span className="font-semibold">{q.correctAnswer}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {!isCorrect && q.questionType === 'multiple_choice' && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
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
              ? 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30'
              : score >= 7
                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30'
                : score >= 5
                  ? 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30'
                  : 'bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30'
          } p-6 text-center`}>
            <div className="text-3xl mb-2">
              {score >= 9 ? '🎉🎊🌟🏆' : score >= 7 ? '🌟⭐👏' : score >= 5 ? '👍✨💪' : '💪📚❤️'}
            </div>
            <p className={`font-semibold ${
              score >= 9 ? 'text-amber-800 dark:text-amber-200' : score >= 7 ? 'text-emerald-800 dark:text-emerald-200' : score >= 5 ? 'text-orange-800 dark:text-orange-200' : 'text-rose-800 dark:text-rose-200'
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

      {/* Print-only report card (hidden on screen, shown in print) */}
      <div className="print-report hidden">
        {/* Header */}
        <div className="print-header text-center">
          <h1 style={{ fontSize: '20pt', fontWeight: 800, marginBottom: '4pt' }}>
            Cô Giáo Hải Anh 📚
          </h1>
          <p style={{ fontSize: '10pt', color: '#666' }}>
            Nền tảng học tập trực tuyến dành cho học sinh tiểu học
          </p>
          <h2 style={{ fontSize: '14pt', fontWeight: 700, marginTop: '10pt' }}>
            PHIẾU KẾT QUẢ KIỂM TRA
          </h2>
        </div>

        {/* Student info */}
        <div className="print-info" style={{ marginTop: '15pt' }}>
          <table style={{ width: '100%', fontSize: '11pt' }}>
            <tbody>
              <tr>
                <td style={{ padding: '3pt 0', width: '30%' }}><strong>Học sinh:</strong></td>
                <td style={{ padding: '3pt 0' }}>{studentInfo?.name || 'N/A'}</td>
                <td style={{ padding: '3pt 0', width: '20%' }}><strong>Lớp:</strong></td>
                <td style={{ padding: '3pt 0' }}>{studentInfo?.className || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3pt 0' }}><strong>Trường:</strong></td>
                <td style={{ padding: '3pt 0' }}>{studentInfo?.schoolName || 'N/A'}</td>
                <td style={{ padding: '3pt 0' }}><strong>Môn:</strong></td>
                <td style={{ padding: '3pt 0' }}>{getSubjectName()}</td>
              </tr>
              <tr>
                <td style={{ padding: '3pt 0' }}><strong>Bài kiểm tra:</strong></td>
                <td style={{ padding: '3pt 0' }} colSpan={3}>{quiz?.title || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '3pt 0' }}><strong>Khối lớp:</strong></td>
                <td style={{ padding: '3pt 0' }}>{getGradeName()}</td>
                <td style={{ padding: '3pt 0' }}><strong>Ngày:</strong></td>
                <td style={{ padding: '3pt 0' }}>{getCompletionDate()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Score section */}
        <div className="print-score-section" style={{ textAlign: 'center', margin: '20pt 0', padding: '15pt', border: '2pt solid #333', borderRadius: '8pt' }}>
          <div className="print-score" style={{ fontSize: '36pt', fontWeight: 800 }}>
            {score.toFixed(1)} / 10
          </div>
          <div style={{ fontSize: '11pt', marginTop: '6pt' }}>
            ✅ {correctCount} câu đúng / {incorrectCount} câu sai / {totalQuestions} câu hỏi
          </div>
          <div style={{ fontSize: '11pt', marginTop: '4pt' }}>
            ⏱️ Thời gian: {quizResult.timeTaken ? formatTime(quizResult.timeTaken) : 'N/A'}
          </div>
          <div style={{ fontSize: '12pt', marginTop: '8pt', fontWeight: 600 }}>
            {msg.emoji} {getMotivationalMessage(score)}
          </div>
        </div>

        {/* Answer review table */}
        {quiz && (
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '8%' }}>Câu</th>
                <th style={{ width: '37%' }}>Câu hỏi</th>
                <th style={{ width: '18%' }}>Trả lời</th>
                <th style={{ width: '18%' }}>Đáp án</th>
                <th style={{ width: '10%', textAlign: 'center' }}>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {[...quiz.questions]
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((q, idx) => {
                  const userAnswer = quizResult.answers[q.id] || ''
                  const isCorrect = userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
                  return (
                    <tr key={q.id}>
                      <td>{idx + 1}</td>
                      <td>{q.questionText}</td>
                      <td>{userAnswer || '(chưa trả lời)'}</td>
                      <td>{q.correctAnswer}</td>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: isCorrect ? '#059669' : '#dc2626' }}>
                        {isCorrect ? '✓' : '✗'}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        )}

        {/* Footer */}
        <div className="print-footer" style={{ textAlign: 'center' }}>
          <p>cogiaohaianh.io · facebook.com/hattieu.tran.1</p>
          <p style={{ marginTop: '4pt', fontSize: '8pt' }}>© {new Date().getFullYear()} Cô Giáo Hải Anh. All rights reserved.</p>
        </div>
      </div>

      {/* Certificate Dialog */}
      <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Chứng nhận kết quả</DialogTitle>
            <DialogDescription className="sr-only">Chứng nhận kết quả kiểm tra của học sinh</DialogDescription>
          </DialogHeader>

          {/* Certificate Card */}
          <div className="print-certificate relative bg-gradient-to-br from-amber-50 via-white to-orange-50 border-4 border-double border-amber-400 rounded-xl p-6 sm:p-10">
            {/* Decorative corners */}
            <div className="absolute top-3 left-3 text-amber-300 text-2xl">❋</div>
            <div className="absolute top-3 right-3 text-amber-300 text-2xl">❋</div>
            <div className="absolute bottom-3 left-3 text-amber-300 text-2xl">❋</div>
            <div className="absolute bottom-3 right-3 text-amber-300 text-2xl">❋</div>

            {/* Decorative top border */}
            <div className="flex justify-center mb-2 gap-2 text-xl">
              {'✿ ❀ ✿ ❀ ✿'.split(' ').map((flower, i) => (
                <span key={i} className="text-amber-400">{flower}</span>
              ))}
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="font-[family-name:var(--font-patrick-hand)] text-lg text-amber-600 mb-1">
                Cô Giáo Hải Anh 📚
              </h2>
              <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-amber-800 font-bold tracking-wide">
                CHỨNG NHẬN KẾT QUẢ
              </h1>
              <div className="flex justify-center mt-2">
                <div className="h-1 w-32 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full" />
              </div>
            </div>

            {/* Student name */}
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm mb-1">Chứng nhận này dành cho</p>
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-orange-700 font-bold">
                {studentInfo?.name || 'Học sinh'}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {studentInfo?.className ? `Lớp ${studentInfo.className}` : ''}
                {studentInfo?.schoolName ? ` · ${studentInfo.schoolName}` : ''}
              </p>
            </div>

            {/* Quiz details */}
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-sm">Đã hoàn thành bài kiểm tra</p>
              <p className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground font-semibold mt-1">
                {quiz?.title || 'Kiểm tra'}
              </p>
              <p className="text-muted-foreground text-sm mt-0.5">
                Môn {getSubjectName()} · {getGradeName()}
              </p>
            </div>

            {/* Score */}
            <div className="text-center mb-6">
              <div className="inline-flex flex-col items-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl px-8 py-5 border-2 border-amber-300 shadow-md">
                <span className="text-sm text-amber-700 font-semibold mb-1">ĐIỂM SỐ</span>
                <span className="font-[family-name:var(--font-patrick-hand)] text-5xl sm:text-6xl text-amber-800 font-bold leading-none">
                  {score.toFixed(1)}
                </span>
                <span className="text-sm text-amber-600 mt-1">trên 10</span>

                {/* Stars */}
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-2xl">
                      {i < getStarCount() ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-emerald-600">{correctCount}/{totalQuestions}</div>
                <div className="text-muted-foreground">Câu đúng</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-rose-600">{incorrectCount}</div>
                <div className="text-muted-foreground">Câu sai</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-foreground">
                  {quizResult.timeTaken ? formatTime(quizResult.timeTaken) : 'N/A'}
                </div>
                <div className="text-muted-foreground">Thời gian</div>
              </div>
            </div>

            {/* Motivational message */}
            <div className="text-center mb-8">
              <p className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
                {msg.emoji} {getMotivationalMessage(score)}
              </p>
            </div>

            {/* Signature area */}
            <div className="flex justify-between items-end mt-8 pt-4 border-t border-amber-200">
              <div className="text-left">
                <p className="text-xs text-muted-foreground">Ngày hoàn thành</p>
                <p className="font-semibold text-sm">{getCompletionDate()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-6">Giáo viên</p>
                <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-orange-700 font-bold">
                  Cô Giáo Hải Anh ✍️
                </p>
              </div>
            </div>

            {/* Decorative bottom border */}
            <div className="flex justify-center mt-4 gap-2 text-xl">
              {'✿ ❀ ✿ ❀ ✿'.split(' ').map((flower, i) => (
                <span key={i} className="text-amber-400">{flower}</span>
              ))}
            </div>
          </div>

          {/* Certificate action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center no-print mt-2">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              In chứng nhận
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Chia sẻ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
