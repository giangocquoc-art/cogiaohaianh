'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Award, Lock, ArrowLeft, Home, Trophy, Star, Sparkles } from 'lucide-react'
import { evaluateBadges, saveBadgesToStorage, type Badge, type QuizResultForBadge } from '@/lib/badges'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const badgeItem = {
  hidden: { opacity: 0, scale: 0.5, y: 20 },
  show: { opacity: 1, scale: 1, y: 0 },
}

const badgeColors: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  'math-expert': { bg: 'from-amber-100 to-yellow-100', border: 'border-amber-300', glow: 'shadow-amber-200/50', text: 'text-amber-700' },
  'little-writer': { bg: 'from-pink-100 to-rose-100', border: 'border-pink-300', glow: 'shadow-pink-200/50', text: 'text-pink-700' },
  'daily-challenge': { bg: 'from-orange-100 to-red-100', border: 'border-orange-300', glow: 'shadow-orange-200/50', text: 'text-orange-700' },
  'speed-demon': { bg: 'from-yellow-100 to-amber-100', border: 'border-yellow-300', glow: 'shadow-yellow-200/50', text: 'text-yellow-700' },
  'perfect-score': { bg: 'from-emerald-100 to-teal-100', border: 'border-emerald-300', glow: 'shadow-emerald-200/50', text: 'text-emerald-700' },
  'excellent-student': { bg: 'from-amber-200 to-orange-100', border: 'border-amber-400', glow: 'shadow-amber-300/50', text: 'text-amber-800' },
  'versatile': { bg: 'from-teal-100 to-cyan-100', border: 'border-teal-300', glow: 'shadow-teal-200/50', text: 'text-teal-700' },
  'hard-worker': { bg: 'from-orange-100 to-amber-100', border: 'border-orange-300', glow: 'shadow-orange-200/50', text: 'text-orange-700' },
  'never-give-up': { bg: 'from-rose-100 to-pink-100', border: 'border-rose-300', glow: 'shadow-rose-200/50', text: 'text-rose-700' },
  'improvement': { bg: 'from-emerald-100 to-green-100', border: 'border-emerald-300', glow: 'shadow-emerald-200/50', text: 'text-emerald-700' },
  'first-quiz': { bg: 'from-amber-100 to-orange-100', border: 'border-amber-300', glow: 'shadow-amber-200/50', text: 'text-amber-700' },
  'new-student': { bg: 'from-sky-100 to-cyan-100', border: 'border-sky-300', glow: 'shadow-sky-200/50', text: 'text-sky-700' },
}

