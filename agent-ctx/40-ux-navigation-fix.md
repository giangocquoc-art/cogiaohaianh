# Task 40: Fix Navigation Overflow & Improve UX

## Problem 1: Navigation Overflow (CRITICAL)
**Fix:** Redesigned desktop header navigation to use a dropdown menu approach.

### Changes to `/src/components/app-header.tsx`:
- Split 12 nav items into two groups:
  - **Main nav (4 items)**: Trang chủ, Thử thách, Bài học, Luyện tập — shown directly in header
  - **More dropdown (8 items)**: Huy hiệu, Lịch học, Bảng điểm, Xếp hạng, Tiến độ, Giáo viên, Phụ huynh, Hồ sơ/Đăng nhập — shown in "Xem thêm" dropdown
- Added `ChevronDown` icon import from lucide-react
- Added `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel` imports from shadcn/ui
- Created `moreNavItems` array for dropdown items
- Created `allNavItems` array combining both for mobile drawer
- Dropdown trigger is a Button with "Xem thêm" label and ChevronDown icon
- Active state highlighted in both main nav AND dropdown (orange bg + dot indicator)
- Dropdown has "Khác" label separator
- Mobile drawer uses `allNavItems` to show all navigation options
- Back button and study mode indicator preserved as-is
- XP Widget and theme toggle remain visible

## Problem 2: Parent Corner Too Sparse
**Fix:** Added rich content that shows before any search is performed.

### Changes to `/src/components/parent-corner-view.tsx`:
- Replaced sparse initial state with 3 rich sections:
  1. **Welcome Section**: Warm welcome card with bullet points (📊 Xem tiến độ, 🤖 Nhận lời khuyên AI, 📅 Theo dõi lịch học, 💡 Mẹo giúp con học tại nhà), decorative emojis (👩‍🏫🎒📚)
  2. **Quick Tips Section**: 4 static tip cards visible immediately:
     - 🕐 Tạo thói quen học mỗi ngày
     - 🤗 Khuyến khích thay vì chỉ trích
     - 🎮 Học qua trò chơi
     - 📖 Đọc cùng con mỗi tối
  3. **Stats Preview**: Global stats banner (27+ bài kiểm tra, 100+ học sinh, 5 lớp học)

## Problem 3: Practice View Missing Selection Hints
**Fix:** Added contextual helper text below the start button.

### Changes to `/src/components/practice-view.tsx`:
- When grade AND subject not selected: "⚠️ Vui lòng chọn lớp và môn học để bắt đầu"
- When grade selected but subject not: "✅ Đã chọn lớp · Vui lòng chọn môn học"
- When both selected: helper text disappears (button becomes enabled)

## Lint Results
- All lint checks pass with no errors
