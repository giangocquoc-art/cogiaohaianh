// Quiz data for grades 1-5, Math and Vietnamese Language
// Based on Vietnamese primary school curriculum (SGK 2024-2025)

export interface QuizData {
  grade: number;
  subject: string;
  chapter: string;
  chapterName: string;
  title: string;
  description: string;
  duration: number;
  questions: {
    questionText: string;
    questionType: "multiple_choice" | "fill_blank";
    options: string[];
    correctAnswer: string;
    points: number;
  }[];
}

export const quizData: QuizData[] = [
  // ===== LỚP 1 - TOÁN =====
  {
    grade: 1,
    subject: "toan",
    chapter: "chuong-1",
    chapterName: "Các số từ 1 đến 10",
    title: "Kiểm tra Các số từ 1 đến 10",
    description: "Bài kiểm tra kiến thức về các số từ 1 đến 10",
    duration: 20,
    questions: [
      { questionText: "Số nào lớn hơn: 7 hay 3?", questionType: "multiple_choice", options: ["A. 7", "B. 3", "C. Bằng nhau", "D. Không xác định"], correctAnswer: "A", points: 1 },
      { questionText: "Điền số thích hợp vào chỗ chấm: 1, 2, 3, ..., 5", questionType: "fill_blank", options: [], correctAnswer: "4", points: 1 },
      { questionText: "Số nào nhỏ nhất trong các số: 6, 3, 8, 2?", questionType: "multiple_choice", options: ["A. 6", "B. 3", "C. 8", "D. 2"], correctAnswer: "D", points: 1 },
      { questionText: "Viết số từ nhỏ đến lớn: 5, 2, 8, 1", questionType: "fill_blank", options: [], correctAnswer: "1 2 5 8", points: 1 },
      { questionText: "Số 6 nằm giữa hai số nào?", questionType: "multiple_choice", options: ["A. 4 và 5", "B. 5 và 7", "C. 7 và 8", "D. 3 và 4"], correctAnswer: "B", points: 1 },
      { questionText: "Có bao nhiêu số từ 1 đến 5?", questionType: "multiple_choice", options: ["A. 4", "B. 5", "C. 6", "D. 3"], correctAnswer: "B", points: 1 },
      { questionText: "Số liền trước số 9 là số nào?", questionType: "fill_blank", options: [], correctAnswer: "8", points: 1 },
      { questionText: "Số liền sau số 5 là số nào?", questionType: "fill_blank", options: [], correctAnswer: "6", points: 1 },
      { questionText: "Số nào lớn nhất có 1 chữ số?", questionType: "multiple_choice", options: ["A. 8", "B. 9", "C. 10", "D. 7"], correctAnswer: "B", points: 1 },
      { questionText: "Khoanh vào số chẵn: 3, 4, 5, 7", questionType: "multiple_choice", options: ["A. 3", "B. 4", "C. 5", "D. 7"], correctAnswer: "B", points: 1 },
    ]
  },
  {
    grade: 1,
    subject: "toan",
    chapter: "chuong-2",
    chapterName: "Phép cộng trong phạm vi 10",
    title: "Kiểm tra Phép cộng trong phạm vi 10",
    description: "Bài kiểm tra kỹ năng tính cộng trong phạm vi 10",
    duration: 25,
    questions: [
      { questionText: "3 + 4 = ?", questionType: "multiple_choice", options: ["A. 6", "B. 7", "C. 8", "D. 5"], correctAnswer: "B", points: 1 },
      { questionText: "5 + 5 = ?", questionType: "fill_blank", options: [], correctAnswer: "10", points: 1 },
      { questionText: "2 + 6 = ?", questionType: "multiple_choice", options: ["A. 7", "B. 9", "C. 8", "D. 6"], correctAnswer: "C", points: 1 },
      { questionText: "1 + 8 = ?", questionType: "fill_blank", options: [], correctAnswer: "9", points: 1 },
      { questionText: "4 + ... = 7. Số cần điền là?", questionType: "fill_blank", options: [], correctAnswer: "3", points: 1 },
      { questionText: "0 + 6 = ?", questionType: "multiple_choice", options: ["A. 0", "B. 6", "C. 60", "D. 5"], correctAnswer: "B", points: 1 },
      { questionText: "Lan có 3 cái kẹo, mẹ cho thêm 4 cái kẹo. Hỏi Lan có tất cả mấy cái kẹo?", questionType: "multiple_choice", options: ["A. 6 cái", "B. 7 cái", "C. 8 cái", "D. 4 cái"], correctAnswer: "B", points: 1 },
      { questionText: "7 + 3 = ?", questionType: "fill_blank", options: [], correctAnswer: "10", points: 1 },
      { questionText: "Có 2 con mèo và 5 con chó. Hỏi có tất cả mấy con vật?", questionType: "fill_blank", options: [], correctAnswer: "7", points: 1 },
      { questionText: "... + 5 = 10. Số cần điền là?", questionType: "fill_blank", options: [], correctAnswer: "5", points: 1 },
    ]
  },
  {
    grade: 1,
    subject: "toan",
    chapter: "chuong-3",
    chapterName: "Phép trừ trong phạm vi 10",
    title: "Kiểm tra Phép trừ trong phạm vi 10",
    description: "Bài kiểm tra kỹ năng tính trừ trong phạm vi 10",
    duration: 25,
    questions: [
      { questionText: "7 - 3 = ?", questionType: "multiple_choice", options: ["A. 3", "B. 5", "C. 4", "D. 6"], correctAnswer: "C", points: 1 },
      { questionText: "10 - 4 = ?", questionType: "fill_blank", options: [], correctAnswer: "6", points: 1 },
      { questionText: "8 - 8 = ?", questionType: "multiple_choice", options: ["A. 8", "B. 1", "C. 0", "D. 16"], correctAnswer: "C", points: 1 },
      { questionText: "9 - 5 = ?", questionType: "fill_blank", options: [], correctAnswer: "4", points: 1 },
      { questionText: "6 - ... = 2. Số cần điền là?", questionType: "fill_blank", options: [], correctAnswer: "4", points: 1 },
      { questionText: "Hàng có 8 quả táo, ăn mất 3 quả. Còn lại mấy quả táo?", questionType: "multiple_choice", options: ["A. 4 quả", "B. 5 quả", "C. 6 quả", "D. 3 quả"], correctAnswer: "B", points: 1 },
      { questionText: "10 - 7 = ?", questionType: "fill_blank", options: [], correctAnswer: "3", points: 1 },
      { questionText: "5 - 0 = ?", questionType: "multiple_choice", options: ["A. 0", "B. 5", "C. 50", "D. 4"], correctAnswer: "B", points: 1 },
      { questionText: "... - 3 = 4. Số cần điền là?", questionType: "fill_blank", options: [], correctAnswer: "7", points: 1 },
      { questionText: "10 - 10 = ?", questionType: "fill_blank", options: [], correctAnswer: "0", points: 1 },
    ]
  },
  {
    grade: 1,
    subject: "toan",
    chapter: "chuong-4",
    chapterName: "Các số đến 20",
    title: "Kiểm tra Các số đến 20",
    description: "Bài kiểm tra kiến thức về các số từ 10 đến 20",
    duration: 20,
    questions: [
      { questionText: "Số mười lăm viết là:", questionType: "multiple_choice", options: ["A. 51", "B. 15", "C. 14", "D. 16"], correctAnswer: "B", points: 1 },
      { questionText: "Số 17 gồm mấy chục và mấy đơn vị?", questionType: "multiple_choice", options: ["A. 1 chục và 7 đơn vị", "B. 7 chục và 1 đơn vị", "C. 1 chục và 7 đơn vị", "D. 17 chục"], correctAnswer: "A", points: 1 },
      { questionText: "Số nào lớn hơn: 13 hay 16?", questionType: "fill_blank", options: [], correctAnswer: "16", points: 1 },
      { questionText: "Viết các số từ 11 đến 15:", questionType: "fill_blank", options: [], correctAnswer: "11 12 13 14 15", points: 1 },
      { questionText: "Số liền sau số 19 là:", questionType: "fill_blank", options: [], correctAnswer: "20", points: 1 },
      { questionText: "Số liền trước số 14 là:", questionType: "fill_blank", options: [], correctAnswer: "13", points: 1 },
      { questionText: "12 + 5 = ?", questionType: "multiple_choice", options: ["A. 15", "B. 17", "C. 18", "D. 16"], correctAnswer: "B", points: 1 },
      { questionText: "18 - 3 = ?", questionType: "fill_blank", options: [], correctAnswer: "15", points: 1 },
      { questionText: "Số nào nằm giữa 14 và 16?", questionType: "fill_blank", options: [], correctAnswer: "15", points: 1 },
      { questionText: "Số 20 gồm mấy chục?", questionType: "multiple_choice", options: ["A. 1 chục", "B. 2 chục", "C. 20 chục", "D. 0 chục"], correctAnswer: "B", points: 1 },
    ]
  },
  // ===== LỚP 1 - NGỮ VĂN =====
  {
    grade: 1,
    subject: "ngu-van",
    chapter: "chuong-1",
    chapterName: "Tập đọc - Các chữ cái",
    title: "Kiểm tra Tập đọc chữ cái",
    description: "Bài kiểm tra nhận biết các chữ cái tiếng Việt",
    duration: 20,
    questions: [
      { questionText: "Chữ nào đứng sau chữ 'b' trong bảng chữ cái?", questionType: "multiple_choice", options: ["A. a", "B. c", "C. d", "D. e"], correctAnswer: "B", points: 1 },
      { questionText: "Chữ 'm' đọc là gì?", questionType: "multiple_choice", options: ["A. Mờ", "B. Nờ", "C. Lờ", "D. Pờ"], correctAnswer: "A", points: 1 },
      { questionText: "Điền chữ còn thiếu: b... ng... t", questionType: "fill_blank", options: [], correctAnswer: "a", points: 1 },
      { questionText: "Chữ cái nào khác với các chữ còn lại: a, ă, â, b?", questionType: "multiple_choice", options: ["A. a", "B. ă", "C. â", "D. b"], correctAnswer: "D", points: 1 },
      { questionText: "Có mấy chữ cái trong từ 'ba'?", questionType: "fill_blank", options: [], correctAnswer: "2", points: 1 },
      { questionText: "Chữ 'o' là nguyên âm hay phụ âm?", questionType: "multiple_choice", options: ["A. Phụ âm", "B. Nguyên âm", "C. Cả hai", "D. Không phải"], correctAnswer: "B", points: 1 },
      { questionText: "Sắp xếp các chữ: a, c, b theo thứ tự bảng chữ cái:", questionType: "fill_blank", options: [], correctAnswer: "a b c", points: 1 },
      { questionText: "Chữ nào đứng trước chữ 'g'?", questionType: "fill_blank", options: [], correctAnswer: "f", points: 1 },
    ]
  },
  {
    grade: 1,
    subject: "ngu-van",
    chapter: "chuong-2",
    chapterName: "Vần và tiếng",
    title: "Kiểm tra Vần và tiếng",
    description: "Bài kiểm tra nhận biết vần và tiếng",
    duration: 20,
    questions: [
      { questionText: "Từ nào có vần 'an'?", questionType: "multiple_choice", options: ["A. Bàn", "B. Bạn", "C. Bàn và Bạn", "D. Bún"], correctAnswer: "C", points: 1 },
      { questionText: "Điền vần thích hợp: c... + an = ...?", questionType: "fill_blank", options: [], correctAnswer: "can", points: 1 },
      { questionText: "Từ 'mẹ' có mấy tiếng?", questionType: "fill_blank", options: [], correctAnswer: "1", points: 1 },
      { questionText: "Từ nào có vần 'ang'?", questionType: "multiple_choice", options: ["A. Càng", "B. Cần", "C. Cầm", "D. Cầm"], correctAnswer: "A", points: 1 },
      { questionText: "Tìm từ có vần 'ăm':", questionType: "multiple_choice", options: ["A. Căm", "B. Cam", "C. Càm", "D. Cầm"], correctAnswer: "A", points: 1 },
      { questionText: "Từ 'bàn ghế' có mấy tiếng?", questionType: "fill_blank", options: [], correctAnswer: "2", points: 1 },
      { questionText: "Điền vần: m... + ang = ...?", questionType: "fill_blank", options: [], correctAnswer: "mang", points: 1 },
      { questionText: "Từ nào có vần 'ôn'?", questionType: "multiple_choice", options: ["A. Con", "B. Còn", "C. Côn", "D. Còn và Côn"], correctAnswer: "D", points: 1 },
    ]
  },
  {
    grade: 1,
    subject: "ngu-van",
    chapter: "chuong-3",
    chapterName: "Tập viết và làm câu",
    title: "Kiểm tra Tập viết và làm câu",
    description: "Bài kiểm tra kỹ năng viết và tạo câu đơn giản",
    duration: 20,
    questions: [
      { questionText: "Câu nào viết đúng chính tả?", questionType: "multiple_choice", options: ["A. Con mèo đang ngủ.", "B. con mèo đang ngủ.", "C. Con Mèo đang ngủ.", "D. con Mèo đang Ngủ."], correctAnswer: "A", points: 1 },
      { questionText: "Chữ nào phải viết hoa trong câu: 'hà nội là thủ đô'?", questionType: "fill_blank", options: [], correctAnswer: "H", points: 1 },
      { questionText: "Dấu chấm đặt ở đâu trong câu?", questionType: "multiple_choice", options: ["A. Đầu câu", "B. Giữa câu", "C. Cuối câu", "D. Trước từ"], correctAnswer: "C", points: 1 },
      { questionText: "Viết lại cho đúng: 'bạn tên là gì'", questionType: "fill_blank", options: [], correctAnswer: "Bạn tên là gì?", points: 1 },
      { questionText: "Từ chỉ người trong câu: 'Mẹ đi chợ' là:", questionType: "multiple_choice", options: ["A. Mẹ", "B. Đi", "C. Chợ", "D. Mẹ đi"], correctAnswer: "A", points: 1 },
      { questionText: "Từ chỉ hoạt động trong câu: 'Em đi học' là:", questionType: "multiple_choice", options: ["A. Em", "B. Đi học", "C. Học", "D. Đi"], correctAnswer: "B", points: 1 },
      { questionText: "Đặt câu với từ 'bạn':", questionType: "fill_blank", options: [], correctAnswer: "Bạn tôi rất ngoan.", points: 1 },
      { questionText: "Câu hỏi kết thúc bằng dấu gì?", questionType: "multiple_choice", options: ["A. Dấu chấm", "B. Dấu chấm than", "C. Dấu chấm hỏi", "D. Dấu phẩy"], correctAnswer: "C", points: 1 },
    ]
  },

  // ===== LỚP 2 - TOÁN =====
  {
    grade: 2,
    subject: "toan",
    chapter: "chuong-1",
    chapterName: "Các số đến 100",
    title: "Kiểm tra Các số đến 100",
    description: "Bài kiểm tra kiến thức về các số trong phạm vi 100",
    duration: 25,
    questions: [
      { questionText: "Số 56 gồm mấy chục và mấy đơn vị?", questionType: "multiple_choice", options: ["A. 5 chục và 6 đơn vị", "B. 6 chục và 5 đơn vị", "C. 56 chục", "D. 50 chục và 6 đơn vị"], correctAnswer: "A", points: 1 },
      { questionText: "Số liền sau số 99 là:", questionType: "fill_blank", options: [], correctAnswer: "100", points: 1 },
      { questionText: "Số lớn nhất có 2 chữ số là:", questionType: "multiple_choice", options: ["A. 90", "B. 99", "C. 100", "D. 89"], correctAnswer: "B", points: 1 },
      { questionText: "Viết số từ nhỏ đến lớn: 45, 23, 67, 12", questionType: "fill_blank", options: [], correctAnswer: "12 23 45 67", points: 1 },
      { questionText: "So sánh: 45 ... 54", questionType: "multiple_choice", options: ["A. > ", "B. <", "C. =", "D. Không so sánh được"], correctAnswer: "B", points: 1 },
      { questionText: "Số 70 gồm mấy chục?", questionType: "fill_blank", options: [], correctAnswer: "7", points: 1 },
      { questionText: "Số nào nằm giữa 34 và 36?", questionType: "fill_blank", options: [], correctAnswer: "35", points: 1 },
      { questionText: "40 + 30 = ?", questionType: "multiple_choice", options: ["A. 60", "B. 70", "C. 80", "D. 43"], correctAnswer: "B", points: 1 },
      { questionText: "85 - 5 = ?", questionType: "fill_blank", options: [], correctAnswer: "80", points: 1 },
      { questionText: "Đếm thêm 5: 25, 30, ..., 40", questionType: "fill_blank", options: [], correctAnswer: "35", points: 1 },
    ]
  },
  {
    grade: 2,
    subject: "toan",
    chapter: "chuong-2",
    chapterName: "Phép cộng trừ trong phạm vi 100",
    title: "Kiểm tra Phép cộng trừ phạm vi 100",
    description: "Bài kiểm tra kỹ năng cộng trừ các số trong phạm vi 100",
    duration: 30,
    questions: [
      { questionText: "36 + 24 = ?", questionType: "multiple_choice", options: ["A. 50", "B. 60", "C. 70", "D. 56"], correctAnswer: "B", points: 1 },
      { questionText: "82 - 37 = ?", questionType: "fill_blank", options: [], correctAnswer: "45", points: 1 },
      { questionText: "47 + 28 = ?", questionType: "multiple_choice", options: ["A. 65", "B. 75", "C. 85", "D. 74"], correctAnswer: "B", points: 1 },
      { questionText: "100 - 46 = ?", questionType: "fill_blank", options: [], correctAnswer: "54", points: 1 },
      { questionText: "Tìm x: x + 35 = 72", questionType: "fill_blank", options: [], correctAnswer: "37", points: 1 },
      { questionText: "Tìm x: 91 - x = 48", questionType: "fill_blank", options: [], correctAnswer: "43", points: 1 },
      { questionText: "Lớp 2A có 35 học sinh, lớp 2B có 32 học sinh. Hỏi cả hai lớp có bao nhiêu học sinh?", questionType: "multiple_choice", options: ["A. 65 học sinh", "B. 67 học sinh", "C. 77 học sinh", "D. 63 học sinh"], correctAnswer: "B", points: 1 },
      { questionText: "53 + 19 = ?", questionType: "fill_blank", options: [], correctAnswer: "72", points: 1 },
      { questionText: "Cửa hàng có 85 kg gạo, bán đi 47 kg. Hỏi còn lại bao nhiêu kg gạo?", questionType: "fill_blank", options: [], correctAnswer: "38", points: 1 },
      { questionText: "64 - 28 = ?", questionType: "multiple_choice", options: ["A. 36", "B. 46", "C. 26", "D. 34"], correctAnswer: "A", points: 1 },
    ]
  },
  {
    grade: 2,
    subject: "toan",
    chapter: "chuong-3",
    chapterName: "Phép nhân và bảng nhân",
    title: "Kiểm tra Phép nhân",
    description: "Bài kiểm tra kiến thức về phép nhân và bảng nhân",
    duration: 25,
    questions: [
      { questionText: "2 × 5 = ?", questionType: "multiple_choice", options: ["A. 7", "B. 10", "C. 8", "D. 12"], correctAnswer: "B", points: 1 },
      { questionText: "3 × 4 = ?", questionType: "fill_blank", options: [], correctAnswer: "12", points: 1 },
      { questionText: "5 × 5 = ?", questionType: "multiple_choice", options: ["A. 20", "B. 30", "C. 25", "D. 15"], correctAnswer: "C", points: 1 },
      { questionText: "4 × 6 = ?", questionType: "fill_blank", options: [], correctAnswer: "24", points: 1 },
      { questionText: "Mỗi hàng có 5 cái kẹo, có 3 hàng. Hỏi có tất cả mấy cái kẹo?", questionType: "multiple_choice", options: ["A. 8 cái", "B. 15 cái", "C. 10 cái", "D. 20 cái"], correctAnswer: "B", points: 1 },
      { questionText: "2 × 7 = ?", questionType: "fill_blank", options: [], correctAnswer: "14", points: 1 },
      { questionText: "5 × ... = 35. Số cần điền là?", questionType: "fill_blank", options: [], correctAnswer: "7", points: 1 },
      { questionText: "3 × 3 = ?", questionType: "multiple_choice", options: ["A. 6", "B. 9", "C. 12", "D. 8"], correctAnswer: "B", points: 1 },
      { questionText: "4 × 5 + 3 = ?", questionType: "fill_blank", options: [], correctAnswer: "23", points: 1 },
      { questionText: "Nhân số nào với 2 thì bằng 16?", questionType: "fill_blank", options: [], correctAnswer: "8", points: 1 },
    ]
  },
  // ===== LỚP 2 - NGỮ VĂN =====
  {
    grade: 2,
    subject: "ngu-van",
    chapter: "chuong-1",
    chapterName: "Tập đọc và hiểu",
    title: "Kiểm tra Tập đọc hiểu",
    description: "Bài kiểm tra kỹ năng đọc và hiểu văn bản",
    duration: 25,
    questions: [
      { questionText: "Trong câu 'Con mèo đang ngủ trên ghế', từ chỉ sự vật là:", questionType: "multiple_choice", options: ["A. đang", "B. ngủ", "C. mèo, ghế", "D. trên"], correctAnswer: "C", points: 1 },
      { questionText: "Từ trái nghĩa với 'cao' là:", questionType: "fill_blank", options: [], correctAnswer: "thấp", points: 1 },
      { questionText: "Từ đồng nghĩa với 'đẹp' là:", questionType: "multiple_choice", options: ["A. Xấu", "B. Xinh", "C. To", "D. Nhỏ"], correctAnswer: "B", points: 1 },
      { questionText: "Câu nào là câu hỏi?", questionType: "multiple_choice", options: ["A. Hôm nay trời nắng.", "B. Bạn đi học chứ?", "C. Chào cô giáo!", "D. Mẹ yêu lắm."], correctAnswer: "B", points: 1 },
      { questionText: "Từ 'hoa hồng' thuộc nhóm từ nào?", questionType: "multiple_choice", options: ["A. Đồ vật", "B. Động vật", "C. Thực vật", "D. Con người"], correctAnswer: "C", points: 1 },
      { questionText: "Đặt câu hỏi với từ 'khi nào':", questionType: "fill_blank", options: [], correctAnswer: "Khi nào bạn đi học?", points: 1 },
      { questionText: "Dấu phẩy dùng để làm gì?", questionType: "multiple_choice", options: ["A. Kết thúc câu", "B. Ngắt nghỉ ngắn trong câu", "C. Hỏi câu", "D. Bày tỏ cảm xúc"], correctAnswer: "B", points: 1 },
      { questionText: "Từ nào chỉ hoạt động: 'bé ăn cơm'?", questionType: "fill_blank", options: [], correctAnswer: "ăn", points: 1 },
    ]
  },
  {
    grade: 2,
    subject: "ngu-van",
    chapter: "chuong-2",
    chapterName: "Chính tả và Luyện từ",
    title: "Kiểm tra Chính tả và Luyện từ",
    description: "Bài kiểm tra chính tả và luyện từ và câu",
    duration: 25,
    questions: [
      { questionText: "Từ nào viết đúng chính tả?", questionType: "multiple_choice", options: ["A. Ngon lành", "B. Ngon lành", "C. Ngon lành", "D. Ngon lảnh"], correctAnswer: "B", points: 1 },
      { questionText: "Điền 'ch' hay 'tr': ...ời nở", questionType: "fill_blank", options: [], correctAnswer: "tr", points: 1 },
      { questionText: "Điền 's' hay 'x': ...uống nước", questionType: "fill_blank", options: [], correctAnswer: "x", points: 1 },
      { questionText: "Từ nào sai chính tả?", questionType: "multiple_choice", options: ["A. Sáng sủa", "B. Xinh đẹp", "C. Trống vắng", "D. Chười cợt"], correctAnswer: "D", points: 1 },
      { questionText: "Tìm từ chứa tiếng có vần 'oai':", questionType: "multiple_choice", options: ["A. Quạt", "B. Gioi", "C. Khoai", "D. Loa"], correctAnswer: "C", points: 1 },
      { questionText: "Điền 'g' hay 'gh': ...ế gỗ", questionType: "fill_blank", options: [], correctAnswer: "gh", points: 1 },
      { questionText: "Từ nào có tiếng chứa vần 'ương'?", questionType: "multiple_choice", options: ["A. Sương", "B. Sóng", "C. Sông", "D. Son"], correctAnswer: "A", points: 1 },
      { questionText: "Điền dấu hỏi hay dấu ngã: Bạn c...", questionType: "fill_blank", options: [], correctAnswer: "ũ", points: 1 },
    ]
  },

  // ===== LỚP 3 - TOÁN =====
  {
    grade: 3,
    subject: "toan",
    chapter: "chuong-1",
    chapterName: "Phép cộng trừ trong phạm vi 1000",
    title: "Kiểm tra Phép cộng trừ phạm vi 1000",
    description: "Bài kiểm tra kỹ năng cộng trừ các số trong phạm vi 1000",
    duration: 30,
    questions: [
      { questionText: "345 + 278 = ?", questionType: "multiple_choice", options: ["A. 623", "B. 523", "C. 613", "D. 723"], correctAnswer: "A", points: 1 },
      { questionText: "812 - 456 = ?", questionType: "fill_blank", options: [], correctAnswer: "356", points: 1 },
      { questionText: "Tìm x: x + 234 = 567", questionType: "fill_blank", options: [], correctAnswer: "333", points: 1 },
      { questionText: "500 + 300 = ?", questionType: "multiple_choice", options: ["A. 700", "B. 800", "C. 900", "D. 600"], correctAnswer: "B", points: 1 },
      { questionText: "999 - 456 = ?", questionType: "fill_blank", options: [], correctAnswer: "543", points: 1 },
      { questionText: "456 + 234 + 100 = ?", questionType: "multiple_choice", options: ["A. 790", "B. 890", "C. 780", "D. 800"], correctAnswer: "A", points: 1 },
      { questionText: "Cửa hàng có 525 kg gạo, bán đi 237 kg. Hỏi còn lại bao nhiêu kg gạo?", questionType: "fill_blank", options: [], correctAnswer: "288", points: 1 },
      { questionText: "Số lớn nhất có 3 chữ số là:", questionType: "fill_blank", options: [], correctAnswer: "999", points: 1 },
      { questionText: "678 + ... = 900. Số cần điền là?", questionType: "fill_blank", options: [], correctAnswer: "222", points: 1 },
      { questionText: "1000 - 357 = ?", questionType: "multiple_choice", options: ["A. 743", "B. 643", "C. 653", "D. 753"], correctAnswer: "B", points: 1 },
    ]
  },
  {
    grade: 3,
    subject: "toan",
    chapter: "chuong-2",
    chapterName: "Phép nhân",
    title: "Kiểm tra Phép nhân",
    description: "Bài kiểm tra kỹ năng nhân các số",
    duration: 30,
    questions: [
      { questionText: "23 × 4 = ?", questionType: "multiple_choice", options: ["A. 82", "B. 92", "C. 86", "D. 96"], correctAnswer: "B", points: 1 },
      { questionText: "15 × 5 = ?", questionType: "fill_blank", options: [], correctAnswer: "75", points: 1 },
      { questionText: "Mỗi túi có 12 cái kẹo, có 6 túi. Hỏi có tất cả mấy cái kẹo?", questionType: "multiple_choice", options: ["A. 60 cái", "B. 72 cái", "C. 78 cái", "D. 66 cái"], correctAnswer: "B", points: 1 },
      { questionText: "125 × 3 = ?", questionType: "fill_blank", options: [], correctAnswer: "375", points: 1 },
      { questionText: "Nhân số nào với 7 thì bằng 56?", questionType: "fill_blank", options: [], correctAnswer: "8", points: 1 },
      { questionText: "24 × 5 = ?", questionType: "multiple_choice", options: ["A. 100", "B. 110", "C. 120", "D. 130"], correctAnswer: "C", points: 1 },
      { questionText: "32 × 3 + 15 = ?", questionType: "fill_blank", options: [], correctAnswer: "111", points: 1 },
      { questionText: "Một lớp có 35 học sinh, mỗi học sinh được phát 4 quyển vở. Hỏi cần bao nhiêu quyển vở?", questionType: "fill_blank", options: [], correctAnswer: "140", points: 1 },
      { questionText: "0 × 123 = ?", questionType: "multiple_choice", options: ["A. 123", "B. 0", "C. 1", "D. 12"], correctAnswer: "B", points: 1 },
      { questionText: "45 × 2 = ?", questionType: "fill_blank", options: [], correctAnswer: "90", points: 1 },
    ]
  },
  {
    grade: 3,
    subject: "toan",
    chapter: "chuong-3",
    chapterName: "Phép chia",
    title: "Kiểm tra Phép chia",
    description: "Bài kiểm tra kỹ năng chia các số",
    duration: 30,
    questions: [
      { questionText: "36 ÷ 4 = ?", questionType: "multiple_choice", options: ["A. 8", "B. 9", "C. 7", "D. 6"], correctAnswer: "B", points: 1 },
      { questionText: "45 ÷ 5 = ?", questionType: "fill_blank", options: [], correctAnswer: "9", points: 1 },
      { questionText: "Có 24 cái kẹo chia đều cho 6 bạn. Mỗi bạn được mấy cái kẹo?", questionType: "multiple_choice", options: ["A. 3 cái", "B. 4 cái", "C. 5 cái", "D. 6 cái"], correctAnswer: "B", points: 1 },
      { questionText: "72 ÷ 8 = ?", questionType: "fill_blank", options: [], correctAnswer: "9", points: 1 },
      { questionText: "56 ÷ 7 = ?", questionType: "fill_blank", options: [], correctAnswer: "8", points: 1 },
      { questionText: "100 ÷ 10 = ?", questionType: "multiple_choice", options: ["A. 5", "B. 10", "C. 15", "D. 20"], correctAnswer: "B", points: 1 },
      { questionText: "48 ÷ 6 = ?", questionType: "fill_blank", options: [], correctAnswer: "8", points: 1 },
      { questionText: "Có 35 quyển sách xếp đều vào 7 ngăn. Mỗi ngăn có mấy quyển sách?", questionType: "fill_blank", options: [], correctAnswer: "5", points: 1 },
      { questionText: "81 ÷ 9 = ?", questionType: "fill_blank", options: [], correctAnswer: "9", points: 1 },
      { questionText: "64 ÷ 8 = ?", questionType: "multiple_choice", options: ["A. 7", "B. 9", "C. 8", "D. 6"], correctAnswer: "C", points: 1 },
    ]
  },
  // ===== LỚP 3 - NGỮ VĂN =====
  {
    grade: 3,
    subject: "ngu-van",
    chapter: "chuong-1",
    chapterName: "Đọc hiểu văn bản",
    title: "Kiểm tra Đọc hiểu",
    description: "Bài kiểm tra kỹ năng đọc hiểu văn bản",
    duration: 30,
    questions: [
      { questionText: "'Bầu trời mùa thu xanh высоко' - Câu này tả điều gì?", questionType: "multiple_choice", options: ["A. Tả cây", "B. Tả bầu trời", "C. Tả nước", "D. Tả đất"], correctAnswer: "B", points: 1 },
      { questionText: "Từ 'rực rỡ' có nghĩa là:", questionType: "multiple_choice", options: ["A. Tối tăm", "B. Tỏa sáng lung linh", "C. Nhỏ bé", "D. Buồn bã"], correctAnswer: "B", points: 1 },
      { questionText: "Câu kể là câu dùng để:", questionType: "multiple_choice", options: ["A. Hỏi", "B. Kể, thông báo điều gì", "C. Kêu gọi", "D. Bày tỏ cảm xúc"], correctAnswer: "B", points: 1 },
      { questionText: "Từ chỉ đặc điểm trong câu 'Bông hoa hồng rất đẹp' là:", questionType: "fill_blank", options: [], correctAnswer: "đẹp", points: 1 },
      { questionText: "Từ trái nghĩa với 'buồn' là:", questionType: "fill_blank", options: [], correctAnswer: "vui", points: 1 },
      { questionText: "Trong câu 'Mẹ nấu cơm rất ngon', từ chỉ hoạt động là:", questionType: "multiple_choice", options: ["A. Mẹ", "B. Nấu", "C. Cơm", "D. Ngon"], correctAnswer: "B", points: 1 },
      { questionText: "Câu cảm thán kết thúc bằng dấu gì?", questionType: "multiple_choice", options: ["A. Dấu chấm", "B. Dấu hỏi", "C. Dấu chấm than", "D. Dấu phẩy"], correctAnswer: "C", points: 1 },
      { questionText: "Từ đồng nghĩa với 'xinh đẹp' là:", questionType: "fill_blank", options: [], correctAnswer: "đẹp đẽ", points: 1 },
    ]
  },
  {
    grade: 3,
    subject: "ngu-van",
    chapter: "chuong-2",
    chapterName: "Luyện từ và câu",
    title: "Kiểm tra Luyện từ và câu",
    description: "Bài kiểm tra kỹ năng luyện từ và đặt câu",
    duration: 25,
    questions: [
      { questionText: "Danh từ là từ chỉ:", questionType: "multiple_choice", options: ["A. Hoạt động", "B. Đặc điểm", "C. Sự vật, hiện tượng", "D. Số lượng"], correctAnswer: "C", points: 1 },
      { questionText: "Động từ là từ chỉ:", questionType: "fill_blank", options: [], correctAnswer: "hoạt động", points: 1 },
      { questionText: "Tính từ là từ chỉ:", questionType: "multiple_choice", options: ["A. Sự vật", "B. Hoạt động", "C. Đặc điểm, tính chất", "D. Số lượng"], correctAnswer: "C", points: 1 },
      { questionText: "Trong câu 'Chiếc áo đỏ rất đẹp', từ 'đỏ' là:", questionType: "multiple_choice", options: ["A. Danh từ", "B. Động từ", "C. Tính từ", "D. Đại từ"], correctAnswer: "C", points: 1 },
      { questionText: "Mở rộng câu: 'Em đi học.' bằng cách thêm từ chỉ thời gian:", questionType: "fill_blank", options: [], correctAnswer: "Sáng nay em đi học.", points: 1 },
      { questionText: "Câu 'Muaڻ hoa nở trong vườn.' có mấy danh từ?", questionType: "multiple_choice", options: ["A. 1", "B. 2", "C. 3", "D. 4"], correctAnswer: "B", points: 1 },
      { questionText: "Thay từ 'đi' bằng từ ngữ phù hợp: 'Em ___ xe đạp đến trường.'", questionType: "fill_blank", options: [], correctAnswer: "đạp", points: 1 },
      { questionText: "Đại từ xưng hô 'mình' dùng để chỉ:", questionType: "multiple_choice", options: ["A. Người khác", "B. Chính mình", "C. Nhiều người", "D. Vật"], correctAnswer: "B", points: 1 },
    ]
  },

  // ===== LỚP 4 - TOÁN =====
  {
    grade: 4,
    subject: "toan",
    chapter: "chuong-1",
    chapterName: "Các số đến 100000",
    title: "Kiểm tra Các số đến 100000",
    description: "Bài kiểm tra kiến thức về các số trong phạm vi 100000",
    duration: 30,
    questions: [
      { questionText: "Số 24567 đọc là:", questionType: "multiple_choice", options: ["A. Hai mươi bốn nghìn năm trăm sáu mươi bảy", "B. Hai mươi lăm nghìn bốn trăm sáu mươi bảy", "C. Hai mươi tư nghìn năm trăm sáu mươi bảy", "D. Hai mươi bốn nghìn năm trăm sáu mươi bảy"], correctAnswer: "D", points: 1 },
      { questionText: "Viết số: Ba mươi lăm nghìn hai trăm mười hai =", questionType: "fill_blank", options: [], correctAnswer: "35212", points: 1 },
      { questionText: "Giá trị chữ số 5 trong số 45678 là:", questionType: "multiple_choice", options: ["A. 5", "B. 50", "C. 500", "D. 5000"], correctAnswer: "D", points: 1 },
      { questionText: "Số lớn nhất có 5 chữ số là:", questionType: "fill_blank", options: [], correctAnswer: "99999", points: 1 },
      { questionText: "Làm tròn số 4567 đến hàng nghìn:", questionType: "multiple_choice", options: ["A. 4000", "B. 5000", "C. 4500", "D. 4600"], correctAnswer: "B", points: 1 },
      { questionText: "So sánh: 23456 ... 24356", questionType: "fill_blank", options: [], correctAnswer: "<", points: 1 },
      { questionText: "Số liền sau số 9999 là:", questionType: "fill_blank", options: [], correctAnswer: "10000", points: 1 },
      { questionText: "Phân tích số 34567 = ... + ... + ... + ... + ...", questionType: "multiple_choice", options: ["A. 30000 + 4000 + 500 + 60 + 7", "B. 3000 + 400 + 50 + 6 + 7", "C. 30000 + 4000 + 500 + 67", "D. 34000 + 567"], correctAnswer: "A", points: 1 },
      { questionText: "Hàng chục nghìn trong số 67890 có chữ số nào?", questionType: "fill_blank", options: [], correctAnswer: "6", points: 1 },
      { questionText: "Số nhỏ nhất có 5 chữ số khác nhau là:", questionType: "multiple_choice", options: ["A. 10000", "B. 10234", "C. 12345", "D. 11111"], correctAnswer: "B", points: 1 },
    ]
  },
  {
    grade: 4,
    subject: "toan",
    chapter: "chuong-2",
    chapterName: "Phép nhân chia số lớn",
    title: "Kiểm tra Phép nhân chia số lớn",
    description: "Bài kiểm tra kỹ năng nhân chia các số lớn",
    duration: 35,
    questions: [
      { questionText: "234 × 5 = ?", questionType: "multiple_choice", options: ["A. 1070", "B. 1170", "C. 1270", "D. 1175"], correctAnswer: "B", points: 1 },
      { questionText: "4567 × 3 = ?", questionType: "fill_blank", options: [], correctAnswer: "13701", points: 1 },
      { questionText: "896 ÷ 4 = ?", questionType: "fill_blank", options: [], correctAnswer: "224", points: 1 },
      { questionText: "1234 × 6 = ?", questionType: "multiple_choice", options: ["A. 7404", "B. 7304", "C. 7204", "D. 7504"], correctAnswer: "A", points: 1 },
      { questionText: "5678 ÷ 2 = ?", questionType: "fill_blank", options: [], correctAnswer: "2839", points: 1 },
      { questionText: "Một xưởng mỗi ngày sản xuất 345 sản phẩm. Hỏi trong 7 ngày xưởng sản xuất được bao nhiêu sản phẩm?", questionType: "fill_blank", options: [], correctAnswer: "2415", points: 1 },
      { questionText: "3456 ÷ 8 = ?", questionType: "multiple_choice", options: ["A. 432", "B. 422", "C. 442", "D. 412"], correctAnswer: "A", points: 1 },
      { questionText: "Tìm x: x × 4 = 3648", questionType: "fill_blank", options: [], correctAnswer: "912", points: 1 },
      { questionText: "567 × 9 = ?", questionType: "fill_blank", options: [], correctAnswer: "5103", points: 1 },
      { questionText: "Có 4560 quyển sách chia đều cho 8 lớp. Mỗi lớp nhận được bao nhiêu quyển?", questionType: "fill_blank", options: [], correctAnswer: "570", points: 1 },
    ]
  },
  {
    grade: 4,
    subject: "toan",
    chapter: "chuong-3",
    chapterName: "Phân số",
    title: "Kiểm tra Phân số",
    description: "Bài kiểm tra kiến thức về phân số",
    duration: 30,
    questions: [
      { questionText: "Phân số 3/4 có tử số là bao nhiêu?", questionType: "multiple_choice", options: ["A. 3", "B. 4", "C. 7", "D. 1"], correctAnswer: "A", points: 1 },
      { questionText: "Phân số 5/5 bằng bao nhiêu?", questionType: "fill_blank", options: [], correctAnswer: "1", points: 1 },
      { questionText: "So sánh: 2/3 ... 3/4", questionType: "multiple_choice", options: ["A. >", "B. <", "C. =", "D. Không so sánh được"], correctAnswer: "B", points: 1 },
      { questionText: "Rút gọn phân số 6/8:", questionType: "fill_blank", options: [], correctAnswer: "3/4", points: 1 },
      { questionText: "1/2 + 1/4 = ?", questionType: "multiple_choice", options: ["A. 2/6", "B. 3/4", "C. 1/3", "D. 2/4"], correctAnswer: "B", points: 1 },
      { questionText: "3/5 - 1/5 = ?", questionType: "fill_blank", options: [], correctAnswer: "2/5", points: 1 },
      { questionText: "Phân số nào lớn hơn: 2/5 hay 3/5?", questionType: "fill_blank", options: [], correctAnswer: "3/5", points: 1 },
      { questionText: "Quy đồng mẫu số: 1/3 và 1/4. Mẫu số chung là:", questionType: "multiple_choice", options: ["A. 7", "B. 12", "C. 3", "D. 4"], correctAnswer: "B", points: 1 },
      { questionText: "2/3 của 12 bằng bao nhiêu?", questionType: "fill_blank", options: [], correctAnswer: "8", points: 1 },
      { questionText: "Viết phân số chỉ phần bị tô màu của hình vuông chia thành 4 phần bằng nhau, tô màu 3 phần:", questionType: "fill_blank", options: [], correctAnswer: "3/4", points: 1 },
    ]
  },
  // ===== LỚP 4 - NGỮ VĂN =====
  {
    grade: 4,
    subject: "ngu-van",
    chapter: "chuong-1",
    chapterName: "Đọc hiểu văn bản kể chuyện",
    title: "Kiểm tra Đọc hiểu - Kể chuyện",
    description: "Bài kiểm tra kỹ năng đọc hiểu văn bản kể chuyện",
    duration: 30,
    questions: [
      { questionText: "Nhân vật chính trong truyện là:", questionType: "multiple_choice", options: ["A. Người kể chuyện", "B. Người quan trọng nhất trong truyện", "C. Tác giả", "D. Người đọc"], correctAnswer: "B", points: 1 },
      { questionText: "Yếu tố nào không thuộc cấu trúc câu chuyện?", questionType: "multiple_choice", options: ["A. Mở bài", "B. Thân bài", "C. Kết bài", "D. Lời tựa"], correctAnswer: "D", points: 1 },
      { questionText: "Từ 'dũng cảm' có nghĩa là:", questionType: "fill_blank", options: [], correctAnswer: "có lòng can đảm không sợ hãi", points: 1 },
      { questionText: "Câu ghép là câu có:", questionType: "multiple_choice", options: ["A. Một chủ ngữ", "B. Hai hay nhiều chủ ngữ - vị ngữ", "C. Không có chủ ngữ", "D. Chỉ có vị ngữ"], correctAnswer: "B", points: 1 },
      { questionText: "Nối hai câu đơn thành câu ghép: 'Trời mưa. Chúng tôi ở nhà.'", questionType: "fill_blank", options: [], correctAnswer: "Trời mưa nên chúng tôi ở nhà.", points: 1 },
      { questionText: "Tác giả của truyện kể thường kể ở ngôi thứ mấy?", questionType: "multiple_choice", options: ["A. Ngôi thứ nhất", "B. Ngôi thứ ba", "C. Cả A và B đều đúng", "D. Không có ngôi"], correctAnswer: "C", points: 1 },
      { questionText: "Nội dung chính của đoạn văn là:", questionType: "multiple_choice", options: ["A. Ý quan trọng nhất được nói đến", "B. Chi tiết phụ", "C. Tên truyện", "D. Tên tác giả"], correctAnswer: "A", points: 1 },
      { questionText: "Từ 'hăng hái' trái nghĩa với:", questionType: "fill_blank", options: [], correctAnswer: "lười biếng", points: 1 },
    ]
  },
  {
    grade: 4,
    subject: "ngu-van",
    chapter: "chuong-2",
    chapterName: "Luyện từ và câu - Câu ghép",
    title: "Kiểm tra Luyện từ và câu - Câu ghép",
    description: "Bài kiểm tra kiến thức về câu ghép và luyện từ",
    duration: 25,
    questions: [
      { questionText: "Câu nào là câu ghép?", questionType: "multiple_choice", options: ["A. Em đi học.", "B. Mẹ nấu cơm và em đi học.", "C. Hôm nay trời đẹp!", "D. Bạn tên là gì?"], correctAnswer: "B", points: 1 },
      { questionText: "Trong câu 'Trời mưa nên em ở nhà', từ 'nên' là:", questionType: "multiple_choice", options: ["A. Danh từ", "B. Động từ", "C. Quan hệ từ", "D. Tính từ"], correctAnswer: "C", points: 1 },
      { questionText: "Quan hệ từ 'vì' chỉ mối quan hệ:", questionType: "multiple_choice", options: ["A. Nguyên nhân - kết quả", "B. Tương phản", "C. Tiếp nối", "D. Điều kiện"], correctAnswer: "A", points: 1 },
      { questionText: "Thêm quan hệ từ vào: 'Em học chăm ... được điểm cao'", questionType: "fill_blank", options: [], correctAnswer: "nên", points: 1 },
      { questionText: "Từ 'nhưng' chỉ mối quan hệ:", questionType: "multiple_choice", options: ["A. Nguyên nhân", "B. Tương phản", "C. Tiếp nối", "D. Điều kiện"], correctAnswer: "B", points: 1 },
      { questionText: "Tách câu ghép thành 2 câu đơn: 'Nam học giỏi còn Lan học khá'", questionType: "fill_blank", options: [], correctAnswer: "Nam học giỏi. Lan học khá.", points: 1 },
      { questionText: "Đại từ dùng để thay thế danh từ nhằm:", questionType: "multiple_choice", options: ["A. Làm câu dài hơn", "B. Tránh lặp từ", "C. Thêm chi tiết", "D. Đổi chủ ngữ"], correctAnswer: "B", points: 1 },
      { questionText: "Điền quan hệ từ: 'Trời nắng ... em vẫn mang ô'", questionType: "fill_blank", options: [], correctAnswer: "nhưng", points: 1 },
    ]
  },

  // ===== LỚP 5 - TOÁN =====
  {
    grade: 5,
    subject: "toan",
    chapter: "chuong-1",
    chapterName: "Phân số thập phân và số thập phân",
    title: "Kiểm tra Phân số thập phân và số thập phân",
    description: "Bài kiểm tra kiến thức về phân số thập phân và số thập phân",
    duration: 30,
    questions: [
      { questionText: "Viết 3/10 dưới dạng số thập phân:", questionType: "multiple_choice", options: ["A. 0,03", "B. 0,3", "C. 3,0", "D. 0,13"], correctAnswer: "B", points: 1 },
      { questionText: "Viết 25/100 dưới dạng số thập phân:", questionType: "fill_blank", options: [], correctAnswer: "0,25", points: 1 },
      { questionText: "Số 4,56 đọc là:", questionType: "multiple_choice", options: ["A. Bốn phẩy năm mươi sáu", "B. Bốn phẩy năm trăm sáu mươi", "C. Bốn phẩy năm mươi sáu", "D. Bốn mươi phẩy năm sáu"], correctAnswer: "A", points: 1 },
      { questionText: "So sánh: 3,45 ... 3,54", questionType: "fill_blank", options: [], correctAnswer: "<", points: 1 },
      { questionText: "Chữ số 5 trong số 12,56 thuộc hàng nào?", questionType: "multiple_choice", options: ["A. Hàng đơn vị", "B. Hàng phần mười", "C. Hàng phần trăm", "D. Hàng chục"], correctAnswer: "B", points: 1 },
      { questionText: "Viết số thập phân: Không phẩy ba mươi bảy =", questionType: "fill_blank", options: [], correctAnswer: "0,37", points: 1 },
      { questionText: "Làm tròn số 3,46 đến hàng phần mười:", questionType: "multiple_choice", options: ["A. 3,4", "B. 3,5", "C. 3,6", "D. 3,0"], correctAnswer: "B", points: 1 },
      { questionText: "Chuyển 45% thành số thập phân:", questionType: "fill_blank", options: [], correctAnswer: "0,45", points: 1 },
      { questionText: "3,5 = ?/10. Tìm số thích hợp:", questionType: "fill_blank", options: [], correctAnswer: "35", points: 1 },
      { questionText: "Sắp xếp từ nhỏ đến lớn: 2,5; 2,15; 2,51; 2,05", questionType: "fill_blank", options: [], correctAnswer: "2,05 2,15 2,5 2,51", points: 1 },
    ]
  },
  {
    grade: 5,
    subject: "toan",
    chapter: "chuong-2",
    chapterName: "Phép tính với số thập phân",
    title: "Kiểm tra Phép tính với số thập phân",
    description: "Bài kiểm tra kỹ năng tính toán với số thập phân",
    duration: 35,
    questions: [
      { questionText: "3,5 + 2,7 = ?", questionType: "multiple_choice", options: ["A. 5,2", "B. 6,2", "C. 5,12", "D. 6,12"], correctAnswer: "B", points: 1 },
      { questionText: "8,4 - 3,6 = ?", questionType: "fill_blank", options: [], correctAnswer: "4,8", points: 1 },
      { questionText: "2,5 × 4 = ?", questionType: "multiple_choice", options: ["A. 8,5", "B. 10", "C. 9,5", "D. 10,5"], correctAnswer: "B", points: 1 },
      { questionText: "7,2 ÷ 3 = ?", questionType: "fill_blank", options: [], correctAnswer: "2,4", points: 1 },
      { questionText: "12,5 × 0,4 = ?", questionType: "fill_blank", options: [], correctAnswer: "5", points: 1 },
      { questionText: "15,6 ÷ 1,2 = ?", questionType: "multiple_choice", options: ["A. 13", "B. 12", "C. 14", "D. 11"], correctAnswer: "A", points: 1 },
      { questionText: "Tìm x: x + 3,7 = 10,5", questionType: "fill_blank", options: [], correctAnswer: "6,8", points: 1 },
      { questionText: "Một người mua 3,5 kg thịt, mỗi kg giá 120 nghìn đồng. Hỏi người đó phải trả bao nhiêu tiền?", questionType: "fill_blank", options: [], correctAnswer: "420", points: 1 },
      { questionText: "4,5 + 3,25 + 2,25 = ?", questionType: "multiple_choice", options: ["A. 9,5", "B. 10", "C. 9,75", "D. 10,5"], correctAnswer: "B", points: 1 },
      { questionText: "Tìm x: 5 × x = 17,5", questionType: "fill_blank", options: [], correctAnswer: "3,5", points: 1 },
    ]
  },
  {
    grade: 5,
    subject: "toan",
    chapter: "chuong-3",
    chapterName: "Diện tích và thể tích",
    title: "Kiểm tra Diện tích và thể tích",
    description: "Bài kiểm tra kiến thức về diện tích và thể tích",
    duration: 30,
    questions: [
      { questionText: "Diện tích hình chữ nhật có chiều dài 5cm, chiều rộng 3cm là:", questionType: "multiple_choice", options: ["A. 8 cm²", "B. 15 cm²", "C. 16 cm²", "D. 12 cm²"], correctAnswer: "B", points: 1 },
      { questionText: "Diện tích hình vuông cạnh 4cm là:", questionType: "fill_blank", options: [], correctAnswer: "16", points: 1 },
      { questionText: "Thể tích hình lập phương cạnh 3cm là:", questionType: "multiple_choice", options: ["A. 9 cm³", "B. 27 cm³", "C. 12 cm³", "D. 18 cm³"], correctAnswer: "B", points: 1 },
      { questionText: "Diện tích hình tam giác có đáy 6cm, chiều cao 4cm là:", questionType: "fill_blank", options: [], correctAnswer: "12", points: 1 },
      { questionText: "1 m² = ? cm²", questionType: "multiple_choice", options: ["A. 100", "B. 1000", "C. 10000", "D. 100000"], correctAnswer: "C", points: 1 },
      { questionText: "Chu vi hình chữ nhật có chiều dài 8cm, chiều rộng 5cm là:", questionType: "fill_blank", options: [], correctAnswer: "26", points: 1 },
      { questionText: "Thể tích hình hộp chữ nhật có kích thước 3cm × 4cm × 5cm là:", questionType: "fill_blank", options: [], correctAnswer: "60", points: 1 },
      { questionText: "Diện tích hình bình hành có đáy 7cm, chiều cao 5cm là:", questionType: "multiple_choice", options: ["A. 12 cm²", "B. 35 cm²", "C. 24 cm²", "D. 25 cm²"], correctAnswer: "B", points: 1 },
      { questionText: "1 dm³ = ? cm³", questionType: "fill_blank", options: [], correctAnswer: "1000", points: 1 },
      { questionText: "Diện tích hình thoi có hai đường chéo 6cm và 8cm là:", questionType: "fill_blank", options: [], correctAnswer: "24", points: 1 },
    ]
  },
  // ===== LỚP 5 - NGỮ VĂN =====
  {
    grade: 5,
    subject: "ngu-van",
    chapter: "chuong-1",
    chapterName: "Đọc hiểu - Văn miêu tả",
    title: "Kiểm tra Đọc hiểu - Văn miêu tả",
    description: "Bài kiểm tra kỹ năng đọc hiểu văn bản miêu tả",
    duration: 30,
    questions: [
      { questionText: "Văn miêu tả là văn bản dùng để:", questionType: "multiple_choice", options: ["A. Kể lại một câu chuyện", "B. Giới thiệu đặc điểm sự vật, hiện tượng", "C. Nêu ý kiến đánh giá", "D. Hướng dẫn làm việc"], correctAnswer: "B", points: 1 },
      { questionText: "Khi miêu tả cây bàng, ta cần quan sát:", questionType: "multiple_choice", options: ["A. Chỉ màu sắc", "B. Chỉ hình dáng", "C. Hình dáng, màu sắc, âm thanh, mùi vị...", "D. Chỉ kích thước"], correctAnswer: "C", points: 1 },
      { questionText: "Câu nào là câu miêu tả?", questionType: "multiple_choice", options: ["A. Em đi học mỗi ngày.", "B. Bông hoa hồng đỏ rực như một ngọn lửa.", "C. Mẹ nấu cơm.", "D. Hôm nay là thứ mấy?"], correctAnswer: "B", points: 1 },
      { questionText: "Biện pháp tu từ 'so sánh' có trong câu:", questionType: "fill_blank", options: [], correctAnswer: "Mặt trời như một quả cầu lửa.", points: 1 },
      { questionText: "Biện pháp nhân hóa là:", questionType: "multiple_choice", options: ["A. So sánh hai sự vật", "B. Gọi sự vật bằng từ ngữ dùng cho con người", "C. Nói quá sự thật", "D. Nói ngược ý"], correctAnswer: "B", points: 1 },
      { questionText: "Dàn ý bài văn miêu tả gồm mấy phần?", questionType: "fill_blank", options: [], correctAnswer: "3", points: 1 },
      { questionText: "Từ gợi tả màu sắc trong câu 'Bầu trời xanh biếc' là:", questionType: "fill_blank", options: [], correctAnswer: "xanh biếc", points: 1 },
      { questionText: "Biện pháp nói quá (phóng đại) có trong câu:", questionType: "multiple_choice", options: ["A. Cây cao đến tận mây.", "B. Cây cao ba mét.", "C. Cây có tán rộng.", "D. Cây xanh tốt."], correctAnswer: "A", points: 1 },
    ]
  },
  {
    grade: 5,
    subject: "ngu-van",
    chapter: "chuong-2",
    chapterName: "Luyện từ và câu - Từ nhiều nghĩa",
    title: "Kiểm tra Luyện từ và câu - Từ nhiều nghĩa",
    description: "Bài kiểm tra kiến thức về từ nhiều nghĩa và từ đồng âm",
    duration: 25,
    questions: [
      { questionText: "Từ nhiều nghĩa là từ:", questionType: "multiple_choice", options: ["A. Chỉ có một nghĩa", "B. Có nhiều nghĩa và nghĩa phụ phái sinh từ nghĩa gốc", "C. Viết giống nhau nhưng nghĩa khác nhau", "D. Đọc khác nhau"], correctAnswer: "B", points: 1 },
      { questionText: "Từ đồng âm là từ:", questionType: "multiple_choice", options: ["A. Có nhiều nghĩa phái sinh", "B. Viết và đọc giống nhau nhưng nghĩa không liên quan", "C. Có nghĩa trái ngược", "D. Có nghĩa giống nhau"], correctAnswer: "B", points: 1 },
      { questionText: "Trong câu 'Con đường đi' và 'Con đường về', từ 'đường' là:", questionType: "multiple_choice", options: ["A. Từ nhiều nghĩa", "B. Từ đồng âm", "C. Từ trái nghĩa", "D. Từ đồng nghĩa"], correctAnswer: "A", points: 1 },
      { questionText: "Từ 'bàn' trong 'cái bàn' và 'bàn bạc' là:", questionType: "fill_blank", options: [], correctAnswer: "từ đồng âm", points: 1 },
      { questionText: "Từ nào là từ đồng âm với 'đường' (con đường)?", questionType: "multiple_choice", options: ["A. Đường (đường đi)", "B. Đường (đường ăn)", "C. Đường (đường phố)", "D. Đường (đường sá)"], correctAnswer: "B", points: 1 },
      { questionText: "Nghĩa gốc của từ 'mắt' là:", questionType: "multiple_choice", options: ["A. Mắt chân", "B. Bộ phận nhìn trên mặt", "C. Mắt dứa", "D. Mắt bão"], correctAnswer: "B", points: 1 },
      { questionText: "Câu ghép cần có:", questionType: "multiple_choice", options: ["A. Một chủ ngữ - vị ngữ", "B. Hai hay nhiều chủ ngữ - vị ngữ", "C. Không có chủ ngữ", "D. Chỉ có vị ngữ"], correctAnswer: "B", points: 1 },
      { questionText: "Từ 'chân' trong 'chân núi' mang nghĩa:", questionType: "fill_blank", options: [], correctAnswer: "phần dưới của núi", points: 1 },
    ]
  },
];

export default quizData;
