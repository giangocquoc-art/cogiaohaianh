'use client'

import { useAppStore } from '@/store/app-store'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ArrowRight, Loader2, ChevronDown, Lightbulb, CheckCircle2, BookOpen, GraduationCap, Pencil, School } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { playClickSound } from '@/lib/sounds'

interface QuizInfo {
  id: string
  grade: number
  subject: string
  chapter: string
  chapterName: string
  title: string
  description: string | null
  duration: number
  _count?: { questions: number }
}

// Study tips map based on Vietnamese curriculum
const studyTips: Record<string, { tips: string[]; keyPoints: string[] }> = {
  // Lớp 1 Toán
  '1-toan-chuong-1': {
    tips: [
      'Nhớ thứ tự các số từ 1 đến 10. Số lớn hơn đứng sau, số nhỏ hơn đứng trước.',
      'Tập đếm đồ vật xung quanh: bút, kẹo, quả,... để nhớ số dễ hơn.',
      'Dùng ngón tay để đếm - đó là cách học tự nhiên nhất!',
    ],
    keyPoints: [
      'Nhận biết các số từ 1 đến 10',
      'So sánh số lớn hơn, nhỏ hơn',
      'Viết đúng các chữ số',
      'Sắp xếp các số theo thứ tự',
    ],
  },
  '1-toan-chuong-2': {
    tips: [
      'Cộng là thêm vào. Khi cộng hai số, kết quả luôn lớn hơn hoặc bằng mỗi số.',
      'Dùng đồ vật để thực hành: lấy 3 cái kẹo, thêm 2 cái kẹo nữa, đếm tất cả.',
      'Học thuộc bảng cộng trong phạm vi 10 để làm bài nhanh hơn.',
    ],
    keyPoints: [
      'Phép cộng trong phạm vi 10',
      'Biểu tượng "+" và "="',
      'Tính chất giao hoán: a + b = b + a',
      'Giải toán có lời văn đơn giản',
    ],
  },
  '1-toan-chuong-3': {
    tips: [
      'Trừ là bớt đi. Khi trừ, kết quả luôn nhỏ hơn hoặc bằng số bị trừ.',
      'Dùng đồ vật để thực hành: có 5 cái kẹo, ăn 2 cái, còn mấy cái?',
      'Nhớ: Phép trừ là phép ngược của phép cộng. 5 - 2 = 3 vì 3 + 2 = 5.',
    ],
    keyPoints: [
      'Phép trừ trong phạm vi 10',
      'Biểu tượng "−"',
      'Mối quan hệ giữa phép cộng và phép trừ',
      'Giải toán có lời văn về phép trừ',
    ],
  },
  '1-toan-chuong-4': {
    tips: [
      'Số từ 11-19 gồm 1 chục và vài đơn vị. Số 20 gồm 2 chục.',
      'Viết số: chữ số hàng chục viết trước, chữ số hàng đơn vị viết sau.',
      'Tập đọc số: 11 = "mười một", 15 = "mười lăm", 20 = "hai mươi".',
    ],
    keyPoints: [
      'Đọc, viết các số đến 20',
      'Phân tích số: hàng chục và hàng đơn vị',
      'So sánh các số trong phạm vi 20',
      'Phép cộng, trừ không nhớ trong phạm vi 20',
    ],
  },
  // Lớp 2 Toán
  '2-toan-chuong-1': {
    tips: [
      'Ôn lại các số đến 20 trước khi học số lớn hơn.',
      'Số đến 100 gồm hàng chục và hàng đơn vị. VD: 35 = 3 chục + 5 đơn vị.',
      'Tập đếm nhảy 2, nhảy 5, nhảy 10 để nhớ số tốt hơn.',
    ],
    keyPoints: [
      'Các số đến 100',
      'Đọc, viết, so sánh số đến 100',
      'Phân tích số hàng chục, hàng đơn vị',
      'Sắp xếp số theo thứ tự tăng, giảm',
    ],
  },
  '2-toan-chuong-2': {
    tips: [
      'Phép cộng có nhớ: khi cộng hàng đơn vị lớn hơn 10, nhớ sang hàng chục.',
      'Luôn cộng từ hàng đơn vị trước, rồi đến hàng chục.',
      'Tập tính nhẩm: 28 + 5 = 28 + 2 + 3 = 33.',
    ],
    keyPoints: [
      'Phép cộng có nhớ trong phạm vi 100',
      'Cộng nhẩm',
      'Giải toán có lời văn',
      'Tính chất giao hoán của phép cộng',
    ],
  },
  '2-toan-chuong-3': {
    tips: [
      'Phép trừ có nhớ: khi không đủ để trừ, mượn từ hàng chục.',
      'Nhớ: 32 - 8: 2 không đủ trừ 8, mượn 1 chục → 12 - 8 = 4, còn 2 chục.',
      'Luôn kiểm tra lại bằng phép cộng: 32 - 8 = 24, thử lại 24 + 8 = 32 ✓',
    ],
    keyPoints: [
      'Phép trừ có nhớ trong phạm vi 100',
      'Trừ nhẩm',
      'Kiểm tra kết quả bằng phép cộng',
      'Mối quan hệ giữa phép cộng và phép trừ',
    ],
  },
  // Lớp 3 Toán
  '3-toan-chuong-1': {
    tips: [
      'Số đến 1000 gồm hàng trăm, hàng chục, hàng đơn vị.',
      'VD: 325 = 3 trăm + 2 chục + 5 đơn vị.',
      'Tập đọc số theo từng hàng từ cao đến thấp.',
    ],
    keyPoints: [
      'Các số đến 1000',
      'Phân tích số: hàng trăm, chục, đơn vị',
      'So sánh số đến 1000',
      'Sắp xếp số lớn và tìm số giữa',
    ],
  },
  // Lớp 1 Ngữ văn
  '1-ngu-van-chuong-1': {
    tips: [
      'Tập nhìn nhận các chữ cái và âm tương ứng.',
      'Đọc theo thứ tự: nguyên âm trước, phụ âm sau.',
      'Tập ghép chữ thành tiếng: b-a → ba, m-e → me.',
    ],
    keyPoints: [
      'Nhận diện các chữ cái',
      'Ghép chữ thành tiếng',
      'Đọc tiếng, từ ngữ đơn giản',
      'Luyện phát âm đúng các âm khó',
    ],
  },
  '1-ngu-van-chuong-2': {
    tips: [
      'Vần là phần cuối của tiếng. Tiếng = âm đầu + vần.',
      'VD: "ba" → âm đầu "b" + vần "a"; "mẹ" → âm đầu "m" + vần "ê".',
      'Tập đánh vần từng tiếng trước khi đọc nguyên câu.',
    ],
    keyPoints: [
      'Nhận biết vần và tiếng',
      'Đánh vần tiếng',
      'Đọc trơn từ và câu ngắn',
      'Phân biệt âm đầu và vần',
    ],
  },
  '1-ngu-van-chuong-3': {
    tips: [
      'Tập viết đúng nét chữ, đều khoảng cách.',
      'Viết chữ thường trước, rồi mới luyện chữ hoa.',
      'Chữ viết ngay ngắn giúp bạn đọc tốt hơn.',
    ],
    keyPoints: [
      'Tập viết chữ thường',
      'Nét chữ đúng quy định',
      'Viết từ, câu đơn giản',
      'Giữ vở sạch đẹp, viết đúng dòng',
    ],
  },
  // Lớp 2 Ngữ văn
  '2-ngu-van-chuong-1': {
    tips: [
      'Đọc chậm rãi từng câu, gạch chân từ mới để tra nghĩa sau.',
      'Sau khi đọc xong, tự kể lại nội dung bằng lời của mình.',
      'Để ý các từ ngữ miêu tả trong bài: màu sắc, hình dáng, âm thanh.',
    ],
    keyPoints: [
      'Đọc hiểu văn bản ngắn (5-7 câu)',
      'Xác định nhân vật và sự việc chính',
      'Trả lời câu hỏi về nội dung bài đọc',
      'Nhận biết từ ngữ chỉ sự vật, hoạt động',
    ],
  },
  '2-ngu-van-chuong-2': {
    tips: [
      'Danh từ chỉ người, vật, sự vật. Động từ chỉ hoạt động, trạng thái.',
      'Tìm thêm từ đồng nghĩa và từ trái nghĩa để làm giàu vốn từ.',
      'Mỗi ngày học 3-5 từ mới và đặt câu với từ đó.',
    ],
    keyPoints: [
      'Nhận biết danh từ và động từ',
      'Từ chỉ sự vật, hoạt động, đặc điểm',
      'Mở rộng vốn từ theo chủ đề',
      'Đặt câu với từ đã học',
    ],
  },
  '2-ngu-van-chuong-3': {
    tips: [
      'Viết câu theo mẫu: Ai làm gì? Ai thế nào? Cái gì thế nào?',
      'Nối các câu liên quan thành đoạn văn ngắn (3-4 câu).',
      'Nhớ viết hoa chữ cái đầu câu và đặt dấu chấm hết câu.',
    ],
    keyPoints: [
      'Viết câu đúng cấu trúc cơ bản',
      'Nối câu thành đoạn văn ngắn',
      'Viết hoa đầu câu, dấu chấm hết câu',
      'Viết đoạn văn tả người, vật quen thuộc',
    ],
  },
  // Lớp 3 Ngữ văn
  '3-ngu-van-chuong-1': {
    tips: [
      'Đọc kỹ bài, gạch chân câu hỏi rồi tìm câu trả lời trong bài.',
      'Phân biệt ý chính và ý phụ: ý chính là nội dung quan trọng nhất.',
      'Tóm tắt bài đọc bằng 2-3 câu ngắn gọn.',
    ],
    keyPoints: [
      'Đọc hiểu văn bản dài hơn (8-12 câu)',
      'Tìm ý chính và ý phụ trong bài',
      'Nhận biết hình ảnh so sánh, nhân hóa',
      'Nói được cảm xúc sau khi đọc bài',
    ],
  },
  '3-ngu-van-chuong-2': {
    tips: [
      'Tính từ miêu tả đặc điểm: to, nhỏ, xinh, đẹp,... Đặt câu miêu tả đồ vật xung quanh.',
      'Nhận biết câu kể Ai làm gì? Ai thế nào? Cái gì thế nào?',
      'Tìm chủ ngữ và vị ngữ trong câu để hiểu câu rõ hơn.',
    ],
    keyPoints: [
      'Nhận biết và sử dụng tính từ',
      'Các kiểu câu kể cơ bản',
      'Chủ ngữ và vị ngữ',
      'Câu kể Ai làm gì? Ai thế nào?',
    ],
  },
  '3-ngu-van-chuong-3': {
    tips: [
      'Viết đoạn văn theo trình tự: mở đoạn → nội dung chính → kết đoạn.',
      'Mỗi đoạn văn nên có 4-6 câu, xoay quanh một ý chính.',
      'Sử dụng từ nối: đầu tiên, sau đó, cuối cùng,... để liên kết câu.',
    ],
    keyPoints: [
      'Viết đoạn văn tả người, vật, cảnh',
      'Cấu trúc đoạn văn: mở, thân, kết',
      'Dùng từ ngữ sinh động, hình ảnh',
      'Kiểm tra lỗi chính tả và dấu câu',
    ],
  },
  // Lớp 4 Toán
  '4-toan-chuong-1': {
    tips: [
      'Số đến 100000 gồm hàng trăm nghìn, chục nghìn, nghìn, trăm, chục, đơn vị.',
      'VD: 52347 = 5 chục nghìn + 2 nghìn + 3 trăm + 4 chục + 7 đơn vị.',
      'Tập đọc số theo nhóm 3 chữ số từ phải sang trái để dễ đọc số lớn.',
    ],
    keyPoints: [
      'Các số đến 100000',
      'Đọc, viết và so sánh số đến 100000',
      'Phân tích số theo hàng: trăm nghìn, chục nghìn, nghìn',
      'Sắp xếp số từ bé đến lớn và ngược lại',
    ],
  },
  '4-toan-chuong-2': {
    tips: [
      'Cộng trừ các số lớn: thực hiện từ hàng đơn vị đến hàng cao nhất.',
      'Khi cộng có nhớ, nhớ sang hàng bên trái. Khi trừ không đủ, mượn từ hàng bên trái.',
      'Luôn ước lượng kết quả trước khi tính: 48000 + 32000 ≈ 80000.',
    ],
    keyPoints: [
      'Phép cộng các số đến 100000',
      'Phép trừ các số đến 100000',
      'Cộng trừ có nhớ qua nhiều hàng',
      'Giải toán có lời văn với số lớn',
    ],
  },
  '4-toan-chuong-3': {
    tips: [
      'Nhân số nhiều chữ số với số một chữ số: nhân từ hàng đơn vị, nhớ sang hàng bên.',
      'Chia số nhiều chữ số cho số một chữ số: ước lượng trước rồi chia từng bước.',
      'Kiểm tra: nhân → thử lại bằng chia, và ngược lại.',
    ],
    keyPoints: [
      'Phép nhân số nhiều chữ số với số một chữ số',
      'Phép chia số nhiều chữ số cho số một chữ số',
      'Nhân chia có dư và không dư',
      'Giải toán có lời văn về nhân và chia',
    ],
  },
  // Lớp 4 Ngữ văn
  '4-ngu-van-chuong-1': {
    tips: [
      'Đọc bài 2 lần: lần đầu hiểu ý chính, lần thứ hai ghi chú chi tiết.',
      'Tìm các chi tiết quan trọng: nhân vật, thời gian, địa điểm, sự việc.',
      'Rút ra bài học hoặc thông điệp từ bài đọc.',
    ],
    keyPoints: [
      'Đọc hiểu văn bản kể chuyện, miêu tả',
      'Nhận biết chi tiết quan trọng và phụ',
      'Xác định chủ đề và thông điệp bài đọc',
      'Phân tích nhân vật qua hành động, lời nói',
    ],
  },
  '4-ngu-van-chuong-2': {
    tips: [
      'Danh từ chỉ đơn vị: con, cái, chiếc, bông,... Ghép đúng danh từ với đơn vị.',
      'Tính từ chỉ đặc điểm và so sánh: cao hơn, đẹp nhất, nhanh như gió.',
      'Quan hệ từ: vì... nên, nếu... thì, tuy... nhưng - giúp nối câu logic.',
    ],
    keyPoints: [
      'Danh từ chỉ đơn vị và cách sử dụng',
      'Tính từ so sánh hơn và nhất',
      'Quan hệ từ và cách nối câu',
      'Câu ghép và các vế câu',
    ],
  },
  '4-ngu-van-chuong-3': {
    tips: [
      'Bài miêu tả cần có: giới thiệu → tả chi tiết → cảm nghĩ. Tả từ tổng thể đến chi tiết.',
      'Dùng từ gợi hình, gợi cảm: lấp lánh, rực rỡ, êm ái,... để bài viết sinh động.',
      'Tả đồ vật: hình dáng → màu sắc → công dụng. Tả cây: thân → lá → hoa → quả.',
    ],
    keyPoints: [
      'Viết bài văn miêu tả đồ vật, cây cối',
      'Dàn bài miêu tả: mở bài, thân bài, kết bài',
      'Sử dụng từ ngữ gợi hình, so sánh, nhân hóa',
      'Biết cách quan sát và trình bày theo thứ tự',
    ],
  },
  // Lớp 5 Toán
  '5-toan-chuong-1': {
    tips: [
      'Phân số có tử số và mẫu số. Tử số trên, mẫu số dưới. VD: 3/4.',
      'Số thập phân viết bằng dấu phẩy: 0,5 = 5/10 = 1/2.',
      'Đổi phân số thành số thập phân: chia tử cho mẫu. VD: 3/4 = 0,75.',
    ],
    keyPoints: [
      'Nhận biết phân số và số thập phân',
      'Đổi phân số thành số thập phân và ngược lại',
      'So sánh phân số và số thập phân',
      'Đọc, viết số thập phân đúng cách',
    ],
  },
  '5-toan-chuong-2': {
    tips: [
      'Cộng trừ phân số: quy đồng mẫu số trước, rồi cộng trừ tử số.',
      'Nhân phân số: nhân tử với tử, mẫu với mẫu. Rút gọn kết quả.',
      'Chia phân số: đảo ngược phân số sau rồi nhân. VD: 3/4 ÷ 2/5 = 3/4 × 5/2 = 15/8.',
    ],
    keyPoints: [
      'Cộng và trừ phân số (quy đồng mẫu số)',
      'Nhân phân số và rút gọn',
      'Chia phân số (nhân với phân số đảo)',
      'Giải toán có lời văn với phân số',
    ],
  },
  '5-toan-chuong-3': {
    tips: [
      'Đơn vị đo độ dài: km, m, dm, cm, mm. Nhớ: 1km = 1000m, 1m = 10dm.',
      'Đơn vị đo khối lượng: tấn, tạ, yến, kg, g. Nhớ: 1tấn = 10tạ, 1tạ = 10yến.',
      'Đổi đơn vị: đơn vị lớn nhân 10/100/1000, đơn vị nhỏ chia 10/100/1000.',
    ],
    keyPoints: [
      'Các đơn vị đo độ dài và bảng đơn vị',
      'Các đơn vị đo khối lượng và bảng đơn vị',
      'Đổi đơn vị đo đại lượng',
      'Tính chu vi và diện tích hình cơ bản',
    ],
  },
  // Lớp 5 Ngữ văn
  '5-ngu-van-chuong-1': {
    tips: [
      'Đọc bài văn nghị luận: tìm luận điểm chính và các luận chứng hỗ trợ.',
      'Phân biệt văn bản kể chuyện, miêu tả và nghị luận qua cách trình bày.',
      'Ghi chép ý chính bằng sơ đồ tư duy để dễ nhớ nội dung bài dài.',
    ],
    keyPoints: [
      'Đọc hiểu văn bản nghị luận cơ bản',
      'Nhận biết luận điểm và luận chứng',
      'Phân tích cách dẫn chứng và lập luận',
      'Tóm tắt nội dung văn bản phức tạp',
    ],
  },
  '5-ngu-van-chuong-2': {
    tips: [
      'Nghĩa của từ: nghĩa đen (nghĩa gốc) và nghĩa bóng (nghĩa chuyển). VD: "đường" = con đường / con đường học tập.',
      'Từ nhiều nghĩa: một từ có nhiều nghĩa tùy ngữ cảnh. Xem câu để hiểu đúng nghĩa.',
      'Thành ngữ là cụm từ cố định có nghĩa bóng: "mưa như trút nước", "nhẹ như lông hồng".',
    ],
    keyPoints: [
      'Nghĩa đen và nghĩa bóng của từ',
      'Từ nhiều nghĩa và cách xác định',
      'Thành ngữ và cách hiểu nghĩa',
      'Mở rộng vốn từ theo chủ đề',
    ],
  },
  '5-ngu-van-chuong-3': {
    tips: [
      'Bài nghị luận cần: mở bài (nêu vấn đề) → thân bài (lập luận) → kết bài (khẳng định).',
      'Mỗi luận điểm cần có dẫn chứng cụ thể: sự thật, con số, ví dụ thực tế.',
      'Dùng từ nối logic: thứ nhất, thứ hai, ngoài ra, tóm lại,... để bài viết chặt chẽ.',
    ],
    keyPoints: [
      'Viết bài văn nghị luận cơ bản',
      'Dàn bài nghị luận: mở, thân, kết',
      'Cách đưa dẫn chứng và lập luận',
      'Sử dụng từ nối và liên kết câu',
    ],
  },
}

