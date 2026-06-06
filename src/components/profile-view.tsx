'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Edit3,
  Award,
  Trophy,
  BarChart3,
  Home,
  Crown,
  Star,
  Clock,
  BookOpen,
  X,
  Loader2,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { evaluateBadges, type Badge, type QuizResultForBadge } from '@/lib/badges'

/* ===== Avatar Options ===== */
const avatarOptions = [
  { emoji: '🦊', name: 'Cáo' },
  { emoji: '🐱', name: 'Mèo' },
  { emoji: '🐰', name: 'Thỏ' },
  { emoji: '🐻', name: 'Gấu' },
  { emoji: '🦁', name: 'Sư tử' },
  { emoji: '🐼', name: 'Gấu trúc' },
  { emoji: '🦄', name: 'Kỳ lân' },
  { emoji: '🐸', name: 'Ếch' },
  { emoji: '🦉', name: 'Cú mèo' },
  { emoji: '🐳', name: 'Cá voi' },
  { emoji: '🦋', name: 'Bướm' },
  { emoji: '🐲', name: 'Rồng' },
]

/* ===== Interfaces ===== */
interface ProgressResult {
  id: string
  studentName: string
  className: string
  schoolName: string
  quizId: string
  score: number
  totalPoints: number
  timeTaken: number | null
  createdAt: string
  quiz: {
    title: string
    subject: string
    grade: number
    chapter: string
    chapterName: string
  }
}

interface XPData {
  totalXP: number
  level: number
  levelName: string
  levelEmoji: string
  xpInCurrentLevel: number
  xpForNextLevel: number
  quizCount: number
  averageScore: number
  currentStreak: number
}

/* ===== Helper Functions ===== */
function getScoreColor(score: number): string {
  if (score >= 9) return 'text-amber-600 dark:text-amber-400'
  if (score >= 7) return 'text-emerald-600 dark:text-emerald-400'
  if (score >= 5) return 'text-orange-600 dark:text-orange-400'
  return 'text-rose-600 dark:text-rose-400'
}

function getScoreBg(score: number): string {
  if (score >= 9) return 'bg-amber-100 dark:bg-amber-900/30 ring-amber-300 dark:ring-amber-700 text-amber-700 dark:text-amber-300'
  if (score >= 7) return 'bg-emerald-100 dark:bg-emerald-900/30 ring-emerald-200 dark:ring-emerald-700 text-emerald-700 dark:text-emerald-300'
  if (score >= 5) return 'bg-orange-100 dark:bg-orange-900/30 ring-orange-200 dark:ring-orange-700 text-orange-700 dark:text-orange-300'
  return 'bg-rose-100 dark:bg-rose-900/30 ring-rose-200 dark:ring-rose-700 text-rose-700 dark:text-rose-300'
}

