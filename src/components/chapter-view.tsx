'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface QuizInfo {
  id: string
  grade: number
  subject: string
  chapter: string
  chapterName: string
  title: string
  description: string | null
  duration: number
  _count?: { questions: number }
}

export function ChapterView() {
  const { selectedGrade, selectedSubject, startQuiz, studentInfo } = useAppStore()
  const [quizzes, setQuizzes] = useState<QuizInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Show student info form if not filled
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [formName, setFormName] = useState(studentInfo?.name || '')
  const [formClass, setFormClass] = useState(studentInfo?.className || '')
  const [formSchool, setFormSchool] = useState(studentInfo?.schoolName || '')
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedGrade || !selectedSubject) return

    const fetchQuizzes = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/quizzes?grade=${selectedGrade}&subject=${selectedSubject}`)
        if (!res.ok) throw new Error('Không thể tải danh sách bài kiểm tra')
        const data = await res.json()
        setQuizzes(data)
      } catch (err) {
        setError('Không thể tải danh sách bài kiểm tra. Vui lòng thử lại.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [selectedGrade, selectedSubject])

  const handleStartQuiz = (quizId: string) => {
    if (!formName || !formClass) {
      setPendingQuizId(quizId)
      setShowStudentForm(true)
      return
    }
    startQuiz(quizId, { name: formName, className: formClass, schoolName: formSchool })
  }

  const handleFormSubmit = () => {
    if (!formName.trim() || !formClass.trim()) return
    if (pendingQuizId) {
      startQuiz(pendingQuizId, { name: formName.trim(), className: formClass.trim(), schoolName: formSchool.trim() })
      setPendingQuizId(null)
    }
    setShowStudentForm(false)
  }

  if (!selectedGrade || !selectedSubject) return null

  const subjectName = selectedSubject === 'toan' ? 'Toán' : 'Ngữ văn'
  const subjectEmoji = selectedSubject === 'toan' ? '🔢' : '📖'

  const gradeColors: Record<number, { bg: string; text: string; accent: string }> = {
    1: { bg: 'bg-rose-50', text: 'text-rose-700', accent: 'bg-rose-500' },
    2: { bg: 'bg-orange-50', text: 'text-orange-700', accent: 'bg-orange-500' },
    3: { bg: 'bg-amber-50', text: 'text-amber-700', accent: 'bg-amber-500' },
    4: { bg: 'bg-emerald-50', text: 'text-emerald-700', accent: 'bg-emerald-500' },
    5: { bg: 'bg-teal-50', text: 'text-teal-700', accent: 'bg-teal-500' },
  }

  const gc = gradeColors[selectedGrade]

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      {/* Student info form modal */}
      {showStudentForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowStudentForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-orange-700 mb-4 text-center">
              Nhập thông tin của bạn ✏️
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nhập họ và tên..."
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Lớp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  placeholder="VD: 1A, 2B..."
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1">
                  Trường
                </label>
                <input
                  type="text"
                  value={formSchool}
                  onChange={(e) => setFormSchool(e.target.value)}
                  placeholder="Nhập tên trường..."
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-400 focus:outline-none text-base"
                />
              </div>
              <Button
                onClick={handleFormSubmit}
                disabled={!formName.trim() || !formClass.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-base rounded-xl"
              >
                Bắt đầu làm bài →
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${gc.bg} border-2 border-current/10 rounded-2xl p-4 sm:p-6 text-center`}
      >
        <h2 className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl ${gc.text}`}>
          {subjectEmoji} {subjectName} - Lớp {selectedGrade}
        </h2>
        <p className={`${gc.text} opacity-70 mt-1 text-sm`}>Chọn chương để làm bài kiểm tra</p>
      </motion.div>

      {/* Student quick info (if already entered) */}
      {studentInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-center text-amber-700 text-sm"
        >
          👤 {studentInfo.name} | Lớp {studentInfo.className}
          {studentInfo.schoolName && ` | ${studentInfo.schoolName}`}
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
          <p className="text-muted-foreground">Đang tải danh sách bài kiểm tra...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Quiz list */}
      {!loading && !error && quizzes.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <p className="text-amber-700 text-lg">Chưa có bài kiểm tra nào cho môn này.</p>
          <p className="text-amber-600 text-sm mt-2">Vui lòng quay lại sau nhé!</p>
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              variants={item}
              whileHover={{ scale: 1.01, x: 4 }}
              className="bg-white border-2 border-gray-100 hover:border-orange-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      Chương {index + 1}
                    </span>
                    {quiz.duration > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {quiz.duration} phút
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {quiz.chapterName}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {quiz.title}
                  </p>
                </div>
                <Button
                  onClick={() => handleStartQuiz(quiz.id)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl text-base shrink-0 gap-2 shadow-md"
                >
                  Kiểm tra online
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
