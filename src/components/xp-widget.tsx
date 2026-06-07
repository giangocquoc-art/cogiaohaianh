'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'

interface XPData {
  totalXP: number
  level: number
  levelName: string
  levelEmoji: string
  xpInCurrentLevel: number
  xpForNextLevel: number
  quizCount: number
  averageScore: number
  currentStreak: number
}

export function XPWidget() {
  const studentInfo = useAppStore((s) => s.studentInfo)
  const [xpData, setXpData] = useState<XPData | null>(null)
  const [xpGain, setXpGain] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchXP = useCallback(async () => {
    if (!studentInfo?.name || !studentInfo?.className) return

    setLoading(true)
    try {
      const res = await fetch(`/api/xp?studentName=${encodeURIComponent(studentInfo.name)}&className=${encodeURIComponent(studentInfo.className)}`)
      if (res.ok) {
        const data = await res.json()

        // Check for XP gain animation
        const prevXP = localStorage.getItem('lastKnownXP')
        if (prevXP) {
          const diff = data.totalXP - parseInt(prevXP)
          if (diff > 0) {
            setXpGain(diff)
            setTimeout(() => setXpGain(null), 3000)
          }
        }
        localStorage.setItem('lastKnownXP', String(data.totalXP))

        setXpData({
          totalXP: data.totalXP,
          level: data.level,
          levelName: data.levelName,
          levelEmoji: data.levelEmoji,
          xpInCurrentLevel: data.xpInCurrentLevel,
          xpForNextLevel: data.xpForNextLevel,
          quizCount: data.quizCount,
          averageScore: data.averageScore,
          currentStreak: data.currentStreak,
        })

        // Also store in localStorage for quick access
        localStorage.setItem('xpData', JSON.stringify({
          totalXP: data.totalXP,
          level: data.level,
          levelName: data.levelName,
          levelEmoji: data.levelEmoji,
          xpInCurrentLevel: data.xpInCurrentLevel,
          xpForNextLevel: data.xpForNextLevel,
        }))
      }
    } catch (err) {
      console.error('Failed to fetch XP:', err)
      // Try loading from localStorage
      try {
        const cached = localStorage.getItem('xpData')
        if (cached) {
          setXpData(JSON.parse(cached))
        }
      } catch {
        // Ignore cache errors
      }
    } finally {
      setLoading(false)
    }
  }, [studentInfo])

  useEffect(() => {
    fetchXP()
  }, [fetchXP])

  // Listen for XP gain events
  useEffect(() => {
    const handleXPGain = () => {
      fetchXP()
    }
    window.addEventListener('xp-gained', handleXPGain)
    return () => window.removeEventListener('xp-gained', handleXPGain)
  }, [fetchXP])

  if (!studentInfo?.name || !xpData) return null

  const progressPercent = (xpData.xpInCurrentLevel / xpData.xpForNextLevel) * 100

  // Level emoji based on XP level
  function getLevelEmoji(level: number): string {
    if (level >= 5) return '⭐'
    if (level >= 4) return '🌟'
    if (level >= 3) return '✨'
    if (level >= 2) return '💫'
    return '🌟'
  }

  const levelEmoji = getLevelEmoji(xpData.level)

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 cursor-pointer hover:bg-white/30 transition-colors"
        onClick={() => useAppStore.getState().setView('profile')}
        title="Xem hồ sơ học sinh"
      >
        <div className="flex items-center gap-1">
          <span className="text-base">{levelEmoji}</span>
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-200" fill="currentColor" />
              <span className="text-white font-bold text-xs leading-none">{xpData.totalXP}</span>
            </div>
            <span className="text-white/70 text-[9px] leading-none mt-0.5">Lv.{xpData.level}</span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-300 to-yellow-300 rounded-full"
          />
        </div>
      </motion.div>

      {/* XP gain floating animation */}
      <AnimatePresence>
        {xpGain !== null && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -30, scale: 1.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-30"
          >
            <span className="text-amber-200 font-bold text-sm drop-shadow-lg">
              +{xpGain} XP! ⭐
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper function to trigger XP gain events
export function triggerXPGain(xpAmount: number) {
  // Update localStorage immediately for quick feedback
  const cached = localStorage.getItem('xpData')
  if (cached) {
    try {
      const data = JSON.parse(cached)
      data.totalXP += xpAmount
      data.xpInCurrentLevel = data.totalXP % 100
      data.level = Math.floor(data.totalXP / 100) + 1
      localStorage.setItem('xpData', JSON.stringify(data))
    } catch {
      // Ignore
    }
  }

  // Dispatch event to refresh widget
  window.dispatchEvent(new CustomEvent('xp-gained', { detail: { amount: xpAmount } }))
}

// Calculate XP for a quiz result (client-side, for immediate display)
export function calculateQuizXP(score: number): { total: number; breakdown: { base: number; scoreBonus: number } } {
  let base = 10
  let scoreBonus = 0

  if (score >= 10) scoreBonus = 15
  else if (score >= 9) scoreBonus = 10
  else if (score >= 7) scoreBonus = 5

  return { total: base + scoreBonus, breakdown: { base, scoreBonus } }
}

// Calculate XP for daily challenge (client-side, for immediate display)
export function calculateDailyChallengeXP(streak: number): { total: number; breakdown: { base: number; scoreBonus: number; dailyBonus: number; streakBonus: number } } {
  let base = 10
  let scoreBonus = 0 // Will be added after quiz completion
  const dailyBonus = 20
  const streakBonus = Math.min(streak, 5) * 5

  return { total: base + dailyBonus + streakBonus, breakdown: { base, scoreBonus, dailyBonus, streakBonus } }
}
