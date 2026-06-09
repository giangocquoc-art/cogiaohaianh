'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calculator, BookOpenText, Star, BarChart3, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface SubjectStats {
  quizCount: number
  totalQuestions: number
  avgDuration: number
}

/* Floating math symbols for decoration (reduced from 10 to 5) */
const mathSymbols = ['+', '×', '÷', '=', 'π']
const literatureSymbols = ['A', 'B', 'â', 'ơ', 'đ']

const subjectData = {
  toan: {
    stars: 4,
    difficulty: 'Trung bình',
    difficultyClass: 'difficulty-medium',
    description: 'Kiểm tra kiến thức Toán học - Tính toán, Giải bài tập',
    gradient: 'from-orange-100 to-amber-100',
    border: 'border-orange-300',
    bgButton: 'bg-orange-500',
    bgButtonHover: 'hover:bg-orange-600',
    textColor: 'text-orange-700',
    textColorLight: 'text-orange-600',
    imageSrc: '/images/math-subject.png',
    icon: Calculator,
    iconColor: 'text-orange-600',
    label: 'Toán',
    emoji: '🔢',
  },
  'ngu-van': {
    stars: 3,
    difficulty: 'Cơ bản',
    difficultyClass: 'difficulty-easy',
    description: 'Kiểm tra kiến thức Ngữ văn - Đọc hiểu, Chính tả, Luyện từ',
    gradient: 'from-pink-100 to-rose-100',
    border: 'border-pink-300',
    bgButton: 'bg-pink-500',
    bgButtonHover: 'hover:bg-pink-600',
    textColor: 'text-pink-700',
    textColorLight: 'text-pink-600',
    imageSrc: '/images/vietnamese-subject.png',
    icon: BookOpenText,
    iconColor: 'text-pink-600',
    label: 'Ngữ văn',
    emoji: '📖',
  },
}

