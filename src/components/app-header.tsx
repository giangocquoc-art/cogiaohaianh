'use client'

import { useAppStore } from '@/store/app-store'
import { BookOpen, Home, Trophy, ArrowLeft, BookCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function AppHeader() {
  const { currentView, goBack, goHome, selectedGrade } = useAppStore()
  const [scrolled, setScrolled] = useState(false)

  const gradeLabel = selectedGrade ? `Lớp ${selectedGrade}` : ''
  const isStudying = currentView === 'quiz'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 transition-shadow duration-300 ${scrolled ? 'header-shadow' : 'shadow-lg'}`}
    >
      {/* Subtle wave pattern overlay */}
      <div className="absolute inset-0 pattern-wave opacity-30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 py-2 relative">
        <div className="flex items-center justify-between">
          {/* Logo - prominent with white pill container */}
          <button
            onClick={goHome}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
          >
            <div className="bg-white rounded-full shadow-md px-2 py-1 flex items-center gap-2">
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden">
                <Image
                  src="/images/mascot.png"
                  alt="Cô Giáo Hải Anh"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="hidden sm:block pr-1">
                <h1 className="font-[family-name:var(--font-patrick-hand)] text-orange-700 text-lg sm:text-xl font-bold leading-tight">
                  Cô Giáo Hải Anh
                </h1>
                <p className="text-orange-500 text-[10px] leading-tight font-medium">Học Tập Vui Vẻ 🌟</p>
              </div>
            </div>
            <span className="sm:hidden font-[family-name:var(--font-patrick-hand)] text-white text-lg font-bold drop-shadow-md">
              CGHA
            </span>
          </button>

          {/* Right section: Study mode + Navigation */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Study mode indicator */}
            <AnimatePresence>
              {isStudying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden sm:flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-semibold"
                >
                  <BookCheck className="w-3.5 h-3.5" />
                  <span>Đang làm bài</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse-soft" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <nav className="flex items-center gap-1 sm:gap-1.5">
              {currentView !== 'home' && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={goBack}
                    className="text-white hover:bg-white/20 gap-1 text-sm sm:text-base h-9 sm:h-10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Quay lại</span>
                  </Button>
                </motion.div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={goHome}
                className={`text-white hover:bg-white/20 gap-1 text-sm sm:text-base h-9 sm:h-10 ${currentView === 'home' ? 'bg-white/20' : ''}`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => useAppStore.getState().setView('scoreboard')}
                className={`text-white hover:bg-white/20 gap-1 text-sm sm:text-base h-9 sm:h-10 ${currentView === 'scoreboard' ? 'bg-white/20' : ''}`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Bảng điểm</span>
              </Button>
            </nav>
          </div>
        </div>

        {/* Breadcrumb for deeper views */}
        {currentView !== 'home' && currentView !== 'scoreboard' && selectedGrade && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-white/90 text-xs sm:text-sm mt-1 pb-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Trang chủ</span>
            {gradeLabel && (
              <>
                <span className="text-white/40 mx-0.5">›</span>
                <span className="bg-white/15 px-1.5 py-0.5 rounded text-white">{gradeLabel}</span>
              </>
            )}
            {currentView === 'chapters' && useAppStore.getState().selectedSubject && (
              <>
                <span className="text-white/40 mx-0.5">›</span>
                <span className="bg-white/15 px-1.5 py-0.5 rounded text-white">
                  {useAppStore.getState().selectedSubject === 'toan' ? 'Toán' : 'Ngữ văn'}
                </span>
              </>
            )}
            {(currentView === 'quiz' || currentView === 'result') && (
              <>
                <span className="text-white/40 mx-0.5">›</span>
                <span className="bg-white/15 px-1.5 py-0.5 rounded text-white">
                  {useAppStore.getState().selectedSubject === 'toan' ? 'Toán' : 'Ngữ văn'}
                </span>
                <span className="text-white/40 mx-0.5">›</span>
                <span className="bg-white/15 px-1.5 py-0.5 rounded text-white">
                  {currentView === 'quiz' ? 'Kiểm tra' : 'Kết quả'}
                </span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </header>
  )
}
