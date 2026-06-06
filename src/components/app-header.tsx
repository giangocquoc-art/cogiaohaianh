'use client'

import { useAppStore } from '@/store/app-store'
import { BookOpen, Home, Trophy, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function AppHeader() {
  const { currentView, goBack, goHome, selectedGrade } = useAppStore()

  const gradeLabel = selectedGrade ? `Lớp ${selectedGrade}` : ''

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={goHome}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-md overflow-hidden">
              <Image
                src="/images/mascot.png"
                alt="Cô Giáo Hải Anh"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-[family-name:var(--font-patrick-hand)] text-white text-xl sm:text-2xl font-bold drop-shadow-md leading-tight">
                Cô Giáo Hải Anh
              </h1>
              <p className="text-white/80 text-xs leading-tight">Học Tập Vui Vẻ</p>
            </div>
            <span className="sm:hidden font-[family-name:var(--font-patrick-hand)] text-white text-lg font-bold drop-shadow-md">
              CGHA
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-1 sm:gap-2">
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
                <span className="text-white/60">›</span>
                <span>{gradeLabel}</span>
              </>
            )}
            {currentView === 'chapters' && useAppStore.getState().selectedSubject && (
              <>
                <span className="text-white/60">›</span>
                <span>{useAppStore.getState().selectedSubject === 'toan' ? 'Toán' : 'Ngữ văn'}</span>
              </>
            )}
            {(currentView === 'quiz' || currentView === 'result') && (
              <>
                <span className="text-white/60">›</span>
                <span>{useAppStore.getState().selectedSubject === 'toan' ? 'Toán' : 'Ngữ văn'}</span>
                <span className="text-white/60">›</span>
                <span>{currentView === 'quiz' ? 'Kiểm tra' : 'Kết quả'}</span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </header>
  )
}
