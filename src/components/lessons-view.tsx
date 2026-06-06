'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Star, ChevronDown, ChevronRight, Lightbulb, ArrowLeft, GraduationCap, Loader2, BookCheck, PenTool, Sparkles } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'

/* ─── Types ─── */
interface KeyConcept {
  text: string
  emoji: string
}

interface ExampleStep {
  step: string
  detail: string
}

interface Example {
  title: string
  steps: ExampleStep[]
}

interface PracticeTip {
  text: string
  emoji: string
}

interface Lesson {
  id: string
  chapter: number
  title: string
  description: string
  emoji: string
  difficulty: number
  keyConcepts: KeyConcept[]
  examples: Example[]
  practiceTips: PracticeTip[]
  relatedQuizGrade: number
  relatedQuizSubject: string
  relatedQuizChapter: number
}

/* ─── Constants ─── */
const gradeColors = [
  { bg: 'bg-rose-100 dark:bg-rose-950/30', border: 'border-rose-300 dark:border-rose-700', text: 'text-rose-700 dark:text-rose-300', hover: 'hover:bg-rose-200 dark:hover:bg-rose-900/40', accent: 'bg-rose-500', gradient: 'from-rose-400 to-pink-500', gradientSubtle: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20', glow: 'hover:shadow-rose-200/50 dark:hover:shadow-rose-800/30', cardGradient: 'from-rose-500 to-pink-500' },
  { bg: 'bg-orange-100 dark:bg-orange-950/30', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', hover: 'hover:bg-orange-200 dark:hover:bg-orange-900/40', accent: 'bg-orange-500', gradient: 'from-orange-400 to-amber-500', gradientSubtle: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20', glow: 'hover:shadow-orange-200/50 dark:hover:shadow-orange-800/30', cardGradient: 'from-orange-500 to-amber-500' },
  { bg: 'bg-amber-100 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-300', hover: 'hover:bg-amber-200 dark:hover:bg-amber-900/40', accent: 'bg-amber-500', gradient: 'from-amber-400 to-yellow-500', gradientSubtle: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20', glow: 'hover:shadow-amber-200/50 dark:hover:shadow-amber-800/30', cardGradient: 'from-amber-500 to-yellow-500' },
  { bg: 'bg-emerald-100 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-300', hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/40', accent: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-500', gradientSubtle: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20', glow: 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-800/30', cardGradient: 'from-emerald-500 to-green-500' },
  { bg: 'bg-teal-100 dark:bg-teal-950/30', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-300', hover: 'hover:bg-teal-200 dark:hover:bg-teal-900/40', accent: 'bg-teal-500', gradient: 'from-teal-400 to-cyan-500', gradientSubtle: 'from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20', glow: 'hover:shadow-teal-200/50 dark:hover:shadow-teal-800/30', cardGradient: 'from-teal-500 to-cyan-500' },
]

const gradeEmojis = ['🌸', '🍊', '🌻', '🌿', '🐬']
const gradeSubtitles = ['Làm quen với con số', 'Cộng trừ nhẩm', 'Bảng cửu chương', 'Phép tính nâng cao', 'Chuẩn bị thi chuyển cấp']

const subjectInfo = {
  toan: {
    label: 'Toán',
    emoji: '🔢',
    gradient: 'from-orange-400 to-amber-500',
    bgLight: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-300 dark:border-orange-700',
    text: 'text-orange-700 dark:text-orange-300',
    iconBg: 'bg-orange-500',
  },
  'ngu-van': {
    label: 'Ngữ văn',
    emoji: '📖',
    gradient: 'from-pink-400 to-rose-500',
    bgLight: 'bg-pink-50 dark:bg-pink-950/30',
    border: 'border-pink-300 dark:border-pink-700',
    text: 'text-pink-700 dark:text-pink-300',
    iconBg: 'bg-pink-500',
  },
}

const difficultyLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Rất dễ', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30' },
  2: { label: 'Dễ', color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30' },
  3: { label: 'Trung bình', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30' },
  4: { label: 'Khó', color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30' },
  5: { label: 'Rất khó', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30' },
}

/* ─── Animation variants ─── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

/* ─── Skeleton card ─── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl border-2 border-gray-100 dark:border-border bg-white dark:bg-card p-5 animate-pulse">
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-4 w-full" />
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
      <div className="flex gap-2">
        <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
    </div>
  )
}

/* ─── Difficulty stars ─── */
function DifficultyStars({ level }: { level: number }) {
  const diff = difficultyLabels[level] || difficultyLabels[3]
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= level ? 'text-amber-400 fill-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
      </div>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${diff.color}`}>
        {diff.label}
      </span>
    </div>
  )
}

/* ─── Expandable lesson card ─── */
function LessonCard({ lesson, gradeColor, onQuizClick }: { lesson: Lesson; gradeColor: typeof gradeColors[0]; onQuizClick: () => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      variants={item}
      layout
      className="rounded-2xl border-2 border-gray-100 dark:border-border bg-white dark:bg-card shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group"
    >
      {/* Gradient accent strip at top */}
      <div className={`h-1.5 bg-gradient-to-r ${gradeColor.cardGradient}`} />

      <div className="p-5">
        {/* Header: emoji + title + difficulty */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradeColor.gradient} flex items-center justify-center text-3xl shadow-md shrink-0`}>
            {lesson.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gradeColor.text} ${gradeColor.bg}`}>
                Chương {lesson.chapter}
              </span>
            </div>
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground leading-tight mb-1">
              {lesson.title}
            </h3>
            <DifficultyStars level={lesson.difficulty} />
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
          {lesson.description}
        </p>

        {/* Key concepts count badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
            <BookOpen className="w-3 h-3" />
            {lesson.keyConcepts.length} kiến thức
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
            <Lightbulb className="w-3 h-3" />
            {lesson.examples.length} ví dụ
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="flex-1 gap-1 text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-orange-200 dark:border-orange-800"
          >
            <BookCheck className="w-4 h-4" />
            Học bài
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>
          <Button
            size="sm"
            onClick={onQuizClick}
            className="gap-1 text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md"
          >
            <PenTool className="w-3.5 h-3.5" />
            Kiểm tra
          </Button>
        </div>
      </div>

      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 dark:border-border pt-4 space-y-5">
              {/* Key concepts */}
              <div>
                <h4 className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Kiến thức cần nhớ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {lesson.keyConcepts.map((concept, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/30"
                    >
                      <span className="text-lg shrink-0">{concept.emoji}</span>
                      <p className="text-sm text-foreground leading-relaxed">{concept.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Examples */}
              <div>
                <h4 className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  Ví dụ minh họa
                </h4>
                <div className="space-y-3">
                  {lesson.examples.map((example, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-900/30 p-4"
                    >
                      <p className="font-semibold text-emerald-700 dark:text-emerald-300 text-sm mb-2">
                        📌 {example.title}
                      </p>
                      <div className="space-y-2">
                        {example.steps.map((step, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 text-[10px] font-bold shrink-0">
                              {j + 1}
                            </span>
                            <div>
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                                {step.step}
                              </span>
                              <p className="text-sm text-foreground leading-relaxed">{step.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Practice tips */}
              <div>
                <h4 className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Mẹo luyện tập
                </h4>
                <div className="space-y-2">
                  {lesson.practiceTips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border border-yellow-100 dark:border-yellow-900/30"
                    >
                      <span className="text-xl shrink-0">{tip.emoji}</span>
                      <p className="text-sm text-foreground leading-relaxed">{tip.text}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main component ─── */
export function LessonsView() {
  const { selectGrade, selectSubject, goBack, setView } = useAppStore()
  const [step, setStep] = useState<'grade' | 'subject' | 'lessons'>('grade')
  const [selectedGradeLocal, setSelectedGradeLocal] = useState<number | null>(null)
  const [selectedSubjectLocal, setSelectedSubjectLocal] = useState<string | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch lessons when grade & subject are selected
  const fetchLessons = useCallback(async (grade: number, subject: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/lessons?grade=${grade}&subject=${subject}`)
      if (res.ok) {
        const data = await res.json()
        setLessons(data.lessons || [])
      }
    } catch (err) {
      console.error('Failed to fetch lessons:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle grade selection
  const handleGradeSelect = (grade: number) => {
    setSelectedGradeLocal(grade)
    setStep('subject')
  }

  // Handle subject selection
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubjectLocal(subject)
    setStep('lessons')
    if (selectedGradeLocal) {
      fetchLessons(selectedGradeLocal, subject)
    }
  }

  // Handle quiz click
  const handleQuizClick = (lesson: Lesson) => {
    // Set grade and subject in the global store for quiz navigation
    selectGrade(lesson.relatedQuizGrade)
    // Need to set subject and navigate to chapters after grade is set
    setTimeout(() => {
      selectSubject(lesson.relatedQuizSubject)
    }, 50)
  }

  // Go back handler based on current step
  const handleGoBack = () => {
    if (step === 'lessons') {
      setStep('subject')
      setSelectedSubjectLocal(null)
      setLessons([])
    } else if (step === 'subject') {
      setStep('grade')
      setSelectedGradeLocal(null)
    } else {
      goBack()
    }
  }

  const gc = selectedGradeLocal ? gradeColors[selectedGradeLocal - 1] : gradeColors[0]
  const si = selectedSubjectLocal ? subjectInfo[selectedSubjectLocal as keyof typeof subjectInfo] : subjectInfo.toan

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="text-foreground hover:bg-orange-50 dark:hover:bg-orange-950/30 gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <div className="flex-1">
          <h1 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-foreground flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-orange-500" />
            Bài Học
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {step === 'grade' && 'Chọn lớp học để xem bài giảng'}
            {step === 'subject' && `Lớp ${selectedGradeLocal} - Chọn môn học`}
            {step === 'lessons' && `${si.emoji} ${si.label} Lớp ${selectedGradeLocal}`}
          </p>
        </div>
      </motion.div>

      {/* Step: Grade Selection */}
      <AnimatePresence mode="wait">
        {step === 'grade' && (
          <motion.div
            key="grade"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Decorative header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-950/30 dark:via-amber-950/30 dark:to-yellow-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-5 sm:p-6 text-center mb-6 relative overflow-hidden"
            >
              <div className="absolute top-2 left-4 text-xl opacity-20 animate-float">📚</div>
              <div className="absolute top-3 right-6 text-lg opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>✏️</div>
              <div className="absolute bottom-2 right-10 text-lg opacity-20 animate-float" style={{ animationDelay: '1s' }}>🎓</div>
              <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-orange-700 dark:text-orange-300 relative z-10">
                📖 Chọn Lớp Học
              </h2>
              <p className="text-orange-600 dark:text-orange-400 text-sm mt-1 relative z-10">
                Học bài theo chương trình SGK 2024
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5"
            >
              {[1, 2, 3, 4, 5].map((grade) => {
                const colors = gradeColors[grade - 1]
                const emoji = gradeEmojis[grade - 1]
                const subtitle = gradeSubtitles[grade - 1]
                return (
                  <motion.button
                    key={grade}
                    variants={item}
                    whileHover={{ scale: 1.04, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGradeSelect(grade)}
                    className={`${colors.bg} ${colors.border} border-2 ${colors.hover} rounded-2xl p-4 sm:p-7 flex flex-col items-center gap-2 transition-all shadow-md hover:shadow-xl cursor-pointer group relative overflow-hidden card-glow ${colors.glow}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradientSubtle} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <span className="text-4xl sm:text-5xl group-hover:animate-wiggle relative z-10">{emoji}</span>
                    <span className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl ${colors.text} relative z-10`}>
                      Lớp {grade}
                    </span>
                    <span className={`${colors.text} dark:text-opacity-80 text-xs opacity-70 text-center leading-tight relative z-10`}>
                      {subtitle}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] relative z-10">
                      <span className={`${colors.accent} text-white px-2 py-0.5 rounded-full font-semibold`}>
                        2 môn
                      </span>
                      <span className="text-foreground/50">6+ bài</span>
                    </div>
                  </motion.button>
                )
              })}
            </motion.div>
          </motion.div>
        )}

        {/* Step: Subject Selection */}
        {step === 'subject' && selectedGradeLocal && (
          <motion.div
            key="subject"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Grade header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${gc.bg} ${gc.border} border-2 rounded-2xl p-4 sm:p-6 text-center mb-6 relative overflow-hidden`}
            >
              <div className="absolute top-2 left-4 text-lg opacity-20 animate-float">📚</div>
              <div className="absolute top-3 right-6 text-lg opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>✏️</div>
              <h2 className={`font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl ${gc.text} relative z-10`}>
                Lớp {selectedGradeLocal} 🎒
              </h2>
              <p className={`${gc.text} opacity-70 mt-1 relative z-10`}>Chọn môn học để xem bài giảng</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(['toan', 'ngu-van'] as const).map((subject) => {
                const info = subjectInfo[subject]
                return (
                  <motion.button
                    key={subject}
                    initial={{ opacity: 0, x: subject === 'toan' ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubjectSelect(subject)}
                    className={`group cursor-pointer ${info.bgLight} ${info.border} border-2 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all text-center relative overflow-hidden card-glow`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${info.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <span className="text-6xl block mb-3 group-hover:animate-wiggle">{info.emoji}</span>
                      <h3 className={`font-[family-name:var(--font-patrick-hand)] text-3xl ${info.text} mb-2`}>
                        {info.label}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {subject === 'toan' ? 'Kiến thức Toán học' : 'Kiến thức Ngữ văn'}
                      </p>
                      <div className={`inline-flex items-center gap-2 ${info.iconBg} text-white px-4 py-2 rounded-full font-semibold text-sm shadow-md group-hover:opacity-90 transition-opacity`}>
                        <BookOpen className="w-4 h-4" />
                        Xem bài học →
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Step: Lessons List */}
        {step === 'lessons' && selectedGradeLocal && selectedSubjectLocal && (
          <motion.div
            key="lessons"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.25 }}
          >
            {/* Subject header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${si.bgLight || 'bg-orange-50 dark:bg-orange-950/30'} ${si.border || 'border-orange-300 dark:border-orange-700'} border-2 rounded-2xl p-4 sm:p-6 text-center mb-6 relative overflow-hidden`}
            >
              <div className="absolute top-2 left-4 text-xl opacity-20 animate-float">📖</div>
              <div className="absolute top-3 right-6 text-lg opacity-20 animate-float" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute bottom-2 right-1/4 text-lg opacity-20 animate-sparkle" style={{ animationDelay: '1s' }}>💡</div>
              <h2 className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl ${si.text || 'text-orange-700 dark:text-orange-300'} relative z-10 flex items-center justify-center gap-2`}>
                <span className="text-3xl">{si.emoji}</span>
                {si.label} Lớp {selectedGradeLocal}
              </h2>
              <p className="text-muted-foreground text-sm mt-1 relative z-10">
                {lessons.length} bài học · Chương trình SGK 2024
              </p>
            </motion.div>

            {/* Loading state */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Lessons grid */}
            {!loading && lessons.length > 0 && (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {lessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    gradeColor={gc}
                    onQuizClick={() => handleQuizClick(lesson)}
                  />
                ))}
              </motion.div>
            )}

            {/* Empty state */}
            {!loading && lessons.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <span className="text-6xl block mb-4">📚</span>
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground mb-2">
                  Chưa có bài học
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Bài học cho môn này đang được cập nhật. Hãy quay lại sau nhé!
                </p>
                <Button
                  onClick={() => {
                    setStep('subject')
                    setSelectedSubjectLocal(null)
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <ChevronRight className="w-4 h-4" />
                  Chọn môn khác
                </Button>
              </motion.div>
            )}

            {/* Bottom tip */}
            {!loading && lessons.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-muted-foreground text-xs flex items-center justify-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-500" />
                  Nhấn &quot;Học bài&quot; để xem nội dung chi tiết · Nhấn &quot;Kiểm tra&quot; để làm bài tập
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
