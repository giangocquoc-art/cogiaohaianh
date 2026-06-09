# Task 6 - Feature Developer: LLM-powered Hint System

## Summary
Implemented LLM-powered hint system for quiz questions using z-ai-web-dev-sdk.

## Files Created
- `/home/z/my-project/src/app/api/hint/route.ts` - Backend API route for generating hints via LLM

## Files Modified
- `/home/z/my-project/src/components/quiz-view.tsx` - Added hint button UI and hint card display
- `/home/z/my-project/worklog.md` - Appended work record

## Implementation Details

### Backend API (`/api/hint/route.ts`)
- POST endpoint accepting: questionText, questionType, grade, subject, hintNumber
- Uses z-ai-web-dev-sdk (`ZAI.create()` + `zai.chat.completions.create()`)
- System prompt is tailored as "Cô Giáo Hải Anh" - a caring Vietnamese primary school teacher
- Age-appropriate hint generation adjusted by grade (1-5)
- Hints never reveal the answer directly
- Second hint is slightly more detailed but still guides rather than answers
- Error handling with Vietnamese error messages

### Frontend (`quiz-view.tsx`)
- Added `HintState` interface: { hintsUsed, hints[], loading }
- Extended `QuizData` with `grade` and `subject` fields
- Hint button next to question text with Lightbulb icon
- Button states: "Gợi ý (1/2)" → "Gợi ý (2/2)" → "Hết gợi ý"
- Loading spinner while fetching
- 2 hints max per question (tracked per question ID in state)
- Animated hint cards with warm gradient (amber/yellow/orange)
- Framer Motion slide-in animations for hint cards
- Toast notification on API errors

## Testing
- API tested with curl: returns age-appropriate Vietnamese hints
- Math hint: "Con thử dùng ngón tay đếm nhé..." (for grade 1)
- Vietnamese hint: "Con thử sắp xếp các từ theo đúng trình tự..." (for grade 2)
- Error handling verified: 400 for missing fields
- All lint checks pass
- No runtime errors in dev.log
