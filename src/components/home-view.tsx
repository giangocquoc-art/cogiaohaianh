'use client'

import { useAppStore } from '@/store/app-store'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { BookOpen, Star, Sparkles, Clock, Trophy, BarChart3, PenTool, Users, GraduationCap, BookCheck, Flame, ChevronRight, Zap, Crown, ClipboardList, BookMarked } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { Button } from '@/components/ui/button'

const gradeColors = [
  { bg: 'bg-rose-100 dark:bg-rose-950/30', border: 'border-rose-300 dark:border-rose-700', text: 'text-rose-700 dark:text-rose-300', hover: 'hover:bg-rose-200 dark:hover:bg-rose-900/40', accent: 'bg-rose-500', gradient: 'from-rose-400 to-pink-500', gradientSubtle: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20', glow: 'hover:shadow-rose-200/50 dark:hover:shadow-rose-800/30' },
  { bg: 'bg-orange-100 dark:bg-orange-950/30', border: 'border-orange-300 dark:border-orange-700', text: 'text-orange-700 dark:text-orange-300', hover: 'hover:bg-orange-200 dark:hover:bg-orange-900/40', accent: 'bg-orange-500', gradient: 'from-orange-400 to-amber-500', gradientSubtle: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20', glow: 'hover:shadow-orange-200/50 dark:hover:shadow-orange-800/30' },
  { bg: 'bg-amber-100 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-700', text: 'text-amber-700 dark:text-amber-300', hover: 'hover:bg-amber-200 dark:hover:bg-amber-900/40', accent: 'bg-amber-500', gradient: 'from-amber-400 to-yellow-500', gradientSubtle: 'from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20', glow: 'hover:shadow-amber-200/50 dark:hover:shadow-amber-800/30' },
  { bg: 'bg-emerald-100 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-300', hover: 'hover:bg-emerald-200 dark:hover:bg-emerald-900/40', accent: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-500', gradientSubtle: 'from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20', glow: 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-800/30' },
  { bg: 'bg-teal-100 dark:bg-teal-950/30', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-700 dark:text-teal-300', hover: 'hover:bg-teal-200 dark:hover:bg-teal-900/40', accent: 'bg-teal-500', gradient: 'from-teal-400 to-cyan-500', gradientSubtle: 'from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20', glow: 'hover:shadow-teal-200/50 dark:hover:shadow-teal-800/30' },
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
  { grade: 1, subject: 'toan', chapterName: 'Số từ 1 đến 10', icon: '🔢', emoji: '🌸', color: 'from-rose-400 to-pink-500', bgLight: 'bg-rose-50 dark:bg-rose-950/30', textColor: 'text-rose-700 dark:text-rose-300' },
  { grade: 3, subject: 'toan', chapterName: 'Bảng cửu chương', icon: '✖️', emoji: '🌻', color: 'from-amber-400 to-yellow-500', bgLight: 'bg-amber-50 dark:bg-amber-950/30', textColor: 'text-amber-700 dark:text-amber-300' },
  { grade: 2, subject: 'toan', chapterName: 'Phép cộng có nhớ', icon: '➕', emoji: '🍊', color: 'from-orange-400 to-amber-500', bgLight: 'bg-orange-50 dark:bg-orange-950/30', textColor: 'text-orange-700 dark:text-orange-300' },
  { grade: 1, subject: 'ngu-van', chapterName: 'Tập đọc - Ghép chữ', icon: '📖', emoji: '🌸', color: 'from-pink-400 to-rose-500', bgLight: 'bg-pink-50 dark:bg-pink-950/30', textColor: 'text-pink-700 dark:text-pink-300' },
]

/* Typing effect hook */
function useTypingEffect(text: string, speed: number = 80, startDelay: number = 500) {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const startTimeout = setTimeout(() => {
      let index = 0
      const type = () => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1))
          index++
          timeout = setTimeout(type, speed)
        } else {
          setIsTyping(false)
        }
      }
      type()
    }, startDelay)

    return () => {
      clearTimeout(startTimeout)
      clearTimeout(timeout)
    }
  }, [text, speed, startDelay])

  return { displayText, isTyping }
}

