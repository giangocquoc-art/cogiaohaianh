import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ProgressResult {
  id: string
  studentName: string
  className: string
  schoolName: string
  quizId: string
  score: number
  totalPoints: number
  timeTaken: number | null
  createdAt: string
  quiz: {
    title: string
    subject: string
    grade: number
    chapter: string
    chapterName: string
  }
}

type TrendType = 'up' | 'down' | 'stable'

const parentTips = [
  {
    id: 1,
    title: 'Tạo không gian học tập yên tĩnh',
    content: 'Hãy dành một góc nhỏ trong nhà làm nơi học tập riêng cho con. Không gian yên tĩnh, đủ ánh sáng, tránh tiếng ồn sẽ giúp con tập trung hơn. Trang trí góc học tập với hình ảnh vui nhộn để con yêu thích việc học.',
    icon: '🏠',
  },
  {
    id: 2,
    title: 'Khích lệ thay vì chỉ trích',
    content: 'Khi con đạt điểm kém, đừng la mắng. Hãy ngồi xuống cùng con xem con sai ở đâu, giúp con hiểu bài thay vì học vẹt. Mỗi lần con tiến bộ, dù nhỏ, hãy khen ngợi để con có động lực.',
    icon: '💖',
  },
  {
    id: 3,
    title: 'Học qua trò chơi',
    content: 'Trẻ tiểu học học tốt nhất qua chơi. Hãy cùng con chơi trò đố vui, trò chơi toán học, hoặc đọc truyện và hỏi con về nội dung. Việc học sẽ trở nên vui vẻ và hiệu quả hơn rất nhiều.',
    icon: '🎮',
  },
  {
    id: 4,
    title: 'Lập thời gian biểu hợp lý',
    content: 'Trẻ tiểu học chỉ nên học 30-45 phút mỗi buổi, sau đó nghỉ ngơi 10-15 phút. Đừng ép con học quá lâu. Thời gian biểu cân bằng giữa học, chơi và nghỉ ngơi sẽ giúp con học tập hiệu quả hơn.',
    icon: '⏰',
  },
  {
    id: 5,
    title: 'Gia đình cùng học tập',
    content: 'Thay vì chỉ giao việc học cho con, hãy cùng con học. Đọc sách bên con, hỏi con về bài học ngày hôm nay, cùng làm bài tập khó. Sự đồng hành của ba mẹ là nguồn động lực lớn nhất cho con.',
    icon: '👨‍👩‍👧‍👦',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentName = searchParams.get('studentName')
    const className = searchParams.get('className')

    if (!studentName || !className) {
      return NextResponse.json(
        { error: 'Thiếu thông tin: cần nhập họ tên và tên lớp của học sinh' },
        { status: 400 }
      )
    }

    // Fetch progress data from internal API
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'

    const progressRes = await fetch(
      `${baseUrl}/api/progress?studentName=${encodeURIComponent(studentName.trim())}&className=${encodeURIComponent(className.trim())}`,
      { cache: 'no-store' }
    )

    if (!progressRes.ok) {
      return NextResponse.json(
        { error: 'Không thể tải dữ liệu tiến độ học tập' },
        { status: 500 }
      )
    }

    const results: ProgressResult[] = await progressRes.json()

    if (results.length === 0) {
      return NextResponse.json({
        progressOverview: null,
        aiRecommendation: null,
        weeklyReport: [],
        parentTips,
        subjectBreakdown: null,
      })
    }

    // Calculate progress overview
    const totalQuizzes = results.length
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / totalQuizzes
    const bestScore = Math.max(...results.map((r) => r.score))

    // Calculate improvement trend
    let improvementTrend: TrendType = 'stable'
    if (results.length >= 2) {
      const mid = Math.floor(results.length / 2)
      const firstHalfAvg = results.slice(0, mid).reduce((s, r) => s + r.score, 0) / mid
      const secondHalf = results.slice(mid)
      const secondHalfAvg = secondHalf.reduce((s, r) => s + r.score, 0) / secondHalf.length
      const diff = secondHalfAvg - firstHalfAvg
      if (diff > 0.5) improvementTrend = 'up'
      else if (diff < -0.5) improvementTrend = 'down'
    }

    // Calculate subject averages
    const toanResults = results.filter((r) => r.quiz?.subject === 'toan')
    const nguVanResults = results.filter((r) => r.quiz?.subject === 'ngu-van')

    const toanAvg = toanResults.length > 0
      ? toanResults.reduce((s, r) => s + r.score, 0) / toanResults.length
      : 0
    const nguVanAvg = nguVanResults.length > 0
      ? nguVanResults.reduce((s, r) => s + r.score, 0) / nguVanResults.length
      : 0

    const strongestSubject = toanAvg >= nguVanAvg ? 'Toán' : 'Ngữ văn'
    const weakestSubject = toanAvg <= nguVanAvg ? 'Toán' : 'Ngữ văn'

    // Subject trends
    const getSubjectTrend = (subjectResults: ProgressResult[]): TrendType => {
      if (subjectResults.length < 2) return 'stable'
      const mid = Math.floor(subjectResults.length / 2)
      const firstHalfAvg = subjectResults.slice(0, mid).reduce((s, r) => s + r.score, 0) / mid
      const secondHalf = subjectResults.slice(mid)
      const secondHalfAvg = secondHalf.reduce((s, r) => s + r.score, 0) / secondHalf.length
      const diff = secondHalfAvg - firstHalfAvg
      if (diff > 0.5) return 'up'
      if (diff < -0.5) return 'down'
      return 'stable'
    }

    const progressOverview = {
      totalQuizzes,
      averageScore: Math.round(averageScore * 10) / 10,
      bestScore: Math.round(bestScore * 10) / 10,
      weakestSubject,
      strongestSubject,
      improvementTrend,
    }

    // Calculate weekly report (last 7 days)
    const now = new Date()
    const weeklyReport = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayResults = results.filter((r) => {
        const resultDate = new Date(r.createdAt).toISOString().split('T')[0]
        return resultDate === dateStr
      })
      const daySubjects = [...new Set(dayResults.map((r) => r.quiz?.subject === 'toan' ? 'Toán' : 'Ngữ văn'))]
      weeklyReport.push({
        date: dateStr,
        quizCount: dayResults.length,
        averageScore: dayResults.length > 0
          ? Math.round((dayResults.reduce((s, r) => s + r.score, 0) / dayResults.length) * 10) / 10
          : 0,
        subjects: daySubjects,
      })
    }

    // Subject breakdown
    const subjectBreakdown = {
      toan: {
        avgScore: Math.round(toanAvg * 10) / 10,
        quizCount: toanResults.length,
        trend: getSubjectTrend(toanResults),
      },
      nguVan: {
        avgScore: Math.round(nguVanAvg * 10) / 10,
        quizCount: nguVanResults.length,
        trend: getSubjectTrend(nguVanResults),
      },
    }

    // Generate AI recommendation
    let aiRecommendation = ''

    try {
      const resultsSummary = results
        .slice(-10) // Last 10 results
        .map((r) => `- ${r.quiz?.title || 'Bài kiểm tra'} (${r.quiz?.subject === 'toan' ? 'Toán' : 'Ngữ văn'}, Lớp ${r.quiz?.grade || '?'}): ${r.score.toFixed(1)}/10`)
        .join('\n')

      const systemPrompt = `Bạn là Cô Giáo Hải Anh, một giáo viên tiểu học Việt Nam rất tận tâm và yêu thương học sinh. Bạn đang viết lời khuyên cho phụ huynh của học sinh.

QUY TẮC QUAN TRỌNG:
- Viết bằng tiếng Việt
- Giọng điệu thân thiện, khích lệ, chân thành như một người bạn đồng hành cùng phụ huynh
- Gọi phụ huynh là "anh/chị" hoặc "ba/mẹ"
- Phân tích điểm mạnh, điểm yếu và đưa ra lời khuyên cụ thể, thực tế
- Giải thích rõ ràng, dễ hiểu cho phụ huynh (không dùng thuật ngữ giáo dục phức tạp)
- Đưa ra 2-3 gợi ý cụ thể để phụ huynh giúp con học tốt hơn
- Khích lệ phụ huynh, giúp họ cảm thấy yên tâm và có hướng đi rõ ràng
- Kết thúc bằng một lời chúc ấm áp từ Cô Giáo Hải Anh
- Giới hạn trong 4-5 đoạn văn ngắn, không quá dài`

      const userPrompt = `Phân tích kết quả học tập của học sinh ${studentName.trim()} lớp ${className.trim()} và đưa ra lời khuyên cho phụ huynh:

Thông tin tổng quan:
- Tổng số bài kiểm tra: ${totalQuizzes}
- Điểm trung bình: ${averageScore.toFixed(1)}/10
- Điểm cao nhất: ${bestScore.toFixed(1)}/10
- Môn mạnh nhất: ${strongestSubject} (${(strongestSubject === 'Toán' ? toanAvg : nguVanAvg).toFixed(1)}/10)
- Môn cần cải thiện: ${weakestSubject} (${(weakestSubject === 'Toán' ? toanAvg : nguVanAvg).toFixed(1)}/10)
- Xu hướng: ${improvementTrend === 'up' ? 'Đang tiến bộ' : improvementTrend === 'down' ? 'Cần cố gắng thêm' : 'Ổn định'}

Kết quả chi tiết (10 bài gần nhất):
${resultsSummary}

Hãy viết lời khuyên cho ba/mẹ em ${studentName.trim()} giúp em học tốt hơn.`

      const zai = await ZAI.create()

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'assistant', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        thinking: { type: 'disabled' },
      })

      aiRecommendation = completion.choices[0]?.message?.content || ''
    } catch (err) {
      console.error('AI recommendation error:', err)
      aiRecommendation = `Em ${studentName.trim()} đã làm ${totalQuizzes} bài kiểm tra với điểm trung bình ${averageScore.toFixed(1)}/10. Em có xu hướng ${improvementTrend === 'up' ? 'tiến bộ tốt' : improvementTrend === 'down' ? 'cần cố gắng thêm' : 'học ổn định'}. Môn mạnh nhất của em là ${strongestSubject}. Ba mẹ hãy khích lệ em tiếp tục phát huy môn mạnh và hỗ trợ em thêm ở môn ${weakestSubject} nhé! 🌟`
    }

    return NextResponse.json({
      progressOverview,
      aiRecommendation,
      weeklyReport,
      parentTips,
      subjectBreakdown,
    })
  } catch (error) {
    console.error('Parent corner API error:', error)
    return NextResponse.json(
      { error: 'Không thể tải dữ liệu Góc Phụ Huynh. Vui lòng thử lại sau.' },
      { status: 500 }
    )
  }
}
