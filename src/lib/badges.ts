export interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  earned: boolean
  earnedDate: string | null
  progress: number // 0-100 percentage
}

export interface QuizResultForBadge {
  id: string
  score: number
  subject: string
  grade: number
  quizTitle: string
  timeTaken: number | null
  createdAt: string
}

interface BadgeDefinition {
  id: string
  name: string
  description: string
  emoji: string
  evaluate: (results: QuizResultForBadge[], studentInfo: { name: string; className: string; schoolName: string } | null) => { earned: boolean; progress: number; earnedDate: string | null }
}

const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'math-expert',
    name: 'Chuyên gia Toán',
    description: 'Đạt điểm 9+ ở 3 bài kiểm tra Toán',
    emoji: '🌟',
    evaluate: (results) => {
      const mathHighScores = results.filter(r => r.subject === 'toan' && r.score >= 9)
      const target = 3
      const progress = Math.min(100, Math.round((mathHighScores.length / target) * 100))
      const earned = mathHighScores.length >= target
      const earnedDate = earned ? mathHighScores[target - 1].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'little-writer',
    name: 'Nhà văn nhí',
    description: 'Đạt điểm 9+ ở 3 bài kiểm tra Ngữ văn',
    emoji: '📖',
    evaluate: (results) => {
      const vanHighScores = results.filter(r => r.subject === 'ngu-van' && r.score >= 9)
      const target = 3
      const progress = Math.min(100, Math.round((vanHighScores.length / target) * 100))
      const earned = vanHighScores.length >= target
      const earnedDate = earned ? vanHighScores[target - 1].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'daily-challenge',
    name: 'Thử thách hàng ngày',
    description: 'Hoàn thành 1 thử thách hàng ngày',
    emoji: '🔥',
    evaluate: (results, _studentInfo) => {
      // This badge is checked separately via the daily challenge API
      // For now, check if there's a result that could be from a daily challenge
      // We'll mark this based on localStorage data passed through
      const dailyChallengeCompleted = typeof window !== 'undefined' && localStorage.getItem('dailyChallengeCompleted') === 'true'
      const progress = dailyChallengeCompleted ? 100 : 0
      return { earned: dailyChallengeCompleted, progress, earnedDate: dailyChallengeCompleted ? new Date().toISOString() : null }
    },
  },
  {
    id: 'speed-demon',
    name: 'Tốc độ',
    description: 'Hoàn thành bài kiểm tra trong dưới 5 phút',
    emoji: '⚡',
    evaluate: (results) => {
      const fastResults = results.filter(r => r.timeTaken !== null && r.timeTaken < 300)
      const earned = fastResults.length > 0
      const progress = earned ? 100 : Math.min(100, Math.round((results.length > 0 ? Math.min(...results.filter(r => r.timeTaken !== null).map(r => r.timeTaken || 9999), 9999) / 300 : 0) * 100))
      const earnedDate = earned ? fastResults[0].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'perfect-score',
    name: 'Hoàn hảo',
    description: 'Đạt điểm 10/10 ở bất kỳ bài nào',
    emoji: '🎯',
    evaluate: (results) => {
      const perfectResults = results.filter(r => r.score >= 10)
      const earned = perfectResults.length > 0
      const maxScore = results.length > 0 ? Math.max(...results.map(r => r.score)) : 0
      const progress = Math.min(100, Math.round((maxScore / 10) * 100))
      const earnedDate = earned ? perfectResults[0].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'excellent-student',
    name: 'Học sinh xuất sắc',
    description: 'Điểm trung bình >= 8.0 qua 5+ bài kiểm tra',
    emoji: '🏆',
    evaluate: (results) => {
      if (results.length < 5) return { earned: false, progress: Math.round((results.length / 5) * 100), earnedDate: null }
      const avg = results.reduce((sum, r) => sum + r.score, 0) / results.length
      const earned = avg >= 8.0
      const progress = earned ? 100 : Math.min(100, Math.round((avg / 8.0) * 100))
      const earnedDate = earned ? results[4].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'versatile',
    name: 'Đa năng',
    description: 'Hoàn thành bài kiểm tra cả Toán và Ngữ văn',
    emoji: '🌈',
    evaluate: (results) => {
      const hasMath = results.some(r => r.subject === 'toan')
      const hasVan = results.some(r => r.subject === 'ngu-van')
      const earned = hasMath && hasVan
      const progress = ((hasMath ? 50 : 0) + (hasVan ? 50 : 0))
      const earnedDate = earned ? results.find(r => r.subject === (results.findIndex(x => x.subject === 'toan') < results.findIndex(x => x.subject === 'ngu-van') ? 'ngu-van' : 'toan'))?.createdAt || null : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'hard-worker',
    name: 'Chăm chỉ',
    description: 'Hoàn thành 10 bài kiểm tra',
    emoji: '📚',
    evaluate: (results) => {
      const target = 10
      const progress = Math.min(100, Math.round((results.length / target) * 100))
      const earned = results.length >= target
      const earnedDate = earned ? results[target - 1].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'never-give-up',
    name: 'Không bỏ cuộc',
    description: 'Hoàn thành 3 bài kiểm tra dù điểm dưới 5',
    emoji: '💪',
    evaluate: (results) => {
      const lowScoreResults = results.filter(r => r.score < 5)
      const target = 3
      const progress = Math.min(100, Math.round((lowScoreResults.length / target) * 100))
      const earned = lowScoreResults.length >= target
      const earnedDate = earned ? lowScoreResults[target - 1].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'improvement',
    name: 'Thăng tiến',
    description: 'Cải thiện điểm số 2+ điểm giữa các lần làm',
    emoji: '🚀',
    evaluate: (results) => {
      if (results.length < 2) return { earned: false, progress: 0, earnedDate: null }
      // Group by quizId (or subject+grade) and check for improvement
      let maxImprovement = 0
      let improvementDate: string | null = null
      for (let i = 1; i < results.length; i++) {
        const improvement = results[i].score - results[i - 1].score
        if (improvement > maxImprovement) {
          maxImprovement = improvement
          improvementDate = results[i].createdAt
        }
      }
      const earned = maxImprovement >= 2
      const progress = Math.min(100, Math.round((maxImprovement / 2) * 100))
      const earnedDate = earned ? improvementDate : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'first-quiz',
    name: 'Bắt đầu',
    description: 'Hoàn thành bài kiểm tra đầu tiên',
    emoji: '⭐',
    evaluate: (results) => {
      const earned = results.length >= 1
      const progress = earned ? 100 : 0
      const earnedDate = earned ? results[0].createdAt : null
      return { earned, progress, earnedDate }
    },
  },
  {
    id: 'new-student',
    name: 'Học sinh mới',
    description: 'Nhập thông tin cá nhân lần đầu',
    emoji: '🎒',
    evaluate: (_results, studentInfo) => {
      const earned = !!studentInfo?.name
      const progress = earned ? 100 : 0
      return { earned, progress, earnedDate: earned ? new Date().toISOString() : null }
    },
  },
]

export function evaluateBadges(
  results: QuizResultForBadge[],
  studentInfo: { name: string; className: string; schoolName: string } | null
): Badge[] {
  return badgeDefinitions.map((def) => {
    const evaluation = def.evaluate(results, studentInfo)
    return {
      id: def.id,
      name: def.name,
      description: def.description,
      emoji: def.emoji,
      earned: evaluation.earned,
      earnedDate: evaluation.earnedDate,
      progress: evaluation.progress,
    }
  })
}

export function getNewBadges(
  previousBadges: Badge[],
  currentBadges: Badge[]
): Badge[] {
  return currentBadges.filter((current) => {
    const previous = previousBadges.find((p) => p.id === current.id)
    return current.earned && (!previous || !previous.earned)
  })
}

export function saveBadgesToStorage(badges: Badge[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('earnedBadges', JSON.stringify(badges.filter(b => b.earned).map(b => b.id)))
}

export function loadBadgesFromStorage(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem('earnedBadges')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function markDailyChallengeCompleted(): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('dailyChallengeCompleted', 'true')
}
