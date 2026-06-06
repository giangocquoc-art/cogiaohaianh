'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ArrowRight, Loader2, ChevronDown, Lightbulb } from 'lucide-react'
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

// Study tips map based on Vietnamese curriculum
const studyTips: Record<string, { tips: string[]; keyPoints: string[] }> = {
  // Lớp 1 Toán
  '1-toan-chuong-1': {
    tips: [
      'Nhớ thứ tự các số từ 1 đến 10. Số lớn hơn đứng sau, số nhỏ hơn đứng trước.',
      'Tập đếm đồ vật xung quanh: bút, kẹo, quả,... để nhớ số dễ hơn.',
      'Dùng ngón tay để đếm - đó là cách học tự nhiên nhất!',
    ],
    keyPoints: [
      'Nhận biết các số từ 1 đến 10',
      'So sánh số lớn hơn, nhỏ hơn',
      'Viết đúng các chữ số',
      'Sắp xếp các số theo thứ tự',
    ],
  },
  '1-toan-chuong-2': {
    tips: [
      'Cộng là thêm vào. Khi cộng hai số, kết quả luôn lớn hơn hoặc bằng mỗi số.',
      'Dùng đồ vật để thực hành: lấy 3 cái kẹo, thêm 2 cái kẹo nữa, đếm tất cả.',
      'Học thuộc bảng cộng trong phạm vi 10 để làm bài nhanh hơn.',
    ],
    keyPoints: [
      'Phép cộng trong phạm vi 10',
      'Biểu tượng "+" và "="',
      'Tính chất giao hoán: a + b = b + a',
      'Giải toán có lời văn đơn giản',
    ],
  },
  '1-toan-chuong-3': {
    tips: [
      'Trừ là bớt đi. Khi trừ, kết quả luôn nhỏ hơn hoặc bằng số bị trừ.',
      'Dùng đồ vật để thực hành: có 5 cái kẹo, ăn 2 cái, còn mấy cái?',
      'Nhớ: Phép trừ là phép ngược của phép cộng. 5 - 2 = 3 vì 3 + 2 = 5.',
    ],
    keyPoints: [
      'Phép trừ trong phạm vi 10',
      'Biểu tượng "−"',
      'Mối quan hệ giữa phép cộng và phép trừ',
      'Giải toán có lời văn về phép trừ',
    ],
  },
  '1-toan-chuong-4': {
    tips: [
      'Số từ 11-19 gồm 1 chục và vài đơn vị. Số 20 gồm 2 chục.',
      'Viết số: chữ số hàng chục viết trước, chữ số hàng đơn vị viết sau.',
      'Tập đọc số: 11 = "mười một", 15 = "mười lăm", 20 = "hai mươi".',
    ],
    keyPoints: [
      'Đọc, viết các số đến 20',
      'Phân tích số: hàng chục và hàng đơn vị',
      'So sánh các số trong phạm vi 20',
      'Phép cộng, trừ không nhớ trong phạm vi 20',
    ],
  },
  // Lớp 2 Toán
  '2-toan-chuong-1': {
    tips: [
      'Ôn lại các số đến 20 trước khi học số lớn hơn.',
      'Số đến 100 gồm hàng chục và hàng đơn vị. VD: 35 = 3 chục + 5 đơn vị.',
      'Tập đếm nhảy 2, nhảy 5, nhảy 10 để nhớ số tốt hơn.',
    ],
    keyPoints: [
      'Các số đến 100',
      'Đọc, viết, so sánh số đến 100',
      'Phân tích số hàng chục, hàng đơn vị',
    ],
  },
  '2-toan-chuong-2': {
    tips: [
      'Phép cộng có nhớ: khi cộng hàng đơn vị lớn hơn 10, nhớ sang hàng chục.',
      'Luôn cộng từ hàng đơn vị trước, rồi đến hàng chục.',
      'Tập tính nhẩm: 28 + 5 = 28 + 2 + 3 = 33.',
    ],
    keyPoints: [
      'Phép cộng có nhớ trong phạm vi 100',
      'Cộng nhẩm',
      'Giải toán có lời văn',
    ],
  },
  '2-toan-chuong-3': {
    tips: [
      'Phép trừ có nhớ: khi không đủ để trừ, mượn từ hàng chục.',
      'Nhớ: 32 - 8: 2 không đủ trừ 8, mượn 1 chục → 12 - 8 = 4, còn 2 chục.',
      'Luôn kiểm tra lại bằng phép cộng: 32 - 8 = 24, thử lại 24 + 8 = 32 ✓',
    ],
    keyPoints: [
      'Phép trừ có nhớ trong phạm vi 100',
      'Trừ nhẩm',
      'Kiểm tra kết quả bằng phép cộng',
    ],
  },
  // Lớp 3 Toán
  '3-toan-chuong-1': {
    tips: [
      'Số đến 1000 gồm hàng trăm, hàng chục, hàng đơn vị.',
      'VD: 325 = 3 trăm + 2 chục + 5 đơn vị.',
      'Tập đọc số theo từng hàng từ cao đến thấp.',
    ],
    keyPoints: [
      'Các số đến 1000',
      'Phân tích số: hàng trăm, chục, đơn vị',
      'So sánh số đến 1000',
    ],
  },
  // Lớp 1 Ngữ văn
  '1-ngu-van-chuong-1': {
    tips: [
      'Tập nhìn nhận các chữ cái và âm tương ứng.',
      'Đọc theo thứ tự: nguyên âm trước, phụ âm sau.',
      'Tập ghép chữ thành tiếng: b-a → ba, m-e → me.',
    ],
    keyPoints: [
      'Nhận diện các chữ cái',
      'Ghép chữ thành tiếng',
      'Đọc tiếng, từ ngữ đơn giản',
    ],
  },
  '1-ngu-van-chuong-2': {
    tips: [
      'Vần là phần cuối của tiếng. Tiếng = âm đầu + vần.',
      'VD: "ba" → âm đầu "b" + vần "a"; "mẹ" → âm đầu "m" + vần "ê".',
      'Tập đánh vần từng tiếng trước khi đọc nguyên câu.',
    ],
    keyPoints: [
      'Nhận biết vần và tiếng',
      'Đánh vần tiếng',
      'Đọc trơn từ và câu ngắn',
    ],
  },
  '1-ngu-van-chuong-3': {
    tips: [
      'Tập viết đúng nét chữ, đều khoảng cách.',
      'Viết chữ thường trước, rồi mới luyện chữ hoa.',
      'Chữ viết ngay ngắn giúp bạn đọc tốt hơn.',
    ],
    keyPoints: [
      'Tập viết chữ thường',
      'Nét chữ đúng quy định',
      'Viết từ, câu đơn giản',
    ],
  },
}

