'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Flame, Clock, Star, Zap, Trophy, Calendar, ArrowLeft, Home } from 'lucide-react'
import { playClickSound } from '@/lib/sounds'
import { markDailyChallengeCompleted } from '@/lib/badges'
import { calculateDailyChallengeXP, triggerXPGain } from '@/components/xp-widget'

interface DailyChallengeData {
  quizId: string
  title: string
  subject: string
  grade: number
  chapter: string
  chapterName: string
  duration: number
  questionCount: number
  date: string
  bonusPoints: number
  completed: boolean
  streak: number
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      // Vietnam timezone is UTC+7
      const vietnamOffset = 7 * 60
      const vietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + vietnamOffset) * 60000)
      const tomorrow = new Date(vietnamTime)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const diff = tomorrow.getTime() - vietnamTime.getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 justify-center">
      {[
        { value: timeLeft.hours, label: 'giờ' },
        { value: timeLeft.minutes, label: 'phút' },
        { value: timeLeft.seconds, label: 'giây' },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-3">
          <div className="flex flex-col items-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 min-w-[56px] text-center border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <span className="font-mono text-2xl sm:text-3xl font-bold text-white drop-shadow-sm count-flip">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-white/70 text-xs mt-1">{unit.label}</span>
          </div>
          {i < 2 && <span className="text-white/50 text-2xl font-bold animate-pulse-soft">:</span>}
        </div>
      ))}
    </div>
  )
}

