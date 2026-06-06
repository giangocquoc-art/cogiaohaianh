'use client'

import { useAppStore } from '@/store/app-store'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowLeft, Calculator, BookOpenText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SubjectView() {
  const { selectedGrade, selectSubject, goBack } = useAppStore()

  if (!selectedGrade) return null

  const gradeColors: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    2: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    3: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    4: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    5: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  }

  const gc = gradeColors[selectedGrade]

  return (
    <div className="space-y-6">
      {/* Grade header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${gc.bg} ${gc.border} border-2 rounded-2xl p-4 sm:p-6 text-center`}
      >
        <h2 className={`font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl ${gc.text}`}>
          Lớp {selectedGrade} 🎒
        </h2>
        <p className={`${gc.text} opacity-70 mt-1`}>Chọn môn học để tiếp tục</p>
      </motion.div>

      {/* Subject cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Math card */}
        <motion.button
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => selectSubject('toan')}
          className="group cursor-pointer bg-gradient-to-br from-orange-100 to-amber-100 border-2 border-orange-300 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all text-left"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
              <Image
                src="/images/math-subject.png"
                alt="Toán"
                fill
                className="object-contain group-hover:animate-wiggle"
              />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calculator className="w-6 h-6 text-orange-600" />
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-3xl text-orange-700">
                  Toán
                </h3>
              </div>
              <p className="text-orange-600 text-sm">
                Kiểm tra kiến thức Toán học - Tính toán, Giải bài tập
              </p>
            </div>
            <div className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-orange-600 transition-colors">
              Bắt đầu làm Toán →
            </div>
          </div>
        </motion.button>

        {/* Vietnamese card */}
        <motion.button
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.03, y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => selectSubject('ngu-van')}
          className="group cursor-pointer bg-gradient-to-br from-pink-100 to-rose-100 border-2 border-pink-300 rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all text-left"
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
              <Image
                src="/images/vietnamese-subject.png"
                alt="Ngữ văn"
                fill
                className="object-contain group-hover:animate-wiggle"
              />
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpenText className="w-6 h-6 text-pink-600" />
                <h3 className="font-[family-name:var(--font-patrick-hand)] text-3xl text-pink-700">
                  Ngữ văn
                </h3>
              </div>
              <p className="text-pink-600 text-sm">
                Kiểm tra kiến thức Ngữ văn - Đọc hiểu, Chính tả, Luyện từ
              </p>
            </div>
            <div className="bg-pink-500 text-white px-4 py-2 rounded-full font-semibold text-sm group-hover:bg-pink-600 transition-colors">
              Bắt đầu làm Ngữ văn →
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}
