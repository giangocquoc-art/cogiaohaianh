'use client'

import { useAppStore } from '@/store/app-store'
import { BookOpen, Home, Trophy, ArrowLeft, BookCheck, BarChart3, Menu, X, GraduationCap, Sun, Moon, Award, Flame, Crown, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getTheme, toggleTheme, initTheme, type Theme } from '@/lib/theme'
import { XPWidget } from '@/components/xp-widget'

export function AppHeader() {
  const { currentView, goBack, goHome, selectedGrade } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setThemeState] = useState<Theme>('light')

  // Initialize theme on mount
  useEffect(() => {
    initTheme()
    setThemeState(getTheme())
  }, [])

  const handleToggleTheme = () => {
    const newTheme = toggleTheme()
    setThemeState(newTheme)
  }

  const gradeLabel = selectedGrade ? `Lớp ${selectedGrade}` : ''
  const isStudying = currentView === 'quiz'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close drawer on view change
  useEffect(() => {
    setDrawerOpen(false)
  }, [currentView])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const navItems = [
    { view: 'home' as const, icon: Home, label: 'Trang chủ', action: goHome },
    { view: 'dailyChallenge' as const, icon: Flame, label: 'Thử thách', action: () => useAppStore.getState().setView('dailyChallenge') },
    { view: 'badges' as const, icon: Award, label: 'Huy hiệu', action: () => useAppStore.getState().setView('badges') },
    { view: 'scoreboard' as const, icon: Trophy, label: 'Bảng điểm', action: () => useAppStore.getState().setView('scoreboard') },
    { view: 'leaderboard' as const, icon: Crown, label: 'Xếp hạng', action: () => useAppStore.getState().setView('leaderboard') },
    { view: 'progress' as const, icon: BarChart3, label: 'Tiến độ', action: () => useAppStore.getState().setView('progress') },
    { view: 'teacherDashboard' as const, icon: ClipboardList, label: 'Giáo viên', action: () => useAppStore.getState().setView('teacherDashboard') },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 dark:from-amber-900 dark:via-orange-950 dark:to-amber-900 animate-gradient-shift transition-shadow duration-300 ${scrolled ? 'header-shadow' : 'shadow-lg'}`}
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
              <div className="bg-white dark:bg-amber-950 rounded-full shadow-md px-2 py-1 flex items-center gap-2">
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden">
                  <Image
                    src="/images/mascot.png"
                    alt="Cô Giáo Hải Anh"
                    fill
                    sizes="44px"
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="hidden sm:block pr-1">
                  <h1 className="font-[family-name:var(--font-patrick-hand)] text-orange-700 dark:text-amber-200 text-lg sm:text-xl font-bold leading-tight">
                    Cô Giáo Hải Anh
                  </h1>
                  <p className="text-orange-500 dark:text-amber-300 text-[10px] leading-tight font-medium">Học Tập Vui Vẻ 🌟</p>
                </div>
              </div>
              <span className="sm:hidden font-[family-name:var(--font-patrick-hand)] text-white dark:text-amber-100 text-lg font-bold drop-shadow-md">
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
                    className="hidden sm:flex items-center gap-1.5 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-full px-3 py-1 text-white dark:text-amber-100 text-xs font-semibold"
                  >
                    <BookCheck className="w-3.5 h-3.5" />
                    <span>Đang làm bài</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse-soft" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop Navigation - simplified during quiz */}
              <nav className="hidden sm:flex items-center gap-1 sm:gap-1.5">
                {isStudying ? (
                  /* Simplified nav during quiz: only back button */
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={goBack}
                      className="text-white dark:text-amber-100 hover:bg-white/20 dark:hover:bg-white/10 gap-1 text-sm sm:text-base h-9 sm:h-10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Quay lại</span>
                    </Button>
                  </motion.div>
                ) : (
                  <>
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
                          className="text-white dark:text-amber-100 hover:bg-white/20 dark:hover:bg-white/10 gap-1 text-sm sm:text-base h-9 sm:h-10"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span className="hidden sm:inline">Quay lại</span>
                        </Button>
                      </motion.div>
                    )}

                    {navItems.map((navItem) => {
                      const isActive = currentView === navItem.view || (navItem.view === 'home' && currentView === 'home')
                      return (
                        <Button
                          key={navItem.view}
                          variant="ghost"
                          size="sm"
                          onClick={navItem.action}
                          className={`text-white hover:bg-white/20 gap-1 text-sm sm:text-base h-9 sm:h-10 ${isActive ? 'bg-white/20 nav-active' : ''}`}
                        >
                          <navItem.icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{navItem.label}</span>
                        </Button>
                      )
                    })}
                  </>
                )}
              </nav>

              {/* XP Widget - hidden during quiz */}
              {!isStudying && <XPWidget />}

              {/* Theme toggle button */}
              <motion.button
                onClick={handleToggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-white/20 transition-colors"
                aria-label={theme === 'dark' ? 'Chuyển sáng' : 'Chuyển tối'}
                title={theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: 90, scale: 0 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      exit={{ rotate: -90, scale: 0 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Mobile hamburger menu - simplified during quiz */}
              {isStudying ? (
                <button
                  onClick={goBack}
                  className="sm:hidden flex items-center gap-1 text-white hover:bg-white/20 transition-colors px-2 py-1 rounded-xl text-sm font-medium"
                  aria-label="Quay lại"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Quay lại</span>
                </button>
              ) : (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="sm:hidden flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-white/20 transition-colors"
                  aria-label="Mở menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Breadcrumb for deeper views */}
          {currentView !== 'home' && currentView !== 'scoreboard' && currentView !== 'progress' && currentView !== 'dailyChallenge' && currentView !== 'badges' && currentView !== 'leaderboard' && currentView !== 'teacherDashboard' && selectedGrade && (
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

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] max-w-[80vw] bg-white dark:bg-[#1a1208] z-[70] shadow-2xl overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 dark:from-amber-900 dark:via-orange-950 dark:to-amber-900 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white shadow-md">
                      <Image
                        src="/images/mascot.png"
                        alt="Cô Giáo Hải Anh"
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h2 className="font-[family-name:var(--font-patrick-hand)] text-orange-800 dark:text-amber-200 text-lg font-bold">
                        Cô Giáo Hải Anh
                      </h2>
                      <p className="text-orange-600 dark:text-amber-300 text-xs">Học Tập Vui Vẻ 🌟</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                    aria-label="Đóng menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Drawer nav items */}
              <div className="p-4 space-y-1">
                {/* Back button if not home */}
                {currentView !== 'home' && (
                  <button
                    onClick={() => {
                      goBack()
                      setDrawerOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left"
                  >
                    <ArrowLeft className="w-5 h-5 text-orange-500" />
                    <span className="font-medium">Quay lại</span>
                  </button>
                )}

                {navItems.map((navItem) => {
                  const isActive = currentView === navItem.view || (navItem.view === 'home' && currentView === 'home')
                  return (
                    <button
                      key={navItem.view}
                      onClick={() => {
                        navItem.action()
                        setDrawerOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                        isActive
                          ? 'bg-orange-50 text-orange-700 font-semibold dark:bg-orange-900/30 dark:text-orange-300'
                          : 'text-foreground hover:bg-orange-50 dark:hover:bg-orange-900/20'
                      }`}
                    >
                      <navItem.icon className={`w-5 h-5 ${isActive ? 'text-orange-500' : 'text-muted-foreground'}`} />
                      <span>{navItem.label}</span>
                      {isActive && (
                        <span className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Drawer footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 dark:border-orange-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                    <GraduationCap className="w-5 h-5" />
                    <span className="font-medium">Lớp 1 → Lớp 5</span>
                  </div>
                  <button
                    onClick={handleToggleTheme}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50 transition-colors"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    {theme === 'dark' ? 'Sáng' : 'Tối'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Kiểm tra Toán & Ngữ văn 📚</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
