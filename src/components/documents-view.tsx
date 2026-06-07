'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Home, Search, Heart, Download, FileText,
  BookOpen, Plus, X, Loader2, File, Film, Presentation,
  Link2, Image as ImageIcon, ChevronDown, Share2, Lightbulb,
  Users, Sparkles, ChevronRight, ExternalLink, Tag, Eye,
  ThumbsUp, TrendingUp, Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState, useEffect, useCallback, useRef } from 'react'

// ===== TYPES =====
interface DocumentData {
  id: string
  title: string
  description: string
  category: string
  subject: string
  grade: number
  authorName: string
  fileUrl: string | null
  fileType: string | null
  likes: number
  downloads: number
  tags: string | null
  createdAt: string
}

interface DocumentsResponse {
  documents: DocumentData[]
  total: number
  totalLikes: number
  totalDownloads: number
}

interface Contributor {
  name: string
  documentCount: number
  totalLikes: number
  totalDownloads: number
  subjects: string[]
}

interface SuggestedDocument {
  title: string
  description: string
  category: string
}

type RelatedDocument = DocumentData

// ===== CONSTANTS =====
const categoryConfig: Record<string, { label: string; emoji: string; color: string; darkColor: string; borderColor: string; leftBorder: string; gradient: string; darkGradient: string }> = {
  'giao-an': { label: 'Giáo án', emoji: '📝', color: 'bg-emerald-100 text-emerald-700', darkColor: 'dark:bg-emerald-950/40 dark:text-emerald-300', borderColor: 'border-emerald-300 dark:border-emerald-700', leftBorder: 'border-l-emerald-500 dark:border-l-emerald-400', gradient: 'from-emerald-50/80 to-white', darkGradient: 'dark:from-emerald-950/20 dark:to-card' },
  'tai-lieu-hoc-tap': { label: 'Tài liệu học tập', emoji: '📖', color: 'bg-amber-100 text-amber-700', darkColor: 'dark:bg-amber-950/40 dark:text-amber-300', borderColor: 'border-amber-300 dark:border-amber-700', leftBorder: 'border-l-amber-500 dark:border-l-amber-400', gradient: 'from-amber-50/80 to-white', darkGradient: 'dark:from-amber-950/20 dark:to-card' },
  'de-thi': { label: 'Đề thi', emoji: '📋', color: 'bg-rose-100 text-rose-700', darkColor: 'dark:bg-rose-950/40 dark:text-rose-300', borderColor: 'border-rose-300 dark:border-rose-700', leftBorder: 'border-l-rose-500 dark:border-l-rose-400', gradient: 'from-rose-50/80 to-white', darkGradient: 'dark:from-rose-950/20 dark:to-card' },
  'bai-giang': { label: 'Bài giảng', emoji: '🎬', color: 'bg-sky-100 text-sky-700', darkColor: 'dark:bg-sky-950/40 dark:text-sky-300', borderColor: 'border-sky-300 dark:border-sky-700', leftBorder: 'border-l-sky-500 dark:border-l-sky-400', gradient: 'from-sky-50/80 to-white', darkGradient: 'dark:from-sky-950/20 dark:to-card' },
  'phuong-phap': { label: 'Phương pháp', emoji: '💡', color: 'bg-purple-100 text-purple-700', darkColor: 'dark:bg-purple-950/40 dark:text-purple-300', borderColor: 'border-purple-300 dark:border-purple-700', leftBorder: 'border-l-purple-500 dark:border-l-purple-400', gradient: 'from-purple-50/80 to-white', darkGradient: 'dark:from-purple-950/20 dark:to-card' },
}

const fileTypeConfig: Record<string, { label: string; emoji: string; icon: React.ElementType }> = {
  'pdf': { label: 'PDF', emoji: '📄', icon: FileText },
  'doc': { label: 'DOC', emoji: '📝', icon: File },
  'video': { label: 'Video', emoji: '🎥', icon: Film },
  'slides': { label: 'Slides', emoji: '📊', icon: Presentation },
  'link': { label: 'Link', emoji: '🔗', icon: Link2 },
  'image': { label: 'Ảnh', emoji: '🖼️', icon: ImageIcon },
}

const categoryFilters = [
  { key: 'tat-ca', label: 'Tất cả', emoji: '📚' },
  { key: 'giao-an', label: 'Giáo án', emoji: '📝' },
  { key: 'tai-lieu-hoc-tap', label: 'Tài liệu', emoji: '📖' },
  { key: 'de-thi', label: 'Đề thi', emoji: '📋' },
  { key: 'bai-giang', label: 'Bài giảng', emoji: '🎬' },
  { key: 'phuong-phap', label: 'Phương pháp', emoji: '💡' },
]

const gradeFilters = [
  { key: '0', label: 'Tất cả lớp' },
  { key: '1', label: 'Lớp 1' },
  { key: '2', label: 'Lớp 2' },
  { key: '3', label: 'Lớp 3' },
  { key: '4', label: 'Lớp 4' },
  { key: '5', label: 'Lớp 5' },
]

const subjectFilters = [
  { key: 'tat-ca', label: 'Tất cả' },
  { key: 'toan', label: 'Toán' },
  { key: 'ngu-van', label: 'Ngữ văn' },
]

const subjectLabelMap: Record<string, string> = {
  'toan': '🔢 Toán',
  'ngu-van': '📖 Ngữ văn',
  'all': '📚 Tất cả',
}

const avatarColors = [
  'from-emerald-400 to-teal-500',
  'from-orange-400 to-amber-500',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-blue-500',
  'from-purple-400 to-violet-500',
  'from-amber-400 to-yellow-500',
]

