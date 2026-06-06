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
    let start = 0
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
      {/* Decorative pencil/ruler SVG border at top */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1200 30"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[20px] sm:h-[25px]"
          preserveAspectRatio="none"
        >
          {/* Ruler marks */}
          {Array.from({ length: 60 }).map((_, i) => (
            <line
              key={`ruler-${i}`}
              x1={i * 20}
              y1={i % 5 === 0 ? 0 : 10}
              x2={i * 20}
              y2={30}
              stroke="#f97316"
              strokeWidth={i % 5 === 0 ? 2 : 1}
              opacity={0.3}
            />
          ))}
          {/* Pencil silhouette */}
          <g transform="translate(100, 5) scale(0.8)" opacity="0.2">
            <rect x="0" y="5" width="40" height="10" rx="1" fill="#f59e0b" />
            <polygon points="40,5 50,10 40,15" fill="#fbbf24" />
            <rect x="-5" y="5" width="5" height="10" rx="1" fill="#fb923c" />
          </g>
          {/* Another pencil */}
          <g transform="translate(500, 8) scale(0.6)" opacity="0.15">
            <rect x="0" y="5" width="40" height="10" rx="1" fill="#f59e0b" />
            <polygon points="40,5 50,10 40,15" fill="#fbbf24" />
            <rect x="-5" y="5" width="5" height="10" rx="1" fill="#fb923c" />
          </g>
          {/* Book silhouette */}
          <g transform="translate(900, 3) scale(0.7)" opacity="0.15">
            <rect x="0" y="0" width="30" height="22" rx="2" fill="#f97316" />
            <rect x="2" y="2" width="26" height="18" rx="1" fill="#fbbf24" />
            <line x1="15" y1="2" x2="15" y2="20" stroke="#f97316" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* Wave separator */}
      <div className="w-full overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 60"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[30px] sm:h-[40px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
            fill="url(#footerGradient)"
          />
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main footer content */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 dark:from-amber-800 dark:via-orange-900 dark:to-amber-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Top section with three columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Column 1: Branding */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-2xl bg-white shadow-md overflow-hidden">
                  <Image
                    src="/images/mascot.png"
                    alt="Cô Giáo Hải Anh"
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl font-bold">
                    Cô Giáo Hải Anh 📚
                  </h3>
                  <p className="text-white/80 text-sm">Giáo viên Tiểu học 🦉</p>
                </div>
              </div>
              <p className="text-white/70 text-sm text-center sm:text-left leading-relaxed">
                Nền tảng học tập trực tuyến dành cho học sinh tiểu học.
                Ôn tập vui vẻ, kiểm tra hiệu quả! 🎓
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <h4 className="font-[family-name:var(--font-patrick-hand)] text-base font-semibold mb-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Liên kết nhanh
              </h4>
              {[
                { icon: <Home className="w-4 h-4" />, label: 'Trang chủ', action: goHome },
                { icon: <BookOpen className="w-4 h-4" />, label: 'Kiểm tra', action: () => setView('home') },
                { icon: <Trophy className="w-4 h-4" />, label: 'Bảng điểm', action: () => setView('scoreboard') },
              ].map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="flex items-center gap-2 text-white/80 hover:text-white text-sm hover:translate-x-1 transition-all duration-200 link-underline"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Column 3: Contact */}
            <div className="flex flex-col items-center sm:items-start gap-3">
              <h4 className="font-[family-name:var(--font-patrick-hand)] text-base font-semibold mb-1">
                📬 Liên hệ
              </h4>
              <a
                href="https://www.facebook.com/hattieu.tran.1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-colors text-sm w-fit"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
              <a
                href="mailto:cohaianh@gmail.com"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-colors text-sm w-fit"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Social proof counter */}
          <div className="mt-5 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-white/80 text-sm">
              Đã giúp <span ref={countRef} className="font-bold text-white text-base">{studentCount}+</span> học sinh trên toàn quốc 🌍
            </span>
          </div>

          {/* Motivational quote */}
          <div className="mt-4 py-3 px-4 bg-white/10 rounded-2xl text-center">
            <p className="text-white/90 text-sm italic font-medium min-h-[1.5em] transition-all duration-500">
              &ldquo;{motivationalQuotes[quoteIndex]}&rdquo;
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 mt-4 pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-white/70 text-xs">
              <p className="flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-red-300 fill-red-300 animate-pulse-soft" /> Cô Giáo Hải Anh
              </p>
              <div className="flex items-center gap-2">
                <span>📚</span>
                <span>🦉</span>
                <span>🎓</span>
              </div>
              <p>&copy; {new Date().getFullYear()} Cô Giáo Hải Anh. All rights reserved.</p>
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
            className="back-to-top"
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
