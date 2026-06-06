'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Eye, PenLine, Search, Loader2, BarChart3, Users, Star, TrendingUp, CheckCircle2, Clock, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/app-store'
import { useEffect, useState, useMemo, useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ScoreEntry {
  id: string
  studentName: string
  className: string
  schoolName: string
  subject: string
  grade: number
  testTitle: string
  score: number
  notes: string | null
  createdAt: string
}

interface ResultEntry {
  id: string
  studentName: string
  className: string
  schoolName: string
  quizId: string
  score: number
  totalPoints: number
  timeTaken: number | null
  createdAt: string
  quiz?: {
    title: string
    subject: string
    grade: number
  }
}

type ScoreSource = 'online' | 'manual'

interface CombinedScore {
  studentName: string
  className: string
  schoolName: string
  subject: string
  testTitle: string
  score: number
  date: string
  dateObj: Date
  source: ScoreSource
}

/* Animated counter component */
function AnimatedNumber({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true

    let start: number | null = null
    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Number((eased * target).toFixed(1)))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCurrent(Number(target.toFixed(1)))
      }
    }
    requestAnimationFrame(step)
  }, [target, duration])

  return <span ref={ref}>{typeof current === 'number' ? (Number.isInteger(current) ? current : current.toFixed(1)) : current}</span>
}

