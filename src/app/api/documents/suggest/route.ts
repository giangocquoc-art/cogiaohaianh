import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const gradeNames: Record<string, string> = {
  '1': 'Lớp 1',
  '2': 'Lớp 2',
  '3': 'Lớp 3',
  '4': 'Lớp 4',
  '5': 'Lớp 5',
}

const subjectNames: Record<string, string> = {
  'toan': 'Toán',
  'ngu-van': 'Ngữ văn (Tiếng Việt)',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { grade, subject, topic } = body

    if (!grade || !subject || !topic) {
      return NextResponse.json(
        { error: 'Thiếu thông tin: cần grade, subject, topic' },
        { status: 400 }
      )
    }

    const gradeLabel = gradeNames[grade] || `Lớp ${grade}`
    const subjectLabel = subjectNames[subject] || subject

    const systemPrompt = `Bạn là Cô Giáo Hải Anh, một giáo viên tiểu học Việt Nam tận tâm và giàu kinh nghiệm. Bạn đang gợi ý tài liệu học tập cho học sinh và phụ huynh.

QUY TẮC:
- Gợi ý 3-5 tài liệu phù hợp với chủ đề được yêu cầu
- Mỗi tài liệu bao gồm: title (tiêu đề), description (mô tả ngắn 1-2 câu), category (một trong: giao-an, tai-lieu-hoc-tap, de-thi, bai-giang, phuong-phap)
- Viết bằng tiếng Việt, giọng điệu thân thiện, khích lệ
- Tài liệu phải phù hợp với cấp lớp và môn học
- Trả về JSON hợp lệ theo định dạng sau, KHÔNG thêm markdown hay text khác:

{
  "suggestions": [
    {
      "title": "Tiêu đề tài liệu",
      "description": "Mô tả ngắn gọn nội dung tài liệu",
      "category": "giao-an"
    }
  ]
}`

    const userPrompt = `Hãy gợi ý tài liệu cho:
- Lớp: ${gradeLabel}
- Môn: ${subjectLabel}
- Chủ đề: ${topic}

Gợi ý 3-5 tài liệu phù hợp, đa dạng về danh mục (giáo án, tài liệu học tập, đề thi, bài giảng, phương pháp).`

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const content = completion.choices[0]?.message?.content

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Không thể tạo gợi ý lúc này. Vui lòng thử lại sau!' },
        { status: 500 }
      )
    }

    // Parse JSON from the response
    let suggestions
    try {
      // Try to extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        suggestions = parsed.suggestions || []
      } else {
        suggestions = []
      }
    } catch {
      console.error('Failed to parse suggestions JSON:', content)
      suggestions = []
    }

    if (suggestions.length === 0) {
      return NextResponse.json(
        { error: 'Không thể tạo gợi ý lúc này. Vui lòng thử lại!' },
        { status: 500 }
      )
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Document suggest API error:', error)
    return NextResponse.json(
      { error: 'Không thể tạo gợi ý lúc này. Vui lòng thử lại sau!' },
      { status: 500 }
    )
  }
}
