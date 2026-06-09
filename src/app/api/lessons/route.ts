import { NextRequest, NextResponse } from 'next/server'

interface KeyConcept {
  text: string
  emoji: string
}

interface ExampleStep {
  step: string
  detail: string
}

interface Example {
  title: string
  steps: ExampleStep[]
}

interface PracticeTip {
  text: string
  emoji: string
}

interface Exercise {
  question: string
  answer: string
}

interface Lesson {
  id: string
  chapter: number
  title: string
  description: string
  emoji: string
  difficulty: number // 1-5 stars
  lessonContent: string // Full lesson content - nội dung bài học thật
  keyConcepts: KeyConcept[]
  examples: Example[]
  exercises: Exercise[] // Practice exercises
  practiceTips: PracticeTip[]
  relatedQuizGrade: number
  relatedQuizSubject: string
  relatedQuizChapter: number
}

interface GradeLessons {
  toan: Lesson[]
  'ngu-van': Lesson[]
}

type LessonsData = Record<number, GradeLessons>

const lessonsData: LessonsData = {
  1: {
    toan: [
      {
        id: 'lop-1-toan-bai-1',
        chapter: 1,
        title: 'Số từ 1 đến 10',
        description: 'Nhận biết và đếm các số từ 1 đến 10, so sánh các số nhỏ hơn 10',
        emoji: '🔢',
        difficulty: 1,
        lessonContent: 'Các số tự nhiên từ 1 đến 10 là những số đầu tiên chúng ta học. Mỗi số đại diện cho một số lượng đồ vật khác nhau. Khi đếm, ta bắt đầu từ số 1 và đếm tăng dần: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Để biết số lượng đồ vật, ta chỉ vào từng đồ vật và đếm: một, hai, ba... cho đến khi đếm hết. Khi so sánh hai số, số nào có giá trị lớn hơn thì biểu thị nhiều đồ vật hơn. Ta dùng dấu < (nhỏ hơn) và > (lớn hơn) để so sánh.',
        exercises: [{"question":"Đếm: 🍊🍊🍊. Mấy quả?","answer":"3 quả cam"},{"question":"Số nào lớn hơn: 7 hay 4?","answer":"7 > 4"},{"question":"Viết số từ 1 đến 5:","answer":"1, 2, 3, 4, 5"}],
        keyConcepts: [
          { text: 'Nhận biết các số từ 1 đến 10', emoji: '👀' },
          { text: 'Đếm số lượng đồ vật từ 1 đến 10', emoji: '🖐️' },
          { text: 'So sánh hai số trong phạm vi 10 (lớn hơn, nhỏ hơn, bằng nhau)', emoji: '⚖️' },
          { text: 'Viết các số từ 1 đến 10', emoji: '✏️' },
        ],
        examples: [
          {
            title: 'Đếm số quả táo',
            steps: [
              { step: 'Bước 1', detail: 'Nhìn vào hình vẽ và đếm số quả táo' },
              { step: 'Bước 2', detail: 'Chỉ vào từng quả và đếm: 1, 2, 3, 4, 5' },
              { step: 'Bước 3', detail: 'Có 5 quả táo. Vậy số quả táo là 5' },
            ],
          },
          {
            title: 'So sánh 3 và 5',
            steps: [
              { step: 'Bước 1', detail: 'Đếm số đồ vật bên trái: 3 cái kẹo' },
              { step: 'Bước 2', detail: 'Đếm số đồ vật bên phải: 5 cái kẹo' },
              { step: 'Bước 3', detail: '3 < 5 (3 nhỏ hơn 5). Bên phải có nhiều kẹo hơn' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Đếm số bước chân khi đi từ phòng này sang phòng khác', emoji: '🚶' },
          { text: 'Đếm số ngón tay trên hai bàn tay', emoji: '🖐️' },
          { text: 'Nhặt các viên sỏi và đếm xem có bao nhiêu viên', emoji: '🪨' },
        ],
        relatedQuizGrade: 1,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-1-toan-bai-2',
        chapter: 2,
        title: 'Phép cộng trong phạm vi 10',
        description: 'Học cách cộng hai số có tổng không vượt quá 10, sử dụng đồ vật để đếm',
        emoji: '➕',
        difficulty: 2,
        lessonContent: 'Phép cộng là gộp hai nhóm đồ vật lại với nhau để biết tất cả có bao nhiêu. Khi thấy dấu "+", ta cần tìm tổng của hai số. Ví dụ: 3 + 4 nghĩa là gộp 3 đồ vật với 4 đồ vật, ta đếm tất cả được 7. Dấu "=" có nghĩa là "bằng". Vậy 3 + 4 = 7 đọc là "ba cộng bốn bằng bảy".',
        exercises: [{"question":"2 + 3 = ?","answer":"5"},{"question":"Lan có 4 kẹo, mẹ cho thêm 3. Mấy cái?","answer":"7 cái kẹo"},{"question":"5 + 5 = ?","answer":"10"}],
        keyConcepts: [
          { text: 'Hiểu phép cộng là gộp thêm vào', emoji: '🤝' },
          { text: 'Biết cách tính tổng hai số trong phạm vi 10', emoji: '🧮' },
          { text: 'Dùng đồ vật để đếm và cộng', emoji: '🍎' },
          { text: 'Nhận biết dấu "+" và dấu "="', emoji: '📝' },
        ],
        examples: [
          {
            title: 'Tính 3 + 4',
            steps: [
              { step: 'Bước 1', detail: 'Lấy 3 cái kẹo (đặt bên trái)' },
              { step: 'Bước 2', detail: 'Lấy thêm 4 cái kẹo nữa (đặt bên phải)' },
              { step: 'Bước 3', detail: 'Đếm tất cả: 1, 2, 3, 4, 5, 6, 7. Vậy 3 + 4 = 7' },
            ],
          },
          {
            title: 'Tính 5 + 5',
            steps: [
              { step: 'Bước 1', detail: 'Đếm 5 ngón tay trái' },
              { step: 'Bước 2', detail: 'Đếm 5 ngón tay phải' },
              { step: 'Bước 3', detail: 'Gộp lại đếm tất cả: 10. Vậy 5 + 5 = 10' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Dùng 10 viên sỏi để thực hành gộp nhóm và đếm', emoji: '🪨' },
          { text: 'Chơi trò chơi: gấp số ngón tay và cộng lại', emoji: '🖐️' },
          { text: 'Đếm số bạn trong nhóm rồi thêm bạn mới vào', emoji: '👧' },
        ],
        relatedQuizGrade: 1,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-1-toan-bai-3',
        chapter: 3,
        title: 'Phép trừ trong phạm vi 10',
        description: 'Học cách trừ hai số trong phạm vi 10, hiểu phép trừ là bớt đi',
        emoji: '➖',
        difficulty: 2,
        lessonContent: 'Phép trừ là bớt đi một số lượng từ một nhóm đồ vật. Khi thấy dấu "−", ta cần tìm phần còn lại sau khi bớt. Ví dụ: 7 − 3 nghĩa là từ 7 đồ vật, bớt đi 3 đồ vật, còn lại 4. Phép trừ ngược với phép cộng: nếu 3 + 4 = 7 thì 7 − 4 = 3 và 7 − 3 = 4.',
        exercises: [{"question":"8 − 3 = ?","answer":"5"},{"question":"6 quả chuối, ăn 2. Còn lại?","answer":"4 quả"},{"question":"10 − 7 = ?","answer":"3"}],
        keyConcepts: [
          { text: 'Hiểu phép trừ là bớt đi hoặc lấy ra', emoji: '🔙' },
          { text: 'Biết cách tính hiệu hai số trong phạm vi 10', emoji: '🧮' },
          { text: 'Dùng đồ vật để lấy bớt và đếm phần còn lại', emoji: '🍎' },
          { text: 'Nhận biết dấu "−" và kết quả phép trừ', emoji: '📝' },
        ],
        examples: [
          {
            title: 'Tính 7 − 3',
            steps: [
              { step: 'Bước 1', detail: 'Có 7 quả cam' },
              { step: 'Bước 2', detail: 'Lấy bớt đi 3 quả cam' },
              { step: 'Bước 3', detail: 'Đếm phần còn lại: 4. Vậy 7 − 3 = 4' },
            ],
          },
          {
            title: 'Tính 10 − 6',
            steps: [
              { step: 'Bước 1', detail: 'Có 10 cái kẹo' },
              { step: 'Bước 2', detail: 'Cho bạn 6 cái kẹo' },
              { step: 'Bước 3', detail: 'Còn lại 4 cái. Vậy 10 − 6 = 4' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Dùng 10 que tính, lấy bớt đi và đếm phần còn lại', emoji: '🪵' },
          { text: 'Chơi trò bán hàng: có 8 cái bánh, bán 3 cái, còn mấy cái?', emoji: '🧁' },
          { text: 'Vẽ hình tròn rồi gạch đi số lượng cần bớt', emoji: '⭕' },
        ],
        relatedQuizGrade: 1,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 3,
      },
    ],
    'ngu-van': [
      {
        id: 'lop-1-ngu-van-bai-1',
        chapter: 1,
        title: 'Tập đọc chữ cái',
        description: 'Nhận biết và đọc các nguyên âm, phụ âm trong tiếng Việt',
        emoji: '🔤',
        difficulty: 1,
        lessonContent: 'Bảng chữ cái tiếng Việt có 29 chữ cái: a, ă, â, b, c, d, đ, e, ê, g, h, i, k, l, m, n, o, ô, ơ, p, q, r, s, t, u, ư, v, x, y. Trong đó có 12 nguyên âm và 17 phụ âm. Nguyên âm là âm khi phát âm luồng hơi không bị cản trở, còn phụ âm thì luồng hơi bị cản trở.',
        exercises: [{"question":"Có bao nhiêu nguyên âm?","answer":"12 nguyên âm"},{"question":"\"b\" là nguyên âm hay phụ âm?","answer":"Phụ âm"},{"question":"Viết 3 phụ âm:","answer":"Ví dụ: b, c, d"}],
        keyConcepts: [
          { text: 'Nhận biết 29 chữ cái trong bảng chữ cái tiếng Việt', emoji: '📖' },
          { text: 'Phân biệt nguyên âm (a, ă, â, e, ê, i, o, ô, ơ, u, ư, y) và phụ âm', emoji: '🗣️' },
          { text: 'Đọc đúng âm từng chữ cái', emoji: '👂' },
          { text: 'Viết đúng nét từng chữ cái in thường và in hoa', emoji: '✍️' },
        ],
        examples: [
          {
            title: 'Đọc nguyên âm',
            steps: [
              { step: 'Bước 1', detail: 'Nhìn chữ "a" trên bảng' },
              { step: 'Bước 2', detail: 'Mở miệng rộng, phát âm "a" rõ ràng' },
              { step: 'Bước 3', detail: 'Lặp lại 3 lần để nhớ chữ và âm' },
            ],
          },
          {
            title: 'Phân biệt "o" và "ô"',
            steps: [
              { step: 'Bước 1', detail: 'Chữ "o": môi tròn, âm mở wider' },
              { step: 'Bước 2', detail: 'Chữ "ô": môi tròn hẹp hơn, âm đóng hơn' },
              { step: 'Bước 3', detail: 'Luyện đọc: o - ô, o - ô nhiều lần để phân biệt' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Hát bảng chữ cái mỗi ngày để nhớ tốt hơn', emoji: '🎵' },
          { text: 'Tìm chữ cái xung quanh nhà: trên bao bì, biển hiệu', emoji: '🏠' },
          { text: 'Viết chữ cái bằng ngón tay trên không khí hoặc trên cát', emoji: '✨' },
        ],
        relatedQuizGrade: 1,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-1-ngu-van-bai-2',
        chapter: 2,
        title: 'Ghép vần và đánh vần',
        description: 'Học cách ghép âm đầu + vần để tạo tiếng, luyện đánh vần đúng',
        emoji: '🔤',
        difficulty: 2,
        lessonContent: 'Tiếng Việt được cấu tạo từ âm đầu, vần và thanh điệu. Khi đánh vần, ta tách tiếng thành các phần rồi ghép lại. Ví dụ: tiếng "ba" = b + a, đánh vần: bờ - a - ba. Thanh điệu gồm 5 dấu: sắc, huyền, hỏi, ngã, nặng.',
        exercises: [{"question":"Đánh vần \"ma\":","answer":"mờ - a - ma"},{"question":"\"bà\" có dấu gì?","answer":"Dấu huyền"},{"question":"Tách tiếng \"cá\":","answer":"c + á"}],
        keyConcepts: [
          { text: 'Hiểu cấu tạo tiếng: âm đầu + vần + thanh điệu', emoji: '🧩' },
          { text: 'Ghép phụ âm với nguyên âm tạo vần: b + a = ba', emoji: '🔗' },
          { text: 'Đánh vần từng tiếng theo đúng quy trình', emoji: '🗣️' },
          { text: 'Nhận biết dấu thanh: sắc, huyền, hỏi, ngã, nặng', emoji: '➰' },
        ],
        examples: [
          {
            title: 'Đánh vần tiếng "ba"',
            steps: [
              { step: 'Bước 1', detail: 'Tách tiếng: b - a' },
              { step: 'Bước 2', detail: 'Đánh vần: bờ - a - ba' },
              { step: 'Bước 3', detail: 'Đọc trơn: ba (như từ "ba" bố)' },
            ],
          },
          {
            title: 'Đánh vần tiếng "má"',
            steps: [
              { step: 'Bước 1', detail: 'Tách tiếng: m - a - dấu sắc' },
              { step: 'Bước 2', detail: 'Đánh vần: mờ - a - ma - má' },
              { step: 'Bước 3', detail: 'Đọc trơn: má (như má em)' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Luyện đánh vần 5 tiếng mới mỗi ngày', emoji: '📅' },
          { text: 'Chơi trò ghép chữ: cắt các chữ cái rồi ghép lại thành tiếng', emoji: '✂️' },
          { text: 'Đọc to rõ ràng khi đánh vần để nhớ cách phát âm', emoji: '📢' },
        ],
        relatedQuizGrade: 1,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-1-ngu-van-bai-3',
        chapter: 3,
        title: 'Viết câu đơn',
        description: 'Học cách viết câu đơn giản với chủ ngữ - vị ngữ, đúng chính tả',
        emoji: '✍️',
        difficulty: 2,
        lessonContent: 'Câu đơn là câu chỉ có một chủ ngữ và một vị ngữ. Chủ ngữ trả lời cho câu hỏi "Ai?", "Cái gì?". Vị ngữ trả lời cho câu hỏi "Làm gì?", "Thế nào?". Khi viết câu, ta phải viết hoa chữ cái đầu câu và đặt dấu chấm ở cuối câu.',
        exercises: [{"question":"Chủ ngữ: \"Con mèo ngủ.\"","answer":"Con mèo"},{"question":"Vị ngữ: \"Bạn Lan đọc sách.\"","answer":"đọc sách"},{"question":"Viết 1 câu đơn:","answer":"Ví dụ: Con chim bay."}],
        keyConcepts: [
          { text: 'Câu đơn gồm có chủ ngữ (ai? cái gì?) và vị ngữ (làm gì?)', emoji: '🏗️' },
          { text: 'Viết câu đúng cấu trúc: Ai làm gì?', emoji: '📝' },
          { text: 'Viết đúng chính tả các từ thông dụng', emoji: '✅' },
          { text: 'Viết hoa đầu câu và đặt dấu chấm cuối câu', emoji: '🔴' },
        ],
        examples: [
          {
            title: 'Viết câu "Bạn Lan đọc sách"',
            steps: [
              { step: 'Bước 1', detail: 'Tìm chủ ngữ: Bạn Lan (ai?)' },
              { step: 'Bước 2', detail: 'Tìm vị ngữ: đọc sách (làm gì?)' },
              { step: 'Bước 3', detail: 'Viết: Bạn Lan đọc sách. (viết hoa B, chấm cuối câu)' },
            ],
          },
          {
            title: 'Viết câu "Con mèo ngủ"',
            steps: [
              { step: 'Bước 1', detail: 'Tìm chủ ngữ: Con mèo (cái gì?)' },
              { step: 'Bước 2', detail: 'Tìm vị ngữ: ngủ (làm gì?)' },
              { step: 'Bước 3', detail: 'Viết: Con mèo ngủ. (viết hoa C, chấm cuối câu)' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Hỏi "Ai?" và "Làm gì?" để tạo câu đơn', emoji: '❓' },
          { text: 'Viết 3 câu đơn mỗi ngày về các bạn trong lớp', emoji: '📓' },
          { text: 'Nhớ: luôn viết hoa chữ cái đầu câu và đặt dấu chấm cuối', emoji: '💡' },
        ],
        relatedQuizGrade: 1,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 3,
      },
    ],
  },
  2: {
    toan: [
      {
        id: 'lop-2-toan-bai-1',
        chapter: 1,
        title: 'Số đến 100',
        description: 'Đếm, đọc, viết các số từ 1 đến 100, so sánh các số có hai chữ số',
        emoji: '💯',
        difficulty: 2,
        lessonContent: 'Các số từ 1 đến 100 bao gồm số có 1 chữ số và số có 2 chữ số. Số có 2 chữ số gồm chữ số hàng chục và hàng đơn vị. Ví dụ: số 47 có 4 chục và 7 đơn vị. Khi so sánh, ta so sánh hàng chục trước, nếu bằng nhau thì so sánh hàng đơn vị.',
        exercises: [{"question":"Phân tích 56:","answer":"50 + 6"},{"question":"73 ___ 69?","answer":"73 > 69"},{"question":"Viết \"bốn mươi hai\":","answer":"42"}],
        keyConcepts: [
          { text: 'Đếm từ 1 đến 100 theo thứ tự', emoji: '🔢' },
          { text: 'Đọc và viết các số có hai chữ số', emoji: '📝' },
          { text: 'Phân tích số: chục và đơn vị (34 = 3 chục + 4 đơn vị)', emoji: '🧮' },
          { text: 'So sánh các số có hai chữ số', emoji: '⚖️' },
        ],
        examples: [
          {
            title: 'Phân tích số 47',
            steps: [
              { step: 'Bước 1', detail: 'Nhìn số 47' },
              { step: 'Bước 2', detail: 'Chữ số đầu là 4 → 4 chục = 40' },
              { step: 'Bước 3', detail: 'Chữ số sau là 7 → 7 đơn vị. Vậy 47 = 40 + 7' },
            ],
          },
          {
            title: 'So sánh 56 và 63',
            steps: [
              { step: 'Bước 1', detail: 'So sánh chục: 5 chục < 6 chục' },
              { step: 'Bước 2', detail: 'Không cần so đơn vị vì chục đã khác' },
              { step: 'Bước 3', detail: 'Vậy 56 < 63' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Đếm số bước từ 1 đến 100 thật to', emoji: '🚶' },
          { text: 'Đọc số nhà trên đường đi học', emoji: '🏠' },
          { text: 'Chơi trò: ai viết được nhiều số hơn trong 1 phút', emoji: '⏱️' },
        ],
        relatedQuizGrade: 2,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-2-toan-bai-2',
        chapter: 2,
        title: 'Phép cộng có nhớ trong phạm vi 100',
        description: 'Cộng hai số có hai chữ số với tổng không vượt quá 100, bao gồm phép cộng có nhớ',
        emoji: '➕',
        difficulty: 3,
        lessonContent: 'Khi cộng hai số có 2 chữ số mà tổng hàng đơn vị lớn hơn 9, ta phải nhớ sang hàng chục. Khi đặt tính dọc, phải thẳng hàng: đơn vị dưới đơn vị, chục dưới chục. Cộng từ hàng đơn vị lên.',
        exercises: [{"question":"45 + 38 = ?","answer":"83"},{"question":"67 + 25 = ?","answer":"92"},{"question":"28 + 35 = ?","answer":"63"}],
        keyConcepts: [
          { text: 'Cộng hai số có hai chữ số (không nhớ và có nhớ)', emoji: '🧮' },
          { text: 'Đặt tính dọc đúng cách: đơn vị dưới đơn vị, chục dưới chục', emoji: '📐' },
          { text: 'Cộng từ hàng đơn vị đến hàng chục', emoji: '📏' },
          { text: 'Nhớ sang hàng chục khi đơn vị lớn hơn 9', emoji: '💡' },
        ],
        examples: [
          {
            title: 'Tính 36 + 47',
            steps: [
              { step: 'Bước 1', detail: 'Cộng hàng đơn vị: 6 + 7 = 13. Viết 3 nhớ 1' },
              { step: 'Bước 2', detail: 'Cộng hàng chục: 3 + 4 = 7, thêm 1 nhớ = 8' },
              { step: 'Bước 3', detail: 'Vậy 36 + 47 = 83' },
            ],
          },
          {
            title: 'Tính 58 + 25',
            steps: [
              { step: 'Bước 1', detail: 'Cộng hàng đơn vị: 8 + 5 = 13. Viết 3 nhớ 1' },
              { step: 'Bước 2', detail: 'Cộng hàng chục: 5 + 2 = 7, thêm 1 nhớ = 8' },
              { step: 'Bước 3', detail: 'Vậy 58 + 25 = 83' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Luôn đặt tính dọc trước khi tính để tránh nhầm lẫn', emoji: '📐' },
          { text: 'Nhớ ghi nhớ vào góc bài khi có phép nhớ', emoji: '✏️' },
          { text: 'Kiểm tra lại bằng cách cộng từ dưới lên trên', emoji: '🔄' },
        ],
        relatedQuizGrade: 2,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-2-toan-bai-3',
        chapter: 3,
        title: 'Phép trừ có nhớ trong phạm vi 100',
        description: 'Trừ hai số có hai chữ số, bao gồm phép trừ có nhớ',
        emoji: '➖',
        difficulty: 3,
        lessonContent: 'Khi trừ hai số có 2 chữ số mà hàng đơn vị không đủ trừ, ta phải mượn 1 chục sang hàng đơn vị. Nhớ gạch chéo ở hàng chục khi mượn. Kiểm tra: tổng hiệu + số trừ = số bị trừ.',
        exercises: [{"question":"63 − 27 = ?","answer":"36"},{"question":"80 − 45 = ?","answer":"35"},{"question":"54 − 28 = ?","answer":"26"}],
        keyConcepts: [
          { text: 'Trừ hai số có hai chữ số (không nhớ và có nhớ)', emoji: '🧮' },
          { text: 'Đặt tính dọc đúng cách: đơn vị dưới đơn vị, chục dưới chục', emoji: '📐' },
          { text: 'Trừ từ hàng đơn vị đến hàng chục', emoji: '📏' },
          { text: 'Mượn từ hàng chục khi đơn vị không đủ trừ', emoji: '💡' },
        ],
        examples: [
          {
            title: 'Tính 72 − 38',
            steps: [
              { step: 'Bước 1', detail: 'Trừ hàng đơn vị: 2 − 8 không đủ. Mượn 1 chục = 12 − 8 = 4' },
              { step: 'Bước 2', detail: 'Trừ hàng chục: 7 − 1 (mượn) = 6, rồi 6 − 3 = 3' },
              { step: 'Bước 3', detail: 'Vậy 72 − 38 = 34' },
            ],
          },
          {
            title: 'Tính 90 − 47',
            steps: [
              { step: 'Bước 1', detail: 'Trừ hàng đơn vị: 0 − 7 không đủ. Mượn 1 chục = 10 − 7 = 3' },
              { step: 'Bước 2', detail: 'Trừ hàng chục: 9 − 1 (mượn) = 8, rồi 8 − 4 = 4' },
              { step: 'Bước 3', detail: 'Vậy 90 − 47 = 43' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Nhớ gạch chéo ở hàng chục khi mượn 1', emoji: '✏️' },
          { text: 'Kiểm tra: tổng hiệu + số trừ = số bị trừ', emoji: '✅' },
          { text: 'Tập tính nhanh các phép trừ đơn giản trước', emoji: '⚡' },
        ],
        relatedQuizGrade: 2,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 3,
      },
    ],
    'ngu-van': [
      {
        id: 'lop-2-ngu-van-bai-1',
        chapter: 1,
        title: 'Tập đọc hiểu văn bản ngắn',
        description: 'Đọc hiểu các đoạn văn ngắn, trả lời câu hỏi về nội dung bài đọc',
        emoji: '📖',
        difficulty: 2,
        lessonContent: 'Đọc hiểu là kỹ năng quan trọng nhất khi học Ngữ văn. Khi đọc, ta cần đọc trơn toàn bài, ngắt nghỉ đúng chỗ, hiểu nội dung chính và trả lời được câu hỏi về bài. Các câu hỏi thường hỏi: Ai? Làm gì? Ở đâu? Khi nào?',
        exercises: [{"question":"Khi đọc đoạn văn cần làm gì?","answer":"Đọc trơn toàn bài"},{"question":"Câu hỏi thường hỏi gì?","answer":"Ai? Làm gì? Ở đâu?"},{"question":"Tìm ý chính đoạn văn.","answer":"(Tùy bài đọc)"}],
        keyConcepts: [
          { text: 'Đọc trơn toàn bài, ngắt nghỉ đúng chỗ', emoji: '🗣️' },
          { text: 'Hiểu nội dung chính của đoạn văn', emoji: '🧠' },
          { text: 'Trả lời câu hỏi: Ai? Làm gì? Ở đâu? Khi nào?', emoji: '❓' },
          { text: 'Tìm chi tiết trong bài để trả lời câu hỏi', emoji: '🔍' },
        ],
        examples: [
          {
            title: 'Trả lời câu hỏi về bài đọc',
            steps: [
              { step: 'Bước 1', detail: 'Đọc kỹ bài từ đầu đến cuối' },
              { step: 'Bước 2', detail: 'Đọc lại câu hỏi cần trả lời' },
              { step: 'Bước 3', detail: 'Tìm trong bài câu chứa đáp án và ghi lại' },
            ],
          },
          {
            title: 'Tìm ý chính của đoạn văn',
            steps: [
              { step: 'Bước 1', detail: 'Đọc cả đoạn văn' },
              { step: 'Bước 2', detail: 'Hỏi: Đoạn văn nói về điều gì?' },
              { step: 'Bước 3', detail: 'Tóm tắt bằng 1 câu ngắn: "Đoạn văn kể về..."' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Đọc to rõ ràng mỗi ngày 15 phút', emoji: '📚' },
          { text: 'Sau khi đọc, tự hỏi: Bài này kể về ai? Làm gì?', emoji: '🤔' },
          { text: 'Gạch chân những từ quan trọng trong bài', emoji: '✏️' },
        ],
        relatedQuizGrade: 2,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-2-ngu-van-bai-2',
        chapter: 2,
        title: 'Luyện từ và câu',
        description: 'Học về danh từ, động từ, tính từ và cách đặt câu đúng ngữ pháp',
        emoji: '📝',
        difficulty: 2,
        lessonContent: 'Từ được phân thành: Danh từ (chỉ người, vật, sự việc), Động từ (chỉ hành động), Tính từ (chỉ đặc điểm). Khi đặt câu, cần có đủ chủ ngữ (danh từ) và vị ngữ (động từ/tính từ).',
        exercises: [{"question":"\"Chạy\" là DT hay ĐT?","answer":"Động từ"},{"question":"Tìm tính từ: \"Bông hoa đỏ rất đẹp.\"","answer":"đỏ, đẹp"},{"question":"Đặt câu có DT và ĐT:","answer":"Ví dụ: Con chim bay."}],
        keyConcepts: [
          { text: 'Danh từ: từ chỉ người, vật, sự việc (bàn, ghế, mẹ, bạn)', emoji: '📌' },
          { text: 'Động từ: từ chỉ hành động (chạy, nhảy, đọc, viết)', emoji: '🏃' },
          { text: 'Tính từ: từ chỉ đặc điểm (đỏ, to, đẹp, nhanh)', emoji: '🎨' },
          { text: 'Đặt câu có đủ chủ ngữ và vị ngữ', emoji: '✍️' },
        ],
        examples: [
          {
            title: 'Phân loại từ trong câu',
            steps: [
              { step: 'Bước 1', detail: 'Câu: "Bạn Lan đọc sách mới."' },
              { step: 'Bước 2', detail: 'Bạn Lan = danh từ (chỉ người)' },
              { step: 'Bước 3', detail: 'đọc = động từ (chỉ hành động), mới = tính từ (chỉ đặc điểm)' },
            ],
          },
          {
            title: 'Đặt câu với từ cho trước',
            steps: [
              { step: 'Bước 1', detail: 'Từ cho sẵn: "con mèo" (danh từ)' },
              { step: 'Bước 2', detail: 'Thêm động từ: "con mèo ngủ"' },
              { step: 'Bước 3', detail: 'Thêm tính từ: "Con mèo đen đang ngủ."' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Chơi trò: nêu 1 từ, bạn nói đó là danh từ hay động từ', emoji: '🎮' },
          { text: 'Viết 5 câu có cả danh từ, động từ và tính từ', emoji: '📓' },
          { text: 'Tìm danh từ, động từ trong bài đọc hàng ngày', emoji: '🔍' },
        ],
        relatedQuizGrade: 2,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-2-ngu-van-bai-3',
        chapter: 3,
        title: 'Viết câu và đoạn văn',
        description: 'Học cách viết câu ghép và ghép các câu thành đoạn văn ngắn',
        emoji: '✍️',
        difficulty: 3,
        lessonContent: 'Đoạn văn ngắn gồm 3-5 câu cùng nói về một chủ đề. Câu đầu là câu mở đoạn, câu cuối là câu kết đoạn. Dùng từ nối: và, nhưng, vì, nên để liên kết các câu.',
        exercises: [{"question":"Câu mở đoạn làm gì?","answer":"Giới thiệu chủ đề"},{"question":"Nối bằng \"và\": \"Em đi học.\" + \"Em ăn trưa.\"","answer":"Em đi học và ăn trưa."}],
        keyConcepts: [
          { text: 'Viết câu ghép bằng từ nối: và, nhưng, vì, nên', emoji: '🔗' },
          { text: 'Sắp xếp các câu thành đoạn văn có ý nghĩa', emoji: '📋' },
          { text: 'Viết đoạn văn theo chủ đề: 3-5 câu', emoji: '📝' },
          { text: 'Kiểm tra chính tả và dấu câu khi viết xong', emoji: '✅' },
        ],
        examples: [
          {
            title: 'Viết đoạn văn về con vật yêu thích',
            steps: [
              { step: 'Bước 1', detail: 'Mở đoạn: "Nhà em có một con mèo."' },
              { step: 'Bước 2', detail: 'Phát triển: "Con mèo có lông màu vàng và đôi mắt to. Nó rất thích ăn cá và ngủ ở ghế sofa."' },
              { step: 'Bước 3', detail: 'Kết đoạn: "Em rất yêu con mèo của mình."' },
            ],
          },
          {
            title: 'Nối câu bằng từ "và"',
            steps: [
              { step: 'Bước 1', detail: 'Câu 1: "Lan hát." Câu 2: "Lan múa."' },
              { step: 'Bước 2', detail: 'Nối: "Lan hát và múa."' },
              { step: 'Bước 3', detail: 'Kiểm tra: câu có ý nghĩa và đúng ngữ pháp' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Viết 1 đoạn văn mỗi ngày về chủ đề quen thuộc', emoji: '📅' },
          { text: 'Đọc lại đoạn văn đã viết và sửa lỗi', emoji: '🔄' },
          { text: 'Sử dụng từ nối để câu văn hay hơn', emoji: '✨' },
        ],
        relatedQuizGrade: 2,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 3,
      },
    ],
  },
  3: {
    toan: [
      {
        id: 'lop-3-toan-bai-1',
        chapter: 1,
        title: 'Số đến 1000',
        description: 'Đếm, đọc, viết và so sánh các số đến 1000, hiểu hàng trăm, chục, đơn vị',
        emoji: '🔢',
        difficulty: 2,
        lessonContent: 'Số có 3 chữ số gồm hàng trăm, hàng chục và hàng đơn vị. Ví dụ: 527 = 500 + 20 + 7. Khi so sánh, ta so sánh từ hàng trăm xuống.',
        exercises: [{"question":"Phân tích 456:","answer":"400 + 50 + 6"},{"question":"389 ___ 401?","answer":"389 < 401"},{"question":"Viết \"năm trăm hai mươi bảy\":","answer":"527"}],
        keyConcepts: [
          { text: 'Đếm từ 100 đến 1000 theo từng trăm', emoji: '💯' },
          { text: 'Phân tích số: trăm - chục - đơn vị (456 = 4 trăm + 5 chục + 6 đơn vị)', emoji: '🧮' },
          { text: 'Đọc và viết số có ba chữ số', emoji: '📝' },
          { text: 'So sánh các số có ba chữ số', emoji: '⚖️' },
        ],
        examples: [
          {
            title: 'Phân tích số 527',
            steps: [
              { step: 'Bước 1', detail: 'Chữ số hàng trăm: 5 → 5 trăm = 500' },
              { step: 'Bước 2', detail: 'Chữ số hàng chục: 2 → 2 chục = 20' },
              { step: 'Bước 3', detail: 'Chữ số hàng đơn vị: 7. Vậy 527 = 500 + 20 + 7' },
            ],
          },
          {
            title: 'So sánh 387 và 412',
            steps: [
              { step: 'Bước 1', detail: 'So sánh hàng trăm: 3 < 4' },
              { step: 'Bước 2', detail: 'Không cần so sánh hàng chục và đơn vị' },
              { step: 'Bước 3', detail: 'Vậy 387 < 412' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Đọc số tiền trên các hóa đơn, giá cả ở cửa hàng', emoji: '🛒' },
          { text: 'Đếm số trang trong sách và phân tích số', emoji: '📚' },
          { text: 'Chơi trò: ai đọc được số to nhất trong 10 giây', emoji: '⏱️' },
        ],
        relatedQuizGrade: 3,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-3-toan-bai-2',
        chapter: 2,
        title: 'Phép cộng và trừ trong phạm vi 1000',
        description: 'Cộng và trừ các số có ba chữ số, đặt tính dọc và tính nhẩm',
        emoji: '🧮',
        difficulty: 3,
        lessonContent: 'Cộng trừ số có 3 chữ số tương tự số có 2 chữ số nhưng thêm hàng trăm. Đặt tính dọc thẳng hàng. Cộng/trừ từ hàng đơn vị lên.',
        exercises: [{"question":"356 + 478 = ?","answer":"834"},{"question":"700 − 245 = ?","answer":"455"},{"question":"400 + 300 = ?","answer":"700"}],
        keyConcepts: [
          { text: 'Cộng/trừ số có ba chữ số (không nhớ và có nhớ)', emoji: '📐' },
          { text: 'Đặt tính dọc: đơn vị dưới đơn vị, chục dưới chục, trăm dưới trăm', emoji: '📏' },
          { text: 'Cộng/trừ từ hàng đơn vị lên hàng trăm', emoji: '🔢' },
          { text: 'Tính nhẩm phép cộng/trừ tròn trăm', emoji: '⚡' },
        ],
        examples: [
          {
            title: 'Tính 456 + 278',
            steps: [
              { step: 'Bước 1', detail: 'Đơn vị: 6 + 8 = 14. Viết 4 nhớ 1' },
              { step: 'Bước 2', detail: 'Chục: 5 + 7 = 12, thêm 1 nhớ = 13. Viết 3 nhớ 1' },
              { step: 'Bước 3', detail: 'Trăm: 4 + 2 = 6, thêm 1 nhớ = 7. Vậy 456 + 278 = 734' },
            ],
          },
          {
            title: 'Tính 800 − 367',
            steps: [
              { step: 'Bước 1', detail: 'Đơn vị: 0 − 7 không đủ. Mượn = 10 − 7 = 3' },
              { step: 'Bước 2', detail: 'Chục: 9 (sau mượn) − 6 = 3' },
              { step: 'Bước 3', detail: 'Trăm: 7 (sau mượn) − 3 = 4. Vậy 800 − 367 = 433' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Luôn đặt tính dọc cẩn thận, thẳng hàng', emoji: '📐' },
          { text: 'Ghi nhớ vào góc bài để không quên', emoji: '✏️' },
          { text: 'Tính nhẩm trước, rồi đặt tính kiểm tra', emoji: '🧠' },
        ],
        relatedQuizGrade: 3,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-3-toan-bai-3',
        chapter: 3,
        title: 'Bảng cửu chương',
        description: 'Học thuộc bảng cửu chương từ 2 đến 9, vận dụng vào giải toán',
        emoji: '✖️',
        difficulty: 3,
        lessonContent: 'Phép nhân là cộng nhiều lần một số giống nhau. Bảng cửu chương từ 2 đến 9 cần học thuộc. Tính chất giao hoán: a x b = b x a.',
        exercises: [{"question":"7 × 8 = ?","answer":"56"},{"question":"6 quả cam/rổ, 5 rổ. Mấy quả?","answer":"30 quả"},{"question":"9 × 4 = ?","answer":"36"}],
        keyConcepts: [
          { text: 'Hiểu phép nhân là cộng nhiều lần số giống nhau', emoji: '🔄' },
          { text: 'Học thuộc bảng cửu chương 2, 3, 4, 5', emoji: '📚' },
          { text: 'Học thuộc bảng cửu chương 6, 7, 8, 9', emoji: '📖' },
          { text: 'Vận dụng bảng cửu chương giải bài toán thực tế', emoji: '🏆' },
        ],
        examples: [
          {
            title: 'Tính 6 × 7',
            steps: [
              { step: 'Bước 1', detail: 'Nhớ bảng cửu chương 7: 7 × 6' },
              { step: 'Bước 2', detail: '7 × 6 = 42' },
              { step: 'Bước 3', detail: 'Vậy 6 × 7 = 42 (tính chất giao hoán)' },
            ],
          },
          {
            title: 'Giải toán: Mỗi bó có 5 cái kẹo, có 8 bó. Hỏi có bao nhiêu cái kẹo?',
            steps: [
              { step: 'Bước 1', detail: 'Bài toán yêu cầu tìm 8 lần 5' },
              { step: 'Bước 2', detail: 'Tính: 8 × 5 = 40' },
              { step: 'Bước 3', detail: 'Đáp số: 40 cái kẹo' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Hát bảng cửu chương theo điệu nhạc để nhớ lâu', emoji: '🎵' },
          { text: 'Viết bảng cửu chương ra giấy và đọc mỗi sáng', emoji: '🌅' },
          { text: 'Chơi trò: ai nói được kết quả nhanh nhất', emoji: '⚡' },
        ],
        relatedQuizGrade: 3,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 3,
      },
    ],
    'ngu-van': [
      {
        id: 'lop-3-ngu-van-bai-1',
        chapter: 1,
        title: 'Đọc hiểu văn bản',
        description: 'Đọc hiểu văn bản dài hơn, tìm ý chính và chi tiết trong bài',
        emoji: '📖',
        difficulty: 3,
        lessonContent: 'Đọc hiểu văn bản dài hơn yêu cầu tìm ý chính và ý phụ. Ý chính là nội dung quan trọng nhất. Gạch chân từ ngữ quan trọng khi đọc.',
        exercises: [{"question":"Ý chính là gì?","answer":"Nội dung quan trọng nhất"},{"question":"Tìm ý chính như thế nào?","answer":"Đọc bài, hỏi: kể về ai? Chuyện gì?"},{"question":"Nêu cảm nghĩ nhân vật:","answer":"(Cá nhân)"}],
        keyConcepts: [
          { text: 'Đọc hiểu văn bản: tìm ý chính và ý phụ', emoji: '🎯' },
          { text: 'Nhận biết thứ tự sự việc trong bài', emoji: '📋' },
          { text: 'Tìm từ ngữ miêu tả nhân vật và sự việc', emoji: '🔍' },
          { text: 'Nêu cảm nghĩ về nhân vật hoặc sự việc trong bài', emoji: '💭' },
        ],
        examples: [
          {
            title: 'Tìm ý chính của bài',
            steps: [
              { step: 'Bước 1', detail: 'Đọc toàn bài văn' },
              { step: 'Bước 2', detail: 'Hỏi: Bài văn kể về ai? Chuyện gì xảy ra?' },
              { step: 'Bước 3', detail: 'Tóm tắt: "Bài văn kể về... nhân vật đã..."' },
            ],
          },
          {
            title: 'Tìm chi tiết miêu tả',
            steps: [
              { step: 'Bước 1', detail: 'Đọc đoạn miêu tả nhân vật' },
              { step: 'Bước 2', detail: 'Gạch chân từ ngữ miêu tả: "mắt đen", "tóc dài"' },
              { step: 'Bước 3', detail: 'Giải thích: từ ngữ giúp hình dung nhân vật rõ hơn' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Đọc bài và tự đặt 3 câu hỏi về nội dung', emoji: '❓' },
          { text: 'Gạch chân từ ngữ quan trọng khi đọc', emoji: '✏️' },
          { text: 'Kể lại câu chuyện bằng lời của mình', emoji: '🗣️' },
        ],
        relatedQuizGrade: 3,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-3-ngu-van-bai-2',
        chapter: 2,
        title: 'Từ loại và câu',
        description: 'Nâng cao kiến thức về từ loại, cấu tạo câu và dấu câu',
        emoji: '📝',
        difficulty: 3,
        lessonContent: 'Danh từ riêng chỉ tên riêng (Lan, Hà Nội) - luôn viết hoa. Danh từ chung chỉ loại (bạn, con mèo). Câu kể: Ai làm gì? Ai thế nào? Cái gì thế nào?',
        exercises: [{"question":"\"Hà Nội\" DT riêng hay chung?","answer":"Danh từ riêng"},{"question":"\"Bông hoa rất đẹp.\" mẫu nào?","answer":"Cái gì thế nào?"},{"question":"Viết 1 DT riêng, 1 DT chung:","answer":"Ví dụ: Nam, bạn bè"}],
        keyConcepts: [
          { text: 'Danh từ riêng và danh từ chung', emoji: '📌' },
          { text: 'Động từ chỉ hoạt động và trạng thái', emoji: '🏃' },
          { text: 'Câu kể: Ai làm gì? Ai thế nào? Cái gì thế nào?', emoji: '✍️' },
          { text: 'Dùng dấu phẩy và dấu chấm than đúng cách', emoji: '❗' },
        ],
        examples: [
          {
            title: 'Phân biệt danh từ riêng và chung',
            steps: [
              { step: 'Bước 1', detail: 'Danh từ chung: bạn, con mèo, trường học' },
              { step: 'Bước 2', detail: 'Danh từ riêng: Lan, Hà Nội, Việt Nam' },
              { step: 'Bước 3', detail: 'Nhớ: Danh từ riêng luôn viết hoa chữ cái đầu' },
            ],
          },
          {
            title: 'Nhận biết loại câu',
            steps: [
              { step: 'Bước 1', detail: '"Bạn Nam đang đọc sách." → Ai làm gì?' },
              { step: 'Bước 2', detail: '"Bông hoa rất đẹp." → Cái gì thế nào?' },
              { step: 'Bước 3', detail: 'Mỗi loại câu có cấu trúc chủ ngữ - vị ngữ khác nhau' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Viết 5 danh từ riêng và 5 danh từ chung', emoji: '📓' },
          { text: 'Đặt câu theo mẫu Ai làm gì? Ai thế nào?', emoji: '✍️' },
          { text: 'Luôn viết hoa danh từ riêng trong bài', emoji: '💡' },
        ],
        relatedQuizGrade: 3,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-3-ngu-van-bai-3',
        chapter: 3,
        title: 'Viết đoạn văn',
        description: 'Học cách viết đoạn văn chặt chẽ, có mở - thân - kết',
        emoji: '✍️',
        difficulty: 3,
        lessonContent: 'Đoạn văn có cấu trúc: mở đoạn - phát triển - kết đoạn. Dùng từ nối: đầu tiên, sau đó, cuối cùng để đoạn văn mạch lạc.',
        exercises: [{"question":"Cấu trúc đoạn văn:","answer":"Mở - Phát triển - Kết"},{"question":"Đặt 2 từ nối:","answer":"Ví dụ: đầu tiên, sau đó"}],
        keyConcepts: [
          { text: 'Cấu trúc đoạn văn: câu mở đoạn - các câu phát triển - câu kết đoạn', emoji: '🏗️' },
          { text: 'Viết đoạn văn kể chuyện (5-7 câu)', emoji: '📖' },
          { text: 'Sử dụng từ nối: đầu tiên, sau đó, cuối cùng', emoji: '🔗' },
          { text: 'Kiểm tra chính tả và dấu câu khi viết xong', emoji: '✅' },
        ],
        examples: [
          {
            title: 'Viết đoạn văn kể chuyện',
            steps: [
              { step: 'Bước 1', detail: 'Mở đoạn: "Sáng chủ nhật, em đi công viên cùng gia đình."' },
              { step: 'Bước 2', detail: 'Phát triển: "Đầu tiên, em chơi đu quay rất vui. Sau đó, cả nhà ăn kem. Cuối cùng, em cho cá ăn."' },
              { step: 'Bước 3', detail: 'Kết đoạn: "Đó là một ngày chủ nhật thật đáng nhớ."' },
            ],
          },
          {
            title: 'Sử dụng từ nối',
            steps: [
              { step: 'Bước 1', detail: 'Thay vì: "Em đi học. Em ăn trưa. Em đi chơi."' },
              { step: 'Bước 2', detail: 'Nối: "Đầu tiên em đi học, sau đó em ăn trưa, cuối cùng em đi chơi."' },
              { step: 'Bước 3', detail: 'Đoạn văn mạch lạc và dễ đọc hơn nhiều!' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Viết đoạn văn theo dàn ý trước khi viết', emoji: '📋' },
          { text: 'Sử dụng ít nhất 2 từ nối trong mỗi đoạn', emoji: '🔗' },
          { text: 'Đọc to đoạn văn để kiểm tra sự mạch lạc', emoji: '🗣️' },
        ],
        relatedQuizGrade: 3,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 3,
      },
    ],
  },
  4: {
    toan: [
      {
        id: 'lop-4-toan-bai-1',
        chapter: 1,
        title: 'Số đến 100 000',
        description: 'Đọc, viết, so sánh các số đến 100 000, hiểu hàng chục nghìn',
        emoji: '🔢',
        difficulty: 3,
        lessonContent: 'Số có 5 chữ số gồm: chục nghìn, nghìn, trăm, chục, đơn vị. Khi so sánh, so sánh từ hàng cao nhất xuống.',
        exercises: [{"question":"Phân tích 52 347:","answer":"50 000 + 2 000 + 300 + 40 + 7"},{"question":"48 923 ___ 52 100?","answer":"48 923 < 52 100"},{"question":"Đọc số: 37 845","answer":"Ba mươi bảy nghìn tám trăm bốn mươi lăm"}],
        keyConcepts: [
          { text: 'Đếm từ 1000 đến 100 000 theo nghìn', emoji: '💯' },
          { text: 'Phân tích số: chục nghìn - nghìn - trăm - chục - đơn vị', emoji: '🧮' },
          { text: 'Đọc và viết số có năm chữ số', emoji: '📝' },
          { text: 'So sánh và sắp xếp các số đến 100 000', emoji: '⚖️' },
        ],
        examples: [
          {
            title: 'Phân tích số 37 845',
            steps: [
              { step: 'Bước 1', detail: '3 chục nghìn = 30 000' },
              { step: 'Bước 2', detail: '7 nghìn = 7 000, 8 trăm = 800, 4 chục = 40, 5 đơn vị = 5' },
              { step: 'Bước 3', detail: 'Vậy 37 845 = 30 000 + 7 000 + 800 + 40 + 5' },
            ],
          },
          {
            title: 'So sánh 52 347 và 52 410',
            steps: [
              { step: 'Bước 1', detail: 'Hàng chục nghìn bằng nhau: 5 = 5' },
              { step: 'Bước 2', detail: 'Hàng nghìn bằng nhau: 2 = 2' },
              { step: 'Bước 3', detail: 'Hàng trăm: 3 < 4. Vậy 52 347 < 52 410' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Đọc số dân số các tỉnh thành trên bản đồ', emoji: '🗺️' },
          { text: 'Viết số bằng chữ và bằng số xen kẽ để luyện', emoji: '✏️' },
          { text: 'Chơi trò sắp xếp số từ bé đến lớn', emoji: '🔢' },
        ],
        relatedQuizGrade: 4,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-4-toan-bai-2',
        chapter: 2,
        title: 'Cộng và trừ các số lớn',
        description: 'Thực hiện phép cộng và trừ các số đến hàng chục nghìn',
        emoji: '🧮',
        difficulty: 3,
        lessonContent: 'Cộng trừ số lớn cần cẩn thận với phép nhớ nhiều lần. Đặt tính dọc, thẳng hàng các chữ số.',
        exercises: [{"question":"24 567 + 18 394 = ?","answer":"42 961"},{"question":"50 000 − 17 835 = ?","answer":"32 165"},{"question":"2345 − 678 = ?","answer":"1 667"}],
        keyConcepts: [
          { text: 'Cộng/trừ số có 4-5 chữ số, có nhớ nhiều lần', emoji: '📐' },
          { text: 'Đặt tính dọc đúng cách với số lớn', emoji: '📏' },
          { text: 'Kiểm tra kết quả bằng cách tính ngược', emoji: '🔄' },
          { text: 'Giải toán có lời văn với phép cộng/trừ', emoji: '📝' },
        ],
        examples: [
          {
            title: 'Tính 24 567 + 18 394',
            steps: [
              { step: 'Bước 1', detail: 'Đơn vị: 7 + 4 = 11. Viết 1 nhớ 1' },
              { step: 'Bước 2', detail: 'Chục: 6 + 9 = 15, + 1 = 16. Viết 6 nhớ 1' },
              { step: 'Bước 3', detail: 'Tiếp tục: Trăm 5+3+1=9, Nghìn 4+8=12 (viết 2 nhớ 1), Chục nghìn 2+1+1=4. KQ: 42 961' },
            ],
          },
          {
            title: 'Giải toán: Lớp A có 1 245 học sinh, lớp B có ít hơn 378 học sinh. Hỏi lớp B có bao nhiêu học sinh?',
            steps: [
              { step: 'Bước 1', detail: 'Phân tích: Lớp B ít hơn → phép trừ' },
              { step: 'Bước 2', detail: 'Tính: 1 245 − 378 = 867' },
              { step: 'Bước 3', detail: 'Đáp số: Lớp B có 867 học sinh' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Cẩn thận với phép nhớ nhiều lần, ghi nhớ từng hàng', emoji: '✏️' },
          { text: 'Luôn kiểm tra kết quả bằng cách tính ngược', emoji: '🔄' },
          { text: 'Viết số thẳng hàng để không nhầm lẫn', emoji: '📐' },
        ],
        relatedQuizGrade: 4,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-4-toan-bai-3',
        chapter: 3,
        title: 'Nhân và chia số lớn',
        description: 'Nhân số có nhiều chữ số với số có 1 chữ số, chia số có nhiều chữ số cho số có 1 chữ số',
        emoji: '✖️',
        difficulty: 4,
        lessonContent: 'Nhân số nhiều chữ số: nhân từ phải sang trái. Chia: chia từ trái sang phải, hạ từng chữ số. Kiểm tra kết quả bằng cách tính ngược.',
        exercises: [{"question":"345 × 7 = ?","answer":"2 415"},{"question":"963 ÷ 3 = ?","answer":"321"},{"question":"235 × 6 = ?","answer":"1 410"}],
        keyConcepts: [
          { text: 'Nhân số có 2-3 chữ số với số có 1 chữ số', emoji: '✖️' },
          { text: 'Chia số có 2-3 chữ số cho số có 1 chữ số', emoji: '➗' },
          { text: 'Nhân số có nhiều chữ số với số có 2 chữ số', emoji: '🧮' },
          { text: 'Giải toán có lời văn với phép nhân/chia', emoji: '📝' },
        ],
        examples: [
          {
            title: 'Tính 234 × 6',
            steps: [
              { step: 'Bước 1', detail: '6 × 4 = 24. Viết 4 nhớ 2' },
              { step: 'Bước 2', detail: '6 × 3 = 18, + 2 = 20. Viết 0 nhớ 2' },
              { step: 'Bước 3', detail: '6 × 2 = 12, + 2 = 14. KQ: 1 404' },
            ],
          },
          {
            title: 'Tính 846 ÷ 3',
            steps: [
              { step: 'Bước 1', detail: '8 ÷ 3 = 2 dư 2. Viết 2' },
              { step: 'Bước 2', detail: 'Hạ 4: 24 ÷ 3 = 8. Viết 8' },
              { step: 'Bước 3', detail: 'Hạ 6: 6 ÷ 3 = 2. KQ: 282' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Nhân từ phải sang trái, nhớ cẩn thận', emoji: '👉' },
          { text: 'Chia từ trái sang phải, nhớ hạ từng chữ số', emoji: '👈' },
          { text: 'Kiểm tra: tích ÷ thừa số = thừa số kia', emoji: '✅' },
        ],
        relatedQuizGrade: 4,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 3,
      },
    ],
    'ngu-van': [
      {
        id: 'lop-4-ngu-van-bai-1',
        chapter: 1,
        title: 'Đọc hiểu chi tiết',
        description: 'Đọc hiểu văn bản sâu hơn, phân tích nhân vật và ý nghĩa bài văn',
        emoji: '📖',
        difficulty: 3,
        lessonContent: 'Đọc hiểu chi tiết yêu cầu phân tích nhân vật: ngoại hình, tính cách, hành động. Phân biệt kể chuyện và miêu tả. Tìm ý nghĩa bài văn.',
        exercises: [{"question":"Phân tích nhân vật cần tìm gì?","answer":"Ngoại hình, tính cách, hành động"},{"question":"Kể chuyện khác miêu tả thế nào?","answer":"Kể chuyện: nhân vật, sự việc. Miêu tả: cảnh vật"},{"question":"Nêu ý nghĩa bài:","answer":"(Cá nhân)"}],
        keyConcepts: [
          { text: 'Phân tích nhân vật: ngoại hình, tính cách, hành động', emoji: '🎭' },
          { text: 'Tìm ý nghĩa bài văn: bài học rút ra', emoji: '💡' },
          { text: 'Nhận biết văn bản kể chuyện, miêu tả', emoji: '📚' },
          { text: 'Nêu cảm nghĩ và lý do', emoji: '💭' },
        ],
        examples: [
          {
            title: 'Phân tích nhân vật',
            steps: [
              { step: 'Bước 1', detail: 'Tìm các chi tiết miêu tả ngoại hình nhân vật' },
              { step: 'Bước 2', detail: 'Tìm các hành động cho thấy tính cách' },
              { step: 'Bước 3', detail: 'Tóm tắt: "Nhân vật là người... vì đã..."' },
            ],
          },
          {
            title: 'Tìm ý nghĩa bài văn',
            steps: [
              { step: 'Bước 1', detail: 'Hỏi: Bài văn muốn nhắn nhủ điều gì?' },
              { step: 'Bước 2', detail: 'Tìm câu nói hoặc chi tiết thể hiện ý nghĩa' },
              { step: 'Bước 3', detail: 'Nêu: "Bài văn khuyên chúng ta..."' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Gạch chân chi tiết quan trọng khi đọc bài', emoji: '✏️' },
          { text: 'Tự hỏi sau mỗi bài: "Bài học em rút ra là gì?"', emoji: '🤔' },
          { text: 'Viết đoạn nêu cảm nghĩ về nhân vật yêu thích', emoji: '📝' },
        ],
        relatedQuizGrade: 4,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-4-ngu-van-bai-2',
        chapter: 2,
        title: 'Từ loại và câu nâng cao',
        description: 'Nâng cao kiến thức về từ loại, câu mở rộng và dấu câu',
        emoji: '📝',
        difficulty: 3,
        lessonContent: 'Từ đồng nghĩa (xinh - đẹp), từ trái nghĩa (xấu - đẹp). Câu ghép có hơn một chủ ngữ - vị ngữ, nối bằng từ: và, nhưng, vì, nên.',
        exercises: [{"question":"Từ đồng nghĩa \"đẹp\":","answer":"Xinh, mỹ lệ"},{"question":"Đặt câu ghép \"vì... nên\":","answer":"Ví dụ: Vì trời mưa nên em ở nhà."}],
        keyConcepts: [
          { text: 'Danh từ chỉ đơn vị: cái, con, quả, bức...', emoji: '📌' },
          { text: 'Động từ chỉ hoạt động và trạng thái nâng cao', emoji: '🏃' },
          { text: 'Câu kể: Ai là gì? Ai thế nào? Cái gì thế nào?', emoji: '✍️' },
          { text: 'Mở rộng câu bằng cách thêm trạng ngữ', emoji: '🔗' },
        ],
        examples: [
          {
            title: 'Thêm trạng ngữ vào câu',
            steps: [
              { step: 'Bước 1', detail: 'Câu gốc: "Bạn Lan đọc sách."' },
              { step: 'Bước 2', detail: 'Thêm trạng ngữ nơi chốn: "Ở thư viện, bạn Lan đọc sách."' },
              { step: 'Bước 3', detail: 'Thêm trạng ngữ thời gian: "Sáng nay, ở thư viện, bạn Lan đọc sách."' },
            ],
          },
          {
            title: 'Nhận biết danh từ chỉ đơn vị',
            steps: [
              { step: 'Bước 1', detail: '"cái bàn" - cái là danh từ chỉ đơn vị' },
              { step: 'Bước 2', detail: '"con mèo" - con là danh từ chỉ đơn vị' },
              { step: 'Bước 3', detail: '"bức tranh" - bức là danh từ chỉ đơn vị' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Tìm danh từ chỉ đơn vị trong bài đọc', emoji: '🔍' },
          { text: 'Mở rộng câu bằng cách thêm khi, ở, với ai', emoji: '🔗' },
          { text: 'Viết 5 câu có trạng ngữ', emoji: '📓' },
        ],
        relatedQuizGrade: 4,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-4-ngu-van-bai-3',
        chapter: 3,
        title: 'Viết văn miêu tả',
        description: 'Học cách viết bài văn miêu tả đồ vật, cây cối, con vật',
        emoji: '🎨',
        difficulty: 4,
        lessonContent: 'Viết văn miêu tả: giới thiệu, miêu tả từng phần, nêu cảm nghĩ. Dùng từ ngữ sinh động, so sánh và nhân hóa.',
        exercises: [{"question":"Miêu tả cần viết gì?","answer":"Hình dáng, màu sắc, đặc điểm, cảm nhận"},{"question":"Ví dụ nhân hóa:","answer":"Cây me vẫy tay chào gió"}],
        keyConcepts: [
          { text: 'Dàn ý bài miêu tả: mở bài - thân bài - kết bài', emoji: '📋' },
          { text: 'Miêu tả từ tổng thể đến chi tiết', emoji: '🔍' },
          { text: 'Sử dụng từ ngữ gợi tả, gợi cảm', emoji: '✨' },
          { text: 'Sử dụng biện pháp so sánh, nhân hóa', emoji: '🎭' },
        ],
        examples: [
          {
            title: 'Viết bài miêu tả cái bàn học',
            steps: [
              { step: 'Bước 1', detail: 'Mở bài: "Chiếc bàn học quen thuộc gắn bó với em mỗi ngày."' },
              { step: 'Bước 2', detail: 'Thân bài: Miêu tả hình dáng (hình chữ nhật, màu nâu), kích thước, các ngăn kéo, mặt bàn phẳng' },
              { step: 'Bước 3', detail: 'Kết bài: "Chiếc bàn là người bạn đồng hành giúp em học tốt."' },
            ],
          },
          {
            title: 'Sử dụng biện pháp so sánh',
            steps: [
              { step: 'Bước 1', detail: 'Câu thường: "Mặt hồ rất phẳng."' },
              { step: 'Bước 2', detail: 'So sánh: "Mặt hồ phẳng như tấm gương lớn."' },
              { step: 'Bước 3', detail: 'Câu văn sinh động và gợi hình hơn!' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Quan sát kỹ đồ vật trước khi viết', emoji: '👀' },
          { text: 'Sử dụng ít nhất 1 phép so sánh trong bài', emoji: '⚖️' },
          { text: 'Miêu tả từ ngoài vào trong, từ trên xuống dưới', emoji: '📐' },
        ],
        relatedQuizGrade: 4,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 3,
      },
    ],
  },
  5: {
    toan: [
      {
        id: 'lop-5-toan-bai-1',
        chapter: 1,
        title: 'Phân số và số thập phân',
        description: 'Hiểu phân số, chuyển đổi phân số và số thập phân',
        emoji: '🔢',
        difficulty: 4,
        lessonContent: 'Phân số biểu thị phần của một cái gì đó. Phân số thập phân có mẫu số 10, 100, 1000. Ví dụ: 3/10 = 0,3. So sánh số thập phân: phần nguyên trước, rồi từng chữ số thập phân.',
        exercises: [{"question":"7/10 = ? (số thập phân)","answer":"0,7"},{"question":"0,6 ___ 0,58?","answer":"0,6 > 0,58"},{"question":"2 3/10 = ? (số thập phân)","answer":"2,3"}],
        keyConcepts: [
          { text: 'Hiểu phân số: tử số / mẫu số, ý nghĩa từng phần', emoji: '🍕' },
          { text: 'Phân số thập phân: mẫu số là 10, 100, 1000...', emoji: '💯' },
          { text: 'Chuyển phân số thập phân thành số thập phân', emoji: '🔄' },
          { text: 'Đọc, viết, so sánh số thập phân', emoji: '📝' },
        ],
        examples: [
          {
            title: 'Chuyển 3/10 thành số thập phân',
            steps: [
              { step: 'Bước 1', detail: 'Phân số 3/10 có mẫu số 10 → phân số thập phân' },
              { step: 'Bước 2', detail: 'Viết dưới dạng số thập phân: 0,3' },
              { step: 'Bước 3', detail: 'Đọc: không phẩy ba (hoặc ba phần mười)' },
            ],
          },
          {
            title: 'So sánh 0,45 và 0,5',
            steps: [
              { step: 'Bước 1', detail: 'Phần nguyên bằng nhau: 0 = 0' },
              { step: 'Bước 2', detail: 'Phần thập phân: 45 và 5. Thêm số 0: 45 và 50' },
              { step: 'Bước 3', detail: '45 < 50. Vậy 0,45 < 0,5' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Chia bánh pizza thành các phần bằng nhau để hiểu phân số', emoji: '🍕' },
          { text: 'Đọc giá tiền: 12,5 nghìn = 12 500 đồng', emoji: '💰' },
          { text: 'So sánh bằng cách thêm số 0 cho cùng số chữ số thập phân', emoji: '⚖️' },
        ],
        relatedQuizGrade: 5,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-5-toan-bai-2',
        chapter: 2,
        title: 'Phép tính với phân số',
        description: 'Cộng, trừ, nhân, chia phân số và giải toán liên quan',
        emoji: '🧮',
        difficulty: 4,
        lessonContent: 'Cộng trừ phân số cùng mẫu: giữ mẫu, cộng/trừ tử. Khác mẫu: quy đồng. Nhân: tử x tử, mẫu x mẫu. Chia: nhân nghịch đảo.',
        exercises: [{"question":"2/5 + 1/5 = ?","answer":"3/5"},{"question":"1/3 × 2/5 = ?","answer":"2/15"},{"question":"3/4 ÷ 2/3 = ?","answer":"9/8"}],
        keyConcepts: [
          { text: 'Cộng/trừ phân số cùng mẫu số: giữ mẫu, cộng/trừ tử', emoji: '➕' },
          { text: 'Quy đồng mẫu số để cộng/trừ phân số khác mẫu', emoji: '🔄' },
          { text: 'Nhân phân số: tử × tử, mẫu × mẫu', emoji: '✖️' },
          { text: 'Chia phân số: nhân nghịch đảo', emoji: '➗' },
        ],
        examples: [
          {
            title: 'Tính 2/5 + 1/5',
            steps: [
              { step: 'Bước 1', detail: 'Cùng mẫu số 5 → giữ nguyên mẫu' },
              { step: 'Bước 2', detail: 'Cộng tử: 2 + 1 = 3' },
              { step: 'Bước 3', detail: 'Vậy 2/5 + 1/5 = 3/5' },
            ],
          },
          {
            title: 'Tính 1/3 + 1/4',
            steps: [
              { step: 'Bước 1', detail: 'Khác mẫu số → quy đồng: MSC = 12' },
              { step: 'Bước 2', detail: '1/3 = 4/12, 1/4 = 3/12' },
              { step: 'Bước 3', detail: '4/12 + 3/12 = 7/12' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Nhớ: cộng/trừ cùng mẫu thì chỉ tính tử, giữ mẫu', emoji: '📌' },
          { text: 'Quy đồng mẫu số: tìm BCNN của hai mẫu', emoji: '🔄' },
          { text: 'Rút gọn phân số kết quả nếu cần', emoji: '✂️' },
        ],
        relatedQuizGrade: 5,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-5-toan-bai-3',
        chapter: 3,
        title: 'Đại lượng và đo lường',
        description: 'Học các đơn vị đo: độ dài, khối lượng, thời gian, diện tích và chuyển đổi',
        emoji: '📏',
        difficulty: 3,
        lessonContent: 'Đại lượng đo được: độ dài, khối lượng, thời gian, diện tích. Chuyển đổi: 1 km = 1000 m, 1 tấn = 1000 kg.',
        exercises: [{"question":"3 km 250 m = ... m","answer":"3 250 m"},{"question":"S HCN 12m × 8m:","answer":"96 m²"},{"question":"2 tấn 5 yến = ... kg","answer":"2 050 kg"}],
        keyConcepts: [
          { text: 'Đơn vị đo độ dài: km, m, dm, cm, mm và chuyển đổi', emoji: '📐' },
          { text: 'Đơn vị đo khối lượng: tấn, tạ, yến, kg, g và chuyển đổi', emoji: '⚖️' },
          { text: 'Đơn vị đo thời gian: thế kỷ, năm, tháng, ngày, giờ, phút, giây', emoji: '⏰' },
          { text: 'Tính chu vi và diện tích hình chữ nhật, hình vuông', emoji: '📊' },
        ],
        examples: [
          {
            title: 'Chuyển đổi 3 km 250 m = ... m',
            steps: [
              { step: 'Bước 1', detail: '3 km = 3 000 m' },
              { step: 'Bước 2', detail: '3 000 m + 250 m = 3 250 m' },
              { step: 'Bước 3', detail: 'Vậy 3 km 250 m = 3 250 m' },
            ],
          },
          {
            title: 'Tính diện tích hình chữ nhật dài 8m, rộng 5m',
            steps: [
              { step: 'Bước 1', detail: 'Công thức: S = dài × rộng' },
              { step: 'Bước 2', detail: 'S = 8 × 5 = 40' },
              { step: 'Bước 3', detail: 'Diện tích = 40 m²' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Nhớ bảng đơn vị đo: mỗi bước x10 hoặc x100', emoji: '📊' },
          { text: 'Đo các vật xung quanh nhà và ghi kết quả', emoji: '🏠' },
          { text: 'Tính diện tích phòng học hoặc sân trường', emoji: '📐' },
        ],
        relatedQuizGrade: 5,
        relatedQuizSubject: 'toan',
        relatedQuizChapter: 3,
      },
    ],
    'ngu-van': [
      {
        id: 'lop-5-ngu-van-bai-1',
        chapter: 1,
        title: 'Đọc hiểu văn bản phức tạp',
        description: 'Đọc hiểu văn bản nghị luận, văn bản thông tin, phân tích sâu',
        emoji: '📖',
        difficulty: 4,
        lessonContent: 'Văn bản nghị luận trình bày ý kiến và dùng lý lẽ thuyết phục. Luận điểm: ý kiến cần chứng minh. Luận cứ: lý lẽ, dẫn chứng.',
        exercises: [{"question":"Nghị luận là gì?","answer":"Trình bày ý kiến, dùng lý lẽ thuyết phục"},{"question":"Luận điểm khác luận cứ?","answer":"Luận điểm: cần chứng minh. Luận cứ: lý lẽ hỗ trợ"}],
        keyConcepts: [
          { text: 'Nhận biết loại văn bản: nghị luận, thông tin, nghệ thuật', emoji: '📚' },
          { text: 'Tìm luận điểm chính và luận cứ trong văn bản nghị luận', emoji: '🎯' },
          { text: 'Phân tích cách tác giả trình bày ý kiến', emoji: '🔍' },
          { text: 'Nêu quan điểm cá nhân và lý do', emoji: '💭' },
        ],
        examples: [
          {
            title: 'Tìm luận điểm chính',
            steps: [
              { step: 'Bước 1', detail: 'Đọc toàn văn bản' },
              { step: 'Bước 2', detail: 'Hỏi: Tác giả muốn thuyết phục điều gì?' },
              { step: 'Bước 3', detail: 'Luận điểm chính thường ở đầu hoặc cuối văn bản' },
            ],
          },
          {
            title: 'Phân tích luận cứ',
            steps: [
              { step: 'Bước 1', detail: 'Tìm các lý lẽ tác giả đưa ra' },
              { step: 'Bước 2', detail: 'Xét xem lý lẽ có thuyết phục không' },
              { step: 'Bước 3', detail: 'Nêu: "Tác giả dùng lý lẽ... để chứng minh..."' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Đọc báo và tìm ý chính của mỗi bài', emoji: '📰' },
          { text: 'Tóm tắt văn bản bằng 2-3 câu ngắn', emoji: '📝' },
          { text: 'Thảo luận với bạn: đồng ý hay không đồng ý?', emoji: '🗣️' },
        ],
        relatedQuizGrade: 5,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 1,
      },
      {
        id: 'lop-5-ngu-van-bai-2',
        chapter: 2,
        title: 'Nghĩa của từ và câu',
        description: 'Học về nghĩa của từ, từ đồng nghĩa, trái nghĩa, đa nghĩa và câu phức',
        emoji: '📝',
        difficulty: 3,
        lessonContent: 'Từ đồng nghĩa: nghĩa giống nhau. Từ trái nghĩa: nghĩa ngược nhau. Từ đa nghĩa: nhiều nghĩa tùy ngữ cảnh. Câu phức: hơn một chủ ngữ - vị ngữ.',
        exercises: [{"question":"Đồng nghĩa + trái nghĩa \"tốt\":","answer":"Đồng: hay, giỏi. Trái: xấu, dở"},{"question":"\"Chạy bộ\" và \"chạy việc\" cùng nghĩa?","answer":"Không, từ đa nghĩa"}],
        keyConcepts: [
          { text: 'Từ đồng nghĩa: từ có nghĩa giống hoặc gần giống nhau', emoji: '🤝' },
          { text: 'Từ trái nghĩa: từ có nghĩa ngược nhau', emoji: '⚡' },
          { text: 'Từ đa nghĩa: từ có nhiều nghĩa', emoji: '🌈' },
          { text: 'Câu phức: có hơn một chủ ngữ - vị ngữ', emoji: '🏗️' },
        ],
        examples: [
          {
            title: 'Tìm từ đồng nghĩa và trái nghĩa',
            steps: [
              { step: 'Bước 1', detail: 'Từ "đẹp" → đồng nghĩa: xinh, mỹ lệ, lộng lẫy' },
              { step: 'Bước 2', detail: 'Từ "đẹp" → trái nghĩa: xấu, thô kệch' },
              { step: 'Bước 3', detail: 'Chọn từ phù hợp ngữ cảnh để câu văn hay hơn' },
            ],
          },
          {
            title: 'Nhận biết câu phức',
            steps: [
              { step: 'Bước 1', detail: '"Nam học bài / còn Lan chơi bóng."' },
              { step: 'Bước 2', detail: 'Câu 1: Nam học bài (CN1 - VN1)' },
              { step: 'Bước 3', detail: 'Câu 2: Lan chơi bóng (CN2 - VN2). Đây là câu phức' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Mỗi ngày tìm 3 cặp từ đồng nghĩa, 3 cặp từ trái nghĩa', emoji: '📅' },
          { text: 'Thay từ trong câu bằng từ đồng nghĩa cho hay hơn', emoji: '✨' },
          { text: 'Tìm câu phức trong bài đọc hàng ngày', emoji: '🔍' },
        ],
        relatedQuizGrade: 5,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 2,
      },
      {
        id: 'lop-5-ngu-van-bai-3',
        chapter: 3,
        title: 'Viết văn nghị luận cơ bản',
        description: 'Học cách viết bài văn nghị luận nêu ý kiến và lý lẽ',
        emoji: '✍️',
        difficulty: 4,
        lessonContent: 'Bài nghị luận: Mở bài (nêu vấn đề) - Thân bài (luận điểm + luận cứ) - Kết bài (khẳng định quan điểm). Dùng từ nối: ngoài ra, tuy nhiên, tóm lại.',
        exercises: [{"question":"Cấu trúc bài nghị luận:","answer":"Mở - Thân (luận điểm+luận cứ) - Kết"},{"question":"Dùng \"tuy nhiên\" viết câu:","answer":"Ví dụ: Đọc sách có ích, tuy nhiên cần chọn sách phù hợp."}],
        keyConcepts: [
          { text: 'Dàn ý bài nghị luận: mở bài - thân bài (luận điểm + luận cứ) - kết bài', emoji: '📋' },
          { text: 'Nêu luận điểm rõ ràng và đưa ra lý lẽ thuyết phục', emoji: '🎯' },
          { text: 'Dùng từ nối: ngoài ra, hơn nữa, tuy nhiên, tóm lại', emoji: '🔗' },
          { text: 'Kết bài nêu lại quan điểm và lời khuyên', emoji: '💡' },
        ],
        examples: [
          {
            title: 'Viết bài nghị luận ngắn: "Có nên đọc sách mỗi ngày?"',
            steps: [
              { step: 'Bước 1', detail: 'Mở bài: "Đọc sách mỗi ngày là thói quen rất có ích."' },
              { step: 'Bước 2', detail: 'Thân bài: Luận điểm 1 - Mở rộng kiến thức. Luận điểm 2 - Rèn luyện tư duy. Luận điểm 3 - Giúp thư giãn.' },
              { step: 'Bước 3', detail: 'Kết bài: "Vì vậy, mỗi chúng ta nên dành thời gian đọc sách mỗi ngày."' },
            ],
          },
          {
            title: 'Sử dụng từ nối',
            steps: [
              { step: 'Bước 1', detail: 'Thêm ý: "Ngoài ra, đọc sách còn giúp..."' },
              { step: 'Bước 2', detail: 'Phản biện: "Tuy nhiên, cần chọn sách phù hợp..."' },
              { step: 'Bước 3', detail: 'Tóm tắt: "Tóm lại, đọc sách mang lại nhiều lợi ích..."' },
            ],
          },
        ],
        practiceTips: [
          { text: 'Viết dàn ý trước khi viết bài đầy đủ', emoji: '📋' },
          { text: 'Mỗi luận điểm cần ít nhất 1 lý lẽ và ví dụ', emoji: '💡' },
          { text: 'Đọc lại bài và hỏi: bài viết có thuyết phục không?', emoji: '🤔' },
        ],
        relatedQuizGrade: 5,
        relatedQuizSubject: 'ngu-van',
        relatedQuizChapter: 3,
      },
    ],
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const grade = searchParams.get('grade')
  const subject = searchParams.get('subject')

  // If no parameters, return all lessons
  if (!grade && !subject) {
    return NextResponse.json({ lessons: lessonsData })
  }

  // If grade is specified
  if (grade) {
    const gradeNum = parseInt(grade)
    if (gradeNum < 1 || gradeNum > 5) {
      return NextResponse.json({ error: 'Khối không hợp lệ. Chọn từ 1 đến 5.' }, { status: 400 })
    }

    const gradeData = lessonsData[gradeNum]
    if (!gradeData) {
      return NextResponse.json({ lessons: [] })
    }

    // If subject is also specified
    if (subject) {
      if (subject !== 'toan' && subject !== 'ngu-van') {
        return NextResponse.json({ error: 'Môn học không hợp lệ. Chọn toan hoặc ngu-van.' }, { status: 400 })
      }

      const lessons = gradeData[subject] || []
      return NextResponse.json({ lessons })
    }

    // Return both subjects for this grade
    return NextResponse.json({ lessons: gradeData })
  }

  return NextResponse.json({ lessons: lessonsData })
}
