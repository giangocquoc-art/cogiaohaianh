'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Home, Sparkles, Lock, Check, Flame, Target, Award, Zap, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useCallback } from 'react'

interface CharacterData {
  studentName: string
  className: string
  character: {
    level: number
    emoji: string
    name: string
    message: string
    accentColor: string
  }
  currentXP: number
  nextLevelXP: number
  evolutionProgress: number
  stats: {
    quizzesCompleted: number
    perfectScores: number
    dailyStreak: number
    badgesEarned: number
  }
  abilities: Array<{
    level: number
    name: string
    unlocked: boolean
  }>
  evolutionStages: Array<{
    level: number
    emoji: string
    name: string
    minXP: number
    isCurrent: boolean
    isUnlocked: boolean
    isPast: boolean
  }>
  motivationalMessage: string
}

// Accent color map for each level
function getAccentClasses(level: number) {
  switch (level) {
    case 1:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        gradient: 'from-gray-300 to-gray-400',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-300 dark:border-gray-700',
        progressGradient: 'from-gray-400 to-gray-500',
        glow: 'shadow-gray-300/50 dark:shadow-gray-700/50',
        sceneBg: 'from-green-100 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20',
      }
    case 2:
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-950/20',
        gradient: 'from-yellow-400 to-amber-400',
        text: 'text-yellow-600 dark:text-yellow-400',
        border: 'border-yellow-300 dark:border-yellow-700',
        progressGradient: 'from-yellow-400 to-amber-500',
        glow: 'shadow-yellow-300/50 dark:shadow-yellow-700/50',
        sceneBg: 'from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20',
      }
    case 3:
      return {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        gradient: 'from-orange-400 to-amber-500',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-300 dark:border-orange-700',
        progressGradient: 'from-orange-400 to-amber-500',
        glow: 'shadow-orange-300/50 dark:shadow-orange-700/50',
        sceneBg: 'from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20',
      }
    case 4:
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        gradient: 'from-amber-400 to-orange-500',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-300 dark:border-amber-700',
        progressGradient: 'from-amber-400 to-orange-500',
        glow: 'shadow-amber-300/50 dark:shadow-amber-700/50',
        sceneBg: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20',
      }
    case 5:
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/20',
        gradient: 'from-yellow-400 via-amber-400 to-orange-500',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-400 dark:border-amber-600',
        progressGradient: 'from-yellow-400 via-amber-400 to-orange-500',
        glow: 'shadow-amber-400/50 dark:shadow-amber-600/50',
        sceneBg: 'from-sky-100 to-amber-50 dark:from-sky-950/20 dark:to-amber-950/20',
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        gradient: 'from-gray-300 to-gray-400',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-300 dark:border-gray-700',
        progressGradient: 'from-gray-400 to-gray-500',
        glow: 'shadow-gray-300/50 dark:shadow-gray-700/50',
        sceneBg: 'from-green-100 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20',
      }
  }
}

