# Task 5 - Feature Developer: Add Study Materials / Bài học View

## Task Summary
Added a dedicated "Bài học" (Study Materials / Lessons) view where students can browse curriculum content organized by grade and subject, with rich visual lesson cards and interactive content.

## Work Completed

### 1. Backend API (`/src/app/api/lessons/route.ts`)
- GET endpoint with `grade` and `subject` query parameters
- 30 comprehensive lessons (3 per grade per subject, grades 1-5, toan + ngu-van)
- Each lesson includes: title, description, emoji, difficulty (1-5 stars), key concepts (4 per lesson), examples with step-by-step explanations (2 per lesson), practice tips (3 per lesson), related quiz reference
- Content accurate for Vietnamese primary school curriculum (SGK 2024)
- All content in Vietnamese, age-appropriate

### 2. Frontend Component (`/src/components/lessons-view.tsx`)
- 3-step navigation: Grade selection → Subject selection → Lesson list
- Grade grid matching home-view style with warm colors and emojis
- Subject selection with Toán and Ngữ văn cards
- Responsive lesson grid (1/2/3 columns)
- Expandable lesson cards with:
  - Gradient accent strip, emoji icon, chapter badge
  - Title, description, difficulty stars with labels
  - Key concepts count and examples count badges
  - "Học bài" expandable section (key concepts, examples, practice tips)
  - "Kiểm tra" button linking to related quiz
- Skeleton loading cards, empty state with navigation
- Framer-motion animations, dark mode with warm tones

### 3. Integration Updates
- `app-store.ts`: Added 'lessons' to ViewType
- `page.tsx`: Added LessonsView import and viewMap entry
- `app-header.tsx`: Added "Bài học" nav button (BookMarked icon) between "Thử thách" and "Luyện tập"
- `home-view.tsx`: Added "📚 Bài học" feature card in features section

## Files Created
- `/src/app/api/lessons/route.ts`
- `/src/components/lessons-view.tsx`

## Files Modified
- `/src/store/app-store.ts`
- `/src/app/page.tsx`
- `/src/components/app-header.tsx`
- `/src/components/home-view.tsx`

## Verification
- Lint passes with no errors
- API tested: returns correct data for all grades/subjects
- No runtime errors in dev.log
