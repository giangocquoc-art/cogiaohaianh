---
Task ID: 28
Agent: Styling Improvement Developer
Task: Improve mobile experience, dark mode, animations, accessibility

Work Log:
- Created /src/hooks/use-scroll-reveal.ts with IntersectionObserver hook (threshold 0.1, once-visible stays visible)
- Improved mobile drawer in app-header.tsx: backdrop-blur-md on overlay, gradient top strip, close button (w-9 rounded-xl), min-h-12 touch targets with py-3, active state with orange border-left-4 indicator, role="dialog" and aria-modal="true", aria-label on close/theme buttons, "cogiaohaianh.io" branding at footer
- Updated globals.css: added font-feature-settings "liga" 1 and "calt" 1 for Vietnamese text rendering, line-height 1.6 for body readability, skip-to-content link styles, mobile-table-scroll shadow indicator, skeleton-line/skeleton-circle/skeleton-card skeleton loading components
- Improved page.tsx: added scale (0.98→1 enter, 1→0.99 exit) alongside opacity/y offset, exit is subtler than enter, skip-to-content link with id="main-content" on main
- Improved home-view.tsx: imported useScrollReveal, reduced grade card hover scale from 1.07→1.04 and padding p-5→p-4 for mobile, standardized H2 headings to text-xl sm:text-2xl (from text-2xl sm:text-3xl)
- Improved quiz-view.tsx: stacked timer/progress bar vertically on very small screens (flex-col sm:flex-row), added aria-label on quiz option buttons (e.g., "Đáp án A: ...")
- Improved result-view.tsx: responsive score circle size (130px on screens < 400px, 160px default), dark mode bg circle opacity-20, added darkBg color variants
- Improved scoreboard-view.tsx: added overflow-x-auto and mobile-table-scroll class to score table for horizontal scrolling on mobile
- Dark mode consistency audit and fixes: leaderboard-view (border-gray-700, border-gray-700/50, rank circle bg-gray-700), badges-view (locked cards bg-gray-800/50 border-gray-600, progress bar bg-gray-600, earned text dark:text-gray-300), daily-challenge-view (XP card dark bg/border, countdown timer border-white/10 + drop-shadow-sm), progress-view (getScoreColor/getScoreBg/getScoreBarColor/getScoreBarBg all have dark: variants, heading text dark variants, trend text dark variants)

Stage Summary:
- Mobile experience significantly improved: drawer has backdrop blur, gradient, close button, active indicators, touch targets; quiz header stacks vertically on small screens; score circle responsive; table scrolls horizontally
- Dark mode consistency: all views now have proper dark: variants for score colors, borders, backgrounds, and text
- Accessibility: skip-to-content link, ARIA labels on dialog/modal/buttons, role="dialog" on mobile drawer, aria-label on theme toggle and quiz options
- Typography: font-feature-settings for Vietnamese ligatures, line-height 1.6 for readability
- Animations: page transitions have subtle scale effect, skeleton loading components ready
- Lint passes with no errors, no runtime errors
