'use client'

import { motion } from 'framer-motion'
import {
  Search,
  Loader2,
  CalendarDays,
  Flame,
  BookOpen,
  TrendingUp,
  ArrowLeft,
  Home,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { useAppStore } from '@/store/app-store'

interface CalendarDay {
  date: string
  completed: boolean
  score: number | null
  quizCount: number
  subjects: string[]
}

interface MonthlySummary {
  month: string
  monthLabel: string
  totalDays: number
  totalQuizzes: number
  avgScore: number | null
}

interface CalendarStats {
  totalStudyDays: number
  currentStreak: number
  longestStreak: number
  totalQuizzes: number
  averageScore: number | null
  bestDay: string | null
}

interface CalendarResponse {
  calendar: CalendarDay[]
  stats: CalendarStats
  monthlySummary: MonthlySummary[]
}

function getCellColor(day: CalendarDay, isDark: boolean): string {
  if (!day.completed) {
    return isDark
      ? 'bg-gray-800/50 hover:bg-gray-700/50'
      : 'bg-gray-100 hover:bg-gray-200'
  }
  if (day.quizCount >= 4) {
    return isDark
      ? 'bg-emerald-700 hover:bg-emerald-600'
      : 'bg-emerald-600 hover:bg-emerald-500'
  }
  if (day.quizCount >= 2) {
    return isDark
      ? 'bg-emerald-600/80 hover:bg-emerald-500/80'
      : 'bg-emerald-400 hover:bg-emerald-300'
  }
  return isDark
    ? 'bg-emerald-500/50 hover:bg-emerald-400/50'
    : 'bg-emerald-200 hover:bg-emerald-100'
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr + 'T00:00:00')
  return date.getDay()
}