// Difficulty levels per chapter
const chapterDifficulty: Record<number, { label: string; class: string; emoji: string }> = {
  1: { label: 'Dễ', class: 'difficulty-easy', emoji: '🟢' },
  2: { label: 'Trung bình', class: 'difficulty-medium', emoji: '🟡' },
  3: { label: 'Trung bình', class: 'difficulty-medium', emoji: '🟡' },
  4: { label: 'Khó', class: 'difficulty-hard', emoji: '🔴' },
  5: { label: 'Khó', class: 'difficulty-hard', emoji: '🔴' },
}

// Chapter emojis for visual appeal (especially Grade 1)
const chapterEmojis: Record<string, string> = {
  // Grade 1 Toán
  '1-toan-chuong-1': '🍎', // Các số đến 10
  '1-toan-chuong-2': '➕', // Phép cộng
  '1-toan-chuong-3': '➖', // Phép trừ
  '1-toan-chuong-4': '🔢', // Các số đến 20
  '1-toan-chuong-5': '📏', // Điểm và đường thẳng
  '1-toan-chuong-6': '⬜', // Hình học cơ bản
  '1-toan-chuong-7': '⚖️', // Đại lượng
  // Grade 1 Ngữ văn
  '1-ngu-van-chuong-1': '🔤', // Âm và vần
  '1-ngu-van-chuong-2': '🗣️', // Vần và tiếng
  '1-ngu-van-chuong-3': '✏️', // Tập viết
  '1-ngu-van-chuong-4': '📖', // Đọc hiểu
  // Grade 2 Toán
  '2-toan-chuong-1': '💯', // Số đến 100
  '2-toan-chuong-2': '🧮', // Cộng trừ pv100
  '2-toan-chuong-3': '✖️', // Phép nhân
  '2-toan-chuong-4': '📐', // Hình học
  '2-toan-chuong-5': '⏰', // Đại lượng
  // Grade 2 Ngữ văn
  '2-ngu-van-chuong-1': '📚', // Đọc hiểu
  '2-ngu-van-chuong-2': '✍️', // Chính tả
  '2-ngu-van-chuong-3': '📝', // Tập làm văn
  // Grade 3 Toán
  '3-toan-chuong-1': '🎯', // Số đến 1000
  '3-toan-chuong-2': '✖️', // Phép nhân
  '3-toan-chuong-3': '➗', // Phép chia
  '3-toan-chuong-4': '📐', // Hình học/Diện tích
  '3-toan-chuong-5': '⏱️', // Thời gian/Độ dài
  // Grade 3 Ngữ văn
  '3-ngu-van-chuong-1': '📖', // Đọc hiểu
  '3-ngu-van-chuong-2': '💬', // Luyện từ
  '3-ngu-van-chuong-3': '📝', // Tập làm văn
  // Grade 4-5 Toán & Ngữ văn (generic)
  '4-toan-chuong-1': '🔢', '4-toan-chuong-2': '🧮', '4-toan-chuong-3': '➗', '4-toan-chuong-4': '📐', '4-toan-chuong-5': '📏',
  '4-ngu-van-chuong-1': '📖', '4-ngu-van-chuong-2': '💬', '4-ngu-van-chuong-3': '📝',
  '5-toan-chuong-1': '📊', '5-toan-chuong-2': '🔢', '5-toan-chuong-3': '📐', '5-toan-chuong-4': '📈', '5-toan-chuong-5': '📏',
  '5-ngu-van-chuong-1': '📖', '5-ngu-van-chuong-2': '💬', '5-ngu-van-chuong-3': '📝',
}