export function BadgesView() {
  const { studentInfo, goBack, goHome } = useAppStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<QuizResultForBadge[]>([])

  const fetchAndEvaluate = useCallback(async () => {
    setLoading(true)
    try {
      let quizResults: QuizResultForBadge[] = []

      if (studentInfo?.name && studentInfo?.className) {
        const res = await fetch(`/api/progress?studentName=${encodeURIComponent(studentInfo.name)}&className=${encodeURIComponent(studentInfo.className)}`)
        if (res.ok) {
          const data = await res.json()
          quizResults = data.map((r: { id: string; score: number; quiz: { subject: string; grade: number; title: string }; timeTaken: number | null; createdAt: string }) => ({
            id: r.id,
            score: r.score,
            subject: r.quiz.subject,
            grade: r.quiz.grade,
            quizTitle: r.quiz.title,
            timeTaken: r.timeTaken,
            createdAt: r.createdAt,
          }))
        }
      }

      setResults(quizResults)
      const evaluatedBadges = evaluateBadges(quizResults, studentInfo)
      setBadges(evaluatedBadges)
      saveBadgesToStorage(evaluatedBadges)
    } catch (err) {
      console.error('Failed to evaluate badges:', err)
    } finally {
      setLoading(false)
    }
  }, [studentInfo])

  useEffect(() => {
    fetchAndEvaluate()
  }, [fetchAndEvaluate])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="text-5xl animate-float">🏆</div>
        <p className="text-muted-foreground">Đang tải huy hiệu...</p>
      </div>
    )
  }

  const earnedBadges = badges.filter(b => b.earned)
  const totalBadges = badges.length
  const earnedCount = earnedBadges.length

  return (
    <div className="space-y-6">
      {/* Header summary card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 p-6 sm:p-8 shadow-lg border-2 border-amber-200"
      >
        {/* Decorative elements */}
        <div className="absolute top-3 right-6 text-3xl animate-sparkle opacity-60">✨</div>
        <div className="absolute bottom-4 left-8 text-2xl animate-float opacity-50" style={{ animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute top-1/2 right-12 text-xl animate-sparkle opacity-40" style={{ animationDelay: '1s' }}>⭐</div>

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center shadow-lg">
              <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
            </div>
            {/* Badge count badge */}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2.5 py-1 shadow-md border-2 border-amber-300">
              <span className="font-[family-name:var(--font-patrick-hand)] text-lg text-amber-700 font-bold">
                {earnedCount}/{totalBadges}
              </span>
            </div>
          </motion.div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-amber-800 mb-2">
              Huy Hiệu Thành Tích 🏅
            </h1>
            <p className="text-amber-700 text-sm sm:text-base mb-3">
              {earnedCount === 0
                ? 'Hoàn thành bài kiểm tra để mở khóa huy hiệu!'
                : earnedCount < 5
                  ? `Bạn đã mở ${earnedCount} huy hiệu. Tiếp tục cố gắng nhé!`
                  : earnedCount < 10
                    ? `Tuyệt vời! ${earnedCount} huy hiệu đã mở khóa!`
                    : `Xuất sắc! ${earnedCount} huy hiệu — bạn là học sinh ngoan! 🌟`}
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-white/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full"
                />
              </div>
              <span className="text-amber-700 font-bold text-sm">
                {Math.round((earnedCount / totalBadges) * 100)}%
              </span>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-amber-700 font-semibold">{results.length} bài làm</span>
              </div>
              {results.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-700 font-semibold">
                    TB: {(results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1)} điểm
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* No student info notice */}
      {!studentInfo?.name && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"
        >
          <p className="text-amber-700 text-sm">
            Nhập thông tin học sinh khi làm bài kiểm tra để theo dõi huy hiệu thành tích!
          </p>
          <Button
            onClick={goHome}
            className="mt-3 bg-orange-500 hover:bg-orange-600 text-white gap-2"
          >
            <Home className="w-4 h-4" />
            Bắt đầu làm bài
          </Button>
        </motion.div>
      )}

      {/* Badges Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {badges.map((badge) => {
          const colors = badgeColors[badge.id] || { bg: 'from-gray-100 to-gray-200', border: 'border-gray-300', glow: 'shadow-gray-200/50', text: 'text-gray-700' }
          const isEarned = badge.earned

          return (
            <motion.div
              key={badge.id}
              variants={badgeItem}
              whileHover={isEarned ? { scale: 1.05, y: -4 } : { scale: 1.02 }}
              className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all overflow-hidden ${
                isEarned
                  ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-lg ${colors.glow}`
                  : 'bg-gray-50 border-gray-200 opacity-70'
              }`}
            >
              {/* Glow effect for earned badges */}
              {isEarned && (
                <div className="absolute inset-0 opacity-20 animate-shimmer pointer-events-none" />
              )}

              {/* Badge emoji */}
              <div className="text-center mb-3">
                <motion.div
                  className={`text-4xl sm:text-5xl ${isEarned ? '' : 'grayscale opacity-50'}`}
                  animate={isEarned ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {isEarned ? badge.emoji : <Lock className="w-10 h-10 mx-auto text-gray-400" />}
                </motion.div>
              </div>

              {/* Badge info */}
              <div className="text-center">
                <h3 className={`font-[family-name:var(--font-patrick-hand)] text-lg sm:text-xl mb-1 ${
                  isEarned ? colors.text : 'text-gray-500'
                }`}>
                  {badge.name}
                </h3>
                <p className={`text-xs leading-relaxed ${
                  isEarned ? 'text-foreground/70' : 'text-gray-400'
                }`}>
                  {badge.description}
                </p>
              </div>

              {/* Progress bar */}
              {!isEarned && (
                <div className="mt-3">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-300 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 text-center mt-1">
                    {badge.progress}% hoàn thành
                  </p>
                </div>
              )}

              {/* Earned indicator */}
              {isEarned && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-semibold text-amber-600">Đã đạt</span>
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={goBack}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Button
          onClick={goHome}
          variant="outline"
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Button>
      </div>
    </div>
  )
}