export function HomeView() {
  const { selectGrade, setView, studentInfo } = useAppStore()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])

  const { displayText: welcomeText, isTyping } = useTypingEffect('Chào mừng các em! 🎉', 70, 800)

  const quizzesCounter = useAnimatedCounter(27, 1500, false)
  const subjectsCounter = useAnimatedCounter(2, 1200, false)
  const gradesCounter = useAnimatedCounter(5, 1000, false)
  const studentsCounter = useAnimatedCounter(100, 2000, false)

  // Daily challenge state
  const [dailyChallenge, setDailyChallenge] = useState<{
    quizId: string
    title: string
    subject: string
    grade: number
    chapterName: string
    duration: number
    questionCount: number
    date: string
    bonusPoints: number
    completed: boolean
    streak: number
  } | null>(null)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })

  // Mini leaderboard state
  const [topStudents, setTopStudents] = useState<Array<{
    rank: number
    displayName: string
    className: string
    totalXP: number
    level: number
    levelName: string
  }>>([])

  useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        const res = await fetch('/api/leaderboard')
        if (res.ok) {
          const data = await res.json()
          setTopStudents(data.leaderboard.slice(0, 3))
        }
      } catch (err) {
        console.error('Failed to fetch top students:', err)
      }
    }
    fetchTopStudents()
  }, [])

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const params = new URLSearchParams()
        if (studentInfo?.name) params.set('studentName', studentInfo.name)
        if (studentInfo?.className) params.set('className', studentInfo.className)
        const res = await fetch(`/api/daily-challenge?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setDailyChallenge(data)
        }
      } catch (err) {
        console.error('Failed to fetch daily challenge:', err)
      }
    }
    fetchChallenge()
  }, [studentInfo])

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const vietnamOffset = 7 * 60
      const vietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + vietnamOffset) * 60000)
      const tomorrow = new Date(vietnamTime)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - vietnamTime.getTime()
      setCountdown({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-12">
      {/* ===== TOP GROUP: Ticker + Daily Challenge ===== */}
      <div className="space-y-4">
      {/* ===== SCROLLING ANNOUNCEMENT BANNER ===== */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/90 via-amber-500/90 to-yellow-500/90 backdrop-blur-sm py-2 shadow-sm premium-glass"
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
        <div className="ticker-container">
          <div className="ticker-content">
            {tickerMessages.map((msg, i) => (
              <span key={i} className="inline-block text-white/95 font-medium text-sm tracking-wide px-6">
                {msg}
                <span className="ml-6 text-white/50">●</span>
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {tickerMessages.map((msg, i) => (
              <span key={`dup-${i}`} className="inline-block text-white/95 font-medium text-sm tracking-wide px-6">
                {msg}
                <span className="ml-6 text-white/50">●</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== DAILY CHALLENGE CARD ===== */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setView('dailyChallenge')}
        className="w-full text-left relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-yellow-950/40 border-2 border-orange-200 dark:border-orange-800 p-5 sm:p-6 shadow-sm group cursor-pointer active:scale-[0.99] premium-card"
      >
        {/* Decorative fire emoji - subtle */}
        <div className="absolute top-2 right-4 text-3xl opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none">🔥</div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Left: Fire icon + text */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-500 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Flame className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-orange-700 dark:text-orange-200 flex items-center gap-2">
                Thử Thách Hàng Ngày
                <span className="text-sm bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full">🔥 Mỗi ngày</span>
              </h2>
              <p className="text-orange-600 dark:text-orange-300/70 text-sm mt-0.5">
                {dailyChallenge
                  ? `${dailyChallenge.subject === 'toan' ? '🔢 Toán' : '📖 Ngữ văn'} · Lớp ${dailyChallenge.grade} · ${dailyChallenge.chapterName}`
                  : 'Đang tải thử thách...'
                }
              </p>
            </div>
          </div>

          {/* Right: Countdown + streak */}
          <div className="flex items-center gap-4 shrink-0">
            {dailyChallenge?.streak !== undefined && dailyChallenge.streak > 0 && (
              <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-full px-3 py-1.5">
                <Zap className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <span className="text-orange-600 dark:text-orange-300 font-medium text-sm">{dailyChallenge.streak} ngày</span>
              </div>
            )}
            {dailyChallenge?.completed && (
              <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full px-3 py-1.5">
                <span className="text-emerald-600 dark:text-emerald-300 text-sm font-medium">✓ Đã xong</span>
              </div>
            )}
            <div className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/40 rounded-xl px-3 py-2">
              <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-300">
                {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-orange-500/70 dark:text-orange-400/70 text-xs">
              <span>+1 điểm</span>
              <span className="text-lg">🎁</span>
            </div>
          </div>
        </div>
      </motion.button>
      </div>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="premium-divider my-6" />

      {/* ===== HERO SECTION ===== */}
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/80 dark:from-orange-950/30 dark:via-card dark:to-amber-950/30 p-8 sm:p-10 border border-orange-100/50 dark:border-orange-900/20 shadow-sm"
      >
        {/* Floating particle dots - reduced */}
        <div className="particle-dot pointer-events-none" style={{ top: '20%', left: '12%' }} />
        <div className="particle-dot pointer-events-none" style={{ top: '40%', right: '18%' }} />
        <div className="particle-dot pointer-events-none" style={{ bottom: '30%', left: '55%' }} />

        {/* Layered background patterns */}
        <div className="absolute inset-0 pattern-clouds opacity-30 dark:opacity-15 pointer-events-none" />
        <div className="absolute inset-0 pattern-dots opacity-10 dark:opacity-5 pointer-events-none" />

        {/* Floating animated decorations with parallax - reduced to 3 subtle ones */}
        <motion.div className="pointer-events-none" style={{ y: parallaxY, opacity: parallaxOpacity }}>
          <div className="absolute top-6 right-10 text-2xl animate-drift-right opacity-40">🌟</div>
          <div className="absolute bottom-8 left-8 text-2xl animate-drift-left opacity-30">📚</div>
          <div className="absolute top-1/2 right-6 text-lg animate-sparkle opacity-30" style={{ animationDelay: '0.5s' }}>✨</div>
        </motion.div>

        <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          {/* Teacher image */}
          <div className="relative w-32 h-32 sm:w-48 sm:h-48 shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-100 dark:from-orange-800 dark:to-amber-800 rounded-2xl opacity-20 pointer-events-none" />
            <Image
              src="/images/teacher-hero.png"
              alt="Cô Giáo Hải Anh"
              fill
              sizes="(max-width: 640px) 128px, 192px"
              className="object-cover rounded-2xl drop-shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              priority
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            {/* Glassmorphism text area */}
            <div className="bg-white/50 dark:bg-black/20 backdrop-blur-md rounded-xl p-4 sm:p-5">
            {/* Welcome text with sparkle */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-lg">🌟</span>
            </div>
            {/* Greeting with avatar if student info exists */}
            {studentInfo ? (
              <>
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setView('profile')}
                    className="w-12 h-12 rounded-full bg-white dark:bg-card shadow-md flex items-center justify-center text-2xl ring-2 ring-orange-300 dark:ring-orange-700 hover:ring-orange-400 dark:hover:ring-orange-500 transition-all cursor-pointer"
                    aria-label="Xem hồ sơ"
                  >
                    {typeof window !== 'undefined' ? (localStorage.getItem('cogiaohaianh-avatar') || '🐱') : '🐱'}
                  </motion.button>
                  <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-5xl leading-tight drop-shadow-sm premium-gradient-text">
                    Chào {studentInfo.name}! 🎉
                  </h2>
                </div>
                <p className="text-orange-800 dark:text-amber-100 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
                  Chúc em có những giờ học thật vui vẻ và thú vị!
                  Hãy chọn lớp để bắt đầu nhé!
                </p>
              </>
            ) : (
              <>
                <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-5xl mb-2 leading-tight min-h-[1.3em] drop-shadow-sm premium-gradient-text">
                  {welcomeText}
                  {isTyping && <span className="typing-cursor" />}
                </h2>
                <p className="text-orange-800 dark:text-amber-100 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
                  Cô Giáo Hải Anh chúc các em có những giờ học thật vui vẻ và thú vị!
                  Hãy chọn lớp của các em để bắt đầu nhé!
                </p>
              </>
            )}
            </div>
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start flex-wrap">
              <Sparkles className="w-5 h-5 text-orange-400 dark:text-orange-500" />
              <span className="text-amber-700 dark:text-amber-300 font-medium text-sm">Kiểm tra online</span>
              <span className="text-amber-400 dark:text-amber-500">•</span>
              <span className="text-amber-700 dark:text-amber-200 font-medium text-sm">Xem kết quả</span>
              <span className="text-amber-400 dark:text-amber-500">•</span>
              <span className="text-amber-700 dark:text-amber-200 font-medium text-sm">Học tập vui vẻ</span>
              <Sparkles className="w-5 h-5 text-orange-400 dark:text-orange-500" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="premium-divider my-6" />

      {/* ===== POPULAR QUIZZES SECTION ===== */}
      <section className="py-2">
        <div className="flex items-center gap-2 mb-5 premium-section-header">
          <Flame className="w-6 h-6 text-orange-500" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground">
            Bài Kiểm Tra Phổ Biến
          </h2>
          <span className="text-xl">🔥</span>
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
              onClick={() => {
                selectGrade(quiz.grade)
                // Auto-select the subject after a tick so the grade is set first
                setTimeout(() => {
                  const { selectSubject } = useAppStore.getState()
                  selectSubject(quiz.subject)
                }, 50)
              }}
              className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white dark:bg-card border-2 border-gray-100 dark:border-border hover:border-orange-200 dark:hover:border-orange-700 shadow-sm hover:shadow-lg transition-all text-left p-4 sm:p-5 premium-card"
            >
              {/* Gradient accent top strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${quiz.color}`} />

              {/* Grade badge */}
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-gradient-to-r ${quiz.color} text-white shadow-sm`}>
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

              {/* CTA - Premium button */}
              <div className="mt-4">
                <span className="premium-btn">
                  Làm bài
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="premium-divider my-6" />

      {/* ===== TOP STUDENTS MINI LEADERBOARD ===== */}
      {topStudents.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5 premium-section-header">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground">
                Top Học Sinh
              </h2>
              <span className="text-xl">👑</span>
            </div>
            <Button
              onClick={() => setView('leaderboard')}
              variant="ghost"
              className="text-amber-600 dark:text-amber-400 text-sm gap-1 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              Xem tất cả
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <motion.button
            onClick={() => setView('leaderboard')}
            className="w-full text-left cursor-pointer group"
          >
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 p-5 shadow-sm group-hover:shadow-md group-hover:border-amber-300 dark:group-hover:border-amber-700 transition-all relative overflow-hidden premium-card">
              <div className="space-y-3">
                {topStudents.map((student, index) => {
                  const medals = ['🥇', '🥈', '🥉']

                  return (
                    <motion.div
                      key={student.rank}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <span className="premium-badge-amber premium-badge text-lg">{medals[index]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">{student.displayName}</p>
                        <p className="text-xs text-muted-foreground">{student.className}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Star className="w-3.5 h-3.5 text-amber-500" fill="currentColor" />
                        <span className="font-medium text-amber-600 dark:text-amber-400 text-sm">{student.totalXP}</span>
                        <span className="text-xs text-muted-foreground">XP</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-3 flex items-center justify-center gap-1 text-amber-600 dark:text-amber-400 text-xs font-medium group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                <Trophy className="w-3.5 h-3.5" />
                <span>Xem bảng xếp hạng đầy đủ</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </motion.button>
        </motion.section>
      )}

      {/* ===== SECTION DIVIDER ===== */}
      <div className="premium-divider my-6" />

      {/* ===== GRADE CARDS SECTION ===== */}
      <section className="py-2">
        <div className="flex items-center gap-2 mb-5 premium-section-header">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground">
            Chọn Lớp Học
          </h2>
          <Star className="w-5 h-5 text-amber-400" />
        </div>

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
            const icons = gradeSubjectIcons[grade - 1]
            const chapters = gradeChapters[grade - 1]
            return (
              <motion.button
                key={grade}
                variants={item}
                whileHover={{ scale: 1.04, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectGrade(grade)}
                className={`${colors.bg} dark:bg-opacity-20 ${colors.border} border-2 ${colors.hover} rounded-2xl p-4 sm:p-7 flex flex-col items-center gap-2 transition-all shadow-md hover:shadow-xl cursor-pointer group relative overflow-hidden premium-card ${colors.glow}`}
              >
                {/* Subtle gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradientSubtle} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                {/* Popular badge for Lớp 1 - premium style */}
                {grade === 1 && (
                  <div className="absolute -top-0 -right-0 premium-badge premium-badge-rose text-[10px] px-2 py-0.5 rounded-bl-lg rounded-tr-xl z-10">
                    🔥 Phổ biến
                  </div>
                )}

                <span className="text-4xl sm:text-5xl relative z-10">
                  {emoji}
                </span>
                <span className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl ${colors.text} relative z-10`}>
                  Lớp {grade}
                </span>

                {/* Subtitle */}
                <span className={`${colors.text} dark:text-opacity-80 text-xs opacity-70 text-center leading-tight relative z-10`}>
                  {subtitle}
                </span>

                {/* Subject icons grid */}
                <div className="flex gap-2 text-lg relative z-10">
                  {icons.map((icon, i) => (
                    <span key={i} className="bg-white/50 dark:bg-white/10 rounded-lg px-1.5 py-0.5 shadow-sm">{icon}</span>
                  ))}
                </div>

                {/* Bottom info bar */}
                <div className="flex items-center gap-3 text-[11px] relative z-10">
                  <span className={`${colors.accent} text-white px-2 py-0.5 rounded-full font-medium`}>
                    2 môn
                  </span>
                  <span className="text-foreground/50">
                    {chapters} chương
                  </span>
                </div>

                {/* Start arrow on hover */}
                <div className="absolute bottom-2 right-2 text-xs font-medium text-foreground/0 group-hover:text-foreground/60 transition-all duration-300 z-10 flex items-center gap-0.5">
                  Bắt đầu <ChevronRight className="w-3 h-3" />
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="premium-divider my-6" />

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-2">
        <div className="flex items-center gap-2 mb-5 premium-section-header">
          <GraduationCap className="w-6 h-6 text-emerald-500" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground">
            Tính Năng Học Tập
          </h2>
          <span className="text-xl">✨</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {[
            {
              icon: <BookMarked className="w-7 h-7" />,
              title: 'Bài học',
              description: 'Xem bài giảng theo chương trình SGK 2024',
              gradient: 'from-amber-500 to-orange-600',
              bgLight: 'bg-amber-50 dark:bg-amber-950/30',
              emoji: '📚',
              action: () => setView('lessons'),
            },
            {
              icon: <Zap className="w-7 h-7" />,
              title: 'Luyện tập',
              description: 'Luyện tập nhanh từng câu hỏi không áp lực',
              gradient: 'from-orange-500 to-amber-500',
              bgLight: 'bg-orange-50 dark:bg-orange-950/30',
              emoji: '⚡',
              action: () => setView('practice'),
            },
            {
              icon: <PenTool className="w-7 h-7" />,
              title: 'Kiểm tra online',
              description: 'Làm bài kiểm tra trực tiếp trên máy tính',
              gradient: 'from-rose-400 to-orange-400',
              bgLight: 'bg-rose-50 dark:bg-rose-950/30',
              emoji: '📝',
            },
            {
              icon: <Clock className="w-7 h-7" />,
              title: 'Tính thời gian',
              description: 'Luyện tập quản lý thời gian làm bài',
              gradient: 'from-amber-400 to-yellow-400',
              bgLight: 'bg-amber-50 dark:bg-amber-950/30',
              emoji: '⏱️',
            },
            {
              icon: <BarChart3 className="w-7 h-7" />,
              title: 'Xem kết quả',
              description: 'Kết quả chấm ngay lập tức',
              gradient: 'from-emerald-400 to-green-400',
              bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
              emoji: '📊',
            },
            {
              icon: <Trophy className="w-7 h-7" />,
              title: 'Thành tích',
              description: 'Theo dõi tiến độ học tập',
              gradient: 'from-teal-400 to-cyan-400',
              bgLight: 'bg-teal-50 dark:bg-teal-950/30',
              emoji: '🏆',
            },
            {
              icon: <Users className="w-7 h-7" />,
              title: 'Góc Phụ Huynh',
              description: 'Xem tiến độ con và nhận lời khuyên từ Cô',
              gradient: 'from-teal-500 to-emerald-500',
              bgLight: 'bg-teal-50 dark:bg-teal-950/30',
              emoji: '🧑‍🤝‍🧑',
              action: () => setView('parentCorner'),
            },
            {
              icon: <BookMarked className="w-7 h-7" />,
              title: 'Tài Liệu',
              description: 'Chia sẻ tài liệu giảng dạy và học tập',
              gradient: 'from-emerald-400 to-teal-500',
              bgLight: 'bg-emerald-50 dark:bg-emerald-950/30',
              emoji: '📚',
              action: () => setView('documents'),
            },
          ].map((feature) => (
            <motion.button
              key={feature.title}
              variants={item}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={feature.action}
              className={`${feature.bgLight} dark:bg-card border border-white/50 dark:border-border rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden group ${feature.action ? 'cursor-pointer' : 'cursor-default'} premium-card`}
            >
              {/* Gradient background accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.gradient} opacity-10 rounded-bl-full group-hover:opacity-20 transition-opacity`} />

              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md mb-3 premium-icon-container`}>
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg sm:text-xl text-foreground mb-1">
                  {feature.emoji} {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="premium-divider my-6" />

      {/* ===== QUICK STATS BANNER ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl overflow-hidden shadow-sm border border-orange-100/50 dark:border-orange-900/20"
      >
        <div className="relative bg-gradient-to-br from-orange-50/80 via-white to-amber-50/80 dark:from-orange-950/30 dark:via-card dark:to-amber-950/30 p-6 sm:p-8">
          {/* Decorative pattern */}
          <div className="absolute inset-0 pattern-dots opacity-10" />

          <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { ref: quizzesCounter.ref, count: quizzesCounter.count, label: 'Bài kiểm tra', icon: <BookCheck className="w-5 h-5" /> },
              { ref: subjectsCounter.ref, count: subjectsCounter.count, label: 'Môn học', icon: <BookOpen className="w-5 h-5" /> },
              { ref: gradesCounter.ref, count: gradesCounter.count, label: 'Lớp học', icon: <GraduationCap className="w-5 h-5" /> },
              { ref: studentsCounter.ref, count: studentsCounter.count, label: 'Học sinh+', icon: <Users className="w-5 h-5" /> },
            ].map((stat) => (
              <div
                key={stat.label}
                ref={stat.ref}
                className="premium-stat flex flex-col items-center gap-1"
              >
                <div className="premium-icon-container text-orange-500 dark:text-orange-400 mb-1">{stat.icon}</div>
                <span className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl md:text-5xl text-foreground font-bold">
                  {stat.count}
                </span>
                <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== SECTION DIVIDER ===== */}
      <div className="premium-divider my-6" />

      {/* ===== TEACHER INTRO SECTION ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border border-emerald-200 dark:border-emerald-800 p-6 sm:p-8 shadow-sm relative overflow-hidden premium-card"
      >
        {/* Decorative border accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400" />

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          {/* Mascot */}
          <div className="relative w-28 h-28 sm:w-40 sm:h-40 shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-300 to-teal-300 opacity-10 pointer-events-none" />
            <Image
              src="/images/mascot.png"
              alt="Cô Giáo Hải Anh"
              fill
              sizes="(max-width: 640px) 112px, 160px"
              className="object-cover rounded-2xl"
            />
          </div>

          <div className="text-center sm:text-left flex-1">
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-emerald-800 dark:text-emerald-200 mb-2">
              Về Cô Giáo Hải Anh 👩‍🏫
            </h3>
            <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
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
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-200 dark:bg-emerald-800 text-sm border-2 border-white dark:border-card"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                Đã giúp <span className="text-emerald-800 dark:text-emerald-200 font-medium">100+</span> học sinh
              </span>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              {[
                { icon: '📝', text: 'Kiểm tra online', count: '27+' },
                { icon: '📊', text: 'Xem kết quả', count: 'Ngay' },
                { icon: '⏱️', text: 'Tính giờ', count: 'Chính xác' },
                { icon: '🏆', text: 'Thành tích', count: 'Cập nhật' },
              ].map((feature) => (
                <span
                  key={feature.text}
                  className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <span>{feature.icon}</span>
                  {feature.text}
                  <span className="text-[10px] bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded-full font-medium">
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
        className="rounded-2xl overflow-hidden shadow-sm border border-pink-100/50 dark:border-pink-900/20"
      >
        <div className="relative bg-gradient-to-r from-pink-50 via-orange-50 to-amber-50 dark:from-pink-950/30 dark:via-orange-950/30 dark:to-amber-950/30 p-6 sm:p-8 premium-card">
          <div className="absolute inset-0 pattern-dots opacity-15" />
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
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-pink-800 dark:text-pink-200 mb-2">
                Cùng nhau học tập nhé! 🎒
              </h3>
              <p className="text-pink-700 dark:text-pink-300">
                Các em hãy chọn lớp và môn học để bắt đầu làm bài kiểm tra.
                Kết quả sẽ được lưu lại để theo dõi tiến độ học tập!
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ===== TEACHER LINK SECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex justify-center"
      >
        <button
          onClick={() => setView('teacherDashboard')}
          className="group flex items-center gap-2 bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 rounded-xl px-5 py-3 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-950/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-sm hover:shadow-md"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="font-medium text-sm">Dành cho giáo viên 📋</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </motion.div>
    </div>
  )
}