function StudyTipsSection({ quiz }: { quiz: QuizInfo }) {
  const [isOpen, setIsOpen] = useState(false)
  const chapterNum = quiz.chapter.replace('chuong-', '')
  const tipKey = `${quiz.grade}-${quiz.subject}-chuong-${chapterNum}`
  const tipsData = studyTips[tipKey]
  const isGrade1 = quiz.grade === 1

  if (!tipsData) return null

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 ${isGrade1 ? 'text-base' : 'text-sm'} font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors py-1`}
      >
        <Lightbulb className={isGrade1 ? 'w-5 h-5' : 'w-4 h-4'} />
        <span>{isGrade1 ? '💡 Xem mẹo học bài' : 'Ôn tập'}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={isGrade1 ? 'w-5 h-5' : 'w-4 h-4'} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl ${isGrade1 ? 'p-5' : 'p-4'} mt-2 space-y-3`}>
              {/* Key knowledge points */}
              <div>
                <h5 className={`${isGrade1 ? 'text-base' : 'text-sm'} font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1`}>
                  📌 Kiến thức trọng tâm
                </h5>
                <ul className="space-y-1">
                  {tipsData.keyPoints.map((point, i) => (
                    <li key={i} className={`${isGrade1 ? 'text-base' : 'text-sm'} text-amber-700 dark:text-amber-400 flex items-start gap-2`}>
                      <span className="shrink-0">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tips */}
              <div>
                <h5 className={`${isGrade1 ? 'text-base' : 'text-sm'} font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1`}>
                  💡 Mẹo làm bài tốt
                </h5>
                <ul className="space-y-1.5">
                  {tipsData.tips.map((tip, i) => (
                    <li key={i} className={`${isGrade1 ? 'text-base' : 'text-sm'} text-amber-700 dark:text-amber-400 flex items-start gap-2`}>
                      <span className="shrink-0">✨</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ChapterView() {
  const { selectedGrade, selectedSubject, startQuiz, studentInfo } = useAppStore()
  const [quizzes, setQuizzes] = useState<QuizInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Show student info form if not filled
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [formName, setFormName] = useState(studentInfo?.name || '')
  const [formClass, setFormClass] = useState(studentInfo?.className || '')
  const [formSchool, setFormSchool] = useState(studentInfo?.schoolName || '')
  const [pendingQuizId, setPendingQuizId] = useState<string | null>(null)
  const [formStep, setFormStep] = useState(1) // 1: name, 2: class/school

  // Quiz completion state from localStorage
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, { score: number; date: string }>>({})

  // Load completed quizzes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cogiaohaianh-completed-quizzes')
      if (stored) {
        setCompletedQuizzes(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Save completed quiz to localStorage (called after quiz submission in result view)
  // We also check the progress API for current student
  useEffect(() => {
    if (!studentInfo?.name || !studentInfo?.className) return
    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress?studentName=${encodeURIComponent(studentInfo.name)}&className=${encodeURIComponent(studentInfo.className)}`)
        if (res.ok) {
          const data = await res.json()
          const completions: Record<string, { score: number; date: string }> = {}
          data.forEach((r: { quizId: string; score: number; createdAt: string }) => {
            const existing = completions[r.quizId]
            if (!existing || r.score > existing.score) {
              completions[r.quizId] = { score: r.score, date: r.createdAt }
            }
          })
          setCompletedQuizzes(prev => ({ ...prev, ...completions }))
          // Also save to localStorage
          try {
            const stored = localStorage.getItem('cogiaohaianh-completed-quizzes')
            const existing = stored ? JSON.parse(stored) : {}
            const merged = { ...existing, ...completions }
            localStorage.setItem('cogiaohaianh-completed-quizzes', JSON.stringify(merged))
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore errors
      }
    }
    fetchProgress()
  }, [studentInfo])

  useEffect(() => {
    if (!selectedGrade || !selectedSubject) return

    const fetchQuizzes = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/quizzes?grade=${selectedGrade}&subject=${selectedSubject}`)
        if (!res.ok) throw new Error('Không thể tải danh sách bài kiểm tra')
        const data = await res.json()
        setQuizzes(data)
      } catch (err) {
        setError('Không thể tải danh sách bài kiểm tra. Vui lòng thử lại.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [selectedGrade, selectedSubject])

  const handleStartQuiz = (quizId: string) => {
    if (!formName || !formClass) {
      setFormStep(1)
      setPendingQuizId(quizId)
      setShowStudentForm(true)
      return
    }
    startQuiz(quizId, { name: formName, className: formClass, schoolName: formSchool })
  }

  const handleFormSubmit = () => {
    if (!formName.trim() || !formClass.trim()) return
    if (pendingQuizId) {
      startQuiz(pendingQuizId, { name: formName.trim(), className: formClass.trim(), schoolName: formSchool.trim() })
      setPendingQuizId(null)
    }
    setShowStudentForm(false)
  }

  if (!selectedGrade || !selectedSubject) return null

  const subjectName = selectedSubject === 'toan' ? 'Toán' : 'Ngữ văn'
  const subjectEmoji = selectedSubject === 'toan' ? '🔢' : '📖'

  const gradeColors: Record<number, { bg: string; text: string; accent: string }> = {
    1: { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-700 dark:text-rose-300', accent: 'bg-rose-500' },
    2: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700 dark:text-orange-300', accent: 'bg-orange-500' },
    3: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-700 dark:text-amber-300', accent: 'bg-amber-500' },
    4: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', accent: 'bg-emerald-500' },
    5: { bg: 'bg-teal-50 dark:bg-teal-950/30', text: 'text-teal-700 dark:text-teal-300', accent: 'bg-teal-500' },
  }

  const gc = gradeColors[selectedGrade]

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  // Calculate progress based on completed quizzes
  const completedCount = quizzes.filter(q => completedQuizzes[q.id]).length
  const totalChapters = quizzes.length
  const progressPercent = totalChapters > 0 ? Math.round((completedCount / totalChapters) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Student info form modal */}
      {showStudentForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowStudentForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
          >
            {/* Decorative top strip */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400" />

            {/* Step indicator */}
            <div className="step-indicator mb-6 px-4">
              <div className={`step-dot ${formStep >= 1 ? (formStep > 1 ? 'completed' : 'active') : 'inactive'}`}>
                {formStep > 1 ? '✓' : '👤'}
              </div>
              <div className={`step-line ${formStep > 1 ? 'completed' : ''}`} />
              <div className={`step-dot ${formStep >= 2 ? 'active' : 'inactive'}`}>
                🏫
              </div>
            </div>

            <h3 className="font-[family-name:var(--font-patrick-hand)] text-2xl text-orange-700 dark:text-orange-300 mb-4 text-center">
              {formStep === 1 ? 'Nhập thông tin của bạn ✏️' : 'Thông tin lớp học 🏫'}
            </h3>

            <AnimatePresence mode="wait">
              {formStep === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <Pencil className="w-3.5 h-3.5 text-orange-500" />
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Nhập họ và tên..."
                      className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-xl focus:border-orange-400 dark:focus:border-orange-500 focus:outline-none text-base bg-white dark:bg-card transition-colors"
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (formName.trim()) setFormStep(2)
                    }}
                    disabled={!formName.trim()}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-base rounded-xl"
                  >
                    Tiếp theo →
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-orange-500" />
                      Lớp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formClass}
                      onChange={(e) => setFormClass(e.target.value)}
                      placeholder="VD: 1A, 2B..."
                      className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-xl focus:border-orange-400 dark:focus:border-orange-500 focus:outline-none text-base bg-white dark:bg-card transition-colors"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <School className="w-3.5 h-3.5 text-orange-500" />
                      Trường
                    </label>
                    <input
                      type="text"
                      value={formSchool}
                      onChange={(e) => setFormSchool(e.target.value)}
                      placeholder="Nhập tên trường..."
                      className="w-full px-4 py-3 border-2 border-orange-200 dark:border-orange-800 rounded-xl focus:border-orange-400 dark:focus:border-orange-500 focus:outline-none text-base bg-white dark:bg-card transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setFormStep(1)}
                      className="flex-1 py-3 text-base rounded-xl"
                    >
                      ← Quay lại
                    </Button>
                    <Button
                      onClick={handleFormSubmit}
                      disabled={!formName.trim() || !formClass.trim()}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-base rounded-xl"
                    >
                      Bắt đầu →
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fun decorative elements */}
            <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 dark:opacity-40 select-none pointer-events-none">✏️</div>
            <div className="absolute -top-1 -left-1 text-3xl opacity-10 dark:opacity-40 select-none pointer-events-none">📚</div>
          </motion.div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${gc.bg} border-2 border-current/10 rounded-2xl p-4 sm:p-6 text-center relative overflow-hidden`}
      >
        {/* Decorative elements */}
        <div className="absolute top-2 right-4 text-lg opacity-15 dark:opacity-45 animate-float">📖</div>
        <div className="absolute bottom-2 left-4 text-lg opacity-15 dark:opacity-45 animate-float" style={{ animationDelay: '0.5s' }}>✏️</div>

        <h2 className={`font-[family-name:var(--font-patrick-hand)] text-2xl sm:text-3xl ${gc.text} relative z-10`}>
          {subjectEmoji} {subjectName} - Lớp {selectedGrade}
        </h2>
        <p className={`${gc.text} opacity-70 mt-1 text-sm relative z-10`}>Chọn chương để làm bài kiểm tra</p>
      </motion.div>

      {/* Chapter Progress Bar */}
      {!loading && quizzes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-card rounded-2xl p-4 shadow-sm border dark:border-border"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-orange-500" />
              Tiến độ chương
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-bold text-emerald-600">{completedCount}</span> / {totalChapters} chương
            </span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="progress-bar-gradient h-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {completedCount === 0
              ? '📝 Chưa làm bài nào. Hãy bắt đầu nhé!'
              : completedCount === totalChapters
                ? '🎉 Đã hoàn thành tất cả chương! Tuyệt vời!'
                : `💪 Đã hoàn thành ${completedCount}/${totalChapters} chương. Tiếp tục nào!`
            }
          </p>
        </motion.div>
      )}

      {/* Student quick info (if already entered) */}
      {studentInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2 text-center text-amber-700 dark:text-amber-300 text-sm"
        >
          👤 {studentInfo.name} | Lớp {studentInfo.className}
          {studentInfo.schoolName && ` | ${studentInfo.schoolName}`}
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="fun-loading">
            <span className="pencil-icon">✏️</span>
            <span className="book-icon">📚</span>
          </div>
          <p className="text-muted-foreground">Đang tải danh sách bài kiểm tra...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Quiz list */}
      {!loading && !error && quizzes.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-8 text-center">
          <p className="text-amber-700 text-lg">Chưa có bài kiểm tra nào cho môn này.</p>
          <p className="text-amber-600 text-sm mt-2">Vui lòng quay lại sau nhé!</p>
        </div>
      )}

      {!loading && !error && quizzes.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {quizzes.map((quiz, index) => {
            const diff = chapterDifficulty[(index % 5) + 1] || chapterDifficulty[1]
            const completion = completedQuizzes[quiz.id]
            const isCompleted = !!completion
            const chapterEmojiKey = `${quiz.grade}-${quiz.subject}-${quiz.chapter}`
            const chapterEmoji = chapterEmojis[chapterEmojiKey] || '📝'
            const isGrade1 = quiz.grade === 1
            return (
              <motion.div
                key={quiz.id}
                variants={item}
                whileHover={{ scale: 1.01, x: 4 }}
                className={`bg-white dark:bg-card border-2 rounded-2xl ${isGrade1 ? 'p-5 sm:p-6' : 'p-4 sm:p-5'} shadow-sm hover:shadow-md transition-all relative overflow-hidden group ${
                  isCompleted
                    ? 'border-emerald-200 dark:border-emerald-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    : 'border-gray-100 dark:border-border hover:border-orange-200 dark:hover:border-orange-700'
                }`}
              >
                {/* Left accent bar - green for completed, orange for not */}
                <div className={`absolute top-0 left-0 bottom-0 ${isGrade1 ? 'w-1.5' : 'w-1'} transition-opacity ${
                  isCompleted
                    ? 'bg-gradient-to-b from-emerald-400 to-teal-400 opacity-100'
                    : 'bg-gradient-to-b from-orange-400 to-amber-400 opacity-0 group-hover:opacity-100'
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    {/* Chapter emoji + metadata row */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {/* Chapter emoji icon - bigger for Grade 1 */}
                      <span className={`${isGrade1 ? 'text-2xl' : 'text-lg'} leading-none`}>
                        {chapterEmoji}
                      </span>
                      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full">
                        Chương {index + 1}
                      </span>

                      {/* Difficulty badge - hidden for Grade 1 */}
                      {!isGrade1 && (
                        <span className={`${diff.class} text-xs px-2 py-0.5 rounded-full font-semibold`}>
                          {diff.emoji} {diff.label}
                        </span>
                      )}

                      {quiz.duration > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          ~{quiz.duration} phút
                        </span>
                      )}
                      {quiz._count?.questions && (
                        <span className={`${isGrade1 ? 'text-sm' : 'text-xs'} text-muted-foreground dark:text-gray-400`}>
                          📝 {quiz._count.questions} câu hỏi
                        </span>
                      )}

                      {/* Completed badge - shown when student has done this quiz */}
                      {isCompleted && (
                        <span className="completed-badge">
                          ✓ Đã làm
                        </span>
                      )}
                    </div>
                    <h3 className={`font-semibold ${isGrade1 ? 'text-xl sm:text-2xl font-[family-name:var(--font-patrick-hand)]' : 'text-lg'} text-foreground`}>
                      {quiz.chapterName}
                    </h3>
                    <p className="text-muted-foreground dark:text-gray-400 text-sm mt-0.5">
                      {quiz.title}
                    </p>

                    {/* Best score display for completed quizzes */}
                    {isCompleted && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold shadow-sm ${
                            completion.score >= 9
                              ? 'score-excellent'
                              : completion.score >= 7
                                ? 'score-good'
                                : completion.score >= 5
                                  ? 'score-average'
                                  : 'score-poor'
                          }`}>
                            {completion.score.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground dark:text-gray-400">Điểm cao nhất</span>
                        </div>
                        {/* Mini progress bar */}
                        <div className="flex-1 max-w-[100px]">
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                completion.score >= 9
                                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400'
                                  : completion.score >= 7
                                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
                                    : completion.score >= 5
                                      ? 'bg-gradient-to-r from-orange-400 to-amber-400'
                                      : 'bg-gradient-to-r from-rose-400 to-pink-400'
                              }`}
                              style={{ width: `${(completion.score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Study tips section */}
                    <StudyTipsSection quiz={quiz} />
                  </div>
                  <Button
                    onClick={() => {
                      playClickSound()
                      handleStartQuiz(quiz.id)
                    }}
                    className={`font-semibold ${isGrade1 ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'} rounded-xl shrink-0 gap-2 shadow-md hover-glow transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}
                  >
                    {isCompleted ? '🔄 Làm lại' : isGrade1 ? '🎮 Bắt đầu nhé!' : 'Kiểm tra online'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