export function SubjectView() {
  const { selectedGrade, selectSubject, goBack, studentInfo } = useAppStore()
  const [stats, setStats] = useState<Record<string, SubjectStats>>({ toan: { quizCount: 0, totalQuestions: 0, avgDuration: 0 }, 'ngu-van': { quizCount: 0, totalQuestions: 0, avgDuration: 0 } })

  useEffect(() => {
    if (!selectedGrade) return
    const fetchStats = async () => {
      try {
        const [toanRes, nguVanRes] = await Promise.all([
          fetch(`/api/quizzes?grade=${selectedGrade}&subject=toan`),
          fetch(`/api/quizzes?grade=${selectedGrade}&subject=ngu-van`),
        ])
        if (toanRes.ok) {
          const data = await toanRes.json()
          const totalQ = data.reduce((sum: number, q: { _count?: { questions: number }; duration: number }) => sum + (q._count?.questions || 0), 0)
          const avgD = data.length > 0 ? data.reduce((sum: number, q: { duration: number }) => sum + q.duration, 0) / data.length : 0
          setStats(prev => ({ ...prev, toan: { quizCount: data.length, totalQuestions: totalQ, avgDuration: Math.round(avgD) } }))
        }
        if (nguVanRes.ok) {
          const data = await nguVanRes.json()
          const totalQ = data.reduce((sum: number, q: { _count?: { questions: number }; duration: number }) => sum + (q._count?.questions || 0), 0)
          const avgD = data.length > 0 ? data.reduce((sum: number, q: { duration: number }) => sum + q.duration, 0) / data.length : 0
          setStats(prev => ({ ...prev, 'ngu-van': { quizCount: data.length, totalQuestions: totalQ, avgDuration: Math.round(avgD) } }))
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
  }, [selectedGrade])

  if (!selectedGrade) return null

  const gradeColors: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
    2: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
    3: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    4: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
    5: { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
  }

  const gc = gradeColors[selectedGrade]

  return (
    <div className="space-y-6">
      {/* Grade header - premium refined */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-5 sm:p-6 border border-orange-100 dark:border-orange-900/30 bg-gradient-to-r from-orange-50/50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/20 text-center relative overflow-hidden`}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 opacity-60" />

        {/* Keep only 2 floating emojis */}
        <div className="absolute top-3 left-6 text-lg opacity-15 dark:opacity-35 animate-float" style={{ animationDelay: '0s' }}>📚</div>
        <div className="absolute bottom-3 right-6 text-lg opacity-15 dark:opacity-35 animate-float" style={{ animationDelay: '1s' }}>✨</div>

        <h2 className={`font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl relative z-10`}>
          <span className="premium-gradient-text">Lớp {selectedGrade}</span> <span>🎒</span>
        </h2>
        <p className="text-foreground/60 mt-1 relative z-10 text-sm">Chọn môn học để tiếp tục</p>
      </motion.div>

      {/* Student info reminder - more subtle */}
      {studentInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-800/20 rounded-lg px-4 py-2 text-center text-orange-700 dark:text-orange-300 text-sm"
        >
          👤 {studentInfo.name} | Lớp {studentInfo.className}
          {studentInfo.schoolName && ` | ${studentInfo.schoolName}`}
        </motion.div>
      )}

      {/* Subject cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Math card - premium */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selectSubject('toan')}
          className="group cursor-pointer bg-white dark:bg-card premium-card p-6 sm:p-8 text-left relative overflow-hidden"
        >
          {/* Floating math symbols decoration (5 only) */}
          {mathSymbols.map((symbol, i) => (
            <span
              key={i}
              className="math-symbol"
              style={{
                top: `${15 + (i * 16) % 70}%`,
                left: `${8 + (i * 18) % 85}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3.5 + (i % 2)}s`,
              }}
            >
              {symbol}
            </span>
          ))}

          <div className="flex flex-col items-center text-center gap-4 relative z-10">
            {/* Subject image with premium ring */}
            <div className="premium-ring rounded-2xl">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden">
                <Image
                  src="/images/math-subject.png"
                  alt="Toán"
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-contain group-hover:animate-wiggle"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calculator className="w-6 h-6 text-orange-600" />
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-3xl text-orange-700 dark:text-orange-300">
                  Toán
                </h3>
              </div>
              <p className="text-orange-600/80 dark:text-orange-400 text-sm">
                Kiểm tra kiến thức Toán học - Tính toán, Giải bài tập
              </p>

              {/* Star rating / Difficulty - cleaner with text-amber-400 */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="premium-badge premium-badge-amber text-xs">
                  Trung bình
                </span>
              </div>
            </div>

            {/* Quick Stats mini card - premium stat */}
            <div className="premium-stat w-full">
              <div className="flex items-center gap-1.5 mb-2 text-orange-700 dark:text-orange-300">
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Thống kê nhanh</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{stats.toan.quizCount}</p>
                  <p className="text-[10px] text-orange-500 dark:text-orange-400 font-medium">Bài kiểm tra</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{stats.toan.totalQuestions}</p>
                  <p className="text-[10px] text-orange-500 dark:text-orange-400 font-medium">Câu hỏi</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-0.5">
                    <Clock className="w-3 h-3 text-orange-500" />
                    <p className="text-lg font-bold text-orange-700 dark:text-orange-300">{stats.toan.avgDuration}</p>
                  </div>
                  <p className="text-[10px] text-orange-500 font-medium">Phút TB</p>
                </div>
              </div>
            </div>

            <div className="premium-btn flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Bắt đầu làm Toán →
            </div>
          </div>
        </motion.button>

        {/* Vietnamese card - premium */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => selectSubject('ngu-van')}
          className="group cursor-pointer bg-white dark:bg-card premium-card p-6 sm:p-8 text-left relative overflow-hidden"
        >
          {/* Floating literature symbols decoration (5 only) */}
          {literatureSymbols.map((symbol, i) => (
            <span
              key={i}
              className="literature-symbol"
              style={{
                top: `${12 + (i * 18) % 75}%`,
                left: `${6 + (i * 17) % 88}%`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: `${4 + (i % 2)}s`,
              }}
            >
              {symbol}
            </span>
          ))}

          <div className="flex flex-col items-center text-center gap-4 relative z-10">
            {/* Subject image with premium ring */}
            <div className="premium-ring rounded-2xl">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden">
                <Image
                  src="/images/vietnamese-subject.png"
                  alt="Ngữ văn"
                  fill
                  sizes="(max-width: 640px) 112px, 144px"
                  className="object-contain group-hover:animate-wiggle"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpenText className="w-6 h-6 text-pink-600" />
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-3xl text-pink-700 dark:text-pink-300">
                  Ngữ văn
                </h3>
              </div>
              <p className="text-pink-600/80 dark:text-pink-400 text-sm">
                Kiểm tra kiến thức Ngữ văn - Đọc hiểu, Chính tả, Luyện từ
              </p>

              {/* Star rating / Difficulty - cleaner with text-amber-400 */}
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= 3 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="premium-badge premium-badge-emerald text-xs">
                  Cơ bản
                </span>
              </div>
            </div>

            {/* Quick Stats mini card - premium stat */}
            <div className="premium-stat w-full">
              <div className="flex items-center gap-1.5 mb-2 text-pink-700 dark:text-pink-300">
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Thống kê nhanh</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-pink-700 dark:text-pink-300">{stats['ngu-van'].quizCount}</p>
                  <p className="text-[10px] text-pink-500 dark:text-pink-400 font-medium">Bài kiểm tra</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-pink-700 dark:text-pink-300">{stats['ngu-van'].totalQuestions}</p>
                  <p className="text-[10px] text-pink-500 dark:text-pink-400 font-medium">Câu hỏi</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-0.5">
                    <Clock className="w-3 h-3 text-pink-500" />
                    <p className="text-lg font-bold text-pink-700 dark:text-pink-300">{stats['ngu-van'].avgDuration}</p>
                  </div>
                  <p className="text-[10px] text-pink-500 font-medium">Phút TB</p>
                </div>
              </div>
            </div>

            <div className="premium-btn flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #ec4899, #f472b6)' }}>
              <Zap className="w-4 h-4" />
              Bắt đầu làm Ngữ văn →
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
