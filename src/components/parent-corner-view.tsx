'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Users,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  BarChart3,
  Star,
  Lightbulb,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'

interface ProgressOverview {
  totalQuizzes: number
  averageScore: number
  bestScore: number
  weakestSubject: string
  strongestSubject: string
  improvementTrend: 'up' | 'down' | 'stable'
}

interface WeeklyReportItem {
  date: string
  quizCount: number
  averageScore: number
  subjects: string[]
}

interface ParentTip {
  id: number
  title: string
  content: string
  icon: string
}

interface SubjectBreakdown {
  toan: { avgScore: number; quizCount: number; trend: 'up' | 'down' | 'stable' }
  nguVan: { avgScore: number; quizCount: number; trend: 'up' | 'down' | 'stable' }
}

interface ParentCornerData {
  progressOverview: ProgressOverview | null
  aiRecommendation: string | null
  weeklyReport: WeeklyReportItem[]
  parentTips: ParentTip[]
  subjectBreakdown: SubjectBreakdown | null
}

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

function getTrendIcon(trend: 'up' | 'down' | 'stable') {
  if (trend === 'up') return <TrendingUp className="w-5 h-5 text-emerald-500" />
  if (trend === 'down') return <TrendingDown className="w-5 h-5 text-rose-500" />
  return <Minus className="w-5 h-5 text-amber-500" />
}

function getTrendLabel(trend: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') return 'Đang tiến bộ'
  if (trend === 'down') return 'Cần cố gắng'
  return 'Ổn định'
}

function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
  if (trend === 'down') return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30'
  return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
  return `${days[date.getDay()]} ${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}`
}

