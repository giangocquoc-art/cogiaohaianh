'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Award, Lock, ArrowLeft, Home, Trophy, Star, Sparkles, Target, Flame, BookOpen, TrendingUp } from 'lucide-react'
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

const badgeColors: Record<string, { bg: string; border: string; glow: string; text: string; darkBg: string; darkBorder: string; darkText: string; progressGradient: string }> = {
  'math-expert': { bg: 'from-amber-100 to-yellow-100', border: 'border-amber-300', glow: 'shadow-amber-200/50', text: 'text-amber-700', darkBg: 'dark:from-amber-950/40 dark:to-yellow-950/40', darkBorder: 'dark:border-amber-700', darkText: 'dark:text-amber-300', progressGradient: 'from-amber-400 via-yellow-400 to-amber-500' },
  'little-writer': { bg: 'from-pink-100 to-rose-100', border: 'border-pink-300', glow: 'shadow-pink-200/50', text: 'text-pink-700', darkBg: 'dark:from-pink-950/40 dark:to-rose-950/40', darkBorder: 'dark:border-pink-700', darkText: 'dark:text-pink-300', progressGradient: 'from-pink-400 via-rose-400 to-pink-500' },
  'daily-challenge': { bg: 'from-orange-100 to-red-100', border: 'border-orange-300', glow: 'shadow-orange-200/50', text: 'text-orange-700', darkBg: 'dark:from-orange-950/40 dark:to-red-950/40', darkBorder: 'dark:border-orange-700', darkText: 'dark:text-orange-300', progressGradient: 'from-orange-400 via-red-400 to-orange-500' },
  'speed-demon': { bg: 'from-yellow-100 to-amber-100', border: 'border-yellow-300', glow: 'shadow-yellow-200/50', text: 'text-yellow-700', darkBg: 'dark:from-yellow-950/40 dark:to-amber-950/40', darkBorder: 'dark:border-yellow-700', darkText: 'dark:text-yellow-300', progressGradient: 'from-yellow-400 via-amber-400 to-yellow-500' },
  'perfect-score': { bg: 'from-emerald-100 to-teal-100', border: 'border-emerald-300', glow: 'shadow-emerald-200/50', text: 'text-emerald-700', darkBg: 'dark:from-emerald-950/40 dark:to-teal-950/40', darkBorder: 'dark:border-emerald-700', darkText: 'dark:text-emerald-300', progressGradient: 'from-emerald-400 via-teal-400 to-emerald-500' },
  'excellent-student': { bg: 'from-amber-200 to-orange-100', border: 'border-amber-400', glow: 'shadow-amber-300/50', text: 'text-amber-800', darkBg: 'dark:from-amber-950/40 dark:to-orange-950/40', darkBorder: 'dark:border-amber-700', darkText: 'dark:text-amber-300', progressGradient: 'from-amber-500 via-orange-400 to-amber-500' },
  'versatile': { bg: 'from-teal-100 to-cyan-100', border: 'border-teal-300', glow: 'shadow-teal-200/50', text: 'text-teal-700', darkBg: 'dark:from-teal-950/40 dark:to-cyan-950/40', darkBorder: 'dark:border-teal-700', darkText: 'dark:text-teal-300', progressGradient: 'from-teal-400 via-cyan-400 to-teal-500' },
  'hard-worker': { bg: 'from-orange-100 to-amber-100', border: 'border-orange-300', glow: 'shadow-orange-200/50', text: 'text-orange-700', darkBg: 'dark:from-orange-950/40 dark:to-amber-950/40', darkBorder: 'dark:border-orange-700', darkText: 'dark:text-orange-300', progressGradient: 'from-orange-400 via-amber-400 to-orange-500' },
  'never-give-up': { bg: 'from-rose-100 to-pink-100', border: 'border-rose-300', glow: 'shadow-rose-200/50', text: 'text-rose-700', darkBg: 'dark:from-rose-950/40 dark:to-pink-950/40', darkBorder: 'dark:border-rose-700', darkText: 'dark:text-rose-300', progressGradient: 'from-rose-400 via-pink-400 to-rose-500' },
  'improvement': { bg: 'from-emerald-100 to-green-100', border: 'border-emerald-300', glow: 'shadow-emerald-200/50', text: 'text-emerald-700', darkBg: 'dark:from-emerald-950/40 dark:to-green-950/40', darkBorder: 'dark:border-emerald-700', darkText: 'dark:text-emerald-300', progressGradient: 'from-emerald-400 via-green-400 to-emerald-500' },
  'first-quiz': { bg: 'from-amber-100 to-orange-100', border: 'border-amber-300', glow: 'shadow-amber-200/50', text: 'text-amber-700', darkBg: 'dark:from-amber-950/40 dark:to-orange-950/40', darkBorder: 'dark:border-amber-700', darkText: 'dark:text-amber-300', progressGradient: 'from-amber-400 via-orange-400 to-amber-500' },
  'new-student': { bg: 'from-teal-100 to-emerald-100', border: 'border-teal-300', glow: 'shadow-teal-200/50', text: 'text-teal-700', darkBg: 'dark:from-teal-950/40 dark:to-emerald-950/40', darkBorder: 'dark:border-teal-700', darkText: 'dark:text-teal-300', progressGradient: 'from-teal-400 via-emerald-400 to-teal-500' },
}