function StreakCalendar({ streak }: { streak: number }) {
  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const today = new Date()
  const vietnamOffset = 7 * 60
  const vietnamTime = new Date(today.getTime() + (today.getTimezoneOffset() + vietnamOffset) * 60000)
  const dayOfWeek = vietnamTime.getDay() === 0 ? 6 : vietnamTime.getDay() - 1 // Monday = 0

  return (
    <div className="flex items-center gap-1.5 justify-center">
      {days.map((day, i) => {
        const isCompleted = i < dayOfWeek && streak > (dayOfWeek - 1 - i)
        const isToday = i === dayOfWeek
        const isFuture = i > dayOfWeek

        let content: React.ReactNode = '·'
        let bgClass = 'bg-white/10 text-white/40'

        if (isCompleted) {
          content = '🔥'
          bgClass = 'bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md'
        } else if (isToday) {
          content = <Star className="w-4 h-4 text-white" />
          bgClass = 'bg-white/30 text-white border-2 border-white/50 animate-pulse-soft'
        } else if (isFuture) {
          bgClass = 'bg-white/10 text-white/30'
        }

        return (
          <div key={day} className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-white/60 font-medium">{day}</span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${bgClass}`}
            >
              {content}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function DailyChallengeView() {
  const { studentInfo, startQuiz, setView, goBack, goHome } = useAppStore()
  const [challenge, setChallenge] = useState<DailyChallengeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)

  const fetchChallenge = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (studentInfo?.name) params.set('studentName', studentInfo.name)
      if (studentInfo?.className) params.set('className', studentInfo.className)

      const res = await fetch(`/api/daily-challenge?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setChallenge(data)
      }
    } catch (err) {
      console.error('Failed to fetch daily challenge:', err)
    } finally {
      setLoading(false)
    }
  }, [studentInfo])

  useEffect(() => {
    fetchChallenge()
  }, [fetchChallenge])

  const handleStartChallenge = () => {
    if (!challenge || !studentInfo) return
    playClickSound()
    setStarting(true)

    // Mark daily challenge in localStorage
    markDailyChallengeCompleted()

    // Start the quiz like normal
    startQuiz(challenge.quizId, studentInfo)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="text-5xl animate-float">🔥</div>
        <p className="text-muted-foreground">Đang tải thử thách hôm nay...</p>
      </div>
    )
  }

  if (!challenge) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Không thể tải thử thách. Vui lòng thử lại sau.</p>
        <Button onClick={goHome} className="mt-4">
          <Home className="w-4 h-4 mr-2" />
          Trang chủ
        </Button>
      </div>
    )
  }

  const subjectLabel = challenge.subject === 'toan' ? 'Toán' : 'Ngữ văn'
  const subjectEmoji = challenge.subject === 'toan' ? '🔢' : '📖'

  return (
    <div className="space-y-6">
      {/* Main Challenge Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* Fiery gradient background */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-amber-600 p-6 sm:p-8 relative">
          {/* Animated fire decorations */}
          <div className="absolute top-2 left-4 text-4xl animate-float opacity-60 fire-emoji">🔥</div>
          <div className="absolute top-6 right-6 text-3xl animate-drift-right opacity-50 fire-emoji" style={{ animationDelay: '0.5s' }}>🔥</div>
          <div className="absolute bottom-4 left-1/4 text-2xl animate-sparkle opacity-40" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute bottom-8 right-1/3 text-2xl animate-float opacity-40" style={{ animationDelay: '0.3s' }}>⭐</div>

          {/* Pattern overlay */}
          <div className="absolute inset-0 pattern-dots opacity-10" />

          {/* Header */}
          <div className="relative text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl sm:text-7xl mb-3"
            >
              🔥
            </motion.div>
            <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-5xl text-white mb-2">
              Thử Thách Hàng Ngày
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Mỗi ngày một thử thách mới — hoàn thành để nhận thêm điểm thưởng!
            </p>
          </div>

          {/* Countdown */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm font-medium">Thử thách mới sau</span>
            </div>
            <CountdownTimer />
          </div>

          {/* Streak Calendar */}
          <div className="relative mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm font-medium">Chuỗi {challenge.streak} ngày 🔥</span>
            </div>
            <StreakCalendar streak={challenge.streak} />
          </div>
        </div>

        {/* Challenge Details Card */}
        <div className="bg-white dark:bg-card p-6 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 text-center border border-orange-100 dark:border-orange-800">
              <span className="text-2xl block mb-1">{subjectEmoji}</span>
              <span className="text-xs text-muted-foreground block">Môn học</span>
              <span className="font-semibold text-orange-700 dark:text-orange-300 text-sm">{subjectLabel}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 text-center border border-amber-100 dark:border-amber-800">
              <span className="text-2xl block mb-1">🏫</span>
              <span className="text-xs text-muted-foreground block">Lớp</span>
              <span className="font-semibold text-amber-700 dark:text-amber-300 text-sm">Lớp {challenge.grade}</span>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/30 rounded-xl p-3 text-center border border-rose-100 dark:border-rose-800">
              <span className="text-2xl block mb-1">📝</span>
              <span className="text-xs text-muted-foreground block">Số câu hỏi</span>
              <span className="font-semibold text-rose-700 dark:text-rose-300 text-sm">{challenge.questionCount} câu</span>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-xl p-3 text-center border border-orange-200 dark:border-orange-800 shadow-sm">
              <span className="text-2xl block mb-1">🎁</span>
              <span className="text-xs text-muted-foreground block">Điểm thưởng</span>
              <span className="font-semibold text-orange-700 dark:text-orange-300 text-sm">+{challenge.bonusPoints} điểm</span>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl p-3 text-center border border-amber-200 dark:border-amber-800 shadow-sm">
              <span className="text-2xl block mb-1">⭐</span>
              <span className="text-xs text-muted-foreground block">XP thưởng</span>
              <span className="font-semibold text-amber-700 dark:text-amber-300 text-sm">+20 XP</span>
              {challenge.streak > 0 && (
                <span className="block text-[10px] text-amber-500">+{Math.min(challenge.streak, 5) * 5} chuỗi</span>
              )}
            </div>
          </div>

          {/* Quiz info */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl p-4 mb-6 border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-orange-800 dark:text-orange-200">
                {challenge.title}
              </h3>
            </div>
            <p className="text-orange-600 dark:text-orange-300 text-sm">
              {challenge.chapterName} · {challenge.duration} phút
            </p>
          </div>

          {/* Completed badge or Start button */}
          {challenge.completed ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-center completed-pulse"
            >
              {/* Animated fire particles around fire emoji */}
              <div className="relative inline-block">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  🔥
                </motion.div>
                <div className="fire-particle" style={{ bottom: '10px', left: '10px' }} />
                <div className="fire-particle" style={{ bottom: '10px', left: '10px' }} />
                <div className="fire-particle" style={{ bottom: '10px', left: '10px' }} />
                <div className="fire-particle" style={{ bottom: '10px', left: '10px' }} />
                <div className="fire-particle" style={{ bottom: '10px', left: '10px' }} />
              </div>
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-emerald-700 dark:text-emerald-300 mb-2">
                Thử thách hoàn thành!
              </h3>
              <p className="text-emerald-600 dark:text-emerald-300 text-sm">
                {challenge.streak >= 3
                  ? 'Tuyệt vời! Bạn đang trong trạng thái cực tốt! 🔥'
                  : challenge.streak >= 1
                    ? 'Bạn đã hoàn thành thử thách hôm nay. Hãy quay lại ngày mai nhé! 🌟'
                    : 'Bạn đã hoàn thành thử thách hôm nay. Hãy tiếp tục nhé! ✨'}
              </p>
              {challenge.streak >= 3 && (
                <div className="mt-3 flex flex-col items-center gap-2">
                  <div className="shield-badge">
                    🛡️ Chuỗi {challenge.streak} ngày
                  </div>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs italic">
                    {challenge.streak >= 7
                      ? '"Bậc thầy kiên trì! Không gì có thể ngăn cản bạn!" 💪'
                      : challenge.streak >= 5
                        ? '"Sự kiên nhẫn là chìa khóa của thành công!" 🌟'
                        : '"Mỗi ngày một bước, bạn đang đi đúng hướng!" 🚀'}
                  </p>
                </div>
              )}
              {challenge.streak > 1 && challenge.streak < 3 && (
                <div className="mt-3 inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full">
                  <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
                    Chuỗi {challenge.streak} ngày liên tiếp!
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center">
              {!studentInfo?.name ? (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                  <p className="text-amber-700 dark:text-amber-300 text-sm mb-1">
                    👋 Chào bạn! Để tham gia thử thách, bạn cần nhập thông tin trước.
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 text-xs mb-3">
                    Về Trang chủ → Chọn lớp → Chọn môn → Nhập tên để bắt đầu!
                  </p>
                  <Button
                    onClick={() => setView('home')}
                    className="bg-orange-500 hover:bg-orange-600 text-white gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Về Trang chủ
                  </Button>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleStartChallenge}
                    disabled={starting}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg sm:text-xl px-8 py-6 rounded-2xl shadow-lg gap-3 font-[family-name:var(--font-patrick-hand)] h-auto"
                  >
                    <Flame className="w-6 h-6" />
                    Bắt đầu thử thách
                    <Zap className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}
              <p className="text-muted-foreground text-xs mt-3">
                ⏱️ Thời gian: {challenge.duration} phút · 🎁 +{challenge.bonusPoints} điểm thưởng · ⭐ +20 XP
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tips section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-5"
      >
        <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Mẹo cho Thử Thách
        </h3>
        <ul className="space-y-2 text-amber-700 dark:text-amber-300 text-sm">
          <li className="flex items-start gap-2">
            <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Hoàn thành thử thách mỗi ngày để nhận +1 điểm thưởng và +20 XP</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Duy trì chuỗi ngày liên tiếp để nhận thêm XP (+5 XP/ngày, tối đa +25)</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Thử thách thay đổi mỗi ngày — đừng bỏ lỡ!</span>
          </li>
          <li className="flex items-start gap-2">
            <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>Có thể sử dụng gợi ý AI nếu gặp câu khó</span>
          </li>
        </ul>
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={goBack}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Button
          onClick={goHome}
          variant="outline"
          className="gap-2"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Button>
      </div>
    </div>
  )
}
