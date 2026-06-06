'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy, Medal, Crown, Star, ChevronRight, ArrowLeft, Home, Sparkles, TrendingUp, TrendingDown } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  displayName: string
  fullKey: string
  className: string
  totalXP: number
  level: number
  levelName: string
  quizCount: number
  averageScore: number
  badgesCount: number
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  totalStudents: number
}

const gradeTabs = [
  { label: 'Tất cả', value: '' },
  { label: 'Lớp 1', value: '1' },
  { label: 'Lớp 2', value: '2' },
  { label: 'Lớp 3', value: '3' },
  { label: 'Lớp 4', value: '4' },
  { label: 'Lớp 5', value: '5' },
]

const medalColors = [
  { bg: 'bg-gradient-to-br from-amber-300 to-yellow-500', border: 'border-amber-400', text: 'text-amber-800', shadow: 'shadow-amber-300/50', emoji: '🥇' },
  { bg: 'bg-gradient-to-br from-gray-300 to-gray-400', border: 'border-gray-400', text: 'text-gray-700', shadow: 'shadow-gray-300/50', emoji: '🥈' },
  { bg: 'bg-gradient-to-br from-orange-300 to-amber-600', border: 'border-amber-600', text: 'text-amber-900', shadow: 'shadow-amber-400/50', emoji: '🥉' },
]

function getLevelName(lvl: number): string {
  if (lvl === 1) return 'Học sinh mới'
  if (lvl === 2) return 'Học sinh chăm chỉ'
  if (lvl === 3) return 'Học sinh giỏi'
  if (lvl === 4) return 'Học sinh xuất sắc'
  return 'Cao thủ'
}

function getLevelEmoji(lvl: number): string {
  if (lvl === 1) return '🌱'
  if (lvl === 2) return '📖'
  if (lvl === 3) return '⭐'
  if (lvl === 4) return '🏆'
  return '👑'
}

