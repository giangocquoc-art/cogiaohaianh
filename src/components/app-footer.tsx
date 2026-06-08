'use client'

import { Heart, Facebook, Mail, Home, BookOpen, Trophy, Sparkles, ArrowUp, Users } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'

const motivationalQuotes = [
  'Học hỏi là hành trình không bao giờ kết thúc 🌈',
  'Mỗi ngày học thêm một điều mới nhé! 🌟',
  'Kiến thức là chìa khóa mở cửa tương lai 🔑',
  'Hãy cố gắng hết mình mỗi ngày nhé! 💪',
  'Thất bại là mẹ thành công, đừng bỏ cuộc! 🌻',
  'Học mà chơi, chơi mà học 🎮',
  'Mỗi bước đi đều đưa em đến gần mục tiêu hơn 🚀',
  'Hôm nay cố gắng, ngày mai tỏa sáng ✨',
]

export function AppFooter() {
  const { setView, goHome } = useAppStore()
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [studentCount, setStudentCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)

  // Rotating motivational quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animated social proof counter
  useEffect(() => {
    const target = 100
    const duration = 2000
    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setStudentCount(Math.floor(eased * target))
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setStudentCount(target)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="mt-auto relative">
      {/* Refined wave separator */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[30px] sm:h-[40px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            className="fill-orange-200 dark:fill-orange-900/30"
          />
          <path
            d="M0,35 C200,55 400,15 720,35 C1040,55 1240,15 1440,35 L1440,60 L0,60 Z"
            className="fill-amber-200 dark:fill-amber-900/30"
          />
        </svg>
      </div>

      {/* Main footer content */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 dark:from-[#1a1208] dark:via-[#1f1610] dark:to-[#1a1208] border-t border-orange-200 dark:border-orange-900/20">
        <div className="max-w-6xl mx-auto px-4 py-6 pb-20 sm:pb-6">
          {/* Top section with three columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Column 1: Branding */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl bg-white dark:bg-card ring-2 ring-orange-200 dark:ring-orange-800 shadow-sm overflow-hidden">
                  <Image
                    src="/images/mascot.png"
                    alt="Cô Giáo Hải Anh"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl font-bold text-orange-800 dark:text-amber-200">
                    Cô Giáo Hải Anh 📚
                  </h3>
                  <p className="text-orange-500 dark:text-orange-400 text-sm">Giáo viên Tiểu học 🦉</p>
                </div>
              </div>
              <p className="text-orange-600 dark:text-amber-300/70 text-sm text-center sm:text-left leading-relaxed">
                Nền tảng học tập trực tuyến dành cho học sinh tiểu học.
                Ôn tập vui vẻ, kiểm tra hiệu quả! 🎓
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <h4 className="premium-section-header font-[family-name:var(--font-patrick-hand)] text-base font-semibold mb-1 flex items-center gap-1 text-orange-800 dark:text-amber-200">
                <Sparkles className="w-4 h-4" /> Liên kết nhanh
              </h4>
              {[
                { icon: <Home className="w-4 h-4 text-orange-400 dark:text-orange-500" />, label: 'Trang chủ', action: goHome },
                { icon: <BookOpen className="w-4 h-4 text-orange-400 dark:text-orange-500" />, label: 'Kiểm tra', action: () => setView('home') },
                { icon: <Trophy className="w-4 h-4 text-orange-400 dark:text-orange-500" />, label: 'Bảng điểm', action: () => setView('scoreboard') },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="flex items-center gap-2 text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-lg px-2 py-1 -mx-2 transition-colors"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Column 3: Contact */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <h4 className="premium-section-header font-[family-name:var(--font-patrick-hand)] text-base font-semibold mb-1 flex items-center gap-1 text-orange-800 dark:text-amber-200">
                📬 Liên hệ
              </h4>
              <a
                href="https://www.facebook.com/hattieu.tran.1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30 rounded-full px-4 py-2 transition-all text-sm w-fit"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
              <a
                href="mailto:cohaianh@gmail.com"
                className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/30 rounded-full px-4 py-2 transition-all text-sm w-fit"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Social proof counter */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-600 dark:text-orange-400 text-sm">
              Đã giúp <span ref={countRef} className="text-orange-700 dark:text-orange-300 font-bold text-base">{studentCount}+</span> học sinh trên toàn quốc 🌍
            </span>
          </div>

          {/* Motivational quote */}
          <div className="mt-4 py-3 px-4 bg-orange-100/50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-800/20 rounded-2xl text-center relative overflow-hidden">
            <p className="text-orange-700 dark:text-amber-200/80 italic font-medium text-sm min-h-[1.5em] transition-all duration-500 animate-[fadeSlide_0.5s_ease-in-out]">
              &ldquo;{motivationalQuotes[quoteIndex]}&rdquo;
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-orange-200 dark:border-orange-900/20 mt-4 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <p className="flex items-center gap-1 text-orange-500 dark:text-orange-400/70">
                Made with <Heart className="w-3 h-3 text-red-400 dark:text-red-500 fill-red-400 dark:fill-red-500 animate-pulse-soft" /> Cô Giáo Hải Anh
              </p>
              <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400/70">
                <span>📚</span>
                <span>🦉</span>
                <span>🎓</span>
              </div>
              <p className="text-orange-500 dark:text-orange-400/70">&copy; {new Date().getFullYear()} Cô Giáo Hải Anh. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="back-to-top ring-2 ring-orange-200 dark:ring-orange-800"
            aria-label="Lên đầu trang"
            title="Lên đầu trang"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  )
}
