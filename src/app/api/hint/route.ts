import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const gradeDescriptions: Record<number, string> = {
  1: 'lớp 1 (6-7 tuổi, mới bắt đầu học)',
  2: 'lớp 2 (7-8 tuổi)',
  3: 'lớp 3 (8-9 tuổi)',
  4: 'lớp 4 (9-10 tuổi)',
  5: 'lớp 5 (10-11 tuổi)',
}

const subjectNames: Record<string, string> = {
  math: 'Toán',
  vietnamese: 'Ngữ văn (Tiếng Việt)',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionText, questionType, grade, subject, hintNumber } = body

    if (!questionText || !questionType || !grade || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: questionText, questionType, grade, subject' },
        { status: 400 }
      )
    }

    const gradeNum = parseInt(grade)
    const gradeDesc = gradeDescriptions[gradeNum] || `lớp ${gradeNum}`
    const subjectName = subjectNames[subject] || subject
    const isFillBlank = questionType === 'fill_blank'
    const hintNum = hintNumber || 1

    const systemPrompt = `Bạn là Cô Giáo Hải Anh, một giáo viên tiểu học Việt Nam rất tận tâm và yêu thương học sinh. Bạn đang giúp học sinh ${gradeDesc} làm bài môn ${subjectName}.

QUY TẮC QUAN TRỌNG:
- KHÔNG BAO GIỜ đưa ra đáp án trực tiếp
- Chỉ đưa ra gợi ý nhẹ nhàng để học sinh tự suy nghĩ và tìm ra câu trả lời
- Viết bằng tiếng Việt, dùng từ ngữ đơn giản phù hợp với học sinh tiểu học
- Giọng điệu thân thiện, khích lệ: "Con thử nghĩ xem...", "Con có thể làm được!", "Gợi ý nhỏ cho con nhé..."
- Gợi ý ngắn gọn, chỉ 1-2 câu
- ${isFillBlank ? 'Với câu điền đáp án, gợi ý cách tìm kết quả chứ không cho con số.' : 'Với câu trắc nghiệm, gợi ý cách loại trừ hoặc tư duy logic, không chỉ thẳng đáp án.'}
- ${hintNum === 2 ? 'Đây là gợi ý thứ 2, có thể chi tiết hơn một chút nhưng vẫn KHÔNG đưa đáp án.' : 'Đây là gợi ý đầu tiên, hãy thật nhẹ nhàng.'}
- Luôn kết thúc bằng một câu khích lệ`

    const userPrompt = `Hãy cho gợi ý ${hintNum === 2 ? 'thứ 2, chi tiết hơn ' : ''}cho câu hỏi sau (môn ${subjectName}, học sinh ${gradeDesc}):

Câu hỏi: ${questionText}
Loại câu: ${isFillBlank ? 'Điền đáp án' : 'Trắc nghiệm'}

Hãy đưa ra gợi ý ngắn gọn 1-2 câu, KHÔNG đưa đáp án.`

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const hint = completion.choices[0]?.message?.content

    if (!hint || hint.trim().length === 0) {
      return NextResponse.json(
        { error: 'Không thể tạo gợi ý lúc này. Con hãy thử lại nhé!' },
        { status: 500 }
      )
    }

    return NextResponse.json({ hint: hint.trim() })
  } catch (error) {
    console.error('Hint API error:', error)
    return NextResponse.json(
      { error: 'Không thể tạo gợi ý lúc này. Con hãy thử lại sau nhé!' },
      { status: 500 }
    )
  }
}
