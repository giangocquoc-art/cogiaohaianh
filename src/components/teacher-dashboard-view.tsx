'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Users, BookOpen, TrendingUp, Search, Loader2, GraduationCap, BarChart3, Star, Trophy, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

interface TeacherData {
  totalStudents: number
  totalQuizzes: number
  averageScore: number
  passRate: number
  subjectBreakdown: {
    toan: { count: number; avgScore: number }
    'ngu-van': { count: number; avgScore: number }
  }
  gradeBreakdown: Array<{
    grade: number
    count: number
    avgScore: number
  }>
  topStudents: Array<{
    name: string
    className: string
    quizCount: number
    avgScore: number
  }>
  recentActivity: Array<{
    studentName: string
    className: string
    quizTitle: string
    subject: string
    grade: number
    score: number
    date: string
  }>
  scoreDistribution: {
    excellent: number
    good: number
    average: number
    poor: number
  }
}

export function TeacherDashboardView() {
  const [schoolName, setSchoolName] = useState('')
  const [className, setClassName] = useState('')
  const [data, setData] = useState<TeacherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!schoolName.trim()) {
      toast({
        title: '⚠️ Thiếu thông tin',
        description: 'Vui lòng nhập tên trường!',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setSearched(true)

    try {
      const params = new URLSearchParams()
      params.set('schoolName', schoolName.trim())
      if (className.trim()) {
        params.set('className', className.trim())
      }

      const res = await fetch(`/api/teacher?${params.toString()}`)
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Lỗi không xác định')
      }

      const result = await res.json()
      setData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu'
      toast({
        title: '❌ Lỗi',
        description: message,
        variant: 'destructive',
      })
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 6) return 'text-teal-600 dark:text-teal-400'
    if (score >= 5) return 'text-amber-600 dark:text-amber-400'
    return 'text-rose-600 dark:text-rose-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700'
    if (score >= 6) return 'bg-teal-100 dark:bg-teal-900/30 border-teal-300 dark:border-teal-700'
    if (score >= 5) return 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
    return 'bg-rose-100 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700'
  }

  const getGradeLabel = (grade: number) => {
    const emojis = ['🌸', '🍊', '🌻', '🌿', '🐬']
    return `${emojis[grade - 1] || '📚'} Lớp ${grade}`
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  const totalDistribution = data
    ? data.scoreDistribution.excellent + data.scoreDistribution.good + data.scoreDistribution.average + data.scoreDistribution.poor
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <ClipboardList className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-foreground">
            Bảng Điều Khiển Giáo Viên 📋
          </h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          Xem thống kê học tập của học sinh theo trường
        </p>
      </motion.div>

      {/* Search Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-card border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-5 sm:p-6 shadow-md"
      >
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
            Tìm kiếm thống kê
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              🏫 Tên trường <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ví dụ: Tiểu học Lê Lợi"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-card text-foreground focus:border-teal-400 dark:focus:border-teal-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-muted-foreground mb-1 block">
              🎓 Lớp (tùy chọn)
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ví dụ: 3A"
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-card text-foreground focus:border-teal-400 dark:focus:border-teal-600 focus:ring-2 focus:ring-teal-200 dark:focus:ring-teal-800 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 shadow-md"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Xem thống kê
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-teal-500 animate-spin mb-4" />
          <p className="text-muted-foreground text-lg">Đang tải dữ liệu thống kê...</p>
        </div>
      )}

      {/* Empty state */}
      {searched && !loading && !data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground mb-2">
            Không tìm thấy dữ liệu
          </h3>
          <p className="text-muted-foreground">
            Chưa có dữ liệu cho trường &quot;{schoolName}&quot;.
            <br />
            Hãy kiểm tra lại tên trường hoặc thử tên khác nhé!
          </p>
        </motion.div>
      )}

      {/* No data state - 0 students */}
      {searched && !loading && data && data.totalStudents === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="text-6xl mb-4">📭</div>
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground mb-2">
            Chưa có học sinh nào
          </h3>
          <p className="text-muted-foreground">
            Trường &quot;{schoolName}&quot; chưa có học sinh nào làm bài kiểm tra.
          </p>
        </motion.div>
      )}

      {/* Data display */}
      {data && data.totalStudents > 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-card border-2 border-teal-200 dark:border-teal-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="text-sm text-muted-foreground">Học sinh</span>
              </div>
              <p className="font-[family-name:var(--font-patrick-hand)] text-3xl text-foreground">{data.totalStudents}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white dark:bg-card border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-muted-foreground">Bài làm</span>
              </div>
              <p className="font-[family-name:var(--font-patrick-hand)] text-3xl text-foreground">{data.totalQuizzes}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-card border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm text-muted-foreground">Điểm TB</span>
              </div>
              <p className={`font-[family-name:var(--font-patrick-hand)] text-3xl ${getScoreColor(data.averageScore)}`}>
                {data.averageScore.toFixed(1)}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-card border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm text-muted-foreground">Đạt</span>
              </div>
              <p className="font-[family-name:var(--font-patrick-hand)] text-3xl text-foreground">
                {data.passRate}%
              </p>
            </motion.div>
          </div>

          {/* Subject comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-card border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
                So sánh môn học
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Toán */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔢</span>
                    <span className="font-semibold text-orange-700 dark:text-orange-300">Toán</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{data.subjectBreakdown.toan.count} bài</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Điểm trung bình</span>
                    <span className={`font-bold ${getScoreColor(data.subjectBreakdown.toan.avgScore)}`}>
                      {data.subjectBreakdown.toan.avgScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 dark:bg-orange-900 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-amber-400 dark:from-orange-500 dark:to-amber-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, (data.subjectBreakdown.toan.avgScore / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Ngữ văn */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-2 border-pink-200 dark:border-pink-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📖</span>
                    <span className="font-semibold text-pink-700 dark:text-pink-300">Ngữ văn</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{data.subjectBreakdown['ngu-van'].count} bài</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Điểm trung bình</span>
                    <span className={`font-bold ${getScoreColor(data.subjectBreakdown['ngu-van'].avgScore)}`}>
                      {data.subjectBreakdown['ngu-van'].avgScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="w-full bg-pink-200 dark:bg-pink-900 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-rose-400 dark:from-pink-500 dark:to-rose-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, (data.subjectBreakdown['ngu-van'].avgScore / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Grade breakdown */}
          {data.gradeBreakdown.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white dark:bg-card border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
                  Thống kê theo lớp
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {data.gradeBreakdown.map((g) => (
                  <div
                    key={g.grade}
                    className={`${getScoreBg(g.avgScore)} border-2 rounded-xl p-3 sm:p-4 text-center`}
                  >
                    <p className="text-lg mb-1">{getGradeLabel(g.grade)}</p>
                    <p className={`font-[family-name:var(--font-patrick-hand)] text-2xl ${getScoreColor(g.avgScore)}`}>
                      {g.avgScore.toFixed(1)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{g.count} bài làm</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Score distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-card border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
                Phân loại điểm
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Xuất sắc', emoji: '🌟', count: data.scoreDistribution.excellent, color: 'from-emerald-400 to-green-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
                { label: 'Khá', emoji: '⭐', count: data.scoreDistribution.good, color: 'from-teal-400 to-cyan-400', bgColor: 'bg-teal-100 dark:bg-teal-900/30' },
                { label: 'Trung bình', emoji: '👍', count: data.scoreDistribution.average, color: 'from-amber-400 to-yellow-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
                { label: 'Cần cố gắng', emoji: '💪', count: data.scoreDistribution.poor, color: 'from-rose-400 to-pink-400', bgColor: 'bg-rose-100 dark:bg-rose-900/30' },
              ].map((item) => {
                const pct = totalDistribution > 0 ? Math.round((item.count / totalDistribution) * 100) : 0
                return (
                  <div key={item.label} className={`${item.bgColor} rounded-xl p-3 sm:p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="font-medium text-foreground text-sm">{item.label}</span>
                        <span className="text-xs text-muted-foreground">(≥8 / 6-8 / 5-6 / &lt;5)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{item.count}</span>
                        <span className="text-muted-foreground text-sm">({pct}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/50 dark:bg-black/20 rounded-full h-2.5">
                      <div
                        className={`bg-gradient-to-r ${item.color} h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct > 0 ? 3 : 0, pct)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Top students */}
          {data.topStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white dark:bg-card border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
                  Top 10 học sinh xuất sắc
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">#</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Học sinh</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium hidden sm:table-cell">Lớp</th>
                      <th className="text-center py-3 px-2 text-muted-foreground font-medium">Số bài</th>
                      <th className="text-center py-3 px-2 text-muted-foreground font-medium">Điểm TB</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topStudents.map((student, idx) => (
                      <tr
                        key={student.name}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                            idx === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                            idx === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                            idx === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                            'bg-gray-50 text-gray-500 dark:bg-gray-800/50 dark:text-gray-400'
                          }`}>
                            {idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-medium text-foreground">{student.name}</td>
                        <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell">{student.className}</td>
                        <td className="py-3 px-2 text-center">
                          <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-full text-xs font-semibold">
                            {student.quizCount}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className={`font-bold ${getScoreColor(student.avgScore)}`}>
                            {student.avgScore.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Recent activity */}
          {data.recentActivity.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-card border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground">
                  Hoạt động gần đây
                </h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {data.recentActivity.map((activity, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      activity.score >= 8 ? 'bg-emerald-500' :
                      activity.score >= 6 ? 'bg-teal-500' :
                      activity.score >= 5 ? 'bg-amber-500' :
                      'bg-rose-500'
                    }`}>
                      {activity.score.toFixed(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm truncate">{activity.studentName}</span>
                        <span className="text-xs text-muted-foreground shrink-0">{activity.className}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.subject === 'toan' ? '🔢' : '📖'} {activity.quizTitle} · Lớp {activity.grade}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className={`font-bold text-sm ${getScoreColor(activity.score)}`}>
                        {activity.score.toFixed(1)}/10
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(activity.date)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Initial state - no search yet */}
      {!searched && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center py-12"
        >
          <div className="text-7xl mb-4">📊</div>
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground mb-2">
            Chào mừng giáo viên!
          </h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Nhập tên trường của bạn để xem thống kê chi tiết về kết quả học tập của học sinh.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
            <div className="bg-teal-50 dark:bg-teal-950/30 rounded-xl p-3">
              <p className="text-2xl mb-1">📈</p>
              <p className="text-xs text-muted-foreground">Xem điểm trung bình</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-3">
              <p className="text-2xl mb-1">🏆</p>
              <p className="text-xs text-muted-foreground">Top học sinh xuất sắc</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3">
              <p className="text-2xl mb-1">📊</p>
              <p className="text-xs text-muted-foreground">Phân loại theo điểm</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
