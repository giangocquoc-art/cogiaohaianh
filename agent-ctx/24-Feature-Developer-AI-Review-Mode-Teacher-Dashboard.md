# Task ID: 24 - AI Review Mode + Teacher Dashboard

## Work Completed

### Feature 1: AI Quiz Review Mode (Ôn Tập Cùng AI)
- **Backend**: Created `/src/app/api/explain/route.ts` - POST API using z-ai-web-dev-sdk LLM
  - Accepts: questionText, questionType, options, correctAnswer, studentAnswer, grade, subject
  - System prompt: "Cô Giáo Hải Anh" persona for age-appropriate explanations
  - Grade-based explanation length (2-4 sentences for grade 1-2, 3-6 for grade 3-5)
  - Correct answers: congratulate + explain WHY correct
  - Wrong answers: gently explain correct answer with step-by-step reasoning
  - Vietnamese error handling

- **Frontend**: Updated `/src/components/result-view.tsx`
  - Added "Ôn tập cùng AI 🤖" button (teal/emerald gradient)
  - Review mode: questions shown one at a time
  - Each question: text, options, correct (green), student answer (red if wrong)
  - "Giải thích" button calls /api/explain
  - Loading spinner while AI generates explanation
  - Warm amber/orange explanation cards
  - Navigation: "Câu trước"/"Câu sau" with progress bar
  - Question dots (colored by correct/incorrect)
  - "Quay lại kết quả" button to exit
  - Framer Motion transitions

### Feature 2: Teacher Dashboard (Bảng Điều Khiển Giáo Viên)
- **Backend**: Created `/src/app/api/teacher/route.ts` - GET API
  - Accepts: schoolName, className (optional)
  - Returns: totalStudents, totalQuizzes, averageScore, passRate, subjectBreakdown, gradeBreakdown, topStudents, recentActivity, scoreDistribution

- **Frontend**: Created `/src/components/teacher-dashboard-view.tsx`
  - Search form: school name + optional class name
  - Summary cards: Students, Quizzes, Avg Score, Pass Rate
  - Subject comparison: Toán vs Ngữ văn with CSS bar charts
  - Grade performance breakdown (1-5)
  - Score distribution chart
  - Top 10 students table
  - Recent activity feed
  - Professional emerald/teal color scheme
  - Dark mode, responsive design

### Navigation & Integration
- Updated app-store.ts: Added 'teacherDashboard' to ViewType
- Updated page.tsx: Added TeacherDashboardView to viewMap
- Updated app-header.tsx: "Giáo viên" nav button with ClipboardList icon
- Updated home-view.tsx: "Dành cho giáo viên 📋" link near footer

### Bug Fix
- Fixed React hooks rules violation (useCallback handleExplain placed before early return)

### Verification
- `bun run lint` passes with no errors
- No runtime errors in dev.log
