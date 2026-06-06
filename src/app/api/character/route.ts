import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Character evolution stages based on XP
interface CharacterStage {
  level: number
  minXP: number
  maxXP: number
  emoji: string
  name: string
  message: string
  accentColor: string
  abilities: string[]
}

const CHARACTER_STAGES: CharacterStage[] = [
  {
    level: 1,
    minXP: 0,
    maxXP: 49,
    emoji: '🥚',
    name: 'Trứng',
    message: 'Chào mừng em đến với thế giới học tập!',
    accentColor: 'gray',
    abilities: ['🌟 Bắt đầu hành trình'],
  },
  {
    level: 2,
    minXP: 50,
    maxXP: 149,
    emoji: '🐣',
    name: 'Bé Gà',
    message: 'Em đang bắt đầu hành trình học tập!',
    accentColor: 'yellow',
    abilities: ['🌟 Bắt đầu hành trình', '💡 Mở khóa gợi ý AI'],
  },
  {
    level: 3,
    minXP: 150,
    maxXP: 299,
    emoji: '🐥',
    name: 'Gà Con',
    message: 'Em đang lớn lên cùng kiến thức!',
    accentColor: 'orange',
    abilities: ['🌟 Bắt đầu hành trình', '💡 Mở khóa gợi ý AI', '🔥 Thử thách hàng ngày'],
  },
  {
    level: 4,
    minXP: 300,
    maxXP: 499,
    emoji: '🐔',
    name: 'Gà Trưởng Thành',
    message: 'Em đã trở thành học sinh chăm chỉ!',
    accentColor: 'amber',
    abilities: ['🌟 Bắt đầu hành trình', '💡 Mở khóa gợi ý AI', '🔥 Thử thách hàng ngày', '🏆 Xếp hạng cao'],
  },
  {
    level: 5,
    minXP: 500,
    maxXP: Infinity,
    emoji: '🦅',
    name: 'Đại Bàng',
    message: 'Em đã vươn cao cùng tri thức!',
    accentColor: 'gold',
    abilities: ['🌟 Bắt đầu hành trình', '💡 Mở khóa gợi ý AI', '🔥 Thử thách hàng ngày', '🏆 Xếp hạng cao', '✨ Bậc thầy tri thức'],
  },
]

// All abilities in order
const ALL_ABILITIES = [
  { level: 1, name: '🌟 Bắt đầu hành trình' },
  { level: 2, name: '💡 Mở khóa gợi ý AI' },
  { level: 3, name: '🔥 Thử thách hàng ngày' },
  { level: 4, name: '🏆 Xếp hạng cao' },
  { level: 5, name: '✨ Bậc thầy tri thức' },
]

