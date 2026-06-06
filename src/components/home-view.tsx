'use client'

import { useAppStore } from '@/store/app-store'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { BookOpen, Star, Sparkles, Clock, Trophy, BarChart3, PenTool, Users, GraduationCap, BookCheck, Flame, ChevronRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'

const gradeColors = [
  { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700', hover: 'hover:bg-rose-200', accent: 'bg-rose-500', gradient: 'from-rose-400 to-pink-500', gradientSubtle: 'from-rose-50 to-pink-50', glow: 'hover:shadow-rose-200/50' },
  { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', hover: 'hover:bg-orange-200', accent: 'bg-orange-500', gradient: 'from-orange-400 to-amber-500', gradientSubtle: 'from-orange-50 to-amber-50', glow: 'hover:shadow-orange-200/50' },
  { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700', hover: 'hover:bg-amber-200', accent: 'bg-amber-500', gradient: 'from-amber-400 to-yellow-500', gradientSubtle: 'from-amber-50 to-yellow-50', glow: 'hover:shadow-amber-200/50' },
  { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700', hover: 'hover:bg-emerald-200', accent: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-500', gradientSubtle: 'from-emerald-50 to-green-50', glow: 'hover:shadow-emerald-200/50' },
  { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700', hover: 'hover:bg-teal-200', accent: 'bg-teal-500', gradient: 'from-teal-400 to-cyan-500', gradientSubtle: 'from-teal-50 to-cyan-50', glow: 'hover:shadow-teal-200/50' },
]

const gradeEmojis = ['🌸', '🍊', '🌻', '🌿', '🐬']
const gradeSubtitles = [
  'Làm quen với con số',
  'Cộng trừ nhẩm',
  'Bảng cửu chương',
  'Phép tính nâng cao',
  'Chuẩn bị thi chuyển cấp',
]
const gradeSubjectIcons = [
  ['🔢', '📝'],
  ['➕', '📖'],
  ['✖️', '✍️'],
  ['📐', '📚'],
  ['🧮', '🎓'],
]
const gradeChapters = [6, 7, 8, 8, 7]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

/* Animated counter hook */
function useAnimatedCounter(target: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (startOnView && !inView) return
    if (hasStarted.current) return
    hasStarted.current = true

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [inView, target, duration, startOnView])

  return { count, ref }
}

/* Scrolling announcement ticker messages */
const tickerMessages = [
  '🎉 Chào mừng năm học mới!',
  '📝 Đã có 27+ bài kiểm tra online',
  '🌟 Làm bài kiểm tra để xem kết quả ngay!',
  '🏆 Xem bảng điểm và thành tích!',
  '📚 Ôn tập Toán và Ngữ văn lớp 1-5',
  '⏱️ Có tính giờ khi làm bài!',
  '✨ Gợi ý AI giúp học sinh hiểu bài tốt hơn!',
]

/* Popular quizzes data */
const popularQuizzes = [
  { grade: 1, subject: 'toan', chapterName: 'Số từ 1 đến 10', icon: '🔢', emoji: '🌸', color: 'from-rose-400 to-pink-500', bgLight: 'bg-rose-50', textColor: 'text-rose-700' },
  { grade: 3, subject: 'toan', chapterName: 'Bảng cửu chương', icon: '✖️', emoji: '🌻', color: 'from-amber-400 to-yellow-500', bgLight: 'bg-amber-50', textColor: 'text-amber-700' },
  { grade: 2, subject: 'toan', chapterName: 'Phép cộng có nhớ', icon: '➕', emoji: '🍊', color: 'from-orange-400 to-amber-500', bgLight: 'bg-orange-50', textColor: 'text-orange-700' },
  { grade: 1, subject: 'ngu-van', chapterName: 'Tập đọc - Ghép chữ', icon: '📖', emoji: '🌸', color: 'from-pink-400 to-rose-500', bgLight: 'bg-pink-50', textColor: 'text-pink-700' },
]

/* School-themed emoji composition for hero decoration */
const schoolEmojis = ['📐', '📏', '✂️', '🖍️', '🎒', '🍎', '📝', '✏️', '📌', '💡']

export function HomeView() {
  const { selectGrade } = useAppStore()

  const quizzesCounter = useAnimatedCounter(27, 1500)
  const subjectsCounter = useAnimatedCounter(10, 1500)
  const gradesCounter = useAnimatedCounter(5, 1000)
  const studentsCounter = useAnimatedCounter(100, 2000)

  return (
    <div className="space-y-8">
      {/* ===== SCROLLING ANNOUNCEMENT BANNER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 py-2.5 shadow-md"
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        <div className="ticker-container">
          <div className="ticker-content">
            {tickerMessages.map((msg, i) => (
              <span key={i} className="inline-block text-white font-semibold text-sm px-6">
                {msg}
                <span className="ml-6 text-white/50">●</span>
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {tickerMessages.map((msg, i) => (
              <span key={`dup-${i}`} className="inline-block text-white font-semibold text-sm px-6">
                {msg}
                <span className="ml-6 text-white/50">●</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== HERO SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200 p-6 sm:p-8 shadow-lg wave-separator"
      >
        {/* Layered background patterns */}
        <div className="absolute inset-0 pattern-clouds opacity-40" />
        <div className="absolute inset-0 pattern-dots opacity-20" />

        {/* Floating animated decorations */}
        <div className="absolute top-3 right-8 text-4xl animate-drift-right opacity-70">🌟</div>
        <div className="absolute top-16 right-20 text-2xl animate-sparkle opacity-50" style={{ animationDelay: '0.8s' }}>⭐</div>
        <div className="absolute bottom-8 left-10 text-3xl animate-drift-left opacity-60">📚</div>
        <div className="absolute top-10 left-6 text-2xl animate-float opacity-40" style={{ animationDelay: '0.5s' }}>✏️</div>
        <div className="absolute top-4 right-1/3 text-xl animate-float opacity-50" style={{ animationDelay: '1.2s' }}>☁️</div>
        <div className="absolute bottom-4 right-12 text-xl animate-drift-left opacity-40" style={{ animationDelay: '2s' }}>☁️</div>
        <div className="absolute top-1/2 right-4 text-xl animate-sparkle opacity-60" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute bottom-12 left-1/3 text-lg animate-sparkle opacity-50" style={{ animationDelay: '1.5s' }}>✨</div>
        <div className="absolute top-1/3 left-2 text-lg animate-drift-right opacity-40" style={{ animationDelay: '0.7s' }}>🖍️</div>

        {/* Slow-spinning background decoration */}
        <div className="absolute -top-10 -right-10 w-40 h-40 opacity-10 animate-spin-slow">
          <div className="w-full h-full rounded-full border-8 border-dashed border-orange-400" />
        </div>

        {/* School-themed decorative illustration area */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1 opacity-20 pointer-events-none select-none">
          {schoolEmojis.map((emoji, i) => (
            <span
              key={i}
              className="text-2xl sm:text-3xl animate-float"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Teacher image with breathing animation */}
          <div className="relative w-36 h-36 sm:w-48 sm:h-48 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-amber-200 rounded-full opacity-30 animate-breathing scale-110" />
            <Image
              src="/images/teacher-hero.png"
              alt="Cô Giáo Hải Anh"
              fill
              sizes="(max-width: 640px) 144px, 192px"
              className="object-contain drop-shadow-lg animate-breathing"
              priority
            />
            {/* Sparkle ring around image */}
            <div className="absolute -top-2 -left-2 text-lg animate-sparkle" style={{ animationDelay: '0s' }}>✨</div>
            <div className="absolute -bottom-1 -right-1 text-lg animate-sparkle" style={{ animationDelay: '0.7s' }}>✨</div>
            <div className="absolute top-0 right-2 text-sm animate-sparkle" style={{ animationDelay: '1.4s' }}>💫</div>
          </div>

          <div className="text-center sm:text-left flex-1">
            {/* Welcome text with sparkles */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xl animate-sparkle">🌟</span>
              <span className="text-xl animate-sparkle" style={{ animationDelay: '0.5s' }}>🌟</span>
              <span className="text-xl animate-sparkle" style={{ animationDelay: '1s' }}>🌟</span>
            </div>
            <h2 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-5xl text-orange-800 mb-2 leading-tight">
              Chào mừng các em! 🎉
            </h2>
            <p className="text-orange-700 text-base sm:text-lg leading-relaxed max-w-lg">
              Cô Giáo Hải Anh chúc các em có những giờ học thật vui vẻ và thú vị!
              Hãy chọn lớp của các em để bắt đầu nhé!
            </p>
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
              <Sparkles className="w-5 h-5 text-amber-500 animate-sparkle" />
              <span className="text-amber-700 font-semibold text-sm">Kiểm tra online</span>
              <span className="text-amber-400">•</span>
              <span className="text-amber-700 font-semibold text-sm">Xem kết quả</span>
              <span className="text-amber-400">•</span>
              <span className="text-amber-700 font-semibold text-sm">Học tập vui vẻ</span>
              <Sparkles className="w-5 h-5 text-amber-500 animate-sparkle" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== POPULAR QUIZZES SECTION ===== */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-foreground">
            Bài Kiểm Tra Phổ Biến
          </h2>
          <span className="text-xl animate-sparkle">🔥</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {popularQuizzes.map((quiz, index) => (
            <motion.button
              key={index}
              variants={item}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => selectGrade(quiz.grade)}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-lg transition-all text-left p-4 sm:p-5 card-glow"
            >
              {/* Gradient accent top strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${quiz.color}`} />

              {/* Grade badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${quiz.color} text-white shadow-sm`}>
                  {quiz.emoji} Lớp {quiz.grade}
                </span>
                <span className="text-2xl">{quiz.icon}</span>
              </div>

              {/* Subject */}
              <span className="text-xs text-muted-foreground font-medium">
                {quiz.subject === 'toan' ? '🔢 Toán' : '📖 Ngữ văn'}
              </span>

              {/* Chapter name */}
              <h3 className={`font-[family-name:var(--font-patrick-hand)] text-lg mt-1 ${quiz.textColor} leading-tight`}>
                {quiz.chapterName}
              </h3>

              {/* CTA */}
              <div className="flex items-center gap-1 mt-3 text-orange-500 text-xs font-semibold group-hover:text-orange-600 transition-colors">
                <span>Làm bài</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ===== GRADE CARDS SECTION ===== */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-foreground">
            Chọn Lớp Học
          </h2>
          <Star className="w-5 h-5 text-amber-400 animate-sparkle" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5"
        >
          {[1, 2, 3, 4, 5].map((grade) => {
            const colors = gradeColors[grade - 1]
            const emoji = gradeEmojis[grade - 1]
            const subtitle = gradeSubtitles[grade - 1]
            const icons = gradeSubjectIcons[grade - 1]
            const chapters = gradeChapters[grade - 1]
            return (
              <motion.button
                key={grade}
                variants={item}
                whileHover={{ scale: 1.07, y: -6 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectGrade(grade)}
                className={`${colors.bg} ${colors.border} border-2 ${colors.hover} rounded-2xl p-5 sm:p-7 flex flex-col items-center gap-2 transition-all shadow-md hover:shadow-xl cursor-pointer group relative overflow-hidden card-glow ${colors.glow}`}
              >
                {/* Subtle gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradientSubtle} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Hover glow ring */}
                <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-15 blur-md transition-opacity duration-300`} />

                {/* Popular badge for Lớp 1 */}
                {grade === 1 && (
                  <div className="absolute -top-0 -right-0 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl shadow-sm z-10">
                    🔥 Phổ biến
                  </div>
                )}

                <span className="text-4xl sm:text-5xl group-hover:animate-wiggle relative z-10">
                  {emoji}
                </span>
                <span className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl ${colors.text} relative z-10`}>
                  Lớp {grade}
                </span>

                {/* Subtitle */}
                <span className={`${colors.text} text-xs opacity-70 text-center leading-tight relative z-10`}>
                  {subtitle}
                </span>

                {/* Subject icons grid */}
                <div className="flex gap-2 text-lg relative z-10">
                  {icons.map((icon, i) => (
                    <span key={i} className="bg-white/50 rounded-lg px-1.5 py-0.5 shadow-sm">{icon}</span>
                  ))}
                </div>

                {/* Bottom info bar */}
                <div className="flex items-center gap-3 text-[11px] relative z-10">
                  <span className={`${colors.accent} text-white px-2 py-0.5 rounded-full font-semibold`}>
                    2 môn
                  </span>
                  <span className="text-foreground/50">
                    {chapters} chương
                  </span>
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap className="w-6 h-6 text-emerald-500" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-foreground">
            Tính Năng Học Tập
          </h2>
          <span className="text-xl animate-sparkle">✨</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              icon: <PenTool className="w-7 h-7" />,
              title: 'Kiểm tra online',
              description: 'Làm bài kiểm tra trực tiếp trên máy tính',
              gradient: 'from-rose-400 to-orange-400',
              bgLight: 'bg-rose-50',
              emoji: '📝',
            },
            {
              icon: <Clock className="w-7 h-7" />,
              title: 'Tính thời gian',
              description: 'Luyện tập quản lý thời gian làm bài',
              gradient: 'from-amber-400 to-yellow-400',
              bgLight: 'bg-amber-50',
              emoji: '⏱️',
            },
            {
              icon: <BarChart3 className="w-7 h-7" />,
              title: 'Xem kết quả',
              description: 'Kết quả chấm ngay lập tức',
              gradient: 'from-emerald-400 to-green-400',
              bgLight: 'bg-emerald-50',
              emoji: '📊',
            },
            {
              icon: <Trophy className="w-7 h-7" />,
              title: 'Thành tích',
              description: 'Theo dõi tiến độ học tập',
              gradient: 'from-teal-400 to-cyan-400',
              bgLight: 'bg-teal-50',
              emoji: '🏆',
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${feature.bgLight} border border-white/50 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group cursor-default hover-lift`}
            >
              {/* Gradient background accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.gradient} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />

              {/* Shimmer on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer pointer-events-none" />

              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md mb-3`}>
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg sm:text-xl text-foreground mb-1">
                  {feature.emoji} {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== QUICK STATS BANNER ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl overflow-hidden shadow-lg"
      >
        <div className="relative bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 p-6 sm:p-8 animate-gradient-shift">
          {/* Decorative pattern */}
          <div className="absolute inset-0 pattern-dots opacity-20" />

          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { ref: quizzesCounter.ref, count: quizzesCounter.count, label: 'Bài kiểm tra', icon: <BookCheck className="w-5 h-5" />, color: 'text-rose-100' },
              { ref: subjectsCounter.ref, count: subjectsCounter.count, label: 'Môn học', icon: <BookOpen className="w-5 h-5" />, color: 'text-amber-100' },
              { ref: gradesCounter.ref, count: gradesCounter.count, label: 'Lớp học', icon: <GraduationCap className="w-5 h-5" />, color: 'text-yellow-100' },
              { ref: studentsCounter.ref, count: studentsCounter.count, label: 'Học sinh+', icon: <Users className="w-5 h-5" />, color: 'text-orange-100' },
            ].map((stat) => (
              <div
                key={stat.label}
                ref={stat.ref}
                className="flex flex-col items-center gap-1 bg-white/15 glass-card rounded-2xl py-4 px-3 hover:bg-white/25 transition-colors"
              >
                <div className={`${stat.color} mb-1`}>{stat.icon}</div>
                <span className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-white font-bold drop-shadow-sm">
                  {stat.count}
                </span>
                <span className="text-white/80 text-xs sm:text-sm font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== TEACHER INTRO SECTION ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 sm:p-8 shadow-sm relative overflow-hidden"
      >
        {/* Ruler pattern decoration */}
        <div className="absolute inset-0 pattern-ruler opacity-20" />

        {/* Decorative border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400" />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Larger mascot with animated border */}
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-300 opacity-20 animate-breathing scale-105" />
            <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-emerald-300 animate-spin-slow" />
            <Image
              src="/images/mascot.png"
              alt="Linh vật"
              fill
              sizes="(max-width: 640px) 112px, 160px"
              className="object-contain animate-float"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-emerald-800 mb-2">
              Về Cô Giáo Hải Anh 👩‍🏫
            </h3>
            <p className="text-emerald-700 leading-relaxed">
              Cô Giáo Hải Anh là giáo viên tiểu học với nhiều năm kinh nghiệm giảng dạy.
              Trang web này được tạo ra để giúp các em học sinh lớp 1 đến lớp 5 có thể
              ôn tập và kiểm tra kiến thức Toán và Ngữ văn một cách vui vẻ, thú vị.
            </p>

            {/* Social proof */}
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
              <div className="flex -space-x-2">
                {['🧒', '👧', '👦', '👩‍🎓', '🧒'].map((emoji, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-200 text-sm border-2 border-white shadow-sm animate-bounce-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <span className="text-emerald-600 text-sm font-semibold">
                Đã giúp <span className="text-emerald-800 font-bold">100+</span> học sinh
              </span>
            </div>

            {/* Feature badges with animated appearance */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              {[
                { icon: '📝', text: 'Kiểm tra online', count: '27+' },
                { icon: '📊', text: 'Xem kết quả', count: 'Ngay' },
                { icon: '⏱️', text: 'Tính giờ', count: 'Chính xác' },
                { icon: '🏆', text: 'Thành tích', count: 'Cập nhật' },
              ].map((feature, i) => (
                <span
                  key={feature.text}
                  className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 hover:bg-emerald-200 transition-colors animate-slide-up hover-scale"
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <span>{feature.icon}</span>
                  {feature.text}
                  <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                    {feature.count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== STUDY BANNER ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl overflow-hidden shadow-lg"
      >
        <div className="relative bg-gradient-to-r from-pink-200 via-orange-100 to-amber-200 p-6 sm:p-8">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="relative flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-48 h-32 sm:h-36">
              <Image
                src="/images/achievement.png"
                alt="Thành tích học tập"
                fill
                sizes="(max-width: 640px) 100vw, 192px"
                className="object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-pink-800 mb-2">
                Cùng nhau học tập nhé! 🎒
              </h3>
              <p className="text-pink-700">
                Các em hãy chọn lớp và môn học để bắt đầu làm bài kiểm tra.
                Kết quả sẽ được lưu lại để theo dõi tiến độ học tập!
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