function getScoreEmoji(score: number): string {
  if (score >= 9) return '🌟'
  if (score >= 7) return '⭐'
  if (score >= 5) return '👍'
  return '💪'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}p ${secs}s`
}

/* ===== Main Component ===== */
export function ProfileView() {
  const { studentInfo, setView } = useAppStore()
  const [selectedAvatar, setSelectedAvatar] = useState<string>('🐱')
  const [showEditForm, setShowEditForm] = useState(false)
  const [editName, setEditName] = useState('')
  const [editClassName, setEditClassName] = useState('')
  const [editSchoolName, setEditSchoolName] = useState('')
  const [results, setResults] = useState<ProgressResult[]>([])
  const [xpData, setXpData] = useState<XPData | null>(null)
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  // Load avatar from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('cogiaohaianh-avatar')
    if (saved) setSelectedAvatar(saved)
  }, [])

  // Load student info for edit form
  useEffect(() => {
    if (studentInfo) {
      setEditName(studentInfo.name)
      setEditClassName(studentInfo.className)
      setEditSchoolName(studentInfo.schoolName)
    }
  }, [studentInfo])

  // Fetch progress and XP data
  const fetchData = useCallback(async () => {
    if (!studentInfo?.name || !studentInfo?.className) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Fetch progress
      const progressRes = await fetch(
        `/api/progress?studentName=${encodeURIComponent(studentInfo.name)}&className=${encodeURIComponent(studentInfo.className)}`
      )
      if (progressRes.ok) {
        const progressData = await progressRes.json()
        setResults(progressData)
      }

      // Fetch XP
      const xpRes = await fetch(
        `/api/xp?studentName=${encodeURIComponent(studentInfo.name)}&className=${encodeURIComponent(studentInfo.className)}`
      )
      if (xpRes.ok) {
        const xp = await xpRes.json()
        setXpData({
          totalXP: xp.totalXP,
          level: xp.level,
          levelName: xp.levelName,
          levelEmoji: xp.levelEmoji,
          xpInCurrentLevel: xp.xpInCurrentLevel,
          xpForNextLevel: xp.xpForNextLevel,
          quizCount: xp.quizCount,
          averageScore: xp.averageScore,
          currentStreak: xp.currentStreak,
        })
      }
    } catch (err) {
      console.error('Failed to fetch profile data:', err)
    } finally {
      setLoading(false)
    }
  }, [studentInfo])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Evaluate badges
  useEffect(() => {
    if (results.length > 0) {
      const badgeResults: QuizResultForBadge[] = results.map((r) => ({
        id: r.id,
        score: r.score,
        subject: r.quiz?.subject || '',
        grade: r.quiz?.grade || 0,
        quizTitle: r.quiz?.title || '',
        timeTaken: r.timeTaken,
        createdAt: r.createdAt,
      }))
      const evaluated = evaluateBadges(badgeResults, studentInfo)
      setBadges(evaluated)
    }
  }, [results, studentInfo])

  // Calculate stats
  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        toanAvg: 0,
        toanCount: 0,
        nguVanAvg: 0,
        nguVanCount: 0,
      }
    }

    const totalQuizzes = results.length
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalQuizzes
    const bestScore = Math.max(...results.map((r) => r.score))

    const toanResults = results.filter((r) => r.quiz?.subject === 'toan')
    const nguVanResults = results.filter((r) => r.quiz?.subject === 'ngu-van')

    return {
      totalQuizzes,
      averageScore,
      bestScore,
      toanAvg: toanResults.length > 0 ? toanResults.reduce((s, r) => s + r.score, 0) / toanResults.length : 0,
      toanCount: toanResults.length,
      nguVanAvg: nguVanResults.length > 0 ? nguVanResults.reduce((s, r) => s + r.score, 0) / nguVanResults.length : 0,
      nguVanCount: nguVanResults.length,
    }
  }, [results])

  // Recent results (last 5)
  const recentResults = useMemo(() => {
    return [...results].reverse().slice(0, 5)
  }, [results])

  // Earned badges
  const earnedBadges = useMemo(() => badges.filter((b) => b.earned), [badges])

  // Handle avatar selection
  const handleAvatarSelect = (emoji: string) => {
    setSelectedAvatar(emoji)
    localStorage.setItem('cogiaohaianh-avatar', emoji)
  }

  // Handle save profile
  const handleSaveProfile = () => {
    if (!editName.trim() || !editClassName.trim()) return
    useAppStore.setState({
      studentInfo: {
        name: editName.trim(),
        className: editClassName.trim(),
        schoolName: editSchoolName.trim(),
      },
    })
    setShowEditForm(false)
    // Re-fetch data with new info
    setTimeout(() => fetchData(), 300)
  }

  // No student info state
  if (!studentInfo?.name) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-6 text-center relative overflow-hidden"
        >
          <div className="absolute top-2 left-3 text-2xl opacity-20 animate-bounce">👤</div>
          <div className="absolute bottom-2 right-3 text-2xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
          <User className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-orange-800 dark:text-orange-200">
            Hồ Sơ Cá Nhân 👤
          </h2>
          <p className="text-orange-600 dark:text-orange-400 text-sm mt-1">Quản lý thông tin và xem thành tích của bạn 🌟</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-card rounded-2xl p-8 shadow-sm border dark:border-border text-center"
        >
          <p className="text-5xl mb-4">📝</p>
          <p className="text-foreground font-semibold text-lg mb-2">
            Bạn chưa nhập thông tin!
          </p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
            Hãy làm bài kiểm tra và nhập thông tin để xem hồ sơ cá nhân nhé! 🌱
          </p>
          <Button
            onClick={() => setView('home')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER SECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border-2 border-orange-200 dark:border-orange-800 p-6 sm:p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-2 right-4 text-3xl animate-sparkle opacity-30">✨</div>
        <div className="absolute bottom-2 left-4 text-2xl animate-sparkle opacity-30" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="absolute top-4 left-1/4 text-lg animate-float opacity-20">☁️</div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Avatar display */}
          <div className="relative">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-5xl sm:text-6xl bg-white dark:bg-card shadow-lg ring-4 ring-orange-300 dark:ring-orange-700 transition-all`}>
              {selectedAvatar}
            </div>
            {/* Level badge */}
            {xpData && (
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-amber-600 dark:to-orange-700 text-white rounded-full px-2 py-0.5 text-xs font-bold shadow-md flex items-center gap-1">
                <span>{xpData.levelEmoji}</span>
                <span>Lv.{xpData.level}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-orange-900 dark:text-orange-100 flex items-center gap-2 justify-center sm:justify-start">
              {studentInfo.name}
              <button
                onClick={() => setShowEditForm(true)}
                className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-200 hover:bg-orange-300 dark:hover:bg-orange-700 transition-colors"
                aria-label="Chỉnh sửa hồ sơ"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </h2>
            <div className="flex items-center gap-3 mt-1 justify-center sm:justify-start text-sm text-orange-700 dark:text-orange-300">
              <span className="flex items-center gap-1">
                🏫 Lớp {studentInfo.className}
              </span>
              {studentInfo.schoolName && (
                <>
                  <span className="text-orange-400">•</span>
                  <span className="flex items-center gap-1">
                    📚 {studentInfo.schoolName}
                  </span>
                </>
              )}
            </div>
            {xpData && (
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <Star className="w-3 h-3" />
                  {xpData.levelName}
                </span>
                <span className="inline-flex items-center gap-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <Sparkles className="w-3 h-3" />
                  {xpData.totalXP} XP
                </span>
              </div>
            )}
            {/* XP Progress bar */}
            {xpData && (
              <div className="mt-3 max-w-xs mx-auto sm:mx-0">
                <div className="flex items-center justify-between text-[10px] text-orange-600 dark:text-orange-400 mb-1">
                  <span>{xpData.xpInCurrentLevel} / {xpData.xpForNextLevel} XP</span>
                  <span>Lv.{xpData.level} → Lv.{xpData.level + 1}</span>
                </div>
                <div className="h-2 bg-orange-200 dark:bg-orange-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(xpData.xpInCurrentLevel / xpData.xpForNextLevel) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-500 dark:to-amber-500 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== AVATAR SELECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
      >
        <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground mb-3 flex items-center gap-2">
          🎨 Chọn Avatar
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {avatarOptions.map((avatar) => (
            <motion.button
              key={avatar.emoji}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAvatarSelect(avatar.emoji)}
              className={`relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all cursor-pointer ${
                selectedAvatar === avatar.emoji
                  ? 'bg-orange-100 dark:bg-orange-900/30 ring-2 ring-orange-400 dark:ring-orange-500 shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800/30 hover:bg-orange-50 dark:hover:bg-orange-900/20'
              }`}
            >
              {/* Glow ring for selected */}
              {selectedAvatar === avatar.emoji && (
                <motion.div
                  layoutId="avatar-glow"
                  className="absolute -inset-1 rounded-xl ring-2 ring-orange-300 dark:ring-orange-600 opacity-60"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <span className="text-3xl relative z-10">{avatar.emoji}</span>
              <span className="text-[10px] font-medium text-muted-foreground relative z-10">{avatar.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ===== STATS SUMMARY CARDS ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          Thống Kê Học Tập 📊
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">📝</div>
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats.totalQuizzes}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Bài đã làm</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">📈</div>
            <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
              {stats.averageScore > 0 ? stats.averageScore.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Điểm TB</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">🌟</div>
            <p className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>
              {stats.bestScore > 0 ? stats.bestScore.toFixed(1) : '—'}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Điểm cao nhất</p>
          </div>
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200 dark:border-teal-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">
              {xpData?.totalXP ?? '—'}
            </p>
            <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Tổng XP</p>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200 dark:border-rose-800 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{xpData?.levelEmoji ?? '🌱'}</div>
            <p className="text-2xl font-bold text-rose-700 dark:text-rose-300">
              {xpData?.level ?? '—'}
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Cấp hiện tại</p>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="rounded-xl p-4 text-center border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 relative overflow-hidden">
            <div className="absolute top-1 right-1 text-lg opacity-20">🔢</div>
            <p className="text-xl mb-0.5">🔢</p>
            <p className="font-bold text-foreground">Toán</p>
            <p className="text-sm text-muted-foreground">{stats.toanCount} bài</p>
            {stats.toanCount > 0 ? (
              <p className={`text-lg font-bold mt-0.5 ${getScoreColor(stats.toanAvg)}`}>
                {stats.toanAvg.toFixed(1)} TB
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">Chưa có bài</p>
            )}
          </div>
          <div className="rounded-xl p-4 text-center border bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800 relative overflow-hidden">
            <div className="absolute top-1 right-1 text-lg opacity-20">📖</div>
            <p className="text-xl mb-0.5">📖</p>
            <p className="font-bold text-foreground">Ngữ văn</p>
            <p className="text-sm text-muted-foreground">{stats.nguVanCount} bài</p>
            {stats.nguVanCount > 0 ? (
              <p className={`text-lg font-bold mt-0.5 ${getScoreColor(stats.nguVanAvg)}`}>
                {stats.nguVanAvg.toFixed(1)} TB
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5">Chưa có bài</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ===== RECENT ACTIVITY ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
      >
        <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          Hoạt Động Gần Đây 🕐
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-8 gap-2">
            <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
            <span className="text-muted-foreground">Đang tải...</span>
          </div>
        ) : recentResults.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-3xl mb-2">📝</p>
            <p className="text-sm">Chưa có bài làm nào. Hãy thử ngay!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {recentResults.map((result, idx) => {
              const subjectLabel = result.quiz?.subject === 'toan' ? 'Toán' : 'Ngữ văn'
              const subjectIcon = result.quiz?.subject === 'toan' ? '🔢' : '📖'

              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className={`rounded-xl p-3 border transition-all hover:shadow-md ${
                    result.score >= 9
                      ? 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-200 dark:border-amber-800'
                      : result.score >= 7
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800'
                        : result.score >= 5
                          ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-orange-200 dark:border-orange-800'
                          : 'bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`shrink-0 w-12 h-12 rounded-full ring-2 flex items-center justify-center ${getScoreBg(result.score)}`}>
                      <span className="font-bold text-sm">{result.score.toFixed(1)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {result.quiz?.title || 'Bài kiểm tra'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-white/80 dark:bg-white/10 px-1.5 py-0.5 rounded-full font-medium">
                          {subjectIcon} {subjectLabel}
                        </span>
                        {result.quiz?.grade && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-white/80 dark:bg-white/10 px-1.5 py-0.5 rounded-full font-medium">
                            🏫 Lớp {result.quiz.grade}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                        <span>{formatDate(result.createdAt)}</span>
                        {result.timeTaken && (
                          <span>⏱️ {formatTime(result.timeTaken)}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xl shrink-0">{getScoreEmoji(result.score)}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* ===== BADGES EARNED ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            Huy Hiệu Đạt Được 🏅
          </h3>
          <Button
            onClick={() => setView('badges')}
            variant="ghost"
            size="sm"
            className="text-orange-600 dark:text-orange-400 text-xs gap-1"
          >
            Xem tất cả
            <ChevronRight className="w-3 h-3" />
          </Button>
        </div>

        {earnedBadges.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-3xl mb-2">🏅</p>
            <p className="text-sm">Chưa đạt huy hiệu nào. Làm bài kiểm tra để kiếm huy hiệu nhé!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-full px-3 py-1.5 shadow-sm"
              >
                <span className="text-lg">{badge.emoji}</span>
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ===== QUICK ACTIONS ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
      >
        <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground mb-4 flex items-center gap-2">
          ⚡ Truy Cập Nhanh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('home')}
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Làm bài kiểm tra</p>
              <p className="text-[10px] text-muted-foreground">Chọn lớp và làm bài</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('leaderboard')}
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center text-white shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Xem bảng xếp hạng</p>
              <p className="text-[10px] text-muted-foreground">So sánh với bạn bè</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('progress')}
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 hover:shadow-md transition-shadow cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Xem tiến độ</p>
              <p className="text-[10px] text-muted-foreground">Theo dõi học tập</p>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* ===== EDIT PROFILE MODAL ===== */}
      <AnimatePresence>
        {showEditForm && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
              onClick={() => setShowEditForm(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-card rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
                {/* Decorative top gradient */}
                <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 dark:from-amber-800 dark:via-orange-900 dark:to-amber-800 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                        {selectedAvatar}
                      </div>
                      <div>
                        <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-white">
                          Chỉnh Sửa Hồ Sơ ✏️
                        </h3>
                        <p className="text-white/70 text-xs">Cập nhật thông tin của bạn</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditForm(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      aria-label="Đóng"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      👤 Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      🏫 Tên lớp <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={editClassName}
                      onChange={(e) => setEditClassName(e.target.value)}
                      placeholder="VD: 1A, 2B..."
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      📚 Tên trường
                    </label>
                    <Input
                      value={editSchoolName}
                      onChange={(e) => setEditSchoolName(e.target.value)}
                      placeholder="VD: Tiểu học ABC..."
                      className="text-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => setShowEditForm(false)}
                      variant="outline"
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={!editName.trim() || !editClassName.trim()}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Lưu thay đổi
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