// Category definitions for grouping
const badgeCategories = [
  {
    id: 'quiz',
    title: 'Kiểm tra',
    emoji: '📝',
    icon: BookOpen,
    description: 'Huy hiệu liên quan đến bài kiểm tra',
    badgeIds: ['math-expert', 'little-writer', 'perfect-score', 'first-quiz'],
  },
  {
    id: 'challenge',
    title: 'Thử thách',
    emoji: '🔥',
    icon: Flame,
    description: 'Huy hiệu từ thử thách và nỗ lực',
    badgeIds: ['daily-challenge', 'speed-demon', 'never-give-up', 'hard-worker'],
  },
  {
    id: 'progress',
    title: 'Tiến bộ',
    emoji: '📈',
    icon: TrendingUp,
    description: 'Huy hiệu về sự phát triển',
    badgeIds: ['excellent-student', 'versatile', 'improvement', 'new-student'],
  },
]

// Progress detail generator per badge
function getProgressDetail(badge: Badge, results: QuizResultForBadge[]): string {
  if (badge.earned) return 'Đã đạt ✓'
  
  switch (badge.id) {
    case 'math-expert': {
      const count = results.filter(r => r.subject === 'toan' && r.score >= 9).length
      return `${count}/3 bài kiểm tra Toán ≥9`
    }
    case 'little-writer': {
      const count = results.filter(r => r.subject === 'ngu-van' && r.score >= 9).length
      return `${count}/3 bài Ngữ văn ≥9`
    }
    case 'daily-challenge': {
      const completed = typeof window !== 'undefined' && localStorage.getItem('dailyChallengeCompleted') === 'true'
      return completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'
    }
    case 'speed-demon': {
      const fastest = results.filter(r => r.timeTaken !== null).length > 0
        ? Math.min(...results.filter(r => r.timeTaken !== null).map(r => r.timeTaken!))
        : null
      return fastest !== null ? `Nhanh nhất: ${Math.floor(fastest / 60)}p (cần <5p)` : 'Chưa có dữ liệu'
    }
    case 'perfect-score': {
      const maxScore = results.length > 0 ? Math.max(...results.map(r => r.score)) : 0
      return `Cao nhất: ${maxScore.toFixed(1)} (cần 10)`
    }
    case 'excellent-student': {
      const count = results.length
      return `${Math.min(count, 5)}/5 bài (cần TB≥8.0)`
    }
    case 'versatile': {
      const hasMath = results.some(r => r.subject === 'toan')
      const hasVan = results.some(r => r.subject === 'ngu-van')
      return `${hasMath ? '✓' : '✗'} Toán · ${hasVan ? '✓' : '✗'} Ngữ văn`
    }
    case 'hard-worker': {
      return `${results.length}/10 bài làm`
    }
    case 'never-give-up': {
      const lowCount = results.filter(r => r.score < 5).length
      return `${lowCount}/3 bài dưới 5 điểm`
    }
    case 'improvement': {
      return results.length < 2 ? 'Cần ít nhất 2 bài' : 'Cần cải thiện 2+ điểm'
    }
    case 'first-quiz': {
      return results.length >= 1 ? 'Đã đạt' : '0/1 bài làm'
    }
    case 'new-student': {
      return 'Nhập thông tin cá nhân'
    }
    default:
      return `${badge.progress}%`
  }
}