export function ScoreboardView() {
  const { goHome } = useAppStore()
  const [activeTab, setActiveTab] = useState<'view' | 'enter' | 'stats'>('view')
  const [statsViewMode, setStatsViewMode] = useState<'charts' | 'timeline'>('charts')

  // View scores state
  const [viewGrade, setViewGrade] = useState('1')
  const [viewSubject, setViewSubject] = useState('toan')
  const [viewClassName, setViewClassName] = useState('')
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [results, setResults] = useState<ResultEntry[]>([])
  const [loadingScores, setLoadingScores] = useState(false)

  // Enter score state
  const [formName, setFormName] = useState('')
  const [formClass, setFormClass] = useState('')
  const [formSchool, setFormSchool] = useState('')
  const [formSubject, setFormSubject] = useState('toan')
  const [formGrade, setFormGrade] = useState('1')
  const [formTestTitle, setFormTestTitle] = useState('')
  const [formScore, setFormScore] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const fetchScores = async () => {
    setLoadingScores(true)
    try {
      const params = new URLSearchParams()
      params.set('grade', viewGrade)
      params.set('subject', viewSubject)
      if (viewClassName.trim()) params.set('className', viewClassName.trim())

      const [scoresRes, resultsRes] = await Promise.all([
        fetch(`/api/scores?${params.toString()}`),
        fetch(`/api/results?grade=${viewGrade}${viewClassName.trim() ? `&className=${viewClassName.trim()}` : ''}`),
      ])

      if (scoresRes.ok) {
        const data = await scoresRes.json()
        setScores(data)
      }
      if (resultsRes.ok) {
        const data = await resultsRes.json()
        setResults(data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingScores(false)
    }
  }

  useEffect(() => {
    fetchScores()
  }, [])

  const handleSubmitScore = async () => {
    if (!formName.trim() || !formClass.trim() || !formTestTitle.trim() || !formScore.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formName.trim(),
          className: formClass.trim(),
          schoolName: formSchool.trim(),
          subject: formSubject,
          grade: parseInt(formGrade),
          testTitle: formTestTitle.trim(),
          score: parseFloat(formScore),
          notes: formNotes.trim() || null,
        }),
      })

      if (res.ok) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
        setFormName('')
        setFormClass('')
        setFormSchool('')
        setFormTestTitle('')
        setFormScore('')
        setFormNotes('')
        fetchScores()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // Combine scores from both sources with deduplication
  const allScores: CombinedScore[] = useMemo(() => {
    const resultEntries: CombinedScore[] = results.map((r) => ({
      studentName: r.studentName,
      className: r.className,
      schoolName: r.schoolName || '',
      subject: r.quiz ? (r.quiz.subject === 'toan' ? 'Toán' : 'Ngữ văn') : 'Kiểm tra online',
      testTitle: r.quiz?.title || `Bài kiểm tra`,
      score: r.score,
      date: new Date(r.createdAt).toLocaleDateString('vi-VN'),
      dateObj: new Date(r.createdAt),
      source: 'online' as ScoreSource,
    }))

    const resultKeys = new Set(
      resultEntries.map((r) => `${r.studentName.toLowerCase()}|${r.testTitle.toLowerCase()}|${r.date}`)
    )

    const manualEntries: CombinedScore[] = scores
      .filter((s) => {
        const dateStr = new Date(s.createdAt).toLocaleDateString('vi-VN')
        const key = `${s.studentName.toLowerCase()}|${s.testTitle.toLowerCase()}|${dateStr}`
        return !resultKeys.has(key)
      })
      .map((s) => ({
        studentName: s.studentName,
        className: s.className,
        schoolName: s.schoolName || '',
        subject: s.subject === 'toan' ? 'Toán' : 'Ngữ văn',
        testTitle: s.testTitle,
        score: s.score,
        date: new Date(s.createdAt).toLocaleDateString('vi-VN'),
        dateObj: new Date(s.createdAt),
        source: 'manual' as ScoreSource,
      }))

    return [...resultEntries, ...manualEntries].sort(
      (a, b) => b.dateObj.getTime() - a.dateObj.getTime()
    )
  }, [scores, results])

  // Statistics calculations
  const stats = useMemo(() => {
    if (allScores.length === 0) {
      return {
        totalResults: 0,
        averageScore: 0,
        highestScore: 0,
        uniqueStudents: 0,
        onlineCount: 0,
        manualCount: 0,
        distribution: [0, 0, 0, 0, 0],
      }
    }

    const totalResults = allScores.length
    const averageScore = allScores.reduce((sum, s) => sum + s.score, 0) / totalResults
    const highestScore = Math.max(...allScores.map((s) => s.score))
    const uniqueStudents = new Set(allScores.map((s) => s.studentName.toLowerCase())).size
    const onlineCount = allScores.filter((s) => s.source === 'online').length
    const manualCount = allScores.filter((s) => s.source === 'manual').length

    const distribution = [0, 0, 0, 0, 0]
    allScores.forEach((s) => {
      if (s.score < 2) distribution[0]++
      else if (s.score < 4) distribution[1]++
      else if (s.score < 6) distribution[2]++
      else if (s.score < 8) distribution[3]++
      else distribution[4]++
    })

    return { totalResults, averageScore, highestScore, uniqueStudents, onlineCount, manualCount, distribution }
  }, [allScores])

  const distributionLabels = ['0-2', '2-4', '4-6', '6-8', '8-10']
  const distributionColors = [
    'bg-gradient-to-r from-rose-400 to-rose-500',
    'bg-gradient-to-r from-orange-400 to-orange-500',
    'bg-gradient-to-r from-amber-400 to-amber-500',
    'bg-gradient-to-r from-emerald-400 to-emerald-500',
    'bg-gradient-to-r from-teal-400 to-teal-500',
  ]
  const distributionBgColors = [
    'bg-rose-100',
    'bg-orange-100',
    'bg-amber-100',
    'bg-emerald-100',
    'bg-teal-100',
  ]
  const distributionEmojis = ['😢', '😟', '😐', '😊', '🌟']

  // Top students for podium
  const topStudents = useMemo(() => {
    const studentMap = new Map<string, { totalScore: number; count: number }>()
    allScores.forEach((s) => {
      const key = s.studentName
      const existing = studentMap.get(key) || { totalScore: 0, count: 0 }
      existing.totalScore += s.score
      existing.count += 1
      studentMap.set(key, existing)
    })
    return Array.from(studentMap.entries())
      .map(([name, data]) => ({ name, avg: data.totalScore / data.count, count: data.count }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3)
  }, [allScores])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden dark-card-glow-hover"
      >
        <div className="absolute top-2 left-4 text-lg opacity-10 animate-float">🏆</div>
        <div className="absolute bottom-2 right-4 text-lg opacity-10 animate-float" style={{ animationDelay: '0.5s' }}>📊</div>
        <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <h2 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-amber-800">
          Bảng Điểm 📊
        </h2>
        <p className="text-amber-600 text-sm mt-1">Xem điểm, nhập điểm và thống kê 🎯</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1">
        <button
          onClick={() => setActiveTab('view')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'view'
              ? 'bg-white dark:bg-card shadow-md text-orange-700 dark:text-orange-300'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Xem điểm</span>
          <span className="sm:hidden">Xem</span>
        </button>
        <button
          onClick={() => setActiveTab('enter')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'enter'
              ? 'bg-white dark:bg-card shadow-md text-orange-700 dark:text-orange-300'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <PenLine className="w-4 h-4" />
          <span className="hidden sm:inline">Nhập điểm</span>
          <span className="sm:hidden">Nhập</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'stats'
              ? 'bg-white dark:bg-card shadow-md text-orange-700 dark:text-orange-300'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Thống kê</span>
          <span className="sm:hidden">TK</span>
        </button>
      </div>

      {/* View Scores Tab */}
      {activeTab === 'view' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Filters */}
          <div className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm border dark:border-border">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Lọc kết quả 🔍
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Lớp</label>
                <select
                  value={viewGrade}
                  onChange={(e) => setViewGrade(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-card"
                >
                  {[1, 2, 3, 4, 5].map((g) => (
                    <option key={g} value={g}>Lớp {g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Môn học</label>
                <select
                  value={viewSubject}
                  onChange={(e) => setViewSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-card"
                >
                  <option value="toan">Toán</option>
                  <option value="ngu-van">Ngữ văn</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Tên lớp</label>
                <Input
                  value={viewClassName}
                  onChange={(e) => setViewClassName(e.target.value)}
                  placeholder="VD: 1A"
                  className="text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={fetchScores}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Search className="w-4 h-4 mr-1" />
                  Tìm 🔎
                </Button>
              </div>
            </div>
          </div>

          {/* Score table */}
          {loadingScores ? (
            <div className="flex items-center justify-center py-12 gap-2">
              <Loader2 className="w-6 h-6 text-orange-400 animate-spin" />
              <span className="text-muted-foreground">Đang tải...</span>
            </div>
          ) : allScores.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-amber-700 font-medium">Chưa có điểm nào. Hãy thay đổi bộ lọc hoặc nhập điểm mới.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-card rounded-2xl shadow-sm border dark:border-border overflow-hidden">
              <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">
                  📋 Có <span className="font-bold">{allScores.length}</span> kết quả
                  {allScores.some((s) => s.source === 'online') && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      🟢 Online: {allScores.filter((s) => s.source === 'online').length}
                    </span>
                  )}
                  {allScores.some((s) => s.source === 'manual') && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                      ✏️ Nhập tay: {allScores.filter((s) => s.source === 'manual').length}
                    </span>
                  )}
                </p>
              </div>
              <div className="max-h-[28rem] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50 dark:bg-orange-950/20">
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300">Họ tên</TableHead>
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300">Lớp</TableHead>
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300 hidden sm:table-cell">Trường</TableHead>
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300">Môn</TableHead>
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300">Bài kiểm tra</TableHead>
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300 text-center">Điểm</TableHead>
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300 text-center">Nguồn</TableHead>
                      <TableHead className="font-bold text-orange-700 dark:text-orange-300">Ngày</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allScores.map((entry, idx) => (
                      <TableRow key={idx} className="hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-colors">
                        <TableCell className="font-medium">{entry.studentName}</TableCell>
                        <TableCell>{entry.className}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                          {entry.schoolName || '—'}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-xs">
                            {entry.subject === 'Toán' ? '🔢' : '📖'} {entry.subject}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[120px] truncate">{entry.testTitle}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                              entry.score >= 9
                                ? 'score-excellent ring-2 ring-amber-300'
                                : entry.score >= 7
                                  ? 'score-good ring-2 ring-emerald-200'
                                  : entry.score >= 5
                                    ? 'score-average ring-2 ring-orange-200'
                                    : 'score-poor ring-2 ring-rose-200'
                            }`}
                          >
                            {entry.score.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.source === 'online' ? (
                            <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
                              🟢 Online
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full font-medium">
                              ✏️ Nhập tay
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{entry.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Enter Scores Tab */}
      {activeTab === 'enter' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card rounded-2xl p-6 shadow-sm border dark:border-border relative overflow-hidden"
        >
          {/* Success animation overlay */}
          <AnimatePresence>
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-emerald-50/95 flex flex-col items-center justify-center z-10 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-3"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
                <p className="font-[family-name:var(--font-patrick-hand)] text-2xl text-emerald-700">
                  Lưu thành công! 🎉
                </p>
                <p className="text-emerald-600 text-sm mt-1">Điểm đã được thêm vào bảng</p>
              </motion.div>
            )}
          </AnimatePresence>

          <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-orange-700 dark:text-orange-300 mb-4">
            Nhập điểm học sinh ✏️
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Nhập họ và tên học sinh..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Lớp <span className="text-red-500">*</span>
              </label>
              <Input
                value={formClass}
                onChange={(e) => setFormClass(e.target.value)}
                placeholder="VD: 1A, 2B..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Trường</label>
              <Input
                value={formSchool}
                onChange={(e) => setFormSchool(e.target.value)}
                placeholder="Tên trường..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Khối lớp</label>
              <select
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-card"
              >
                {[1, 2, 3, 4, 5].map((g) => (
                  <option key={g} value={g}>Lớp {g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Môn học</label>
              <select
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white dark:bg-card"
              >
                <option value="toan">Toán</option>
                <option value="ngu-van">Ngữ văn</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Tên bài kiểm tra <span className="text-red-500">*</span>
              </label>
              <Input
                value={formTestTitle}
                onChange={(e) => setFormTestTitle(e.target.value)}
                placeholder="VD: Giữa kỳ 1..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Điểm (0-10) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formScore}
                onChange={(e) => setFormScore(e.target.value)}
                placeholder="0-10"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Ghi chú</label>
              <Input
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Ghi chú (nếu có)..."
              />
            </div>
          </div>
          <Button
            onClick={handleSubmitScore}
            disabled={
              submitting ||
              !formName.trim() ||
              !formClass.trim() ||
              !formTestTitle.trim() ||
              !formScore.trim() ||
              parseFloat(formScore) < 0 ||
              parseFloat(formScore) > 10
            }
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl hover-glow"
          >
            {submitting ? 'Đang lưu...' : 'Lưu điểm ✓'}
          </Button>
        </motion.div>
      )}

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {allScores.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-3">📊</p>
              <p className="text-amber-700 font-medium">Chưa có dữ liệu để thống kê. Hãy làm bài kiểm tra hoặc nhập điểm trước nhé!</p>
            </div>
          ) : (
            <>
              {/* Stats cards with animated counters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center hover-lift dark-stats-gradient">
                  <div className="text-2xl mb-1">📝</div>
                  <p className="text-2xl font-bold text-amber-700">
                    <AnimatedNumber target={stats.totalResults} />
                  </p>
                  <p className="text-xs text-amber-600 font-medium">Tổng bài làm</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center hover-lift dark-stats-gradient">
                  <div className="text-2xl mb-1">📈</div>
                  <p className="text-2xl font-bold text-emerald-700">
                    <AnimatedNumber target={stats.averageScore} />
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">Điểm trung bình</p>
                </div>
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl p-4 text-center hover-lift dark-stats-gradient">
                  <div className="text-2xl mb-1">🌟</div>
                  <p className="text-2xl font-bold text-rose-700">
                    <AnimatedNumber target={stats.highestScore} />
                  </p>
                  <p className="text-xs text-rose-600 font-medium">Điểm cao nhất</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200 dark:border-teal-800 rounded-2xl p-4 text-center hover-lift dark-stats-gradient">
                  <div className="text-2xl mb-1">👥</div>
                  <p className="text-2xl font-bold text-teal-700">
                    <AnimatedNumber target={stats.uniqueStudents} />
                  </p>
                  <p className="text-xs text-teal-600 font-medium">Học sinh</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center hover-lift dark-stats-gradient">
                  <div className="text-2xl mb-1">🟢</div>
                  <p className="text-2xl font-bold text-emerald-700">
                    <AnimatedNumber target={stats.onlineCount} />
                  </p>
                  <p className="text-xs text-emerald-600 font-medium">Làm online</p>
                </div>
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800 rounded-2xl p-4 text-center hover-lift dark-stats-gradient">
                  <div className="text-2xl mb-1">✏️</div>
                  <p className="text-2xl font-bold text-violet-700">
                    <AnimatedNumber target={stats.manualCount} />
                  </p>
                  <p className="text-xs text-violet-600 font-medium">Nhập tay</p>
                </div>
              </div>

              {/* Top 3 Podium */}
              {topStudents.length > 0 && (
                <div className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border">
                  <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-orange-700 dark:text-orange-300 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Top 3 Học sinh 🏆
                  </h3>
                  <div className="flex items-end justify-center gap-3 sm:gap-6 pt-4">
                    {/* 2nd place (silver) */}
                    {topStudents[1] && (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">🥈</span>
                        <div className="text-center mb-2">
                          <p className="font-semibold text-foreground text-sm truncate max-w-[80px]">{topStudents[1].name}</p>
                          <p className="text-xs text-muted-foreground">{topStudents[1].count} bài</p>
                        </div>
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          style={{ transformOrigin: 'bottom' }}
                          className="w-16 sm:w-20 h-24 podium-silver rounded-t-xl flex items-center justify-center"
                        >
                          <span className="font-bold text-xl">{topStudents[1].avg.toFixed(1)}</span>
                        </motion.div>
                      </div>
                    )}

                    {/* 1st place (gold) */}
                    {topStudents[0] && (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl mb-1 animate-pulse-soft">👑</span>
                        <div className="text-center mb-2">
                          <p className="font-bold text-foreground text-sm truncate max-w-[80px]">{topStudents[0].name}</p>
                          <p className="text-xs text-muted-foreground">{topStudents[0].count} bài</p>
                        </div>
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          style={{ transformOrigin: 'bottom' }}
                          className="w-16 sm:w-20 h-32 podium-gold rounded-t-xl flex items-center justify-center animate-pulse-glow"
                        >
                          <span className="font-bold text-2xl">{topStudents[0].avg.toFixed(1)}</span>
                        </motion.div>
                      </div>
                    )}

                    {/* 3rd place (bronze) */}
                    {topStudents[2] && (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl mb-1">🥉</span>
                        <div className="text-center mb-2">
                          <p className="font-semibold text-foreground text-sm truncate max-w-[80px]">{topStudents[2].name}</p>
                          <p className="text-xs text-muted-foreground">{topStudents[2].count} bài</p>
                        </div>
                        <motion.div
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          style={{ transformOrigin: 'bottom' }}
                          className="w-16 sm:w-20 h-20 podium-bronze rounded-t-xl flex items-center justify-center"
                        >
                          <span className="font-bold text-xl">{topStudents[2].avg.toFixed(1)}</span>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* View mode toggle: Charts vs Timeline */}
              <div className="flex gap-2 bg-muted rounded-xl p-1">
                <button
                  onClick={() => setStatsViewMode('charts')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold text-sm transition-all ${
                    statsViewMode === 'charts'
                      ? 'bg-white dark:bg-card shadow-md text-orange-700 dark:text-orange-300'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Biểu đồ
                </button>
                <button
                  onClick={() => setStatsViewMode('timeline')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold text-sm transition-all ${
                    statsViewMode === 'timeline'
                      ? 'bg-white dark:bg-card shadow-md text-orange-700 dark:text-orange-300'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Lịch sử điểm
                </button>
              </div>

              {statsViewMode === 'charts' ? (
                <>
                  {/* Score distribution chart */}
                  <div className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border">
                    <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-orange-700 dark:text-orange-300 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Phân bố điểm 📊
                    </h3>
                    <div className="space-y-3">
                      {distributionLabels.map((label, idx) => {
                        const count = stats.distribution[idx]
                        const maxCount = Math.max(...stats.distribution, 1)
                        const percentage = (count / maxCount) * 100
                        return (
                          <div key={label} className="flex items-center gap-3">
                            <div className="w-14 text-right">
                              <span className="text-xs font-semibold text-muted-foreground flex items-center justify-end gap-1">
                                <span className="text-base">{distributionEmojis[idx]}</span> {label}
                              </span>
                            </div>
                            <div className="flex-1 relative">
                              <div className={`h-8 rounded-lg ${distributionBgColors[idx]} overflow-hidden`}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                                  className={`h-full rounded-lg ${distributionColors[idx]} flex items-center justify-end pr-2 relative overflow-hidden`}
                                >
                                  {/* Shimmer effect on bars */}
                                  <div className="absolute inset-0 animate-shimmer opacity-30" />
                                  {count > 0 && (
                                    <span className="text-xs font-bold text-white relative z-10">{count}</span>
                                  )}
                                </motion.div>
                              </div>
                            </div>
                            <div className="w-8 text-right">
                              <span className="text-sm font-semibold text-foreground">{count}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 pt-3 border-t flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">😢 Dưới trung bình</span>
                      <span className="flex items-center gap-1">😐 Trung bình</span>
                      <span className="flex items-center gap-1">😊 Khá</span>
                      <span className="flex items-center gap-1">🌟 Giỏi</span>
                    </div>
                  </div>

                  {/* Full top students list */}
                  <div className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border">
                    <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-orange-700 dark:text-orange-300 mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Học sinh xuất sắc 🏆
                    </h3>
                    {(() => {
                      const studentMap = new Map<string, { totalScore: number; count: number }>()
                      allScores.forEach((s) => {
                        const key = s.studentName
                        const existing = studentMap.get(key) || { totalScore: 0, count: 0 }
                        existing.totalScore += s.score
                        existing.count += 1
                        studentMap.set(key, existing)
                      })
                      const studentAverages = Array.from(studentMap.entries())
                        .map(([name, data]) => ({ name, avg: data.totalScore / data.count, count: data.count }))
                        .sort((a, b) => b.avg - a.avg)
                        .slice(0, 5)

                      if (studentAverages.length === 0) return null

                      const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

                      return (
                        <div className="space-y-2">
                          {studentAverages.map((student, idx) => (
                            <div
                              key={student.name}
                              className={`flex items-center gap-3 p-3 rounded-xl transition-colors hover-lift ${
                                idx === 0
                                  ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800'
                                  : idx === 1
                                    ? 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                                    : idx === 2
                                      ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800'
                                      : 'bg-muted/50'
                              }`}
                            >
                              <span className="text-xl">{medals[idx]}</span>
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.count} bài làm</p>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-lg ${
                                  student.avg >= 9
                                    ? 'text-amber-600'
                                    : student.avg >= 7
                                      ? 'text-emerald-600'
                                      : student.avg >= 5
                                        ? 'text-orange-600'
                                        : 'text-rose-600'
                                }`}>
                                  {student.avg.toFixed(1)}
                                </p>
                                <p className="text-xs text-muted-foreground">điểm TB</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>

                  {/* Subject breakdown */}
                  <div className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border">
                    <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-orange-700 dark:text-orange-300 mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Theo môn học 📚
                    </h3>
                    {(() => {
                      const subjectMap = new Map<string, { totalScore: number; count: number }>()
                      allScores.forEach((s) => {
                        const key = s.subject
                        const existing = subjectMap.get(key) || { totalScore: 0, count: 0 }
                        existing.totalScore += s.score
                        existing.count += 1
                        subjectMap.set(key, existing)
                      })

                      const subjectData = Array.from(subjectMap.entries()).map(([name, data]) => ({
                        name,
                        avg: data.totalScore / data.count,
                        count: data.count,
                      }))

                      if (subjectData.length === 0) return null

                      return (
                        <div className="grid grid-cols-2 gap-3">
                          {subjectData.map((subject) => (
                            <div
                              key={subject.name}
                              className={`rounded-xl p-4 text-center border hover-lift ${
                                subject.name === 'Toán'
                                  ? 'bg-orange-50 border-orange-200'
                                  : 'bg-pink-50 border-pink-200'
                              }`}
                            >
                              <p className="text-2xl mb-1">{subject.name === 'Toán' ? '🔢' : '📖'}</p>
                              <p className="font-bold text-foreground">{subject.name}</p>
                              <p className="text-sm text-muted-foreground">{subject.count} bài</p>
                              <p className={`text-xl font-bold mt-1 ${
                                subject.avg >= 7 ? 'text-emerald-600' : subject.avg >= 5 ? 'text-orange-600' : 'text-rose-600'
                              }`}>
                                {subject.avg.toFixed(1)} TB
                              </p>
                            </div>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                </>
              ) : (
                /* Timeline View - Lịch sử điểm */
                <div className="bg-white dark:bg-card rounded-2xl p-5 shadow-sm border dark:border-border">
                  <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-orange-700 dark:text-orange-300 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Lịch sử điểm 📅
                  </h3>
                  {allScores.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Chưa có dữ liệu lịch sử</p>
                  ) : (
                    <div className="relative pl-8">
                      {/* Timeline line */}
                      <div className="timeline-line" />

                      <div className="space-y-4">
                        {[...allScores].reverse().slice(0, 15).map((entry, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative pl-6"
                          >
                            {/* Timeline dot */}
                            <div
                              className={`timeline-dot ${
                                entry.score >= 8 ? 'bg-amber-400' :
                                entry.score >= 6 ? 'bg-emerald-400' :
                                entry.score >= 4 ? 'bg-orange-400' :
                                'bg-rose-400'
                              }`}
                            />

                            <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-3 transition-colors">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-foreground text-sm truncate">{entry.studentName}</p>
                                  <p className="text-xs text-muted-foreground truncate">
                                    {entry.subject} • {entry.testTitle}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold ${
                                    entry.score >= 9 ? 'score-excellent' :
                                    entry.score >= 7 ? 'score-good' :
                                    entry.score >= 5 ? 'score-average' :
                                    'score-poor'
                                  }`}>
                                    {entry.score.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{entry.date}</span>
                                {entry.source === 'online' && (
                                  <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                                    Online
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
