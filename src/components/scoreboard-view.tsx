'use client'

import { motion } from 'framer-motion'
import { Trophy, Eye, PenLine, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/app-store'
import { useEffect, useState } from 'react'
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

export function ScoreboardView() {
  const { goHome } = useAppStore()
  const [activeTab, setActiveTab] = useState<'view' | 'enter'>('view')

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
        // Reset form
        setFormName('')
        setFormClass('')
        setFormTestTitle('')
        setFormScore('')
        setFormNotes('')
        // Refresh scores
        fetchScores()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // Combine scores from both sources
  const allScores: Array<{
    studentName: string
    className: string
    subject: string
    testTitle: string
    score: number
    date: string
  }> = [
    ...scores.map((s) => ({
      studentName: s.studentName,
      className: s.className,
      subject: s.subject === 'toan' ? 'Toán' : 'Ngữ văn',
      testTitle: s.testTitle,
      score: s.score,
      date: new Date(s.createdAt).toLocaleDateString('vi-VN'),
    })),
    ...results.map((r) => ({
      studentName: r.studentName,
      className: r.className,
      subject: r.quiz ? (r.quiz.subject === 'toan' ? 'Toán' : 'Ngữ văn') : 'Kiểm tra online',
      testTitle: r.quiz?.title || `Bài kiểm tra`,
      score: r.score,
      date: new Date(r.createdAt).toLocaleDateString('vi-VN'),
    })),
  ].sort((a, b) => b.score - a.score)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-4 sm:p-6 text-center"
      >
        <Trophy className="w-10 h-10 text-amber-500 mx-auto mb-2" />
        <h2 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-amber-800">
          Bảng Điểm 📊
        </h2>
        <p className="text-amber-600 text-sm mt-1">Xem điểm và nhập điểm học sinh</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-muted rounded-xl p-1">
        <button
          onClick={() => setActiveTab('view')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'view'
              ? 'bg-white shadow-md text-orange-700'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye className="w-4 h-4" />
          Xem điểm
        </button>
        <button
          onClick={() => setActiveTab('enter')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${
            activeTab === 'enter'
              ? 'bg-white shadow-md text-orange-700'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <PenLine className="w-4 h-4" />
          Nhập điểm
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
          <div className="bg-white rounded-2xl p-4 shadow-sm border">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              Lọc kết quả
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Lớp</label>
                <select
                  value={viewGrade}
                  onChange={(e) => setViewGrade(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
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
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
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
                  Tìm
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
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
              <p className="text-amber-700">Chưa có điểm nào. Hãy thay đổi bộ lọc hoặc nhập điểm mới.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-orange-50">
                      <TableHead className="font-bold text-orange-700">Họ tên</TableHead>
                      <TableHead className="font-bold text-orange-700">Lớp</TableHead>
                      <TableHead className="font-bold text-orange-700">Môn</TableHead>
                      <TableHead className="font-bold text-orange-700">Bài kiểm tra</TableHead>
                      <TableHead className="font-bold text-orange-700 text-center">Điểm</TableHead>
                      <TableHead className="font-bold text-orange-700">Ngày</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allScores.map((entry, idx) => (
                      <TableRow key={idx} className="hover:bg-orange-50/50">
                        <TableCell className="font-medium">{entry.studentName}</TableCell>
                        <TableCell>{entry.className}</TableCell>
                        <TableCell>{entry.subject}</TableCell>
                        <TableCell>{entry.testTitle}</TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
                              entry.score >= 9
                                ? 'bg-amber-100 text-amber-700'
                                : entry.score >= 7
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : entry.score >= 5
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {entry.score.toFixed(1)}
                          </span>
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
          className="bg-white rounded-2xl p-6 shadow-sm border"
        >
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-orange-700 mb-4">
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
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
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
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
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
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
          >
            {submitting ? 'Đang lưu...' : 'Lưu điểm ✓'}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
