# Feature: Touch Controls

## Description
Provide on-screen directional and action buttons so the game is fully playable on mobile devices without a physical keyboard.

## Acceptance Criteria

### AC-201: Touch HUD Structure
- A `<div id="touch-controls">` layer is positioned over the canvas inside `#game-wrapper`.
- It contains five buttons:
  - `btn-left` — Left arrow symbol ◀ (steer left)
  - `btn-right` — Right arrow symbol ▶ (steer right)
  - `btn-up` — GAS ⬆ (accelerate)
  - `btn-down` — FRENO ⬇ (brake)
  - `btn-pause` — ⏸ (toggle pause)

### AC-202: Touch Event Binding
- Each button binds `touchstart` (set flag to `true`) and `touchend` (set flag to `false`).
- Events use `{ passive: false }` and call `preventDefault()`.
- `touchend` only clears the flag if no other touch point remains on the same button (multi-touch support).

### AC-203: Touch Feedback
- Buttons have a CSS `:active` state with a visual scale transform (e.g. `scale(0.92)`) and a semi-transparent backdrop.
- Buttons are non-selectable and non-draggable (`user-select: none`, `-webkit-user-select: none`, `touch-callout: none`).

### AC-204: Concurrent Input
- Keyboard and touch can be used simultaneously without conflict (both write to the same `inputState`).
