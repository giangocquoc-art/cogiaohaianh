'use client'

import { motion } from 'framer-motion'
import {
  Search,
  Loader2,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Award,
  Target,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'

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

type TrendType = 'up' | 'down' | 'stable'

function getScoreColor(score: number): string {
  if (score >= 9) return 'text-amber-600'
  if (score >= 7) return 'text-emerald-600'
  if (score >= 5) return 'text-orange-600'
  return 'text-rose-600'
}

function getScoreBg(score: number): string {
  if (score >= 9) return 'bg-amber-100 ring-amber-300 text-amber-700'
  if (score >= 7) return 'bg-emerald-100 ring-emerald-200 text-emerald-700'
  if (score >= 5) return 'bg-orange-100 ring-orange-200 text-orange-700'
  return 'bg-rose-100 ring-rose-200 text-rose-700'
}

function getScoreEmoji(score: number): string {
  if (score >= 9) return '🌟'
  if (score >= 7) return '⭐'
  if (score >= 5) return '👍'
  return '💪'
}

function getScoreBarColor(score: number): string {
  if (score >= 9) return 'bg-amber-400'
  if (score >= 7) return 'bg-emerald-400'
  if (score >= 5) return 'bg-orange-400'
  return 'bg-rose-400'
}

function getScoreBarBg(score: number): string {
  if (score >= 9) return 'bg-amber-100'
  if (score >= 7) return 'bg-emerald-100'
  if (score >= 5) return 'bg-orange-100'
  return 'bg-rose-100'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
  })
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}p ${secs}s`
}

export function ProgressView() {
  const [studentName, setStudentName] = useState('')
  const [className, setClassName] = useState('')
  const [results, setResults] = useState<ProgressResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [displayClass, setDisplayClass] = useState('')

  const handleSearch = async () => {
    if (!studentName.trim() || !className.trim()) return

    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      params.set('studentName', studentName.trim())
      params.set('className', className.trim())

      const res = await fetch(`/api/progress?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
        setDisplayName(studentName.trim())
        setDisplayClass(className.trim())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate summary stats
  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        trend: 'stable' as TrendType,
        toanAvg: 0,
        toanCount: 0,
        nguVanAvg: 0,
        nguVanCount: 0,
      }
    }

    const totalQuizzes = results.length
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalQuizzes
    const bestScore = Math.max(...results.map((r) => r.score))

    // Calculate improvement trend (compare second half avg vs first half avg)
    let trend: TrendType = 'stable'
    if (results.length >= 2) {
      const mid = Math.floor(results.length / 2)
      const firstHalfAvg = results.slice(0, mid).reduce((s, r) => s + r.score, 0) / mid
      const secondHalf = results.slice(mid)
      const secondHalfAvg = secondHalf.reduce((s, r) => s + r.score, 0) / secondHalf.length
      const diff = secondHalfAvg - firstHalfAvg
      if (diff > 0.5) trend = 'up'
      else if (diff < -0.5) trend = 'down'
      else trend = 'stable'
    }

    // Subject breakdown
    const toanResults = results.filter((r) => r.quiz?.subject === 'toan')
    const nguVanResults = results.filter((r) => r.quiz?.subject === 'ngu-van')

    const toanAvg = toanResults.length > 0
      ? toanResults.reduce((s, r) => s + r.score, 0) / toanResults.length
      : 0
    const nguVanAvg = nguVanResults.length > 0
      ? nguVanResults.reduce((s, r) => s + r.score, 0) / nguVanResults.length
      : 0

    return {
      totalQuizzes,
      averageScore,
      bestScore,
      trend,
      toanAvg,
      toanCount: toanResults.length,
      nguVanAvg,
      nguVanCount: nguVanResults.length,
    }
  }, [results])

  // Recent results (last 5)
  const recentResults = useMemo(() => {
    return [...results].reverse().slice(0, 5)
  }, [results])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-2 left-3 text-2xl opacity-20 animate-bounce">📊</div>
        <div className="absolute bottom-2 right-3 text-2xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>📈</div>

        <BarChart3 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <h2 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-emerald-800">
          Tiến Độ Học Tập 📊
        </h2>
        <p className="text-emerald-600 text-sm mt-1">Xem quá trình học tập và phát triển của bạn 🌱</p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
      >
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Search className="w-4 h-4" />
          Tìm kiếm tiến độ 🔍
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập họ và tên..."
              className="text-sm"
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
              className="text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={loading || !studentName.trim() || !className.trim()}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  Đang tìm...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1" />
                  Tìm kiếm 🔎
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-2">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <span className="text-muted-foreground text-lg">Đang tải dữ liệu...</span>
        </div>
      )}

      {/* No results state */}
      {!loading && searched && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-8 text-center"
        >
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-amber-800 font-semibold text-lg mb-1">
            Không tìm thấy kết quả
          </p>
          <p className="text-amber-600 text-sm">
            Chưa có bài làm nào cho học sinh <strong>{displayName}</strong> lớp <strong>{displayClass}</strong>.
            Hãy làm bài kiểm tra để xem tiến độ nhé! 📝
          </p>
        </motion.div>
      )}

      {/* Results content */}
      {!loading && results.length > 0 && (
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
            className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-4 text-center border border-emerald-200 dark:border-emerald-800"
          >
            <p className="text-emerald-700 text-sm font-medium">Tiến độ học tập của</p>
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-emerald-800 mt-1">
              {displayName} 🌈
            </h3>
            <p className="text-emerald-600 text-sm">Lớp {displayClass}</p>
          </motion.div>

          {/* Summary Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">📝</div>
              <p className="text-2xl font-bold text-amber-700">{stats.totalQuizzes}</p>
              <p className="text-xs text-amber-600 font-medium">Bài đã làm</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">📈</div>
              <p className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                {stats.averageScore.toFixed(1)}
              </p>
              <p className="text-xs text-emerald-600 font-medium">Điểm TB</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">🌟</div>
              <p className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>
                {stats.bestScore.toFixed(1)}
              </p>
              <p className="text-xs text-orange-600 font-medium">Điểm cao nhất</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`rounded-2xl p-4 text-center border ${
                stats.trend === 'up'
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-200 dark:border-emerald-800'
                  : stats.trend === 'down'
                    ? 'bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border-rose-200 dark:border-rose-800'
                    : 'bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-sky-200 dark:border-sky-800'
              }`}
            >
              <div className="text-2xl mb-1">
                {stats.trend === 'up' ? '🚀' : stats.trend === 'down' ? '📉' : '➡️'}
              </div>
              <div className="flex items-center justify-center gap-1">
                {stats.trend === 'up' ? (
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                ) : stats.trend === 'down' ? (
                  <TrendingDown className="w-5 h-5 text-rose-600" />
                ) : (
                  <Minus className="w-5 h-5 text-sky-600" />
                )}
              </div>
              <p className={`text-xs font-medium ${
                stats.trend === 'up'
                  ? 'text-emerald-600'
                  : stats.trend === 'down'
                    ? 'text-rose-600'
                    : 'text-sky-600'
              }`}>
                {stats.trend === 'up' ? 'Đang tiến bộ' : stats.trend === 'down' ? 'Cần cố gắng' : 'Ổn định'}
              </p>
            </motion.div>
          </div>

          {/* Subject Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Theo môn học 📚
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-center border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 relative overflow-hidden">
                <div className="absolute top-1 right-1 text-lg opacity-20">🔢</div>
                <p className="text-2xl mb-1">🔢</p>
                <p className="font-bold text-foreground">Toán</p>
                <p className="text-sm text-muted-foreground">{stats.toanCount} bài</p>
                {stats.toanCount > 0 ? (
                  <p className={`text-xl font-bold mt-1 ${getScoreColor(stats.toanAvg)}`}>
                    {stats.toanAvg.toFixed(1)} TB
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">Chưa có bài</p>
                )}
              </div>
              <div className="rounded-xl p-4 text-center border bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800 relative overflow-hidden">
                <div className="absolute top-1 right-1 text-lg opacity-20">📖</div>
                <p className="text-2xl mb-1">📖</p>
                <p className="font-bold text-foreground">Ngữ văn</p>
                <p className="text-sm text-muted-foreground">{stats.nguVanCount} bài</p>
                {stats.nguVanCount > 0 ? (
                  <p className={`text-xl font-bold mt-1 ${getScoreColor(stats.nguVanAvg)}`}>
                    {stats.nguVanAvg.toFixed(1)} TB
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">Chưa có bài</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Score Timeline Chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Biểu đồ điểm theo thời gian 📊
            </h3>

            {results.length <= 1 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-3xl mb-2">📊</p>
                <p className="text-sm">Cần ít nhất 2 bài làm để hiển thị biểu đồ</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Y-axis labels + bars */}
                <div className="relative">
                  {/* Scale markers */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-20 sm:w-28 shrink-0" />
                    <div className="flex-1 flex justify-between text-[10px] text-muted-foreground px-1">
                      <span>0</span>
                      <span>2</span>
                      <span>4</span>
                      <span>6</span>
                      <span>8</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {results.map((result, idx) => {
                      const barWidth = Math.max((result.score / 10) * 100, 3)
                      const subjectIcon = result.quiz?.subject === 'toan' ? '🔢' : '📖'
                      const subjectLabel = result.quiz?.subject === 'toan' ? 'Toán' : 'Ngữ văn'

                      return (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * idx, duration: 0.3 }}
                          className="flex items-center gap-2 group"
                        >
                          <div className="w-20 sm:w-28 shrink-0 text-right">
                            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                              {formatShortDate(result.createdAt)}
                            </p>
                            <p className="text-[10px] sm:text-xs font-medium text-foreground truncate">
                              {subjectIcon} {subjectLabel}
                            </p>
                          </div>
                          <div className="flex-1 relative">
                            <div className={`h-7 rounded-lg ${getScoreBarBg(result.score)} overflow-hidden`}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${barWidth}%` }}
                                transition={{ duration: 0.6, delay: 0.1 * idx, ease: 'easeOut' }}
                                className={`h-full rounded-lg ${getScoreBarColor(result.score)} flex items-center justify-end pr-2 relative`}
                              >
                                <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-sm">
                                  {result.score.toFixed(1)}
                                </span>
                              </motion.div>
                            </div>
                          </div>
                          <div className="w-8 text-right shrink-0">
                            <span className={`text-xs font-bold ${getScoreColor(result.score)}`}>
                              {getScoreEmoji(result.score)}
                            </span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Legend */}
                <div className="mt-3 pt-3 border-t flex flex-wrap gap-3 text-[10px] sm:text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-400 inline-block" /> ≥9 Xuất sắc
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-emerald-400 inline-block" /> ≥7 Giỏi
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-orange-400 inline-block" /> ≥5 Khá
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-rose-400 inline-block" /> &lt;5 Cố gắng
                  </span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Recent Results */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Kết quả gần đây 🎯
            </h3>

            <div className="space-y-3">
              {recentResults.map((result, idx) => {
                const subjectLabel = result.quiz?.subject === 'toan' ? 'Toán' : 'Ngữ văn'
                const subjectIcon = result.quiz?.subject === 'toan' ? '🔢' : '📖'

                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className={`rounded-xl p-4 border-2 transition-all hover:shadow-md ${
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
                      {/* Score badge */}
                      <div className={`shrink-0 w-14 h-14 rounded-full ring-2 flex items-center justify-center ${getScoreBg(result.score)}`}>
                        <span className="font-bold text-lg">{result.score.toFixed(1)}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">
                          {result.quiz?.title || 'Bài kiểm tra'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs bg-white/80 dark:bg-white/10 px-2 py-0.5 rounded-full font-medium">
                            {subjectIcon} {subjectLabel}
                          </span>
                          {result.quiz?.grade && (
                            <span className="inline-flex items-center gap-1 text-xs bg-white/80 dark:bg-white/10 px-2 py-0.5 rounded-full font-medium">
                              🏫 Lớp {result.quiz.grade}
                            </span>
                          )}
                          {result.quiz?.chapterName && (
                            <span className="inline-flex items-center gap-1 text-xs bg-white/80 dark:bg-white/10 px-2 py-0.5 rounded-full font-medium truncate max-w-[150px]">
                              📑 {result.quiz.chapterName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(result.createdAt)}
                          </span>
                          {result.timeTaken && (
                            <span className="flex items-center gap-1">
                              ⏱️ {formatTime(result.timeTaken)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Emoji */}
                      <div className="text-2xl shrink-0">
                        {getScoreEmoji(result.score)}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {results.length > 5 && (
              <p className="text-center text-xs text-muted-foreground mt-3">
                Hiển thị 5 kết quả gần nhất trong tổng số {results.length} bài
              </p>
            )}
          </motion.div>

          {/* Achievement section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl overflow-hidden shadow-md"
          >
            <div className={`${
              stats.averageScore >= 9
                ? 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30'
                : stats.averageScore >= 7
                  ? 'bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30'
                  : stats.averageScore >= 5
                    ? 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30'
                    : 'bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/30'
            } p-6 text-center`}
            >
              <div className="text-3xl mb-2">
                {stats.averageScore >= 9
                  ? '🏆🌟🎉👑'
                  : stats.averageScore >= 7
                    ? '🌟⭐👏🎊'
                    : stats.averageScore >= 5
                      ? '👍✨💪📝'
                      : '💪📚❤️🌱'}
              </div>
              <p className={`font-[family-name:var(--font-patrick-hand)] text-xl ${
                stats.averageScore >= 9
                  ? 'text-amber-800'
                  : stats.averageScore >= 7
                    ? 'text-emerald-800'
                    : stats.averageScore >= 5
                      ? 'text-orange-800'
                      : 'text-rose-800'
              }`}>
                {stats.averageScore >= 9
                  ? 'Bạn thật xuất sắc! Hãy giữ vững phong độ nhé! 🌟'
                  : stats.averageScore >= 7
                    ? 'Bạn học rất tốt! Tiếp tục phát huy nhé! ⭐'
                    : stats.averageScore >= 5
                      ? 'Kết quả khá tốt! Thêm chút cố gắng sẽ giỏi hơn! 💪'
                      : 'Đừng bỏ cuộc! Hãy ôn tập thêm và thử lại nhé! 🌱'}
              </p>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-sm">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">
                    {stats.averageScore >= 8 ? 'Mục tiêu: Giữ vững 💪' : 'Mục tiêu: Đạt 8+ điểm 🎯'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Initial state - before any search */}
      {!loading && !searched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center"
        >
          <p className="text-5xl mb-3">🌱</p>
          <p className="text-emerald-800 font-semibold text-lg mb-1">
            Theo dõi sự tiến bộ của bạn!
          </p>
          <p className="text-emerald-600 text-sm max-w-md mx-auto">
            Nhập họ tên và tên lớp để xem tất cả bài kiểm tra đã làm, điểm số và sự tiến bộ qua từng ngày 📈
          </p>
          <div className="flex justify-center gap-3 mt-4 text-2xl">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              📝
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              📊
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            >
              🌟
            </motion.span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
