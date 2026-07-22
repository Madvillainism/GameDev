# BoKetÉ

Vertical-scrolling arcade driving game. Steer your car to collect holes (+100 points) while dodging poles. Built for desktop and mobile.

## Tech Stack

- **Vanilla JavaScript** — no frameworks, no build tools, no bundlers
- **HTML5 Canvas 2D Context** — all game rendering
- **CSS3** — styling, layout, responsive design, transitions
- **Bootstrap 5** (CDN, carousel only) — garage carousel UI

## Controls

| Action | Keyboard | Touch HUD |
|--------|----------|-----------|
| Accelerate | `↑` Arrow Up | GAS ⬆ |
| Brake | `↓` Arrow Down | FRENO ⬇ |
| Steer Left | `←` Arrow Left | ◀ |
| Steer Right | `→` Arrow Right | ▶ |
| Pause / Start | `P` | ⏸ |
| Back to Title | `Escape` | — |

## Features

### 1. Vehicles
Four selectable cars with unique physics stats:

| Vehicle | Speed | Accel | Turn | Description |
|---------|-------|-------|------|-------------|
| Carro rojo de Ramon | ●●●○○ | ●●●○○ | ●●●○○ | Balanced all-rounder |
| Altheus | ●●●●○ | ●●●●○ | ●●●○○ | Fast acceleration, good top speed |
| Matiz Bumblebee | ●●●○○ | ●●●○○ | ●●●●○ | Slow but tight turning |
| La Motora | ●●●●● | ●●●●● | ●●●●● | Max speed, max accel, razor handling |

Stats are visible in the garage carousel under each vehicle.

### 2. Road Rendering
- Dark asphalt surface
- White dashed center line that scrolls with the car
- Solid white edge lines on both sides

### 3. Game State Machine
A clean four-state loop replaces the original overlapping boolean logic:

```
waiting → playing ↔ paused
   ↑                        |
   |                        ↓
   +—— restart ←—— gameover
```

- **Waiting** — game loaded, shows "PRESS P OR TAP ⏸ TO START"
- **Playing** — active gameplay, input controls the car
- **Paused** — game frozen, overlay with resume prompt
- **Game Over** — DOM modal overlay with score and restart button

### 4. Touch Support
- On-screen D-Pad and action buttons overlaid on the canvas
- Keyboard and touch work simultaneously via unified `inputState`
- `touch-action: none` on game wrapper prevents scroll/zoom
- `touch-action: manipulation` on body disables double-tap zoom

### 5. Responsive Viewport
- Canvas wrapped in `#game-wrapper` with `max-width: 400px`, `max-height: 800px`, `aspect-ratio: 1/2`
- Scales down proportionally on smaller viewports
- Viewport meta: `user-scalable=no, maximum-scale=1.0`

### 6. Non-Blocking Game-Over Modal
- Replaces all `alert()` calls with a styled DOM overlay
- Background music pauses, `requestAnimationFrame` loop continues
- Restart button reinitialises the game state

### 7. Screen Transitions
- Fade-in animation on screen changes (title → garage → game)
- Hover effects on all buttons (scale, shadow)

### 8. Garage Background
- Dark cement-wall gradient with concrete floor stripe
- Car stats bars shown under each vehicle for informed selection

## How to Run

Open `index.html` in any modern browser. No server, build step, or installation required.

## Audio API Compliance

All audio stop/reset uses `.pause()` + `.currentTime = 0`. No invalid `.stop()` calls exist in the codebase.

## Asset Inventory (Immutable)

These files must **never** be renamed, moved, modified, or re-exported:

| File | Purpose |
|------|---------|
| `redcar.png` | Player car sprite (default) |
| `A.png` | Alternate car sprite (Altheus) |
| `matiz.png` | Alternate car sprite (Matiz) |
| `moto.png` | Alternate car sprite (Moto) |
| `hole.png` | Score-target hole sprite |
| `pole.png` | Obstacle pole sprite |
| `bg-image.jpg` | Title-screen background |
| `explosion.wav` | Game-over sound effect |
| `holefall.wav` | Collision sound effect |
| `bg-music.mp3` | In-game background music |
| `garageMusic.mp3` | Garage/menu music |

## Project Structure

```
index.html            Entry point — DOM structure
styles.css            All visual styling
events.js             Game logic, input, rendering, audio
README.md             This file
spec/
├── CONTEXT.md                Project goals, constraints, architecture
├── constitution/
│   ├── asset-governance.md   Asset immutability rules
│   └── mobile-input-layer.md Unified input abstraction
└── features/
    ├── 001-responsive-viewport/spec.md
    ├── 002-touch-controls/spec.md
    └── 003-game-over-modal/spec.md
```

## Spec Documentation

Full specifications are in the `spec/` directory, covering viewport locking, touch controls, game-over modal, asset governance, and the mobile input layer.
