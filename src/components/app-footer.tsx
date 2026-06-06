'use client'

import { Heart, Facebook, Mail } from 'lucide-react'
import Image from 'next/image'

export function AppFooter() {
  return (
    <footer className="mt-auto bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Teacher info */}
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full bg-white shadow-md overflow-hidden">
              <Image
                src="/images/mascot.png"
                alt="Cô Giáo Hải Anh"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg font-bold">
                Cô Giáo Hải Anh
              </h3>
              <p className="text-white/80 text-sm">Giáo viên Tiểu học</p>
            </div>
          </div>

          {/* Contact links */}
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-colors text-sm"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </a>
            <a
              href="mailto:cohaianh@gmail.com"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-full px-4 py-2 transition-colors text-sm"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mt-4 pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-white/70 text-xs">
            <p className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-300 fill-red-300" /> Cô Giáo Hải Anh
            </p>
            <p>&copy; {new Date().getFullYear()} Cô Giáo Hải Anh. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
