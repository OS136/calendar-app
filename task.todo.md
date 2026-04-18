# Calendar Header Layout Refactor

## Plan

- [x] **T1** Refactor header HTML structure
  - Remove `.header-right-buttons` and `.buttons-column` wrapper divs
  - Reorganize as: Month/Year, Prev button, Next button, Today button, Add Event button
  - Simplify: direct button children of header element

- [x] **T2** Refactor CSS header grid layout
  - Use 3-column grid: auto (flex 1) | 1fr (flex 2) | auto (flex 3)
  - Line 1: Month/Year centered (spans all 3 columns, flex 1)
  - Line 2: Prev left (col 1) | gap (col 2) | Next right (col 3) — flex 2
  - Line 3: gap (col 1-2) | Today & Add Event right (col 3) — flex 3
  - Update mobile/tablet to stack buttons vertically

- [ ] **T3** Verify responsive behavior
  - Test desktop: 3 distinct lines with correct alignment
  - Test mobile/tablet: stacked layout works
  - Ensure no regressions in calendar functionality

## Notes
- Keep all button styles and event listeners intact
- All app.js selectors remain unchanged (same button IDs)
- Testing: check Today button centers calendar on current month
