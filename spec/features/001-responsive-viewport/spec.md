# Feature: Responsive Viewport

## Description
Ensure the game canvas scales cleanly across all screen sizes without horizontal overflow, and prevent accidental touch scrolling on mobile.

## Acceptance Criteria

### AC-101: Canvas Aspect-Ratio Container
- The `<canvas id="myCanvas">` is wrapped inside a `<div id="game-wrapper">`.
- `#game-wrapper` has `max-width: 400px` and `max-height: 800px`, and scales down proportionally on smaller viewports without stretching off-screen.
- The canvas itself fills `#game-wrapper` at 100% width/height.

### AC-102: Touch Scroll Prevention
- The `#game-wrapper` element has `touch-action: none` so that touch gestures do not scroll the page.
- The `<body>` or `<html>` element has `touch-action: manipulation` to disable double-tap zoom while preserving tap speed.

### AC-103: Viewport Meta
- The `<head>` includes `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0">`.

### AC-104: Garage Overflow Protection
- `.carousel-inner` and `.carousel-item` max-width and height are adjusted to prevent overflow on screens under 450 px wide.