// ===== STAGGER ANIMATION =====
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

// ===== ANIMATED COUNTER HOOK =====
function useAnimatedCounter(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target === prevTarget.current) return
    prevTarget.current = target

    let startTime: number | null = null
    let rafId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration])

  return count
}

// ===== DOCUMENT DETAIL MODAL =====
function DocumentDetailModal({
  doc,
  open,
  onOpenChange,
  onLike,
  onDownload,
  relatedDocs,
}: {
  doc: DocumentData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onLike: (id: string) => void
  onDownload: (id: string, url: string | null) => void
  relatedDocs: RelatedDocument[]
}) {
  if (!doc) return null

  const catConfig = categoryConfig[doc.category] || categoryConfig['tai-lieu-hoc-tap']
  const ftConfig = doc.fileType ? fileTypeConfig[doc.fileType] : null
  const tagsList = doc.tags ? (typeof doc.tags === 'string' ? JSON.parse(doc.tags) : doc.tags) as string[] : []
  const gradeLabel = doc.grade === 0 ? 'Tất cả lớp' : `Lớp ${doc.grade}`
  const subjectLabel = doc.subject === 'toan' ? 'Toán' : doc.subject === 'ngu-van' ? 'Ngữ văn' : 'Tất cả'

  const handleShare = async () => {
    const shareText = `📚 ${doc.title}\n📝 ${doc.description}\n👤 ${doc.authorName} | ${gradeLabel} | ${subjectLabel}\n❤️ ${doc.likes} lượt thích | 👁️ ${doc.downloads} lượt xem\n\n— Cô Giáo Hải Anh 🌟`
    if (navigator.share) {
      try {
        await navigator.share({ title: doc.title, text: shareText })
      } catch {
        // User cancelled
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText)
      } catch {
        // Clipboard error
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-card p-0">
        {/* Category color strip */}
        <div className={`h-2 bg-gradient-to-r ${
          doc.category === 'giao-an' ? 'from-emerald-400 to-emerald-500' :
          doc.category === 'tai-lieu-hoc-tap' ? 'from-amber-400 to-amber-500' :
          doc.category === 'de-thi' ? 'from-rose-400 to-rose-500' :
          doc.category === 'bai-giang' ? 'from-sky-400 to-sky-500' :
          'from-purple-400 to-purple-500'
        }`} />

        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-foreground leading-tight pr-8">
              {doc.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm mt-2">
              Chi tiết tài liệu
            </DialogDescription>
          </DialogHeader>

          {/* Category + File type badges */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${catConfig.color} ${catConfig.darkColor}`}>
              {catConfig.emoji} {catConfig.label}
            </span>
            {ftConfig && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {ftConfig.emoji} {ftConfig.label}
              </span>
            )}
            <Badge variant="outline" className="text-xs px-2.5 py-1 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400">
              {gradeLabel}
            </Badge>
            <Badge variant="outline" className="text-xs px-2.5 py-1 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
              {subjectLabel === 'Toán' ? '🔢' : subjectLabel === 'Ngữ văn' ? '📖' : '📚'} {subjectLabel}
            </Badge>
          </div>

          {/* Description */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mô tả</h4>
            <p className="text-foreground leading-relaxed text-sm sm:text-base bg-orange-50/50 dark:bg-orange-950/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900/30">
              {doc.description}
            </p>
          </div>

          {/* Author info */}
          <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 dark:from-orange-600 dark:to-amber-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md">
              {doc.authorName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{doc.authorName}</p>
              <p className="text-xs text-muted-foreground">Tác giả tài liệu</p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => onLike(doc.id)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/30 transition-colors group/like"
            >
              <Heart className="w-5 h-5 text-rose-500 group-hover/like:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-lg font-bold text-rose-600 dark:text-rose-400">{doc.likes}</div>
                <div className="text-[10px] text-rose-500 dark:text-rose-500 font-medium">Lượt thích</div>
              </div>
            </button>
            <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <Download className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <div className="text-left">
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{doc.downloads}</div>
                <div className="text-[10px] text-amber-500 dark:text-amber-500 font-medium">Lượt xem</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {tagsList.length > 0 && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Nhãn
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {tagsList.map((tag: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs px-2 py-0.5 border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* File info */}
          {doc.fileUrl && (
            <div className="mb-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Tệp đính kèm
              </h4>
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 flex items-center gap-2">
                {ftConfig && <span className="text-lg">{ftConfig.emoji}</span>}
                <span className="text-xs text-sky-700 dark:text-sky-300 font-medium truncate flex-1">{doc.fileUrl}</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mb-5">
            <Button
              onClick={() => onDownload(doc.id, doc.fileUrl)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-orange-600 dark:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Xem tài liệu
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </div>

          {/* Related documents */}
          {relatedDocs.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Tài liệu liên quan
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {relatedDocs.map((related) => {
                  const relCat = categoryConfig[related.category] || categoryConfig['tai-lieu-hoc-tap']
                  return (
                    <motion.div
                      key={related.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors cursor-pointer group/related"
                      onClick={() => {
                        onDownload(related.id, related.fileUrl)
                        onOpenChange(false)
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                        related.category === 'giao-an' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' :
                        related.category === 'tai-lieu-hoc-tap' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' :
                        related.category === 'de-thi' ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400' :
                        related.category === 'bai-giang' ? 'bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400' :
                        'bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
                      }`}>
                        {relCat.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover/related:text-orange-600 dark:group-hover/related:text-orange-400 transition-colors">
                          {related.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{relCat.label} · ❤️ {related.likes} · 👁️ {related.downloads}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/related:text-orange-500 transition-colors shrink-0" />
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ===== DOCUMENT CARD COMPONENT =====
function DocumentCard({ doc, onLike, onDownload, onClick }: {
  doc: DocumentData
  onLike: (id: string) => void
  onDownload: (id: string, url: string | null) => void
  onClick: (doc: DocumentData) => void
}) {
  const catConfig = categoryConfig[doc.category] || categoryConfig['tai-lieu-hoc-tap']
  const ftConfig = doc.fileType ? fileTypeConfig[doc.fileType] : null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const gradeLabel = doc.grade === 0 ? 'Tất cả lớp' : `Lớp ${doc.grade}`
  const subjectLabel = doc.subject === 'toan' ? 'Toán' : doc.subject === 'ngu-van' ? 'Ngữ văn' : 'Tất cả'

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => onClick(doc)}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${catConfig.gradient} ${catConfig.darkGradient} dark:bg-card border-2 border-l-4 ${catConfig.borderColor} ${catConfig.leftBorder} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer doc-card-shimmer`}
    >
      {/* Category color strip at top */}
      <div className={`h-1.5 bg-gradient-to-r ${
        doc.category === 'giao-an' ? 'from-emerald-400 to-emerald-500' :
        doc.category === 'tai-lieu-hoc-tap' ? 'from-amber-400 to-amber-500' :
        doc.category === 'de-thi' ? 'from-rose-400 to-rose-500' :
        doc.category === 'bai-giang' ? 'from-sky-400 to-sky-500' :
        'from-purple-400 to-purple-500'
      }`} />

      <div className="p-4 sm:p-5">
        {/* Top: Category badge + File type badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${catConfig.color} ${catConfig.darkColor}`}>
            {catConfig.emoji} {catConfig.label}
          </span>
          {ftConfig && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {ftConfig.emoji} {ftConfig.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg sm:text-xl text-foreground leading-tight mb-2 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {doc.title}
        </h3>

        {/* Description - truncated to 2 lines */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {doc.description}
        </p>

        {/* Author with avatar initial */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 dark:from-orange-600 dark:to-amber-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            {doc.authorName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-muted-foreground font-medium truncate">{doc.authorName}</span>
        </div>

        {/* Grade + Subject badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400">
            {gradeLabel}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400">
            {subjectLabel === 'Toán' ? '🔢' : subjectLabel === 'Ngữ văn' ? '📖' : '📚'} {subjectLabel}
          </Badge>
        </div>

        {/* Like + Download counts */}
        <div className="flex items-center gap-4 mb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onLike(doc.id) }}
            className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors group/like"
            aria-label="Thích tài liệu"
          >
            <Heart className="w-3.5 h-3.5 group-hover/like:scale-110 transition-transform" />
            <span className="font-medium">{doc.likes}</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload(doc.id, doc.fileUrl) }}
            className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors group/dl"
            aria-label="Tải tài liệu"
          >
            <Download className="w-3.5 h-3.5 group-hover/dl:scale-110 transition-transform" />
            <span className="font-medium">{doc.downloads}</span>
          </button>
          <span className="text-[10px] text-muted-foreground ml-auto">
            {formatDate(doc.createdAt)}
          </span>
        </div>

        {/* View button */}
        <Button
          onClick={(e) => { e.stopPropagation(); onClick(doc) }}
          size="sm"
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-orange-600 dark:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" />
          Xem chi tiết
        </Button>
      </div>
    </motion.div>
  )
}

// ===== MAIN COMPONENT =====
export function DocumentsView() {
  const { goBack, goHome, studentInfo } = useAppStore()
  const [documents, setDocuments] = useState<DocumentData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('tat-ca')
  const [activeGrade, setActiveGrade] = useState('0')
  const [activeSubject, setActiveSubject] = useState('tat-ca')
  const [totalDocs, setTotalDocs] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)
  const [totalDownloads, setTotalDownloads] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})

  // Detail modal state
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [relatedDocs, setRelatedDocs] = useState<RelatedDocument[]>([])

  // Teacher community state
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [showAllContributors, setShowAllContributors] = useState(false)

  // AI suggestion state
  const [suggestGrade, setSuggestGrade] = useState('3')
  const [suggestSubject, setSuggestSubject] = useState('toan')
  const [suggestTopic, setSuggestTopic] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestedDocument[]>([])
  const [suggesting, setSuggesting] = useState(false)
  const [suggestError, setSuggestError] = useState('')
  const [addingDocIndex, setAddingDocIndex] = useState<number | null>(null)

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState('giao-an')
  const [formSubject, setFormSubject] = useState('toan')
  const [formGrade, setFormGrade] = useState('0')
  const [formAuthor, setFormAuthor] = useState('')
  const [formFileUrl, setFormFileUrl] = useState('')
  const [formFileType, setFormFileType] = useState('pdf')
  const [formTags, setFormTags] = useState('')

  // Seed on mount
  useEffect(() => {
    const seedDocuments = async () => {
      try {
        await fetch('/api/documents/seed', { method: 'POST' })
        setSeeded(true)
      } catch (err) {
        console.error('Failed to seed documents:', err)
        setSeeded(true)
      }
    }
    seedDocuments()
  }, [])

  // Auto-fill author from studentInfo
  useEffect(() => {
    if (studentInfo?.name) {
      setFormAuthor(studentInfo.name)
    }
  }, [studentInfo])

  // Fetch documents
  const fetchDocuments = useCallback(async () => {
    if (!seeded) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'tat-ca') params.set('category', activeCategory)
      if (activeGrade !== '0') params.set('grade', activeGrade)
      if (activeSubject !== 'tat-ca') params.set('subject', activeSubject)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/documents?${params.toString()}`)
      if (res.ok) {
        const data: DocumentsResponse = await res.json()
        setDocuments(data.documents)
        setTotalDocs(data.total)
        setTotalLikes(data.totalLikes)
        setTotalDownloads(data.totalDownloads)

        // Compute category counts from filtered documents
        const counts: Record<string, number> = { 'tat-ca': data.total }
        data.documents.forEach((doc: DocumentData) => {
          counts[doc.category] = (counts[doc.category] || 0) + 1
        })
        setCategoryCounts(counts)
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    } finally {
      setLoading(false)
    }
  }, [activeCategory, activeGrade, activeSubject, searchQuery, seeded])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Fetch contributors
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch('/api/documents/contributors?limit=10')
        if (res.ok) {
          const data = await res.json()
          setContributors(data.contributors || [])
        }
      } catch (err) {
        console.error('Failed to fetch contributors:', err)
      }
    }
    fetchContributors()
  }, [seeded])

  // Handle like
  const handleLike = async (id: string) => {
    try {
      await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'like' }),
      })
      setDocuments(prev =>
        prev.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d)
      )
      setTotalLikes(prev => prev + 1)
      if (selectedDoc?.id === id) {
        setSelectedDoc(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)
      }
    } catch (err) {
      console.error('Failed to like document:', err)
    }
  }

  // Handle download/view
  const handleDownload = async (id: string, url: string | null) => {
    try {
      await fetch('/api/documents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'download' }),
      })
      setDocuments(prev =>
        prev.map(d => d.id === id ? { ...d, downloads: d.downloads + 1 } : d)
      )
      setTotalDownloads(prev => prev + 1)
      if (selectedDoc?.id === id) {
        setSelectedDoc(prev => prev ? { ...prev, downloads: prev.downloads + 1 } : null)
      }

      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch (err) {
      console.error('Failed to track download:', err)
    }
  }

  // Handle document click - open detail modal
  const handleDocClick = useCallback((doc: DocumentData) => {
    setSelectedDoc(doc)
    setDetailOpen(true)

    // Fetch related documents (same category and/or subject)
    const fetchRelated = async () => {
      try {
        const params = new URLSearchParams()
        params.set('category', doc.category)
        params.set('limit', '5')
        const res = await fetch(`/api/documents?${params.toString()}`)
        if (res.ok) {
          const data: DocumentsResponse = await res.json()
          setRelatedDocs(data.documents.filter((d: DocumentData) => d.id !== doc.id).slice(0, 4))
        }
      } catch {
        setRelatedDocs([])
      }
    }
    fetchRelated()
  }, [])

  // Handle AI suggestion
  const handleSuggest = async () => {
    if (!suggestTopic.trim()) return
    setSuggesting(true)
    setSuggestError('')
    setSuggestions([])

    try {
      const res = await fetch('/api/documents/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: suggestGrade,
          subject: suggestSubject,
          topic: suggestTopic.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setSuggestions(data.suggestions || [])
      } else {
        setSuggestError(data.error || 'Không thể tạo gợi ý')
      }
    } catch {
      setSuggestError('Lỗi kết nối. Vui lòng thử lại!')
    } finally {
      setSuggesting(false)
    }
  }

  // Handle adding a suggested document to library
  const handleAddSuggestion = async (suggestion: SuggestedDocument, index: number) => {
    setAddingDocIndex(index)
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: suggestion.title,
          description: suggestion.description,
          category: suggestion.category,
          subject: suggestSubject,
          grade: suggestGrade,
          authorName: 'Cô Giáo Hải Anh 🤖',
          fileType: 'link',
        }),
      })

      if (res.ok) {
        fetchDocuments()
        // Remove the suggestion from list
        setSuggestions(prev => prev.filter((_, i) => i !== index))
      }
    } catch {
      // Silently fail
    } finally {
      setAddingDocIndex(null)
    }
  }

  // Submit new document
  const handleSubmit = async () => {
    if (!formTitle.trim() || !formDescription.trim() || !formCategory || !formAuthor.trim()) return

    setSubmitting(true)
    try {
      const tagsArray = formTags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formTitle.trim(),
          description: formDescription.trim(),
          category: formCategory,
          subject: formSubject,
          grade: formGrade,
          authorName: formAuthor.trim(),
          fileUrl: formFileUrl.trim() || null,
          fileType: formFileType,
          tags: tagsArray.length > 0 ? tagsArray : null,
        }),
      })

      if (res.ok) {
        setFormTitle('')
        setFormDescription('')
        setFormCategory('giao-an')
        setFormSubject('toan')
        setFormGrade('0')
        setFormFileUrl('')
        setFormFileType('pdf')
        setFormTags('')
        setDialogOpen(false)
        fetchDocuments()
      }
    } catch (err) {
      console.error('Failed to create document:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const displayedContributors = showAllContributors ? contributors : contributors.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={goHome}
          className="text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 gap-1"
        >
          <Home className="w-4 h-4" />
          Trang chủ
        </Button>
      </div>

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-300 via-teal-200 to-amber-200 dark:from-emerald-950 dark:via-teal-950 dark:to-amber-950 p-6 sm:p-8 lg:p-10 shadow-lg docs-hero-wave"
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-dots opacity-30 dark:opacity-10" />

        {/* Floating decorative elements with framer-motion */}
        {[
          { emoji: '📚', style: 'top-3 right-8 text-3xl sm:text-4xl opacity-20 dark:opacity-40', anim: 'animate-float', delay: 0 },
          { emoji: '📖', style: 'bottom-3 left-6 text-2xl sm:text-3xl opacity-15 dark:opacity-30', anim: 'animate-drift-right', delay: 0 },
          { emoji: '✨', style: 'top-1/2 right-1/4 text-xl sm:text-2xl opacity-10 dark:opacity-25', anim: 'animate-sparkle', delay: 0.5 },
          { emoji: '✏️', style: 'top-6 left-1/3 text-xl opacity-10 dark:opacity-20', anim: 'animate-drift-left', delay: 0.3 },
          { emoji: '📎', style: 'bottom-5 right-1/3 text-lg opacity-10 dark:opacity-20', anim: 'animate-float', delay: 0.7 },
          { emoji: '🎓', style: 'top-2 left-1/2 text-2xl opacity-10 dark:opacity-20', anim: 'animate-sparkle', delay: 1 },
        ].map((dec, i) => (
          <motion.div
            key={i}
            className={`absolute ${dec.style} ${dec.anim} floating-decoration select-none`}
            style={{ animationDelay: `${dec.delay}s` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12, duration: 0.5, type: 'spring' }}
          >
            {dec.emoji}
          </motion.div>
        ))}

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="font-[family-name:var(--font-patrick-hand)] text-3xl sm:text-4xl lg:text-5xl text-emerald-800 dark:text-emerald-200 mb-3">
              📚 Thư Viện Tài Liệu
            </h1>
            <p className="text-emerald-700 dark:text-emerald-300 text-base sm:text-lg max-w-lg leading-relaxed">
              Chia sẻ tài liệu giảng dạy và học tập — giáo án, đề thi, bài giảng và nhiều hơn nữa!
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative"
      >
        <motion.div
          animate={searchFocused ? { scale: 1.01 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="relative">
            <motion.div
              animate={searchFocused ? { scale: 1.15 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <Search className={`w-4 h-4 transition-colors duration-200 ${searchFocused ? 'text-orange-500' : 'text-muted-foreground'}`} />
            </motion.div>
            <Input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`pl-10 pr-10 py-3 rounded-xl border-2 transition-all duration-300 bg-white dark:bg-card text-foreground shadow-sm ${
                searchFocused
                  ? 'border-orange-400 dark:border-orange-600 shadow-md shadow-orange-100 dark:shadow-orange-950/30'
                  : 'border-amber-200 dark:border-amber-800'
              }`}
            />
          </div>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Category filter pills with count badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        {categoryFilters.map((cat) => {
          const isActive = activeCategory === cat.key
          const count = cat.key === 'tat-ca' ? totalDocs : (categoryCounts[cat.key] || 0)
          return (
            <motion.button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-2 min-h-[44px] rounded-full text-xs font-semibold transition-all duration-300 shrink-0 ${
                isActive
                  ? 'bg-orange-500 text-white dark:bg-orange-600 shadow-md'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
              {count > 0 && (
                <span className={`category-count-badge ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-amber-200/60 text-amber-700 dark:bg-amber-800/40 dark:text-amber-300'
                }`}>
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
      </motion.div>

      {/* Grade + Subject filters - touch friendly */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:flex-wrap gap-3"
      >
        {/* Grade filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Lớp:</span>
          <div className="flex gap-1">
            {gradeFilters.map((g) => (
              <button
                key={g.key}
                onClick={() => setActiveGrade(g.key)}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeGrade === g.key
                    ? 'bg-amber-500 text-white dark:bg-amber-600 shadow-sm'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground font-medium">Môn:</span>
          <div className="flex gap-1">
            {subjectFilters.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSubject(s.key)}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeSubject === s.key
                    ? 'bg-emerald-500 text-white dark:bg-emerald-600 shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Animated stats summary row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { value: totalDocs, label: 'Tài liệu', icon: <FileText className="w-4 h-4 text-orange-500 dark:text-orange-400" />, bg: 'bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400', sub: 'text-orange-500 dark:text-orange-500' },
          { value: totalLikes, label: 'Lượt thích', icon: <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />, bg: 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800', text: 'text-rose-600 dark:text-rose-400', sub: 'text-rose-500 dark:text-rose-500' },
          { value: totalDownloads, label: 'Lượt xem', icon: <Eye className="w-4 h-4 text-amber-500 dark:text-amber-400" />, bg: 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800', text: 'text-amber-600 dark:text-amber-400', sub: 'text-amber-500 dark:text-amber-500' },
        ].map((stat, idx) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const count = useAnimatedCounter(stat.value)
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`${stat.bg} rounded-xl p-3 sm:p-4 text-center transition-all duration-300`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                {stat.icon}
                <span className={`text-xl sm:text-2xl font-bold ${stat.text}`}>{count}</span>
              </div>
              <div className={`text-[10px] sm:text-xs ${stat.sub} font-medium`}>{stat.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Section divider */}
      <div className="section-divider" />

      {/* Add document button + section header */}
      <div className="flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl text-foreground flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-500" />
          Tài liệu
          {!loading && (
            <span className="text-sm font-normal text-muted-foreground">({totalDocs})</span>
          )}
        </h2>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-600 dark:to-teal-600 text-white font-semibold text-xs rounded-xl shadow-sm gap-1.5 animate-share-glow"
            >
              <Plus className="w-3.5 h-3.5" />
              Chia sẻ tài liệu
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto bg-white dark:bg-card">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-patrick-hand)] text-2xl text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                📤 Chia sẻ tài liệu
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Đăng tải tài liệu để chia sẻ với học sinh và giáo viên khác
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Tiêu đề *</label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Nhập tiêu đề tài liệu..."
                  className="rounded-xl border-2 focus:border-orange-400 dark:focus:border-orange-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Mô tả *</label>
                <Textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Mô tả ngắn gọn nội dung tài liệu..."
                  rows={3}
                  className="rounded-xl border-2 focus:border-orange-400 dark:focus:border-orange-600 resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Danh mục *</label>
                <div className="relative">
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-9 rounded-xl border-2 border-input bg-background px-3 text-sm focus:border-orange-400 dark:focus:border-orange-600 focus:outline-none appearance-none"
                  >
                    {Object.entries(categoryConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.emoji} {val.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Môn học</label>
                <div className="relative">
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full h-9 rounded-xl border-2 border-input bg-background px-3 text-sm focus:border-orange-400 dark:focus:border-orange-600 focus:outline-none appearance-none"
                  >
                    <option value="toan">🔢 Toán</option>
                    <option value="ngu-van">📖 Ngữ văn</option>
                    <option value="all">📚 Tất cả</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Grade */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Lớp</label>
                <div className="relative">
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(e.target.value)}
                    className="w-full h-9 rounded-xl border-2 border-input bg-background px-3 text-sm focus:border-orange-400 dark:focus:border-orange-600 focus:outline-none appearance-none"
                  >
                    <option value="0">Tất cả lớp</option>
                    <option value="1">Lớp 1</option>
                    <option value="2">Lớp 2</option>
                    <option value="3">Lớp 3</option>
                    <option value="4">Lớp 4</option>
                    <option value="5">Lớp 5</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Tác giả *</label>
                <Input
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  placeholder="Tên của bạn..."
                  className="rounded-xl border-2 focus:border-orange-400 dark:focus:border-orange-600"
                />
              </div>

              {/* File URL */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Đường dẫn tài liệu</label>
                <Input
                  value={formFileUrl}
                  onChange={(e) => setFormFileUrl(e.target.value)}
                  placeholder="https://..."
                  className="rounded-xl border-2 focus:border-orange-400 dark:focus:border-orange-600"
                />
              </div>

              {/* File type */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Loại tệp</label>
                <div className="relative">
                  <select
                    value={formFileType}
                    onChange={(e) => setFormFileType(e.target.value)}
                    className="w-full h-9 rounded-xl border-2 border-input bg-background px-3 text-sm focus:border-orange-400 dark:focus:border-orange-600 focus:outline-none appearance-none"
                  >
                    {Object.entries(fileTypeConfig).map(([key, val]) => (
                      <option key={key} value={key}>{val.emoji} {val.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Nhãn (cách nhau bằng dấu phẩy)</label>
                <Input
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="VD: phân số, lớp 3, ôn tập"
                  className="rounded-xl border-2 focus:border-orange-400 dark:focus:border-orange-600"
                />
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !formTitle.trim() || !formDescription.trim() || !formAuthor.trim()}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 dark:from-emerald-600 dark:to-teal-600 text-white font-semibold rounded-xl shadow-sm"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang đăng...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Đăng tài liệu
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Featured document highlight + Most viewed section */}
      {!loading && documents.length > 0 && (() => {
        const featuredDoc = [...documents].sort((a, b) => b.downloads - a.downloads)[0]
        const mostViewed = [...documents].sort((a, b) => b.downloads - a.downloads).slice(0, 5)
        const hasActiveFilters = searchQuery || activeCategory !== 'tat-ca' || activeGrade !== '0' || activeSubject !== 'tat-ca'
        return (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Featured document */}
            {!hasActiveFilters && featuredDoc && (
              <>
                <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  Tài liệu nổi bật
                </h2>
                <div className="featured-doc-border">
                  <div className="featured-doc-inner p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 dark:from-orange-950/40 dark:to-amber-950/40 dark:text-orange-300">
                            <Star className="w-3 h-3" /> Phổ biến nhất
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <Download className="w-3 h-3" /> {featuredDoc.downloads} lượt xem
                          </span>
                        </div>
                        <h3 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground mb-2">
                          {featuredDoc.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{featuredDoc.description}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 dark:from-orange-600 dark:to-amber-600 flex items-center justify-center text-white text-[8px] font-bold">
                              {featuredDoc.authorName.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs text-muted-foreground">{featuredDoc.authorName}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {featuredDoc.grade === 0 ? 'Tất cả lớp' : `Lớp ${featuredDoc.grade}`}
                          </span>
                          <span className="text-xs text-rose-500 flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {featuredDoc.likes}
                          </span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 sm:items-end sm:justify-center">
                        <Button
                          onClick={() => handleDownload(featuredDoc.id, featuredDoc.fileUrl)}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 dark:from-orange-600 dark:to-amber-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
                        >
                          <BookOpen className="w-4 h-4 mr-1.5" />
                          Xem ngay
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLike(featuredDoc.id)}
                          className="border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl"
                        >
                          <Heart className="w-3.5 h-3.5 mr-1" />
                          Thích
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Most viewed horizontal scroll */}
            {!hasActiveFilters && mostViewed.length > 1 && (
              <div>
                <h2 className="font-[family-name:var(--font-patrick-hand)] text-xl sm:text-2xl text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  📚 Được xem nhiều
                </h2>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
                  {mostViewed.map((doc, idx) => {
                    const vCat = categoryConfig[doc.category] || categoryConfig['tai-lieu-hoc-tap']
                    return (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        whileHover={{ y: -3, scale: 1.02 }}
                        onClick={() => handleDocClick(doc)}
                        className="shrink-0 w-48 sm:w-56 rounded-xl bg-white dark:bg-card border-2 border-l-4 border-amber-200 dark:border-amber-800 border-l-amber-400 dark:border-l-amber-600 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer"
                      >
                        <div className={`h-1 bg-gradient-to-r ${
                          doc.category === 'giao-an' ? 'from-emerald-400 to-emerald-500' :
                          doc.category === 'tai-lieu-hoc-tap' ? 'from-amber-400 to-amber-500' :
                          doc.category === 'de-thi' ? 'from-rose-400 to-rose-500' :
                          doc.category === 'bai-giang' ? 'from-sky-400 to-sky-500' :
                          'from-purple-400 to-purple-500'
                        }`} />
                        <div className="p-3">
                          <div className="flex items-center gap-1 mb-1.5">
                            <span className="text-amber-500 text-xs font-bold">#{idx + 1}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${vCat.color} ${vCat.darkColor}`}>
                              {vCat.emoji} {vCat.label}
                            </span>
                          </div>
                          <h4 className="font-[family-name:var(--font-patrick-hand)] text-sm text-foreground leading-tight mb-1.5 line-clamp-2">
                            {doc.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-0.5"><Eye className="w-2.5 h-2.5" /> {doc.downloads}</span>
                            <span className="flex items-center gap-0.5 text-rose-400"><Heart className="w-2.5 h-2.5" /> {doc.likes}</span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )
      })()}

      {/* Section divider */}
      <div className="section-divider" />

      {/* Document grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl bg-white dark:bg-card border-2 border-gray-100 dark:border-border overflow-hidden animate-pulse">
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700" />
              <div className="p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-5 w-12 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
                <div className="h-8 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 sm:py-16"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl sm:text-8xl mb-6 inline-block"
          >
            📭
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-muted-foreground mb-2">
              {searchQuery || activeCategory !== 'tat-ca' || activeGrade !== '0' || activeSubject !== 'tat-ca'
                ? 'Không tìm thấy tài liệu'
                : 'Chưa có tài liệu'}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              {searchQuery || activeCategory !== 'tat-ca' || activeGrade !== '0' || activeSubject !== 'tat-ca'
                ? 'Không tìm thấy tài liệu phù hợp. Thử thay đổi bộ lọc nhé!'
                : 'Hãy là người đầu tiên chia sẻ tài liệu!'}
            </p>
            {(searchQuery || activeCategory !== 'tat-ca' || activeGrade !== '0' || activeSubject !== 'tat-ca') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('tat-ca')
                  setActiveGrade('0')
                  setActiveSubject('tat-ca')
                }}
                className="text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-xl"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Xóa bộ lọc
              </Button>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${activeGrade}-${activeSubject}-${searchQuery}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                onLike={handleLike}
                onDownload={handleDownload}
                onClick={handleDocClick}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ===== AI SUGGESTION SECTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-yellow-950/30 border-2 border-amber-200 dark:border-amber-800 p-6 sm:p-8"
      >
        {/* Decorative elements */}
        <div className="absolute top-3 right-8 text-3xl opacity-20 dark:opacity-40 animate-float">💡</div>
        <div className="absolute bottom-3 left-6 text-2xl opacity-15 dark:opacity-30 animate-sparkle" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute top-1/2 right-1/3 text-xl opacity-10 dark:opacity-25 animate-drift-right">🤖</div>

        <div className="relative">
          <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-amber-800 dark:text-amber-200 mb-1 flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-amber-500" />
            Gợi ý Tài liệu
          </h2>
          <p className="text-amber-700 dark:text-amber-300 text-sm mb-5">
            Để Cô Giáo Hải Anh gợi ý tài liệu phù hợp cho con nhé! 🌟
          </p>

          {/* Input row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {/* Grade selector */}
            <div>
              <label className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1 block">Lớp</label>
              <div className="relative">
                <select
                  value={suggestGrade}
                  onChange={(e) => setSuggestGrade(e.target.value)}
                  className="w-full h-10 rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-white dark:bg-card px-3 text-sm text-foreground focus:border-orange-400 dark:focus:border-orange-600 focus:outline-none appearance-none"
                >
                  <option value="1">Lớp 1</option>
                  <option value="2">Lớp 2</option>
                  <option value="3">Lớp 3</option>
                  <option value="4">Lớp 4</option>
                  <option value="5">Lớp 5</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Subject selector */}
            <div>
              <label className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1 block">Môn học</label>
              <div className="relative">
                <select
                  value={suggestSubject}
                  onChange={(e) => setSuggestSubject(e.target.value)}
                  className="w-full h-10 rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-white dark:bg-card px-3 text-sm text-foreground focus:border-orange-400 dark:focus:border-orange-600 focus:outline-none appearance-none"
                >
                  <option value="toan">🔢 Toán</option>
                  <option value="ngu-van">📖 Ngữ văn</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Topic input */}
            <div>
              <label className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1 block">Chủ đề</label>
              <Input
                value={suggestTopic}
                onChange={(e) => setSuggestTopic(e.target.value)}
                placeholder="VD: phân số, đọc hiểu..."
                className="h-10 rounded-xl border-2 border-amber-200 dark:border-amber-700 focus:border-orange-400 dark:focus:border-orange-600 bg-white dark:bg-card"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSuggest() }}
              />
            </div>
          </div>

          {/* Suggest button */}
          <Button
            onClick={handleSuggest}
            disabled={suggesting || !suggestTopic.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 dark:from-amber-600 dark:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            {suggesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tìm gợi ý...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Tìm gợi ý
              </>
            )}
          </Button>

          {/* Error message */}
          {suggestError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-sm"
            >
              {suggestError}
            </motion.div>
          )}

          {/* Suggestion results */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 space-y-3"
            >
              <h3 className="font-[family-name:var(--font-patrick-hand)] text-lg text-amber-800 dark:text-amber-200 flex items-center gap-2">
                🎯 Gợi ý cho con
              </h3>
              {suggestions.map((suggestion, index) => {
                const sCatConfig = categoryConfig[suggestion.category] || categoryConfig['tai-lieu-hoc-tap']
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-white dark:bg-card border-2 border-amber-200 dark:border-amber-800 p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      {/* Category icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                        suggestion.category === 'giao-an' ? 'bg-emerald-100 dark:bg-emerald-950/40' :
                        suggestion.category === 'tai-lieu-hoc-tap' ? 'bg-amber-100 dark:bg-amber-950/40' :
                        suggestion.category === 'de-thi' ? 'bg-rose-100 dark:bg-rose-950/40' :
                        suggestion.category === 'bai-giang' ? 'bg-sky-100 dark:bg-sky-950/40' :
                        'bg-purple-100 dark:bg-purple-950/40'
                      }`}>
                        {sCatConfig.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Category badge */}
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${sCatConfig.color} ${sCatConfig.darkColor}`}>
                          {sCatConfig.label}
                        </span>
                        {/* Title */}
                        <h4 className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground leading-tight mb-1">
                          {suggestion.title}
                        </h4>
                        {/* Description */}
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {suggestion.description}
                        </p>
                      </div>

                      {/* Add to library button */}
                      <Button
                        size="sm"
                        onClick={() => handleAddSuggestion(suggestion, index)}
                        disabled={addingDocIndex === index}
                        className="shrink-0 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 dark:from-teal-600 dark:to-emerald-600 text-white font-semibold text-[10px] rounded-xl shadow-sm gap-1 self-center"
                      >
                        {addingDocIndex === index ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            Thêm
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ===== TEACHER COMMUNITY SECTION ===== */}
      {contributors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-teal-950/30 dark:via-emerald-950/30 dark:to-cyan-950/30 border-2 border-teal-200 dark:border-teal-800 p-6 sm:p-8"
        >
          {/* Decorative elements */}
          <div className="absolute top-3 right-8 text-3xl opacity-20 dark:opacity-40 animate-float">🤝</div>
          <div className="absolute bottom-4 left-6 text-2xl opacity-15 dark:opacity-30 animate-drift-right">👩‍🏫</div>
          <div className="absolute top-1/3 right-1/4 text-xl opacity-10 dark:opacity-25 animate-sparkle" style={{ animationDelay: '0.7s' }}>⭐</div>

          <div className="relative">
            <h2 className="font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl text-teal-800 dark:text-teal-200 mb-1 flex items-center gap-2">
              <Users className="w-7 h-7 text-teal-500" />
              Cộng đồng Giáo viên
            </h2>
            <p className="text-teal-700 dark:text-teal-300 text-sm mb-5">
              Kết nối và chia sẻ kinh nghiệm giảng dạy 🌱
            </p>

            {/* Teacher cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayedContributors.map((contributor, index) => (
                <motion.div
                  key={contributor.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="relative overflow-hidden rounded-2xl bg-white dark:bg-card border-2 border-teal-200 dark:border-teal-800 p-4 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Top accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-400" />

                  <div className="flex items-center gap-3 mb-3">
                    {/* Avatar initial circle */}
                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColors[index % avatarColors.length]} dark:opacity-90 flex items-center justify-center text-white text-base font-bold shrink-0 shadow-md`}>
                      {contributor.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-[family-name:var(--font-patrick-hand)] text-base text-foreground leading-tight truncate">
                        {contributor.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {contributor.documentCount} tài liệu · ❤️ {contributor.totalLikes}
                      </p>
                    </div>
                  </div>

                  {/* Subject badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {contributor.subjects.map((subject) => (
                      <Badge
                        key={subject}
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 h-5 ${
                          subject === 'toan'
                            ? 'border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20'
                            : subject === 'ngu-van'
                              ? 'border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 bg-pink-50/50 dark:bg-pink-950/20'
                              : 'border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20'
                        }`}
                      >
                        {subjectLabelMap[subject] || subject}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats mini row */}
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-teal-100 dark:border-teal-900/30">
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <ThumbsUp className="w-3 h-3 text-teal-500" />
                      {contributor.totalLikes}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Download className="w-3 h-3 text-emerald-500" />
                      {contributor.totalDownloads}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Show all / Show less toggle */}
            {contributors.length > 3 && (
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllContributors(!showAllContributors)}
                  className="text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30 gap-1 text-xs font-semibold"
                >
                  {showAllContributors ? (
                    <>
                      Thu gọn
                      <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                    </>
                  ) : (
                    <>
                      Xem tất cả ({contributors.length})
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ===== DOCUMENT DETAIL MODAL ===== */}
      <DocumentDetailModal
        doc={selectedDoc}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onLike={handleLike}
        onDownload={handleDownload}
        relatedDocs={relatedDocs}
      />
    </div>
  )
}