// Motivational messages by level
const MOTIVATIONAL_MESSAGES: Record<number, string[]> = {
  1: [
    'Mỗi hành trình vĩ đại đều bắt đầu từ một bước nhỏ! 🌱',
    'Em đã sẵn sàng khám phá thế giới học tập chưa? 🎒',
    'Nhân vật của em sẽ lớn lên khi em học thêm nhiều hơn! 🌟',
  ],
  2: [
    'Em đang làm rất tốt! Tiếp tục nhé! 💪',
    'Gợi ý AI đã được mở khóa! Dùng khi cần nhé! 💡',
    'Mỗi bài kiểm tra đều giúp em mạnh hơn! 📖',
  ],
  3: [
    'Em đang lớn lên cùng kiến thức! 🐥',
    'Thử thách hàng ngày đang chờ em! 🔥',
    'Em đã đi được một nửa hành trình rồi! 🌈',
  ],
  4: [
    'Em đã là học sinh chăm chỉ rồi! 🐔',
    'Xếp hạng cao đã mở khóa! Hãy cạnh tranh nhé! 🏆',
    'Chỉ còn một bước nữa để đạt đến đỉnh cao! ⛰️',
  ],
  5: [
    'Em đã là bậc thầy tri thức! 🦅',
    'Đại Bàng vươn cao - em đã chạm đến ngôi sao! ⭐',
    'Không gì có thể ngăn cản em học hỏi! 🌟',
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentName = searchParams.get('studentName')
    const className = searchParams.get('className')

    if (!studentName || !className) {
      return NextResponse.json(
        { error: 'studentName and className are required' },
        { status: 400 }
      )
    }

    // Get XP data from /api/xp logic (inline to avoid circular fetch)
    const results = await db.studentResult.findMany({
      where: {
        studentName: studentName.trim(),
        className: className.trim(),
      },
      include: {
        quiz: {
          select: {
            id: true,
            subject: true,
            grade: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // Calculate total XP (simplified - base 10 per quiz + score bonuses)
    let totalXP = 0
    let quizzesCompleted = results.length
    let perfectScores = 0
    const subjectSet = new Set<string>()

    for (const result of results) {
      // Base XP
      totalXP += 10

      // Score bonus
      if (result.score >= 10) {
        totalXP += 15
        perfectScores++
      } else if (result.score >= 9) {
        totalXP += 10
      } else if (result.score >= 7) {
        totalXP += 5
      }

      subjectSet.add(result.quiz.subject)
    }

    // Calculate daily streak (simplified)
    const now = new Date()
    const vietnamOffset = 7 * 60
    const vietnamTime = new Date(now.getTime() + (now.getTimezoneOffset() + vietnamOffset) * 60000)

    const resultDates = new Set<string>()
    for (const result of results) {
      const resultDate = new Date(result.createdAt)
      const resultVietnamTime = new Date(resultDate.getTime() + (resultDate.getTimezoneOffset() + vietnamOffset) * 60000)
      const dateStr = `${resultVietnamTime.getFullYear()}-${String(resultVietnamTime.getMonth() + 1).padStart(2, '0')}-${String(resultVietnamTime.getDate()).padStart(2, '0')}`
      resultDates.add(dateStr)
    }

    let dailyStreak = 0
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(vietnamTime)
      checkDate.setDate(checkDate.getDate() - i)
      const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
      if (resultDates.has(checkDateStr)) {
        dailyStreak++
      } else {
        break
      }
    }

    // Count badges earned (simplified - use localStorage in frontend, just estimate here)
    const badgesEarned = Math.min(12, Math.floor(quizzesCompleted / 2) + (perfectScores > 0 ? 1 : 0) + (subjectSet.size > 1 ? 1 : 0))

    // Determine character stage
    let currentStage = CHARACTER_STAGES[0]
    for (const stage of CHARACTER_STAGES) {
      if (totalXP >= stage.minXP) {
        currentStage = stage
      }
    }

    // Calculate next level XP
    const currentStageIndex = CHARACTER_STAGES.indexOf(currentStage)
    const nextStage = currentStageIndex < CHARACTER_STAGES.length - 1
      ? CHARACTER_STAGES[currentStageIndex + 1]
      : null

    const nextLevelXP = nextStage ? nextStage.minXP : currentStage.maxXP

    // Calculate evolution progress (0-100%)
    let evolutionProgress = 0
    if (currentStage.level === 5) {
      evolutionProgress = 100
    } else {
      const rangeXP = nextStage!.minXP - currentStage.minXP
      const currentInRange = totalXP - currentStage.minXP
      evolutionProgress = Math.min(100, Math.round((currentInRange / rangeXP) * 100))
    }

    // Get random motivational message
    const messages = MOTIVATIONAL_MESSAGES[currentStage.level] || MOTIVATIONAL_MESSAGES[1]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    // Build all abilities with unlock status
    const abilities = ALL_ABILITIES.map((ability) => ({
      ...ability,
      unlocked: currentStage.level >= ability.level,
    }))

    // Build evolution stages for timeline
    const evolutionStages = CHARACTER_STAGES.map((stage) => ({
      level: stage.level,
      emoji: stage.emoji,
      name: stage.name,
      minXP: stage.minXP,
      isCurrent: stage.level === currentStage.level,
      isUnlocked: stage.level <= currentStage.level,
      isPast: stage.level < currentStage.level,
    }))

    return NextResponse.json({
      studentName: studentName.trim(),
      className: className.trim(),
      character: {
        level: currentStage.level,
        emoji: currentStage.emoji,
        name: currentStage.name,
        message: currentStage.message,
        accentColor: currentStage.accentColor,
      },
      currentXP: totalXP,
      nextLevelXP,
      evolutionProgress,
      stats: {
        quizzesCompleted,
        perfectScores,
        dailyStreak,
        badgesEarned,
      },
      abilities,
      evolutionStages,
      motivationalMessage: randomMessage,
    })
  } catch (error) {
    console.error('Character API error:', error)
    return NextResponse.json(
      { error: 'Không thể tải thông tin nhân vật' },
      { status: 500 }
    )
  }
}
