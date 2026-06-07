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
  toan: 'Toán',
  'ngu-van': 'Ngữ văn (Tiếng Việt)',
  nguVan: 'Ngữ văn (Tiếng Việt)',
  vietnamese: 'Ngữ văn (Tiếng Việt)',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { questionText, questionType, options, correctAnswer, studentAnswer, grade, subject } = body

    if (!questionText || !correctAnswer || !grade) {
      return NextResponse.json(
        { error: 'Thiếu thông tin cần thiết. Vui lòng thử lại!' },
        { status: 400 }
      )
    }

    const gradeNum = parseInt(grade)
    const gradeDesc = gradeDescriptions[gradeNum] || `lớp ${gradeNum}`
    const subjectName = subjectNames[subject] || subject || 'Toán'
    const isCorrect = studentAnswer && studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    const isFillBlank = questionType === 'fill_blank'

    // Determine explanation length based on grade
    const explanationGuide = gradeNum <= 2
      ? 'Giải thích rất ngắn gọn, chỉ 2-4 câu, dùng từ ngữ đơn giản nhất.'
      : 'Giải thích ngắn gọn 3-6 câu, có thể dùng ví dụ thực tế để học sinh dễ hiểu.'

    const systemPrompt = `Bạn là Cô Giáo Hải Anh, một giáo viên tiểu học Việt Nam thân thiện và tận tâm. Bạn đang giải thích cho học sinh ${gradeDesc} về kết quả bài kiểm tra môn ${subjectName}.

QUY TẮC QUAN TRỌNG:
- Viết bằng tiếng Việt, dùng từ ngữ đơn giản phù hợp với học sinh tiểu học
- Giọng điệu thân thiện, khích lệ như một cô giáo đang trò chuyện với học sinh
- ${explanationGuide}
- ${isCorrect ? 'Khích lệ học sinh vì đã trả lời đúng, sau đó giải thích TẠI SAO đáp án đó đúng.' : 'Nhẹ nhàng giải thích TẠI SAO đáp án đúng là ' + correctAnswer + ' và tại sao câu trả lời của học sinh chưa chính xác.'}
- ${isFillBlank ? 'Với câu điền đáp án, giải thích từng bước cách tìm ra kết quả.' : 'Với câu trắc nghiệm, giải thích tại sao đáp án ' + correctAnswer + ' là đúng và các đáp án khác không đúng.'}
- Dùng ví dụ thực tế gần gũi với học sinh tiểu học nếu có thể
- Luôn kết thúc bằng một câu khích lệ hoặc động viên`

    // Build options context if available
    let optionsContext = ''
    if (options && Array.isArray(options) && options.length > 0) {
      optionsContext = `\n\nCác lựa chọn: ${options.map((opt: string, i: number) => `${String.fromCharCode(65 + i)}. ${opt}`).join(', ')}`
    }

    const userPrompt = isCorrect
      ? `Học sinh đã trả lời ĐÚNG câu hỏi sau. Hãy khen ngợi và giải thích TẠI SAO đáp án "${correctAnswer}" là đúng:

Câu hỏi: ${questionText}
Loại câu: ${isFillBlank ? 'Điền đáp án' : 'Trắc nghiệm'}
Đáp án đúng: ${correctAnswer}
Câu trả lời của học sinh: ${studentAnswer || '(chưa trả lời)'}${optionsContext}

${explanationGuide} Khen ngợi học sinh rồi giải thích lý do đáp án đúng.`
      : `Học sinh đã trả lời SAI câu hỏi sau. Hãy nhẹ nhàng giải thích đáp án đúng:

Câu hỏi: ${questionText}
Loại câu: ${isFillBlank ? 'Điền đáp án' : 'Trắc nghiệm'}
Đáp án đúng: ${correctAnswer}
Câu trả lời của học sinh: ${studentAnswer || '(chưa trả lời)'}${optionsContext}

${explanationGuide} Giải thích TẠI SAO đáp án "${correctAnswer}" là đúng và tại sao câu trả lời "${studentAnswer || '(chưa trả lời)'}" chưa chính xác. Dùng ví dụ gần gũi nếu có thể.`

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      thinking: { type: 'disabled' },
    })

    const explanation = completion.choices[0]?.message?.content

    if (!explanation || explanation.trim().length === 0) {
      return NextResponse.json(
        { error: 'Không thể tạo giải thích lúc này. Con hãy thử lại nhé!' },
        { status: 500 }
      )
    }

    return NextResponse.json({ explanation: explanation.trim() })
  } catch (error) {
    console.error('Explain API error:', error)
    return NextResponse.json(
      { error: 'Không thể tạo giải thích lúc này. Con hãy thử lại sau nhé!' },
      { status: 500 }
    )
  }
}
