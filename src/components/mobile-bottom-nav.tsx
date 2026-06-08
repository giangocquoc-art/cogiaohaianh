'use client'

import { useAppStore, type ViewType } from '@/store/app-store'
import { Home, BookOpen, Zap, Trophy, CalendarDays, BookMarked } from 'lucide-react'
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
  { view: 'documents', icon: BookMarked, label: 'Tài liệu', emoji: '📚' },
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
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/80 dark:bg-[#1a1208]/80 backdrop-blur-xl border-t border-orange-100/50 dark:border-orange-900/20"
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
              className={`flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 transition-colors duration-200 ${
                  isActive ? 'text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-lg' : 'text-gray-400 dark:text-gray-500'
                }`}
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
                className={`text-[9px] leading-tight font-medium transition-colors duration-200 ${
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