function getMonthName(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const months = [
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6',
    'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  ]
  return months[date.getMonth()]
}

function getStreakMessage(streak: number): string {
  if (streak >= 30) return 'Siêu nhân học tập! 🦸'
  if (streak >= 14) return 'Hai tuần liên tiếp! Tuyệt vời! 🎉'
  if (streak >= 7) return 'Một tuần không nghỉ! Giỏi lắm! 💪'
  if (streak >= 3) return 'Đang ăn điểm! Tiếp tục nhé! 🔥'
  if (streak >= 1) return 'Bắt đầu chuỗi mới! Cố lên! ⭐'
  return 'Hãy học hôm nay để bắt đầu chuỗi! 🌱'
}

function getSubjectLabel(subject: string): string {
  if (subject === 'toan') return 'Toán'
  if (subject === 'ngu-van') return 'Ngữ văn'
  return subject
}

export function StudyCalendarView() {
  const [studentName, setStudentName] = useState('')
  const [className, setClassName] = useState('')
  const [data, setData] = useState<CalendarResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [displayClass, setDisplayClass] = useState('')
  const [hoveredDay, setHoveredDay] = useState<CalendarDay | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const goBack = useAppStore((s) => s.goBack)
  const goHome = useAppStore((s) => s.goHome)

  // Check dark mode
  const [isDark, setIsDark] = useState(false)
  useState(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
  })

  const handleSearch = async () => {
    if (!studentName.trim() || !className.trim()) return

    setLoading(true)
    setSearched(true)
    try {
      const params = new URLSearchParams()
      params.set('studentName', studentName.trim())
      params.set('className', className.trim())

      const res = await fetch(`/api/calendar?${params.toString()}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)
        setDisplayName(studentName.trim())
        setDisplayClass(className.trim())

        // Re-check dark mode after data loads
        if (typeof window !== 'undefined') {
          setIsDark(document.documentElement.classList.contains('dark'))
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Organize calendar data into weeks for GitHub-style grid
  const calendarGrid = useMemo(() => {
    if (!data?.calendar) return { weeks: [] as CalendarDay[][], monthLabels: [] as { index: number; label: string }[] }

    const days = data.calendar
    // Group into weeks (7 days per row)
    const weeks: CalendarDay[][] = []
    let currentWeek: CalendarDay[] = []

    // Pad the first week to start on Monday
    const firstDay = getDayOfWeek(days[0].date)
    // Convert Sunday=0 to Monday-based: Mon=0, Tue=1, ..., Sun=6
    const offset = firstDay === 0 ? 6 : firstDay - 1

    for (let i = 0; i < offset; i++) {
      currentWeek.push({
        date: '',
        completed: false,
        score: null,
        quizCount: 0,
        subjects: [],
      })
    }

    for (const day of days) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }

    if (currentWeek.length > 0) {
      // Pad the last week
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: '',
          completed: false,
          score: null,
          quizCount: 0,
          subjects: [],
        })
      }
      weeks.push(currentWeek)
    }

    // Month labels: find which column each new month starts at
    const monthLabels: { index: number; label: string }[] = []
    let lastMonth = ''
    for (let i = 0; i < days.length; i++) {
      const m = getMonthName(days[i].date)
      if (m !== lastMonth) {
        monthLabels.push({ index: i, label: m })
        lastMonth = m
      }
    }

    return { weeks, monthLabels }
  }, [data])

  const stats = data?.stats

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden"
      >
        <div className="absolute top-2 left-3 text-2xl opacity-20 animate-bounce">📅</div>
        <div className="absolute bottom-2 right-3 text-2xl opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}>🗓️</div>

        <CalendarDays className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-200">
          Lịch Học 📅
        </h2>
        <p className="text-emerald-600 dark:text-emerald-400 text-sm mt-1">Theo dõi lịch học tập hàng ngày của bạn 🌱</p>
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
          Tìm lịch học 🔍
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
                  Xem lịch 📅
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
      {!loading && searched && !data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center"
        >
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-amber-800 dark:text-amber-200 font-semibold text-lg mb-1">
            Không tìm thấy dữ liệu
          </p>
          <p className="text-amber-600 dark:text-amber-400 text-sm">
            Chưa có bài làm nào cho học sinh <strong>{displayName}</strong> lớp <strong>{displayClass}</strong>.
            Hãy làm bài kiểm tra để xem lịch học nhé! 📝
          </p>
        </motion.div>
      )}

      {/* Calendar content */}
      {!loading && data && (
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
            className="bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-950/30 dark:to-amber-950/30 rounded-2xl p-4 text-center border border-emerald-200 dark:border-emerald-800"
          >
            <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Lịch học của</p>
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-emerald-800 dark:text-emerald-200 mt-1">
              {displayName} 🌈
            </h3>
            <p className="text-emerald-600 dark:text-emerald-400 text-sm">Lớp {displayClass}</p>
          </motion.div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">📚</div>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stats?.totalStudyDays || 0}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Ngày học</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats?.currentStreak || 0}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Chuỗi hiện tại</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">📝</div>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{stats?.totalQuizzes || 0}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Bài đã làm</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200 dark:border-teal-800 rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">⭐</div>
              <p className="text-2xl font-bold text-teal-700 dark:text-teal-300">
                {stats?.averageScore !== null && stats?.averageScore !== undefined
                  ? stats.averageScore.toFixed(1)
                  : '-'}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">Điểm TB</p>
            </motion.div>
          </div>

          {/* Calendar Grid (GitHub contribution style) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white dark:bg-card rounded-2xl p-4 sm:p-6 shadow-sm border dark:border-border relative"
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Lịch học 90 ngày 🗓️
            </h3>

            {/* Legend */}
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <span>Ít hơn</span>
              <div className="flex gap-0.5">
                <span className="w-3.5 h-3.5 rounded-sm bg-gray-100 dark:bg-gray-800/50" />
                <span className="w-3.5 h-3.5 rounded-sm bg-emerald-200 dark:bg-emerald-500/50" />
                <span className="w-3.5 h-3.5 rounded-sm bg-emerald-400 dark:bg-emerald-600/80" />
                <span className="w-3.5 h-3.5 rounded-sm bg-emerald-600 dark:bg-emerald-700" />
              </div>
              <span>Nhiều hơn</span>
            </div>

            {/* Day labels */}
            <div className="flex gap-0.5 text-[10px] text-muted-foreground mb-1 pl-8">
              <span className="w-3.5 text-center">T2</span>
              <span className="w-3.5 text-center opacity-0">T3</span>
              <span className="w-3.5 text-center">T4</span>
              <span className="w-3.5 text-center opacity-0">T5</span>
              <span className="w-3.5 text-center">T6</span>
              <span className="w-3.5 text-center opacity-0">T7</span>
              <span className="w-3.5 text-center">CN</span>
            </div>

            {/* Scrollable grid container */}
            <div className="overflow-x-auto pb-2">
              {/* Month labels row */}
              <div className="flex gap-0.5 pl-8 mb-1 min-w-fit">
                {calendarGrid.monthLabels.map((ml, idx) => {
                  // Calculate column offset for this month label
                  const weekIndex = Math.floor(ml.index / 7)
                  const prevLabel = idx > 0 ? calendarGrid.monthLabels[idx - 1] : null
                  const span = prevLabel
                    ? Math.floor(ml.index / 7) - Math.floor(prevLabel.index / 7)
                    : Math.floor(ml.index / 7)

                  return (
                    <div key={ml.index} className="flex">
                      {idx === 0 && span > 0 && (
                        <div style={{ width: `${span * 18}px` }} />
                      )}
                      <span
                        className="text-[10px] text-muted-foreground font-medium whitespace-nowrap"
                        style={{ width: `${(idx === calendarGrid.monthLabels.length - 1 ? (data.calendar.length - ml.index) : (calendarGrid.monthLabels[idx + 1]?.index ?? data.calendar.length) - ml.index) / 7 * 18}px` }}
                      >
                        {ml.label}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Weeks as columns (GitHub-style: days as rows, weeks as columns) */}
              <div className="flex gap-0.5 min-w-fit">
                {Array.from({ length: Math.ceil(data.calendar.length / 7) + 1 }, (_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-0.5">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      const flatIndex = weekIdx * 7 + dayIdx
                      const day = data.calendar[flatIndex]

                      if (!day || !day.date) {
                        return (
                          <div
                            key={dayIdx}
                            className="w-3.5 h-3.5 rounded-sm"
                          />
                        )
                      }

                      return (
                        <div
                          key={dayIdx}
                          className={`w-3.5 h-3.5 rounded-sm cursor-pointer transition-colors duration-150 ${getCellColor(day, isDark)}`}
                          onMouseEnter={(e) => {
                            setHoveredDay(day)
                            const rect = e.currentTarget.getBoundingClientRect()
                            setTooltipPos({
                              x: rect.left + rect.width / 2,
                              y: rect.top - 8,
                            })
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                          aria-label={`${formatDisplayDate(day.date)}: ${day.quizCount} bài`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Tooltip */}
            {hoveredDay && hoveredDay.date && (
              <div
                className="fixed z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg px-3 py-2 pointer-events-none shadow-lg transform -translate-x-1/2 -translate-y-full max-w-[200px]"
                style={{
                  left: `${tooltipPos.x}px`,
                  top: `${tooltipPos.y}px`,
                }}
              >
                <p className="font-semibold">{formatDisplayDate(hoveredDay.date)}</p>
                <p>{hoveredDay.quizCount} bài kiểm tra</p>
                {hoveredDay.score !== null && <p>Điểm TB: {hoveredDay.score}</p>}
                {hoveredDay.subjects.length > 0 && (
                  <p>Môn: {hoveredDay.subjects.map(getSubjectLabel).join(', ')}</p>
                )}
              </div>
            )}
          </motion.div>

          {/* Streak Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-5 text-center relative overflow-hidden"
          >
            <div className="absolute top-1 right-3 text-4xl opacity-10">🔥</div>
            <div className="absolute bottom-1 left-3 text-3xl opacity-10">⚡</div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-4xl font-bold text-orange-600 dark:text-orange-400">
                {stats?.currentStreak || 0}
              </span>
              <span className="text-lg text-orange-500 dark:text-orange-400">ngày</span>
            </div>

            <p className="font-[family-name:var(--font-patrick-hand)] text-lg text-orange-700 dark:text-orange-300">
              {getStreakMessage(stats?.currentStreak || 0)}
            </p>

            {stats && stats.longestStreak > 0 && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                🏅 Chuỗi dài nhất: <strong>{stats.longestStreak}</strong> ngày liên tiếp
              </p>
            )}
          </motion.div>

          {/* Monthly Summary */}
          {data.monthlySummary && data.monthlySummary.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border"
            >
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Tóm tắt theo tháng 📊
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {data.monthlySummary.map((month, idx) => {
                  const emojis = ['🌿', '🌻', '🍂']
                  const emoji = emojis[idx] || '🌿'

                  return (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center"
                    >
                      <div className="text-2xl mb-1">{emoji}</div>
                      <p className="font-semibold text-foreground text-sm">{month.monthLabel}</p>
                      <div className="mt-2 space-y-1 text-xs">
                        <p className="text-emerald-700 dark:text-emerald-300">
                          <strong>{month.totalDays}</strong> ngày học
                        </p>
                        <p className="text-amber-700 dark:text-amber-300">
                          <strong>{month.totalQuizzes}</strong> bài làm
                        </p>
                        <p className="text-teal-700 dark:text-teal-300">
                          {month.avgScore !== null ? (
                            <>Điểm TB: <strong>{month.avgScore}</strong></>
                          ) : (
                            'Chưa có điểm'
                          )}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Best Day */}
          {stats?.bestDay && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center"
            >
              <p className="text-2xl mb-1">🌟</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Ngày học tốt nhất: <strong>{formatDisplayDate(stats.bestDay)}</strong>
              </p>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center gap-3"
          >
            <Button
              variant="outline"
              onClick={goBack}
              className="gap-2 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
            <Button
              variant="outline"
              onClick={goHome}
              className="gap-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <Home className="w-4 h-4" />
              Trang chủ
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Initial state - before any search */}
      {!loading && !searched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-emerald-50 to-amber-50 dark:from-emerald-950/30 dark:to-amber-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center"
        >
          <p className="text-5xl mb-3">📅</p>
          <p className="text-emerald-800 dark:text-emerald-200 font-semibold text-lg mb-1">
            Theo dõi lịch học hàng ngày!
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 text-sm max-w-md mx-auto">
            Nhập họ tên và tên lớp để xem lịch học tập, chuỗi ngày học và thống kê chi tiết 📊
          </p>
          <div className="flex justify-center gap-3 mt-4 text-2xl">
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            >
              📅
            </motion.span>
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              🔥
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
