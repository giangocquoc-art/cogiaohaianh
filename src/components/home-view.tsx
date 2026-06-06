'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { BookOpen, Star, Sparkles } from 'lucide-react'

const gradeColors = [
  { bg: 'bg-rose-100', border: 'border-rose-300', text: 'text-rose-700', hover: 'hover:bg-rose-200', accent: 'bg-rose-500' },
  { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700', hover: 'hover:bg-orange-200', accent: 'bg-orange-500' },
  { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-700', hover: 'hover:bg-amber-200', accent: 'bg-amber-500' },
  { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-700', hover: 'hover:bg-emerald-200', accent: 'bg-emerald-500' },
  { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700', hover: 'hover:bg-teal-200', accent: 'bg-teal-500' },
]

const gradeEmojis = ['🌸', '🍊', '🌻', '🌿', '🐬']

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function HomeView() {
  const { selectGrade } = useAppStore()

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-200 via-amber-100 to-yellow-200 p-6 sm:p-8 shadow-lg"
      >
        {/* Decorative elements */}
        <div className="absolute top-2 right-4 text-4xl animate-float opacity-60">🌟</div>
        <div className="absolute bottom-4 left-8 text-3xl animate-float opacity-60" style={{ animationDelay: '1s' }}>📚</div>
        <div className="absolute top-8 left-4 text-2xl animate-float opacity-40" style={{ animationDelay: '0.5s' }}>✏️</div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 sm:w-44 sm:h-44 shrink-0">
            <Image
              src="/images/teacher-hero.png"
              alt="Cô Giáo Hải Anh"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl text-orange-800 mb-2">
              Chào mừng các em! 🎉
            </h2>
            <p className="text-orange-700 text-base sm:text-lg leading-relaxed">
              Cô Giáo Hải Anh chúc các em có những giờ học thật vui vẻ và thú vị!
              Hãy chọn lớp của các em để bắt đầu nhé!
            </p>
            <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-amber-700 font-semibold text-sm">Kiểm tra online • Xem kết quả • Học tập vui vẻ</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Grade Cards */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-orange-500" />
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-foreground">
            Chọn Lớp Học
          </h2>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {[1, 2, 3, 4, 5].map((grade) => {
            const colors = gradeColors[grade - 1]
            const emoji = gradeEmojis[grade - 1]
            return (
              <motion.button
                key={grade}
                variants={item}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectGrade(grade)}
                className={`${colors.bg} ${colors.border} border-2 ${colors.hover} rounded-2xl p-5 sm:p-6 flex flex-col items-center gap-3 transition-all shadow-md hover:shadow-xl cursor-pointer group`}
              >
                <span className="text-4xl sm:text-5xl group-hover:animate-wiggle">
                  {emoji}
                </span>
                <span className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl ${colors.text}`}>
                  Lớp {grade}
                </span>
                <div className={`${colors.accent} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                  2 môn học
                </div>
              </motion.button>
            )
          })}
        </motion.div>
      </section>

      {/* Introduction Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-6 sm:p-8 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
            <Image
              src="/images/mascot.png"
              alt="Linh vật"
              fill
              className="object-contain animate-float"
            />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-emerald-800 mb-2">
              Về Cô Giáo Hải Anh 👩‍🏫
            </h3>
            <p className="text-emerald-700 leading-relaxed">
              Cô Giáo Hải Anh là giáo viên tiểu học với nhiều năm kinh nghiệm giảng dạy.
              Trang web này được tạo ra để giúp các em học sinh lớp 1 đến lớp 5 có thể
              ôn tập và kiểm tra kiến thức Toán và Ngữ văn một cách vui vẻ, thú vị.
            </p>
            <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
              {[
                { icon: '📝', text: 'Kiểm tra online' },
                { icon: '📊', text: 'Xem kết quả' },
                { icon: '⏱️', text: 'Tính giờ' },
                { icon: '🏆', text: 'Thành tích' },
              ].map((feature) => (
                <span
                  key={feature.text}
                  className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1.5 rounded-full font-medium flex items-center gap-1"
                >
                  <span>{feature.icon}</span>
                  {feature.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Students studying banner */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-3xl overflow-hidden shadow-lg"
      >
        <div className="relative bg-gradient-to-r from-pink-200 via-orange-100 to-amber-200 p-6 sm:p-8">
          <div className="absolute inset-0 pattern-dots opacity-30" />
          <div className="relative flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-48 h-32 sm:h-36">
              <Image
                src="/images/achievement.png"
                alt="Thành tích học tập"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-pink-800 mb-2">
                Cùng nhau học tập nhé! 🎒
              </h3>
              <p className="text-pink-700">
                Các em hãy chọn lớp và môn học để bắt đầu làm bài kiểm tra.
                Kết quả sẽ được lưu lại để theo dõi tiến độ học tập!
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
