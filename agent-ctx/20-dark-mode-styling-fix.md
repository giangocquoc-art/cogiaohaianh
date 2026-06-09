# Task 20: Dark Mode & Styling Fix Developer

## Task Summary
Fixed dark mode across all 11 component files by adding proper `dark:` Tailwind CSS variants using warm brown/amber color scheme.

## Work Completed
- Fixed all hardcoded light-only colors (bg-white, bg-rose-50, text-orange-700, border-orange-200, etc.)
- Added dark: variants for header/footer gradients
- Added dark: variants for all card backgrounds, borders, and text colors
- Added dark: variants for form inputs and study tips
- All lint checks pass, no runtime errors

## Key Dark Mode Color Mapping
- `bg-white` → `dark:bg-card`
- `bg-{color}-50` → `dark:bg-{color}-950/30`
- `text-{color}-700` → `dark:text-{color}-300`
- `text-{color}-800` → `dark:text-{color}-200`
- `border-{color}-200` → `dark:border-{color}-800`
- Header/footer gradient: `dark:from-amber-800 dark:via-orange-900 dark:to-amber-800`
