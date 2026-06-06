// Additional quiz questions for each existing quiz
// These are appended to existing quizzes to bring each from ~9 to ~12-14 questions
// Based on Vietnamese primary school curriculum (SGK 2024-2025)

import { QuizData } from './quiz-data'

// Map of quiz title -> additional questions
export const additionalQuestions: Record<string, QuizData['questions']> = {
  // ===== LỚP 1 - TOÁN =====
  "Kiểm tra Các số từ 1 đến 10": [
    { questionText: "Số nào lớn hơn: 6 hay 8?", questionType: "multiple_choice", options: ["A. 6", "B. 8", "C. Bằng nhau", "D. Không biết"], correctAnswer: "B", points: 1 },
    { questionText: "Đếm ngược từ 5 về 1: 5, 4, ..., 2, 1. Số còn thiếu là?", questionType: "fill_blank", options: [], correctAnswer: "3", points: 1 },
    { questionText: "Số lẻ nào nằm giữa 4 và 8?", questionType: "multiple_choice", options: ["A. 5", "B. 6", "C. 7", "D. 5 và 7"], correctAnswer: "D", points: 1 },
    { questionText: "Số liền trước số 1 là:", questionType: "fill_blank", options: [], correctAnswer: "0", points: 1 },
  ],
  "Kiểm tra Phép cộng trong phạm vi 10": [
    { questionText: "6 + 4 = ?", questionType: "multiple_choice", options: ["A. 9", "B. 10", "C. 8", "D. 11"], correctAnswer: "B", points: 1 },
    { questionText: "An có 4 quả cam, Bình cho An thêm 3 quả cam. Hỏi An có mấy quả cam?", questionType: "fill_blank", options: [], correctAnswer: "7", points: 1 },
    { questionText: "Tìm hai số có tổng bằng 10:", questionType: "multiple_choice", options: ["A. 4 và 5", "B. 3 và 6", "C. 2 và 8", "D. 1 và 7"], correctAnswer: "C", points: 1 },
    { questionText: "8 + ... = 10. Số cần điền là?", questionType: "fill_blank", options: [], correctAnswer: "2", points: 1 },
  ],
  "Kiểm tra Phép trừ trong phạm vi 10": [
    { questionText: "8 - 5 = ?", questionType: "multiple_choice", options: ["A. 2", "B. 3", "C. 4", "D. 5"], correctAnswer: "B", points: 1 },
    { questionText: "Có 7 con gà, bán đi 2 con. Còn lại mấy con gà?", questionType: "fill_blank", options: [], correctAnswer: "5", points: 1 },
    { questionText: "Số nào trừ đi 3 thì bằng 5?", questionType: "fill_blank", options: [], correctAnswer: "8", points: 1 },
    { questionText: "9 - 6 = ?", questionType: "multiple_choice", options: ["A. 2", "B. 3", "C. 4", "D. 5"], correctAnswer: "B", points: 1 },
  ],
  "Kiểm tra Các số đến 20": [
    { questionText: "13 + 4 = ?", questionType: "multiple_choice", options: ["A. 16", "B. 17", "C. 18", "D. 15"], correctAnswer: "B", points: 1 },
    { questionText: "Số 11 gồm mấy chục và mấy đơn vị?", questionType: "fill_blank", options: [], correctAnswer: "1 chục và 1 đơn vị", points: 1 },
    { questionText: "Viết các số chẵn từ 10 đến 20:", questionType: "fill_blank", options: [], correctAnswer: "10 12 14 16 18 20", points: 1 },
    { questionText: "20 - 7 = ?", questionType: "multiple_choice", options: ["A. 12", "B. 13", "C. 14", "D. 11"], correctAnswer: "B", points: 1 },
  ],

  // ===== LỚP 1 - NGỮ VĂN =====
  "Kiểm tra Tập đọc chữ cái": [
    { questionText: "Chữ 'p' đọc là gì?", questionType: "multiple_choice", options: ["A. Pờ", "B. Bờ", "C. Tờ", "D. Nờ"], correctAnswer: "A", points: 1 },
    { questionText: "Có mấy nguyên âm đơn trong tiếng Việt?", questionType: "multiple_choice", options: ["A. 5", "B. 6", "C. 12", "D. 29"], correctAnswer: "A", points: 1 },
    { questionText: "Chữ nào đứng sau chữ 'd' trong bảng chữ cái?", questionType: "fill_blank", options: [], correctAnswer: "đ", points: 1 },
  ],
  "Kiểm tra Vần và tiếng": [
    { questionText: "Từ 'cái bút' có mấy tiếng?", questionType: "fill_blank", options: [], correctAnswer: "2", points: 1 },
    { questionText: "Tìm từ có vần 'inh':", questionType: "multiple_choice", options: ["A. Cành", "B. Cành", "C. Mình", "D. Màng"], correctAnswer: "C", points: 1 },
    { questionText: "Điền vần: nh... + ai = ...?", questionType: "fill_blank", options: [], correctAnswer: "nhai", points: 1 },
  ],
  "Kiểm tra Tập viết và làm câu": [
    { questionText: "Viết hoa chữ cái nào trong câu: 'hôm nay em đi học'?", questionType: "fill_blank", options: [], correctAnswer: "H", points: 1 },
    { questionText: "Câu kể kết thúc bằng dấu gì?", questionType: "multiple_choice", options: ["A. Dấu chấm hỏi", "B. Dấu chấm", "C. Dấu chấm than", "D. Dấu phẩy"], correctAnswer: "B", points: 1 },
    { questionText: "Từ chỉ đồ vật trong câu: 'Quyển sách trên bàn' là:", questionType: "multiple_choice", options: ["A. Quyển sách", "B. Trên", "C. Bàn", "D. Quyển sách và bàn"], correctAnswer: "D", points: 1 },
  ],

  // ===== LỚP 2 - TOÁN =====
  "Kiểm tra Các số đến 100": [
    { questionText: "Số nhỏ nhất có 2 chữ số là:", questionType: "fill_blank", options: [], correctAnswer: "10", points: 1 },
    { questionText: "Số 83 gồm mấy chục và mấy đơn vị?", questionType: "multiple_choice", options: ["A. 8 chục và 3 đơn vị", "B. 3 chục và 8 đơn vị", "C. 83 chục", "D. 8 đơn vị và 3 chục"], correctAnswer: "A", points: 1 },
    { questionText: "Đếm thêm 10: 30, 40, ..., 60", questionType: "fill_blank", options: [], correctAnswer: "50", points: 1 },
    { questionText: "So sánh: 67 ... 76", questionType: "multiple_choice", options: ["A. >", "B. <", "C. =", "D. Không so sánh được"], correctAnswer: "B", points: 1 },
  ],
  "Kiểm tra Phép cộng trừ phạm vi 100": [
    { questionText: "25 + 38 = ?", questionType: "multiple_choice", options: ["A. 52", "B. 63", "C. 53", "D. 62"], correctAnswer: "B", points: 1 },
    { questionText: "74 - 29 = ?", questionType: "fill_blank", options: [], correctAnswer: "45", points: 1 },
    { questionText: "Một vườn có 46 cây cam, trồng thêm 27 cây. Hỏi vườn có bao nhiêu cây cam?", questionType: "fill_blank", options: [], correctAnswer: "73", points: 1 },
  ],
  "Kiểm tra Phép nhân": [
    { questionText: "6 × 3 = ?", questionType: "multiple_choice", options: ["A. 15", "B. 18", "C. 21", "D. 12"], correctAnswer: "B", points: 1 },
    { questionText: "7 × 4 = ?", questionType: "fill_blank", options: [], correctAnswer: "28", points: 1 },
    { questionText: "Mỗi bó có 6 cái bút chì, có 5 bó. Hỏi có tất cả mấy cái bút chì?", questionType: "multiple_choice", options: ["A. 25 cái", "B. 35 cái", "C. 30 cái", "D. 11 cái"], correctAnswer: "C", points: 1 },
  ],

  // ===== LỚP 2 - NGỮ VĂN =====
  "Kiểm tra Tập đọc hiểu": [
    { questionText: "Từ 'bàn ghế' thuộc nhóm từ nào?", questionType: "multiple_choice", options: ["A. Động vật", "B. Thực vật", "C. Đồ vật", "D. Con người"], correctAnswer: "C", points: 1 },
    { questionText: "Từ trái nghĩa với 'nhanh' là:", questionType: "fill_blank", options: [], correctAnswer: "chậm", points: 1 },
    { questionText: "Câu nào là câu cảm thán?", questionType: "multiple_choice", options: ["A. Trời mưa rồi.", "B. Bạn đi đâu?", "C. Tuyệt quá!", "D. Em đi học."], correctAnswer: "C", points: 1 },
  ],
  "Kiểm tra Chính tả và Luyện từ": [
    { questionText: "Điền 'ch' hay 'tr': ...ái cây", questionType: "fill_blank", options: [], correctAnswer: "c", points: 1 },
    { questionText: "Từ nào viết sai chính tả?", questionType: "multiple_choice", options: ["A. Trong trẻo", "B. Sáng sủa", "C. Trọng trè", "D. Xinh đẹp"], correctAnswer: "C", points: 1 },
    { questionText: "Điền 'r' hay 'd': ...ương thuốc", questionType: "fill_blank", options: [], correctAnswer: "d", points: 1 },
  ],

  // ===== LỚP 3 - TOÁN =====
  "Kiểm tra Phép cộng trừ phạm vi 1000": [
    { questionText: "456 + 234 = ?", questionType: "fill_blank", options: [], correctAnswer: "690", points: 1 },
    { questionText: "800 - 275 = ?", questionType: "multiple_choice", options: ["A. 525", "B. 625", "C. 535", "D. 615"], correctAnswer: "A", points: 1 },
    { questionText: "Có 435 học sinh, chuyển đi 128 học sinh. Hỏi còn lại bao nhiêu học sinh?", questionType: "fill_blank", options: [], correctAnswer: "307", points: 1 },
    { questionText: "Tìm x: x - 234 = 456", questionType: "fill_blank", options: [], correctAnswer: "690", points: 1 },
  ],
  "Kiểm tra Phép nhân": [
    { questionText: "34 × 3 = ?", questionType: "fill_blank", options: [], correctAnswer: "102", points: 1 },
    { questionText: "Một cửa hàng bán mỗi ngày 45 quyển vở. Hỏi trong 5 ngày bán được bao nhiêu quyển vở?", questionType: "multiple_choice", options: ["A. 200 quyển", "B. 225 quyển", "C. 250 quyển", "D. 215 quyển"], correctAnswer: "B", points: 1 },
    { questionText: "1 × 456 = ?", questionType: "fill_blank", options: [], correctAnswer: "456", points: 1 },
  ],
  "Kiểm tra Phép chia": [
    { questionText: "90 ÷ 9 = ?", questionType: "multiple_choice", options: ["A. 9", "B. 10", "C. 11", "D. 8"], correctAnswer: "B", points: 1 },
    { questionText: "Có 42 học sinh chia đều thành 6 nhóm. Mỗi nhóm có mấy học sinh?", questionType: "fill_blank", options: [], correctAnswer: "7", points: 1 },
    { questionText: "54 ÷ 6 = ?", questionType: "fill_blank", options: [], correctAnswer: "9", points: 1 },
    { questionText: "Số nào chia 8 thì bằng 7?", questionType: "fill_blank", options: [], correctAnswer: "56", points: 1 },
  ],

  // ===== LỚP 3 - NGỮ VĂN =====
  "Kiểm tra Đọc hiểu": [
    { questionText: "Từ 'quanh co' có nghĩa là:", questionType: "multiple_choice", options: ["A. Thẳng tắp", "B. Cong queo không thẳng", "C. Rộng lớn", "D. Nhỏ bé"], correctAnswer: "B", points: 1 },
    { questionText: "Từ đồng nghĩa với 'tốt' là:", questionType: "fill_blank", options: [], correctAnswer: "giỏi", points: 1 },
    { questionText: "Trong câu 'Hoa phượng nở đỏ rực', từ chỉ màu sắc là:", questionType: "fill_blank", options: [], correctAnswer: "đỏ", points: 1 },
  ],
  "Kiểm tra Luyện từ và câu": [
    { questionText: "Trong câu 'Con mèo đen đang ngủ', từ 'đen' là:", questionType: "multiple_choice", options: ["A. Danh từ", "B. Động từ", "C. Tính từ", "D. Đại từ"], correctAnswer: "C", points: 1 },
    { questionText: "Tìm động từ trong câu: 'Chim hót trên cành.'", questionType: "fill_blank", options: [], correctAnswer: "hót", points: 1 },
    { questionText: "Câu 'Mẹ và con đi chợ.' có mấy danh từ?", questionType: "multiple_choice", options: ["A. 1", "B. 2", "C. 3", "D. 4"], correctAnswer: "B", points: 1 },
  ],

  // ===== LỚP 4 - TOÁN =====
  "Kiểm tra Các số đến 100000": [
    { questionText: "Viết số: Chín mươi nghìn không trăm năm mươi =", questionType: "fill_blank", options: [], correctAnswer: "90050", points: 1 },
    { questionText: "Giá trị chữ số 3 trong số 34567 là:", questionType: "multiple_choice", options: ["A. 3", "B. 300", "C. 3000", "D. 30000"], correctAnswer: "D", points: 1 },
    { questionText: "Số liền trước số 10000 là:", questionType: "fill_blank", options: [], correctAnswer: "9999", points: 1 },
  ],
  "Kiểm tra Phép nhân chia số lớn": [
    { questionText: "678 × 4 = ?", questionType: "fill_blank", options: [], correctAnswer: "2712", points: 1 },
    { questionText: "9360 ÷ 9 = ?", questionType: "multiple_choice", options: ["A. 1040", "B. 1030", "C. 1050", "D. 1020"], correctAnswer: "A", points: 1 },
    { questionText: "Tìm x: x ÷ 5 = 234", questionType: "fill_blank", options: [], correctAnswer: "1170", points: 1 },
  ],
  "Kiểm tra Phân số": [
    { questionText: "Phân số 4/4 bằng bao nhiêu?", questionType: "fill_blank", options: [], correctAnswer: "1", points: 1 },
    { questionText: "Tìm phân số bằng phân số 2/3:", questionType: "multiple_choice", options: ["A. 4/6", "B. 4/5", "C. 3/4", "D. 2/4"], correctAnswer: "A", points: 1 },
    { questionText: "3/4 của 20 bằng bao nhiêu?", questionType: "fill_blank", options: [], correctAnswer: "15", points: 1 },
  ],

  // ===== LỚP 4 - NGỮ VĂN =====
  "Kiểm tra Đọc hiểu - Kể chuyện": [
    { questionText: "Sự việc chính trong truyện là:", questionType: "multiple_choice", options: ["A. Chi tiết phụ", "B. Sự việc quan trọng nhất', 'C. Lời kể', 'D. Mô tả cảnh"], correctAnswer: "B", points: 1 },
    { questionText: "Từ 'khắc phục' có nghĩa là:", questionType: "fill_blank", options: [], correctAnswer: "sửa chữa bỏ đi cái sai cái xấu", points: 1 },
    { questionText: "Câu 'Mặc dù trời mưa, em vẫn đi học.' là câu gì?", questionType: "multiple_choice", options: ["A. Câu đơn", "B. Câu ghép", "C. Câu rút gọn", "D. Câu cảm thán"], correctAnswer: "B", points: 1 },
  ],
  "Kiểm tra Luyện từ và câu - Câu ghép": [
    { questionText: "Quan hệ từ 'nếu' chỉ mối quan hệ:", questionType: "multiple_choice", options: ["A. Nguyên nhân", "B. Điều kiện", "C. Tương phản", "D. Tiếp nối"], correctAnswer: "B", points: 1 },
    { questionText: "Thêm quan hệ từ: 'Em ốm ... không đi học'", questionType: "fill_blank", options: [], correctAnswer: "nên", points: 1 },
    { questionText: "Quan hệ từ 'và' chỉ mối quan hệ:", questionType: "multiple_choice", options: ["A. Nguyên nhân", "B. Tương phản", "C. Tiếp nối", "D. Điều kiện"], correctAnswer: "C", points: 1 },
  ],

  // ===== LỚP 5 - TOÁN =====
  "Kiểm tra Phân số thập phân và số thập phân": [
    { questionText: "Viết 7/100 dưới dạng số thập phân:", questionType: "fill_blank", options: [], correctAnswer: "0,07", points: 1 },
    { questionText: "Chữ số 6 trong số 5,63 thuộc hàng nào?", questionType: "multiple_choice", options: ["A. Hàng đơn vị", "B. Hàng phần mười", "C. Hàng phần trăm", "D. Hàng chục"], correctAnswer: "B", points: 1 },
    { questionText: "Làm tròn số 7,82 đến hàng phần mười:", questionType: "fill_blank", options: [], correctAnswer: "7,8", points: 1 },
  ],
  "Kiểm tra Phép tính với số thập phân": [
    { questionText: "3,5 + 2,7 = ?", questionType: "multiple_choice", options: ["A. 5,2", "B. 6,2", "C. 5,12", "D. 6,12"], correctAnswer: "B", points: 1 },
    { questionText: "8,4 - 3,6 = ?", questionType: "fill_blank", options: [], correctAnswer: "4,8", points: 1 },
    { questionText: "2,5 × 4 = ?", questionType: "fill_blank", options: [], correctAnswer: "10", points: 1 },
  ],
  "Kiểm tra Đại lượng và đo lường": [
    { questionText: "1 km bằng bao nhiêu m?", questionType: "fill_blank", options: [], correctAnswer: "1000", points: 1 },
    { questionText: "1 tấn bằng bao nhiêu kg?", questionType: "multiple_choice", options: ["A. 10 kg", "B. 100 kg", "C. 1000 kg", "D. 10000 kg"], correctAnswer: "C", points: 1 },
    { questionText: "1 giờ bằng bao nhiêu phút?", questionType: "fill_blank", options: [], correctAnswer: "60", points: 1 },
  ],

  // ===== LỚP 5 - NGỮ VĂN =====
  "Kiểm tra Đọc hiểu nâng cao": [
    { questionText: "Ý chính của đoạn văn là:", questionType: "multiple_choice", options: ["A. Chi tiết phụ trong đoạn", "B. Ý quan trọng nhất diễn đạt trong đoạn", "C. Tiêu đề của bài", "D. Tên tác giả"], correctAnswer: "B", points: 1 },
    { questionText: "Từ 'kiên trì' có nghĩa là:", questionType: "fill_blank", options: [], correctAnswer: "kiên nhẫn không bỏ cuộc", points: 1 },
    { questionText: "Tác giả viết bài này nhằm mục đích gì?", questionType: "multiple_choice", options: ["A. Thông tin", "B. Giải trí", "C. Thuyết phục", "D. Tất cả đều có thể"], correctAnswer: "D", points: 1 },
  ],
  "Kiểm tra Nghị luận cơ bản": [
    { questionText: "Viết câu mở bài cho bài nghị luận cần:", questionType: "multiple_choice", options: ["A. Nêu vấn đề cần nghị luận", "B. Kể chuyện", "C. Miêu tả cảnh", "D. Đặt câu hỏi"], correctAnswer: "A", points: 1 },
    { questionText: "Lập luận là:", questionType: "fill_blank", options: [], correctAnswer: "nêu lý lẽ dẫn chứng để bảo vệ quan điểm", points: 1 },
    { questionText: "Câu kết bài cần làm gì?", questionType: "multiple_choice", options: ["A. Nêu lại vấn đề", "B. Khẳng định lại quan điểm", "C. Đặt câu hỏi", "D. Kể chuyện"], correctAnswer: "B", points: 1 },
  ],
}
