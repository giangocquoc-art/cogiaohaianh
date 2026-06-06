'use client'

import { useAppStore } from '@/store/app-store'
import { AppHeader } from '@/components/app-header'
import { AppFooter } from '@/components/app-footer'
import { HomeView } from '@/components/home-view'
import { SubjectView } from '@/components/subject-view'
import { ChapterView } from '@/components/chapter-view'
import { QuizView } from '@/components/quiz-view'
import { ResultView } from '@/components/result-view'
import { ScoreboardView } from '@/components/scoreboard-view'
import { ProgressView } from '@/components/progress-view'
import { DailyChallengeView } from '@/components/daily-challenge-view'
import { BadgesView } from '@/components/badges-view'
import { LeaderboardView } from '@/components/leaderboard-view'
import { TeacherDashboardView } from '@/components/teacher-dashboard-view'
import { ProfileView } from '@/components/profile-view'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { initTheme } from '@/lib/theme'

function ViewRenderer() {
  const currentView = useAppStore((s) => s.currentView)

  const viewMap: Record<string, React.ReactNode> = {
    home: <HomeView />,
    subjects: <SubjectView />,
    chapters: <ChapterView />,
    quiz: <QuizView />,
    result: <ResultView />,
    scoreboard: <ScoreboardView />,
    progress: <ProgressView />,
    dailyChallenge: <DailyChallengeView />,
    badges: <BadgesView />,
    leaderboard: <LeaderboardView />,
    teacherDashboard: <TeacherDashboardView />,
    profile: <ProfileView />,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -5, scale: 0.99 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ minHeight: '200px' }}
      >
        {viewMap[currentView] || <HomeView />}
      </motion.div>
    </AnimatePresence>
  )
}

export default function Home() {
  const currentView = useAppStore((s) => s.currentView)

  // Seed data on first load
  useEffect(() => {
    const seedData = async () => {
      try {
        await fetch('/api/seed', { method: 'POST' })
      } catch (err) {
        console.error('Failed to seed data:', err)
      }
    }
    seedData()
  }, [])

  // Initialize theme on mount (before first render paint)
  useEffect(() => {
    initTheme()
  }, [])

  // Smooth scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <a href="#main-content" className="skip-to-content">
        Đến nội dung chính
      </a>
      <AppHeader />
      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <ViewRenderer />
      </main>
      <AppFooter />
    </div>
  )
}