function StudyTipsSection({ quiz }: { quiz: QuizInfo }) {
  const [isOpen, setIsOpen] = useState(false)
  // Build the key for studyTips map - chapter is like "chuong-1", we need "1-toan-chuong-1"
  const chapterNum = quiz.chapter.replace('chuong-', '')
  const tipKey = `${quiz.grade}-${quiz.subject}-chuong-${chapterNum}`
  const tipsData = studyTips[tipKey]

  if (!tipsData) return null

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors py-1"
      >
        <Lightbulb className="w-4 h-4" />
        <span>Ôn tập</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2 space-y-3">
              {/* Key knowledge points */}
              <div>
                <h5 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1">
                  📌 Kiến thức trọng tâm
                </h5>
                <ul className="space-y-1">
                  {tipsData.keyPoints.map((point, i) => (
                    <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tips */}
              <div>
                <h5 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1">
                  💡 Mẹo làm bài tốt
                </h5>
                <ul className="space-y-1.5">
                  {tipsData.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                      <span className="shrink-0">✨</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
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
                    {quiz._count?.questions && (
                      <span className="text-xs text-muted-foreground">
                        📝 {quiz._count.questions} câu
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {quiz.chapterName}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-0.5">
                    {quiz.title}
                  </p>
                  {/* Study tips section */}
                  <StudyTipsSection quiz={quiz} />
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
