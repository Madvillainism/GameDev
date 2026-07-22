# Feature: Game-Over Modal

## Description
Replace all synchronous `alert()` calls with a non-blocking DOM overlay modal that displays game-over information and provides a restart action without freezing the rendering loop.

## Acceptance Criteria

### AC-301: DOM Modal Structure
- A `<div id="game-over-overlay">` element inside `#game-wrapper` (hidden by default).
- Contains:
  - A title/header element (e.g. `<h2>`).
  - A score display element.
  - A "Restart" button that calls `resetGame()` and dismisses the modal.

### AC-302: Trigger Function
- A `triggerGameOver(title, message)` function in `events.js` that:
  1. Sets `pause = true`.
  2. Pauses background music.
  3. Populates the overlay's header and score text.
  4. Sets `#game-over-overlay.style.display = "flex"`.
- All `alert()` calls in the original code are replaced with calls to `triggerGameOver()`.

### AC-303: Non-Blocking
- The overlay is styled with `position: absolute` (or `fixed`) inside `#game-wrapper`, above the canvas.
- The `requestAnimationFrame` loop continues running (drawing the paused state) — the modal does not halt the event loop.
- Clicking/tapping "Restart" hides the overlay and calls `resetGame()`.

### AC-304: Escape Key Handler
- Pressing Escape while the game is active shows the title screen and stops audio.
- The `.stop()` call on `bgMusic` is replaced with `stopAudio(bgMusic)` which correctly calls `.pause()` + `.currentTime = 0`.