export function LeaderboardView() {
  const { studentInfo, goBack, goHome } = useAppStore()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeGrade, setActiveGrade] = useState('')
  const [userRank, setUserRank] = useState<number | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeGrade) params.set('grade', activeGrade)

      const res = await fetch(`/api/leaderboard?${params.toString()}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)

        // Find user's rank
        if (studentInfo?.name && studentInfo?.className) {
          const userKey = `${studentInfo.name.trim()}|${studentInfo.className.trim()}`
          const entry = result.leaderboard.find((e: LeaderboardEntry) => e.fullKey === userKey)
          if (entry) {
            setUserRank(entry.rank)
          } else {
            setUserRank(null)
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    } finally {
      setLoading(false)
    }
  }, [activeGrade, studentInfo])

  useEffect(() => {
    fetchLeaderboard()
  }, [fetchLeaderboard])

  const top3 = data?.leaderboard.slice(0, 3) || []
  const rest = data?.leaderboard.slice(3) || []

  // Podium layout: 2nd place (left), 1st place (center), 3rd place (right)
  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]] // 2nd, 1st, 3rd
    : top3.length === 2
      ? [top3[1], top3[0]]
      : top3

  const podiumHeights = ['h-24', 'h-32', 'h-20'] // silver, gold, bronze

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="text-5xl sm:text-6xl mb-2"
        >
          🏆
        </motion.div>
        <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-foreground">
          Bảng Xếp Hạng 🏆
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {data ? `${data.totalStudents} học sinh tham gia` : 'Đang tải...'}
        </p>

        {/* Crown decorations */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full" />
          <Crown className="w-5 h-5 text-amber-500" />
        </div>
      </motion.div>

      {/* Grade filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
      >
        {gradeTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveGrade(tab.value)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeGrade === tab.value
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md'
                : 'bg-white dark:bg-card border border-gray-200 dark:border-border text-muted-foreground hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-5xl animate-float">🏆</div>
          <p className="text-muted-foreground">Đang tải bảng xếp hạng...</p>
        </div>
      ) : !data || data.leaderboard.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🌟</div>
          <p className="text-muted-foreground">Chưa có học sinh nào. Hãy làm bài kiểm tra để lên bảng xếp hạng!</p>
          <Button onClick={goHome} className="mt-4 bg-orange-500 hover:bg-orange-600 text-white gap-2">
            <Home className="w-4 h-4" />
            Bắt đầu làm bài
          </Button>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-yellow-950/30 rounded-3xl p-6 border-2 border-amber-200 dark:border-amber-800 shadow-lg relative overflow-hidden"
            >
              {/* Decorative stars */}
              <div className="absolute top-2 left-4 text-xl animate-sparkle opacity-40">⭐</div>
              <div className="absolute top-4 right-8 text-2xl animate-sparkle opacity-50" style={{ animationDelay: '0.5s' }}>✨</div>
              <div className="absolute bottom-4 left-1/4 text-lg animate-sparkle opacity-30" style={{ animationDelay: '1s' }}>🌟</div>
              <div className="absolute bottom-2 right-1/3 text-xl animate-sparkle opacity-40" style={{ animationDelay: '1.5s' }}>⭐</div>

              {/* Pattern overlay */}
              <div className="absolute inset-0 pattern-dots opacity-10" />

              {/* Podium visualization */}
              <div className="relative flex items-end justify-center gap-3 sm:gap-6 mb-4 min-h-[180px]">
                {podiumOrder.map((entry, podiumIndex) => {
                  const actualRank = entry.rank
                  const medal = medalColors[actualRank - 1] || medalColors[2]
                  const isGold = actualRank === 1
                  const heightClass = podiumHeights[podiumIndex] || 'h-20'

                  return (
                    <motion.div
                      key={entry.fullKey}
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{
                        delay: 0.4 + podiumIndex * 0.2,
                        type: 'spring',
                        stiffness: 150,
                      }}
                      className="flex flex-col items-center origin-bottom"
                    >
                      {/* Student info above podium */}
                      <div className="text-center mb-2">
                        {/* Medal / Crown for 1st */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + podiumIndex * 0.2, type: 'spring', stiffness: 200 }}
                          className="text-3xl sm:text-4xl mb-1"
                        >
                          {isGold ? '👑' : medal.emoji}
                        </motion.div>
                        <p className={`font-[family-name:var(--font-patrick-hand)] text-base sm:text-lg font-bold ${
                          isGold ? 'text-amber-700 dark:text-amber-300' : 'text-foreground'
                        }`}>
                          {entry.displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">{entry.className}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-amber-500" fill="currentColor" />
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{entry.totalXP} XP</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{getLevelEmoji(entry.level)} {entry.levelName}</span>
                      </div>

                      {/* Podium bar */}
                      <div
                        className={`w-20 sm:w-28 ${heightClass} ${medal.bg} rounded-t-xl border-2 ${medal.border} ${medal.shadow} shadow-lg flex items-center justify-center relative overflow-hidden ${isGold ? 'gold-shimmer' : ''}`}
                      >
                        {/* Crown sparkles for 1st place */}
                        {isGold && (
                          <>
                            <div className="crown-sparkle" style={{ top: '-2px', left: '10px' }} />
                            <div className="crown-sparkle" style={{ top: '2px', right: '12px' }} />
                            <div className="crown-sparkle" style={{ top: '-5px', left: '25px' }} />
                            <div className="crown-sparkle" style={{ top: '0px', right: '25px' }} />
                          </>
                        )}
                        <span className={`font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl ${medal.text} font-bold relative z-10`}>
                          {actualRank}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Full ranking table (4th-20th) */}
          {rest.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-card rounded-3xl border-2 border-gray-100 dark:border-amber-900/30 overflow-hidden shadow-sm"
            >
              <div className="p-4 border-b border-gray-100 dark:border-amber-900/20">
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Xếp hạng chi tiết
                </h3>
              </div>

              <div className="max-h-96 overflow-y-auto scrollbar-custom">
                {rest.map((entry, index) => {
                  const isCurrentUser = studentInfo?.name && studentInfo?.className &&
                    entry.fullKey === `${studentInfo.name.trim()}|${studentInfo.className.trim()}`

                  return (
                    <motion.div
                      key={entry.fullKey}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.03 }}
                      className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 dark:border-amber-900/20 transition-colors ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-l-4 border-l-amber-400'
                          : index % 2 === 0
                            ? 'bg-gray-50/50 dark:bg-gray-800/30'
                            : 'bg-white dark:bg-card'
                      }`}
                    >
                      {/* Rank with change arrow */}
                      <div className="flex items-center gap-1 shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          isCurrentUser
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-muted-foreground'
                        }`}>
                          {entry.rank}
                        </div>
                        {entry.rank <= 3 && (
                          <TrendingUp className="w-3 h-3 rank-up" />
                        )}
                      </div>

                      {/* Student info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`font-semibold text-sm truncate ${
                            isCurrentUser ? 'text-amber-800 dark:text-amber-200' : 'text-foreground'
                          }`}>
                            {entry.displayName}
                          </p>
                          {isCurrentUser && (
                            <span className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded-full font-bold shrink-0">
                              Bạn
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.className}</p>
                      </div>

                      {/* Level */}
                      <div className="text-center shrink-0 hidden sm:block">
                        <span className="text-base">{getLevelEmoji(entry.level)}</span>
                        <p className="text-[10px] text-muted-foreground leading-tight">{entry.levelName}</p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500" fill="currentColor" />
                            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{entry.totalXP}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">XP</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <span className="text-sm font-semibold text-foreground">{entry.quizCount}</span>
                          <p className="text-[10px] text-muted-foreground">bài</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Your ranking card */}
          {studentInfo?.name && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="your-rank-card rounded-2xl p-5 shadow-md"
            >
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-500" />
                Thứ hạng của bạn
              </h3>
              {userRank ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{studentInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{studentInfo.className}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <span className="font-[family-name:var(--font-patrick-hand)] text-3xl text-amber-600 dark:text-amber-400 font-bold">
                        #{userRank}
                      </span>
                      <p className="text-xs text-muted-foreground">trên {data?.totalStudents || '?'} học sinh</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">
                    Bạn chưa có thứ hạng. Hãy làm bài kiểm tra để lên bảng xếp hạng!
                  </p>
                  <Button
                    onClick={goHome}
                    className="mt-3 bg-orange-500 hover:bg-orange-600 text-white gap-2"
                  >
                    <Home className="w-4 h-4" />
                    Bắt đầu làm bài
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Info section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-5"
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Cách tính XP
            </h3>
            <ul className="space-y-2 text-orange-700 dark:text-orange-300 text-sm">
              <li className="flex items-start gap-2">
                <span className="xp-coin">10</span>
                <span>Hoàn thành bài kiểm tra: <strong>+10 XP</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="xp-coin">5+</span>
                <span>Điểm ≥ 7: <strong>+5 XP</strong> · Điểm ≥ 9: <strong>+10 XP</strong> · Điểm 10: <strong>+15 XP</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="xp-coin">20</span>
                <span>Thử thách hàng ngày: <strong>+20 XP</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="xp-coin">5</span>
                <span>Chuỗi ngày liên tiếp: <strong>+5 XP/ngày</strong> (tối đa +25)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="xp-coin">100</span>
                <span>Lên cấp mỗi 100 XP · Cấp 5+: <strong>Cao thủ 👑</strong></span>
              </li>
            </ul>
          </motion.div>
        </>
      )}

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