function TipCard({ tip, isOpen, onToggle }: { tip: ParentTip; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      layout
      className="rounded-xl border-2 border-teal-100 dark:border-teal-900/50 bg-white dark:bg-card overflow-hidden hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400"
      >
        <span className="text-2xl shrink-0">{tip.icon}</span>
        <span className="flex-1 font-semibold text-foreground text-sm">{tip.title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-teal-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <div className="border-t border-teal-100 dark:border-teal-900/50 pt-3">
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.content}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function ParentCornerView() {
  const [studentName, setStudentName] = useState('')
  const [className, setClassName] = useState('')
  const [data, setData] = useState<ParentCornerData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [displayClass, setDisplayClass] = useState('')
  const [expandedTips, setExpandedTips] = useState<Set<number>>(new Set())
  const [loadingAI, setLoadingAI] = useState(false)

  const handleSearch = async () => {
    if (!studentName.trim() || !className.trim()) return

    setLoading(true)
    setSearched(true)
    setLoadingAI(true)
    try {
      const params = new URLSearchParams()
      params.set('studentName', studentName.trim())
      params.set('className', className.trim())

      const res = await fetch(`/api/parent-corner?${params.toString()}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)
        setDisplayName(studentName.trim())
        setDisplayClass(className.trim())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      // AI loading finishes when data arrives
      setTimeout(() => setLoadingAI(false), 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const toggleTip = (id: number) => {
    setExpandedTips((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const hasResults = data?.progressOverview !== null

  // Find the best day in weekly report
  const bestDay = useMemo(() => {
    if (!data?.weeklyReport) return null
    const activeDays = data.weeklyReport.filter((d) => d.quizCount > 0)
    if (activeDays.length === 0) return null
    return activeDays.reduce((best, d) => d.averageScore > best.averageScore ? d : best, activeDays[0])
  }, [data?.weeklyReport])

  return (
    <div className="space-y-6">
      {/* Header - Warm emerald/teal theme */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/30 dark:via-emerald-950/30 dark:to-cyan-950/30 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-5 sm:p-6 text-center relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-3 left-4 text-2xl opacity-20 animate-float">👨‍👩‍👧</div>
        <div className="absolute bottom-3 right-4 text-2xl opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>📚</div>
        <div className="absolute top-2 right-16 text-lg opacity-15 animate-sparkle" style={{ animationDelay: '1s' }}>✨</div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Users className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          <Heart className="w-5 h-5 text-rose-400" />
        </div>
        <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-teal-800 dark:text-teal-200">
          Góc Phụ Huynh 🧑‍🤝‍🧑
        </h2>
        <p className="text-teal-600 dark:text-teal-400 text-sm mt-1 max-w-md mx-auto">
          Theo dõi tiến độ học tập và nhận lời khuyên từ Cô Giáo Hải Anh
        </p>
        {/* Branding */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/60 dark:bg-white/10 rounded-full px-3 py-1 text-xs font-medium text-teal-700 dark:text-teal-300">
          <span>💌</span>
          <span>Gửi từ Cô Giáo Hải Anh</span>
        </div>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border-2 border-teal-100 dark:border-teal-900/50"
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-teal-500" />
          Tìm thông tin học sinh 🔍
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Nhập tên và lớp của con để xem tiến độ học tập và nhận lời khuyên
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Họ và tên học sinh <span className="text-red-500">*</span>
            </label>
            <Input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập họ và tên con..."
              className="text-sm border-teal-200 dark:border-teal-800 focus-visible:ring-teal-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Tên lớp <span className="text-red-500">*</span>
            </label>
            <Input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="VD: 1A, 2B..."
              className="text-sm border-teal-200 dark:border-teal-800 focus-visible:ring-teal-400"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={loading || !studentName.trim() || !className.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Đang tìm...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1" />
                  Xem tiến độ
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-3">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
          <span className="text-muted-foreground text-lg">Đang phân tích dữ liệu học tập...</span>
        </div>
      )}

      {/* No results state */}
      {!loading && searched && !hasResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center"
        >
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-amber-800 dark:text-amber-200 font-semibold text-lg mb-1">
            Chưa có dữ liệu học tập
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-sm max-w-md mx-auto">
            Chưa có bài làm nào cho học sinh <strong>{displayName}</strong> lớp <strong>{displayClass}</strong>.
            Hãy khuyến khích con làm bài kiểm tra để theo dõi tiến độ nhé! 📝
          </p>
        </motion.div>
      )}

      {/* Results content */}
      {!loading && hasResults && data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Student name banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-teal-100 to-emerald-100 dark:from-teal-950/30 dark:to-emerald-950/30 rounded-2xl p-4 text-center border border-teal-200 dark:border-teal-800"
          >
            <p className="text-teal-700 dark:text-teal-300 text-sm font-medium">Tiến độ học tập của</p>
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-teal-800 dark:text-teal-200 mt-1">
              {displayName} 🌱
            </h3>
            <p className="text-teal-600 dark:text-teal-400 text-sm">Lớp {displayClass}</p>
          </motion.div>

          {/* Progress Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">📝</div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{data.progressOverview!.totalQuizzes}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Bài đã làm</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">📊</div>
              <p className={`text-2xl font-bold ${getScoreColor(data.progressOverview!.averageScore)}`}>
                {data.progressOverview!.averageScore.toFixed(1)}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Điểm TB</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-2 border-rose-200 dark:border-rose-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">🌟</div>
              <p className={`text-2xl font-bold ${getScoreColor(data.progressOverview!.bestScore)}`}>
                {data.progressOverview!.bestScore.toFixed(1)}
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Điểm cao nhất</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl p-4 text-center border-2 ${getTrendColor(data.progressOverview!.improvementTrend)}`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {getTrendIcon(data.progressOverview!.improvementTrend)}
              </div>
              <p className={`text-sm font-bold ${data.progressOverview!.improvementTrend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : data.progressOverview!.improvementTrend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {getTrendLabel(data.progressOverview!.improvementTrend)}
              </p>
              <p className="text-xs text-muted-foreground font-medium">Xu hướng</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">💪</div>
              <p className="text-sm font-bold text-teal-700 dark:text-teal-300">{data.progressOverview!.strongestSubject}</p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Môn mạnh nhất</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">📚</div>
              <p className="text-sm font-bold text-orange-700 dark:text-orange-300">{data.progressOverview!.weakestSubject}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Cần cải thiện</p>
            </motion.div>
          </div>

          {/* AI Recommendation Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="relative overflow-hidden rounded-2xl border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/30 dark:via-emerald-950/30 dark:to-cyan-950/30 shadow-md"
          >
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-teal-200/40 dark:from-teal-800/30 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-emerald-200/40 dark:from-emerald-800/30 to-transparent rounded-tr-full" />

            <div className="relative p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-teal-800 dark:text-teal-200">
                    Lời khuyên từ Cô Giáo Hải Anh
                  </h3>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400">Phân tích AI cá nhân hóa</p>
                </div>
              </div>

              {loadingAI ? (
                <div className="flex items-center gap-3 py-4">
                  <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                  <span className="text-teal-600 dark:text-teal-400 text-sm">Đang phân tích kết quả học tập...</span>
                </div>
              ) : data.aiRecommendation ? (
                <div className="bg-white/60 dark:bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-5">
                  <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-line text-sm">
                    {data.aiRecommendation}
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 font-medium">
                    <span>💌</span>
                    <span>Gửi từ Cô Giáo Hải Anh</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Chưa có lời khuyên
                </div>
              )}
            </div>
          </motion.div>

          {/* Subject Breakdown */}
          {data.subjectBreakdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border-2 border-teal-100 dark:border-teal-900/50"
            >
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-teal-700 dark:text-teal-300 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Theo môn học 📚
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Toán */}
                <div className="rounded-xl p-5 border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-lg opacity-20">🔢</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔢</span>
                    <h4 className="font-bold text-foreground">Toán</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Điểm trung bình</span>
                      <span className={`font-bold text-lg ${getScoreColor(data.subjectBreakdown.toan.avgScore)}`}>
                        {data.subjectBreakdown.toan.avgScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Số bài đã làm</span>
                      <span className="font-semibold text-foreground">{data.subjectBreakdown.toan.quizCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Xu hướng</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(data.subjectBreakdown.toan.trend)}
                        <span className={`text-sm font-medium ${data.subjectBreakdown.toan.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : data.subjectBreakdown.toan.trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {getTrendLabel(data.subjectBreakdown.toan.trend)}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(data.subjectBreakdown.toan.avgScore * 10, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Ngữ văn */}
                <div className="rounded-xl p-5 border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-lg opacity-20">📖</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">📖</span>
                    <h4 className="font-bold text-foreground">Ngữ văn</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Điểm trung bình</span>
                      <span className={`font-bold text-lg ${getScoreColor(data.subjectBreakdown.nguVan.avgScore)}`}>
                        {data.subjectBreakdown.nguVan.avgScore.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Số bài đã làm</span>
                      <span className="font-semibold text-foreground">{data.subjectBreakdown.nguVan.quizCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Xu hướng</span>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(data.subjectBreakdown.nguVan.trend)}
                        <span className={`text-sm font-medium ${data.subjectBreakdown.nguVan.trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : data.subjectBreakdown.nguVan.trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                          {getTrendLabel(data.subjectBreakdown.nguVan.trend)}
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-2.5 bg-pink-100 dark:bg-pink-900/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(data.subjectBreakdown.nguVan.avgScore * 10, 100)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.7 }}
                        className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Weekly Report */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border-2 border-teal-100 dark:border-teal-900/50"
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-teal-700 dark:text-teal-300 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Báo cáo 7 ngày qua 📅
            </h3>

            <div className="space-y-2">
              {data.weeklyReport.map((day, idx) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx + 0.6 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    day.quizCount > 0
                      ? 'bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 border border-teal-200 dark:border-teal-800'
                      : 'bg-gray-50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-800'
                  }`}
                >
                  {/* Date */}
                  <div className="w-16 sm:w-20 shrink-0 text-center">
                    <p className={`text-xs font-semibold ${day.quizCount > 0 ? 'text-teal-700 dark:text-teal-300' : 'text-muted-foreground'}`}>
                      {formatDate(day.date)}
                    </p>
                  </div>

                  {/* Activity indicator */}
                  <div className="w-8 shrink-0 flex items-center justify-center">
                    {day.quizCount > 0 ? (
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse-soft" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {day.quizCount > 0 ? (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">
                          {day.quizCount} bài
                        </span>
                        {day.averageScore > 0 && (
                          <span className={`text-sm font-bold ${getScoreColor(day.averageScore)}`}>
                            TB: {day.averageScore.toFixed(1)}
                          </span>
                        )}
                        {day.subjects.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({day.subjects.join(', ')})
                          </span>
                        )}
                        {bestDay && day.date === bestDay.date && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-semibold">
                            <Star className="w-3 h-3" fill="currentColor" />
                            Ngày tốt nhất
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Chưa có hoạt động</span>
                    )}
                  </div>

                  {/* Score bar mini */}
                  {day.quizCount > 0 && day.averageScore > 0 && (
                    <div className="w-16 sm:w-24 shrink-0 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          day.averageScore >= 9 ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                          day.averageScore >= 7 ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                          day.averageScore >= 5 ? 'bg-gradient-to-r from-orange-400 to-amber-400' :
                          'bg-gradient-to-r from-rose-400 to-pink-400'
                        }`}
                        style={{ width: `${Math.min(day.averageScore * 10, 100)}%` }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            {data.weeklyReport.some((d) => d.quizCount > 0) && (
              <div className="mt-3 pt-3 border-t border-teal-100 dark:border-teal-900/50 text-xs text-muted-foreground text-center">
                {(() => {
                  const activeDays = data.weeklyReport.filter((d) => d.quizCount > 0).length
                  const totalQuizzes = data.weeklyReport.reduce((s, d) => s + d.quizCount, 0)
                  return `Con đã học ${activeDays}/${data.weeklyReport.length} ngày, hoàn thành ${totalQuizzes} bài kiểm tra trong tuần qua`
                })()}
              </div>
            )}
          </motion.div>

          {/* Parent Tips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border-2 border-teal-100 dark:border-teal-900/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center shadow-sm">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-teal-700 dark:text-teal-300">
                Mẹo giúp con học tốt 💡
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Những lời khuyên hữu ích từ Cô Giáo Hải Anh dành cho ba mẹ
            </p>
            <div className="space-y-2">
              {data.parentTips.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  isOpen={expandedTips.has(tip.id)}
                  onToggle={() => toggleTip(tip.id)}
                />
              ))}
            </div>
          </motion.div>

          {/* Branding footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-center py-4"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200 dark:border-teal-800 rounded-full px-4 py-2">
              <span className="text-lg">💌</span>
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">
                Gửi từ Cô Giáo Hải Anh
              </span>
              <span className="text-lg">🌿</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cùng đồng hành cùng con trên hành trình học tập 🌱
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Initial state - before any search */}
      {!loading && !searched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-8 text-center"
        >
          <p className="text-5xl mb-3">👨‍👩‍👧‍👦</p>
          <p className="text-teal-800 dark:text-teal-200 font-semibold text-lg mb-1">
            Theo dõi việc học của con!
          </p>
          <p className="text-teal-600 dark:text-teal-400 text-sm max-w-md mx-auto">
            Nhập họ tên và tên lớp của con để xem tiến độ học tập, nhận lời khuyên cá nhân hóa từ Cô Giáo Hải Anh và những mẹo hữu ích giúp con học tốt hơn 🌟
          </p>
          <div className="flex justify-center gap-3 mt-4 text-2xl">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              📊
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              💡
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              🌱
            </motion.span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
