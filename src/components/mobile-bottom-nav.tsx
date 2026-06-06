'use client'

import { useAppStore, type ViewType } from '@/store/app-store'
import { Home, BookOpen, Zap, Trophy, CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'

interface TabItem {
  view: ViewType
  icon: React.ElementType
  label: string
  emoji: string
}

const tabs: TabItem[] = [
  { view: 'home', icon: Home, label: 'Trang chủ', emoji: '🏠' },
  { view: 'lessons', icon: BookOpen, label: 'Bài học', emoji: '📚' },
  { view: 'practice', icon: Zap, label: 'Luyện tập', emoji: '⚡' },
  { view: 'leaderboard', icon: Trophy, label: 'Xếp hạng', emoji: '🏆' },
  { view: 'studyCalendar', icon: CalendarDays, label: 'Lịch', emoji: '📅' },
]

export function MobileBottomNav() {
  const currentView = useAppStore((s) => s.currentView)
  const setView = useAppStore((s) => s.setView)

  // Hide when in quiz mode
  if (currentView === 'quiz' || currentView === 'result') {
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-orange-200 dark:border-orange-900/30 bg-white/90 dark:bg-[#1a1208]/90 backdrop-blur-md"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Thanh điều hướng chính"
    >
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const isActive =
            currentView === tab.view ||
            (tab.view === 'home' && currentView === 'home')

          return (
            <button
              key={tab.view}
              onClick={() => setView(tab.view)}
              className="flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 transition-colors duration-200"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <tab.icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive
                      ? 'text-orange-500 dark:text-orange-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] leading-tight font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-orange-500 dark:text-orange-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.label}
              </span>
              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="bottomNavDot"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-orange-500 dark:bg-orange-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
