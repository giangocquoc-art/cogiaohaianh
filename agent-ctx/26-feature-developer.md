# Task 26 - Feature Developer

## Task: Add Mobile Bottom Navigation Bar + Study Calendar View

### Work Log:
1. Created `/src/components/mobile-bottom-nav.tsx`:
   - Fixed bottom nav bar, visible only on screens < 640px (sm breakpoint)
   - 5 tabs: Trang chủ, Bài học, Luyện tập, Xếp hạng, Lịch (Calendar replaces Profile)
   - Active tab: orange icon + orange text + animated dot indicator
   - Inactive: gray icon + gray text
   - Glassmorphism background with backdrop-blur
   - Border-t with orange color scheme
   - iOS safe area bottom padding via env(safe-area-inset-bottom)
   - Hides during quiz/result views
   - z-index: 40 (below dialogs/overlays)
   - Framer Motion layout animation for active dot indicator

2. Created `/src/app/api/calendar/route.ts`:
   - GET endpoint accepting `studentName` and `className` query params
   - Returns calendar array of last 90 days with: date, completed, score, quizCount, subjects
   - Stats: totalStudyDays, currentStreak, longestStreak, totalQuizzes, averageScore, bestDay
   - Monthly summary: last 3 months with totalDays, totalQuizzes, avgScore
   - Queries StudentResult table grouped by date
   - Vietnamese month labels in response

3. Created `/src/components/study-calendar-view.tsx`:
   - Header: "Lịch Học" with CalendarDays icon and decorative elements
   - Search form: student name + class name with Enter key support
   - Stats row: 4 mini stat cards (Study days, Current streak, Total quizzes, Avg score)
   - GitHub contribution-style calendar grid:
     - 90 days displayed as 3.5x3.5px colored squares
     - Color scale: gray (no activity), light green, green, dark green
     - Dark mode: same pattern with darker tones
     - Tooltip on hover showing date + details
     - Month labels above the grid
     - Day-of-week labels
   - Streak section: fire emoji with current streak, motivational message
   - Monthly summary: 3 cards for last 3 months with emoji and stats
   - Best day indicator
   - Navigation: Back + Home buttons
   - All in Vietnamese
   - Responsive design
   - Dark mode support with warm colors
   - Framer Motion animations for all cards and sections

4. Updated `/src/store/app-store.ts`:
   - Added 'studyCalendar' to ViewType union

5. Updated `/src/app/page.tsx`:
   - Imported StudyCalendarView and MobileBottomNav
   - Added studyCalendar entry to viewMap
   - Added `<MobileBottomNav />` before closing `</div>` of main wrapper
   - Added `pb-20 sm:pb-6` to `<main>` element for bottom nav spacing

6. Updated `/src/components/app-header.tsx`:
   - Added CalendarDays import from lucide-react
   - Added "Lịch học" navigation button with CalendarDays icon (between Badges and Scoreboard)
   - Added 'studyCalendar' to breadcrumb exclusion list

7. Fixed lint error: parsing error in type annotation on useMemo return

### Stage Summary:
**Feature 1 - Mobile Bottom Navigation Bar:**
1. Fixed bottom nav visible only on mobile (< 640px)
2. 5 tabs: Trang chủ, Bài học, Luyện tập, Xếp hạng, Lịch
3. Active tab: orange color + animated dot indicator
4. Glassmorphism with backdrop-blur
5. iOS safe area padding
6. Hides during quiz/result views
7. z-index: 40

**Feature 2 - Study Calendar / Lịch Học:**
1. Backend: GET /api/calendar with 90-day calendar, stats, monthly summaries
2. Frontend: GitHub contribution-style grid with tooltips
3. Stats row: 4 cards (study days, streak, quizzes, avg score)
4. Streak section with fire emoji and motivational messages
5. Monthly summary cards for last 3 months
6. Navigation: "Lịch học" button in header with CalendarDays icon
7. Mobile bottom nav replaces Profile tab with Calendar tab
8. Bottom padding added to main content to prevent overlap