// Scene elements for each level
function SceneDecoration({ level }: { level: number }) {
  if (level <= 2) {
    // Grass and ground scene
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grass at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-green-200/50 to-transparent dark:from-green-900/30 dark:to-transparent" />
        {/* Small grass tufts */}
        <motion.div
          className="absolute bottom-8 left-[10%] text-green-400/60 dark:text-green-600/40 text-2xl"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌱
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-[30%] text-green-400/60 dark:text-green-600/40 text-xl"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          🌿
        </motion.div>
        <motion.div
          className="absolute bottom-8 right-[20%] text-green-400/60 dark:text-green-600/40 text-2xl"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          🌱
        </motion.div>
        {/* Sun */}
        <motion.div
          className="absolute top-4 right-6 text-3xl"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☀️
        </motion.div>
        {/* Cloud */}
        <motion.div
          className="absolute top-6 left-8 text-2xl opacity-60"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☁️
        </motion.div>
      </div>
    )
  }

  if (level <= 4) {
    // Hills and flowers scene
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Hills */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-200/40 to-transparent dark:from-green-900/20 dark:to-transparent" />
        {/* Flowers */}
        <motion.div
          className="absolute bottom-10 left-[15%] text-xl"
          animate={{ y: [0, -2, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌸
        </motion.div>
        <motion.div
          className="absolute bottom-12 left-[45%] text-xl"
          animate={{ y: [0, -2, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          🌻
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-[20%] text-xl"
          animate={{ y: [0, -2, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          🌺
        </motion.div>
        {/* Butterfly */}
        <motion.div
          className="absolute top-8 left-[60%] text-xl"
          animate={{ x: [0, 15, -5, 10, 0], y: [0, -5, 3, -3, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          🦋
        </motion.div>
        {/* Sun */}
        <motion.div
          className="absolute top-4 right-6 text-3xl"
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☀️
        </motion.div>
        {/* Clouds */}
        <motion.div
          className="absolute top-4 left-6 text-2xl opacity-60"
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          ☁️
        </motion.div>
        <motion.div
          className="absolute top-10 right-[30%] text-xl opacity-40"
          animate={{ x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          ☁️
        </motion.div>
      </div>
    )
  }

  // Level 5: Sky/mountain scene
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Mountain silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-amber-200/40 to-transparent dark:from-amber-900/20 dark:to-transparent" />
      {/* Stars */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-sm"
          style={{
            left: `${10 + (i * 12) % 80}%`,
            top: `${5 + (i * 7) % 25}%`,
          }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          ✨
        </motion.div>
      ))}
      {/* Eagle feather / wind */}
      <motion.div
        className="absolute top-12 left-[20%] text-lg opacity-60"
        animate={{ x: [0, 20, 0], y: [0, -5, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🪶
      </motion.div>
      {/* Rainbow */}
      <div className="absolute top-2 right-4 text-2xl opacity-70">🌈</div>
      {/* Clouds */}
      <motion.div
        className="absolute top-6 left-[40%] text-xl opacity-50"
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☁️
      </motion.div>
    </div>
  )
}

// Animated counter component
function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let start = 0
    const increment = value / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setDisplay(value)
        clearInterval(timer)
      } else {
        setDisplay(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [value, duration])

  return <span>{display}</span>
}

export function CharacterView() {
  const { goBack, goHome, studentInfo, setView } = useAppStore()
  const [characterData, setCharacterData] = useState<CharacterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([])

  const fetchCharacterData = useCallback(async () => {
    if (!studentInfo?.name || !studentInfo?.className) return

    setLoading(true)
    try {
      const res = await fetch(
        `/api/character?studentName=${encodeURIComponent(studentInfo.name)}&className=${encodeURIComponent(studentInfo.className)}`
      )
      if (res.ok) {
        const data = await res.json()
        setCharacterData(data)
      }
    } catch (err) {
      console.error('Failed to fetch character data:', err)
    } finally {
      setLoading(false)
    }
  }, [studentInfo])

  useEffect(() => {
    fetchCharacterData()
  }, [fetchCharacterData])

  // Generate sparkle effects
  useEffect(() => {
    if (!characterData) return
    const interval = setInterval(() => {
      const id = Date.now()
      const x = Math.random() * 100
      const y = Math.random() * 100
      setSparkles((prev) => [...prev.slice(-8), { id, x, y }])
    }, 800)
    return () => clearInterval(interval)
  }, [characterData])

  if (!studentInfo?.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl mb-4"
        >
          🥚
        </motion.div>
        <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground mb-2">
          Nhân Vật Học Tập
        </h2>
        <p className="text-muted-foreground mb-6">
          Nhập thông tin học sinh để xem nhân vật của em!
        </p>
        <Button
          onClick={() => setView('home')}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
        >
          Về trang chủ
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-5xl mb-4"
        >
          🥚
        </motion.div>
        <p className="text-muted-foreground animate-pulse">Đang tải nhân vật...</p>
      </div>
    )
  }

  if (!characterData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-5xl mb-4">😔</div>
        <p className="text-muted-foreground mb-4">Không thể tải thông tin nhân vật</p>
        <Button onClick={fetchCharacterData} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl">
          Thử lại
        </Button>
      </div>
    )
  }

  const accent = getAccentClasses(characterData.character.level)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={goHome}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Button>
      </div>

      {/* ===== CHARACTER DISPLAY AREA ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative rounded-3xl overflow-hidden shadow-lg border ${accent.border}`}
      >
        {/* Background scene */}
        <div className={`bg-gradient-to-br ${accent.sceneBg} p-6 sm:p-8 min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center relative`}>
          <SceneDecoration level={characterData.character.level} />

          {/* Sparkle effects */}
          <AnimatePresence>
            {sparkles.map((sparkle) => (
              <motion.div
                key={sparkle.id}
                initial={{ opacity: 1, scale: 0 }}
                animate={{ opacity: 0, scale: 1.5, y: -20 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute text-amber-400/70 pointer-events-none"
                style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
              >
                ✦
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Character emoji - large animated */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`text-7xl sm:text-8xl drop-shadow-lg ${characterData.character.level === 5 ? 'animate-pulse-glow' : ''}`}
            >
              {characterData.character.emoji}
            </motion.div>
          </motion.div>

          {/* Character name + level badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative z-10 text-center mt-3"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-foreground">
                {characterData.character.name}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${accent.gradient} shadow-sm`}>
                Lv.{characterData.character.level}
              </span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {characterData.character.message}
            </p>
          </motion.div>

          {/* Evolution progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="relative z-10 w-full max-w-xs mt-4"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span className="font-medium">{characterData.currentXP} XP</span>
              <span>{characterData.character.level < 5 ? `${characterData.nextLevelXP} XP` : 'MAX'}</span>
            </div>
            <div className="w-full h-3 bg-white/40 dark:bg-black/20 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${characterData.evolutionProgress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
                className={`h-full rounded-full bg-gradient-to-r ${accent.progressGradient} shadow-sm relative`}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 animate-shimmer opacity-30" />
              </motion.div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-1.5">
              {characterData.character.level < 5
                ? `Còn ${characterData.nextLevelXP - characterData.currentXP} XP để tiến hóa`
                : '🌟 Đã đạt cấp tối cao!'}
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== STATS GRID ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: <Target className="w-5 h-5" />,
              value: characterData.stats.quizzesCompleted,
              label: 'Bài kiểm tra',
              color: 'text-blue-500',
              bg: 'bg-blue-50 dark:bg-blue-950/20',
            },
            {
              icon: <Star className="w-5 h-5" />,
              value: characterData.stats.perfectScores,
              label: 'Điểm tuyệt đối',
              color: 'text-amber-500',
              bg: 'bg-amber-50 dark:bg-amber-950/20',
            },
            {
              icon: <Flame className="w-5 h-5" />,
              value: characterData.stats.dailyStreak,
              label: 'Chuỗi ngày',
              color: 'text-orange-500',
              bg: 'bg-orange-50 dark:bg-orange-950/20',
            },
            {
              icon: <Award className="w-5 h-5" />,
              value: characterData.stats.badgesEarned,
              label: 'Huy hiệu',
              color: 'text-emerald-500',
              bg: 'bg-emerald-50 dark:bg-emerald-950/20',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={`${stat.bg} rounded-2xl p-4 border border-white/50 dark:border-border text-center`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} mb-2`}>
                {stat.icon}
              </div>
              <div className="font-[family-name:var(--font-patrick-hand)] text-2xl text-foreground">
                <AnimatedCounter value={stat.value} duration={1} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== ABILITIES SECTION ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-amber-500" />
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground">
            Khả Năng
          </h3>
        </div>
        <div className="space-y-2">
          {characterData.abilities.map((ability, i) => (
            <motion.div
              key={ability.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                ability.unlocked
                  ? `${accent.bg} ${accent.border} border-opacity-50`
                  : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 opacity-60'
              }`}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                ability.unlocked
                  ? `bg-gradient-to-br ${accent.gradient} text-white`
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
              }`}>
                {ability.unlocked ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Lock className="w-3.5 h-3.5" />
                )}
              </div>
              <span className={`flex-1 text-sm font-medium ${
                ability.unlocked ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {ability.name}
              </span>
              {!ability.unlocked && (
                <span className="text-[10px] text-muted-foreground bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                  Cần Lv.{ability.level}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ===== EVOLUTION PREVIEW ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-foreground">
            Hành Trình Tiến Hóa
          </h3>
        </div>
        <div className="relative bg-gradient-to-r from-orange-50/50 via-amber-50/50 to-yellow-50/50 dark:from-orange-950/10 dark:via-amber-950/10 dark:to-yellow-950/10 rounded-2xl p-4 border border-orange-100 dark:border-orange-900/30">
          {/* Timeline line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-gray-200 via-amber-200 to-amber-400 dark:from-gray-800 dark:via-amber-800 dark:to-amber-600 -translate-y-1/2 z-0" />

          <div className="flex items-start justify-between relative z-10">
            {characterData.evolutionStages.map((stage, i) => (
              <motion.div
                key={stage.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex flex-col items-center"
                style={{ flex: 1 }}
              >
                {/* Emoji circle */}
                <div className={`relative flex items-center justify-center rounded-full transition-all ${
                  stage.isCurrent
                    ? `w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${accent.gradient} shadow-lg ${accent.glow} ring-4 ring-white dark:ring-gray-800`
                    : stage.isPast
                      ? 'w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 dark:bg-amber-900/30 shadow-md'
                      : 'w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 opacity-50'
                }`}>
                  <span className={`${
                    stage.isCurrent ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
                  } ${stage.isUnlocked ? '' : 'grayscale'}`}>
                    {stage.isUnlocked ? stage.emoji : '❓'}
                  </span>
                  {/* Past checkmark */}
                  {stage.isPast && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {/* Current pulse */}
                  {stage.isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-amber-400"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Stage name */}
                <p className={`text-[10px] sm:text-xs mt-2 text-center font-medium ${
                  stage.isCurrent
                    ? 'text-amber-700 dark:text-amber-300'
                    : stage.isPast
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-muted-foreground'
                }`}>
                  {stage.name}
                </p>

                {/* XP requirement */}
                <p className="text-[9px] text-muted-foreground">
                  {stage.minXP} XP
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== FUN FACTS / MOTIVATIONAL ===== */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="relative bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/30"
      >
        {/* Decorative sparkle */}
        <div className="absolute top-3 right-3 text-lg animate-sparkle">✨</div>

        <div className="flex items-start gap-3">
          <div className="text-3xl">💬</div>
          <div>
            <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed">
              {characterData.motivationalMessage}
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              💡 Nhân vật của em có thể tiến hóa khi đạt đủ XP! Hãy làm thêm bài kiểm tra để nhận XP nhé!
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