export function BadgesView() {
  const { studentInfo, goBack, goHome } = useAppStore()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<QuizResultForBadge[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('all')

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
      <div className="space-y-6">
        <div className="skeleton-card p-8">
          <div className="skeleton-card-inner items-center">
            <div className="skeleton-circle w-24 h-24 mx-auto" />
            <div className="skeleton-line h-8 w-48 mx-auto" />
            <div className="skeleton-line h-4 w-64 mx-auto" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-card-inner items-center text-center">
                <div className="skeleton-circle w-14 h-14 mx-auto" />
                <div className="skeleton-line h-5 w-24 mx-auto" />
                <div className="skeleton-line h-3 w-32 mx-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const earnedBadges = badges.filter(b => b.earned)
  const totalBadges = badges.length
  const earnedCount = earnedBadges.length

  // Filter badges by active category
  const filteredBadges = activeCategory === 'all'
    ? badges
    : badges.filter(b => {
        const cat = badgeCategories.find(c => c.badgeIds.includes(b.id))
        return cat?.id === activeCategory
      })

  return (
    <div className="space-y-6">
      {/* Header summary card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-rose-950/30 p-6 sm:p-8 shadow-lg border-2 border-amber-200 dark:border-amber-800"
      >
        {/* Decorative elements - increased opacity for dark mode */}
        <div className="absolute top-3 right-6 text-3xl animate-sparkle opacity-60 dark:opacity-50">✨</div>
        <div className="absolute bottom-4 left-8 text-2xl animate-float opacity-50 dark:opacity-40" style={{ animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute top-1/2 right-12 text-xl animate-sparkle opacity-40 dark:opacity-45" style={{ animationDelay: '1s' }}>⭐</div>

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
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-card rounded-full px-2.5 py-1 shadow-md border-2 border-amber-300 dark:border-amber-700">
              <span className="font-[family-name:var(--font-patrick-hand)] text-lg text-amber-700 dark:text-amber-300 font-bold">
                {earnedCount}/{totalBadges}
              </span>
            </div>
          </motion.div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-amber-800 dark:text-amber-200 mb-2">
              Huy Hiệu Thành Tích 🏅
            </h1>
            <p className="text-amber-700 dark:text-amber-300 text-sm sm:text-base mb-3">
              {earnedCount === 0
                ? 'Hoàn thành bài kiểm tra để mở khóa huy hiệu!'
                : earnedCount < 5
                  ? `Bạn đã mở ${earnedCount} huy hiệu. Tiếp tục cố gắng nhé!`
                  : earnedCount < 10
                    ? `Tuyệt vời! ${earnedCount} huy hiệu đã mở khóa!`
                    : `Xuất sắc! ${earnedCount} huy hiệu — bạn là học sinh ngoan! 🌟`}
            </p>

            {/* Progress bar with gradient and percentage label */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-white/50 dark:bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-full relative overflow-hidden"
                >
                  {/* Animated shimmer overlay */}
                  <div className="absolute inset-0 animate-shimmer-enhanced" />
                </motion.div>
              </div>
              <span className="text-amber-700 dark:text-amber-300 font-bold text-sm">
                {Math.round((earnedCount / totalBadges) * 100)}%
              </span>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start">
              <div className="flex items-center gap-1.5 text-sm">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-amber-700 dark:text-amber-300 font-semibold">{results.length} bài làm</span>
              </div>
              {results.length > 0 && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-700 dark:text-amber-300 font-semibold">
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
          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center"
        >
          <p className="text-amber-700 dark:text-amber-300 text-sm">
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

      {/* Category filter tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex-shrink-0 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
            activeCategory === 'all'
              ? 'bg-white dark:bg-card shadow-md text-orange-700 dark:text-orange-300'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Award className="w-4 h-4" />
          Tất cả
        </button>
        {badgeCategories.map((cat) => {
          const IconComp = cat.icon
          const catEarned = badges.filter(b => cat.badgeIds.includes(b.id) && b.earned).length
          const catTotal = cat.badgeIds.length
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-white dark:bg-card shadow-md text-orange-700 dark:text-orange-300'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <IconComp className="w-4 h-4" />
              {cat.emoji} {cat.title}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                catEarned === catTotal
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}>
                {catEarned}/{catTotal}
              </span>
            </button>
          )
        })}
      </div>

      {/* Category description */}
      {activeCategory !== 'all' && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-muted-foreground dark:text-gray-400 text-center"
        >
          {badgeCategories.find(c => c.id === activeCategory)?.description}
        </motion.p>
      )}

      {/* Badges Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {filteredBadges.map((badge) => {
          const colors = badgeColors[badge.id] || { bg: 'from-gray-100 to-gray-200', border: 'border-gray-300', glow: 'shadow-gray-200/50', text: 'text-gray-700', darkBg: 'dark:from-gray-800/40 dark:to-gray-900/40', darkBorder: 'dark:border-gray-600', darkText: 'dark:text-gray-300', progressGradient: 'from-orange-300 to-amber-400' }
          const isEarned = badge.earned
          const progressDetail = getProgressDetail(badge, results)

          return (
            <motion.div
              key={badge.id}
              variants={badgeItem}
              whileHover={isEarned ? { scale: 1.05, y: -4 } : { scale: 1.02 }}
              className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all overflow-hidden shadow-sm hover:shadow-md ${
                isEarned
                  ? `bg-gradient-to-br ${colors.bg} ${colors.darkBg} ${colors.border} ${colors.darkBorder} shadow-lg ${colors.glow}`
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 opacity-80 hover:opacity-90'
              }`}
            >
              {/* Glow effect for earned badges */}
              {isEarned && (
                <div className="absolute inset-0 animate-shimmer-enhanced pointer-events-none" />
              )}

              {/* Dark mode subtle glow for earned */}
              {isEarned && (
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-400/10 dark:from-amber-400/20 dark:to-orange-400/20 blur-sm -z-10" />
              )}

              {/* Badge emoji */}
              <div className="text-center mb-3">
                <motion.div
                  className={`text-4xl sm:text-5xl ${isEarned ? '' : 'grayscale opacity-50'}`}
                  animate={isEarned ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {isEarned ? badge.emoji : <Lock className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500" />}
                </motion.div>
              </div>

              {/* Badge info */}
              <div className="text-center">
                <h3 className={`font-[family-name:var(--font-patrick-hand)] text-lg sm:text-xl mb-1 ${
                  isEarned ? `${colors.text} ${colors.darkText}` : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {badge.name}
                </h3>
                <p className={`text-xs leading-relaxed ${
                  isEarned ? 'text-foreground/70 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {badge.description}
                </p>
              </div>

              {/* Progress bar - for locked badges */}
              {!isEarned && (
                <div className="mt-3">
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors.progressGradient} rounded-full transition-all duration-500 relative overflow-hidden`}
                      style={{ width: `${badge.progress}%` }}
                    >
                      {/* Animated shimmer on progress bar */}
                      <div className="absolute inset-0 animate-shimmer-enhanced" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate max-w-[60%]">
                      {progressDetail}
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                      {badge.progress}%
                    </p>
                  </div>
                </div>
              )}

              {/* Earned indicator */}
              {isEarned && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">Đã đạt</span>
                  {badge.earnedDate && (
                    <span className="text-[9px] text-amber-500/70 dark:text-amber-400/60">
                      · {new Date(badge.earnedDate).toLocaleDateString('vi-VN')}
                    </span>
                  )}
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
          className="gap-2 dark:border-amber-800 dark:text-amber-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Button
          onClick={goHome}
          variant="outline"
          className="gap-2 dark:border-amber-800 dark:text-amber-300"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Button>
      </div>
    </div>
  )
}
