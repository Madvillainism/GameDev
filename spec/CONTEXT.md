# BoKetÉ — Project Context

## Global Project Goals
BoKetÉ is a vertical-scrolling arcade driving game where the player steers a car to collect holes (+100 points each) while avoiding poles. The game targets both desktop (keyboard) and mobile (touch) audiences with a unified input system.

## Tech Stack Constraints (LOCKED)
- **Vanilla JavaScript** — No frameworks, no build tools, no bundlers.
- **HTML5 Canvas 2D Context** — All game rendering.
- **CSS3** — All styling, layout, and responsive behavior.
- **Bootstrap 5 bundle via CDN** — Only for the Garage carousel UI; no Bootstrap JS components beyond the carousel.

## Asset Organization
Media files are organized under `assets/`:

```
assets/
├── sprites/          # Vehicle & obstacle sprites
├── backgrounds/      # Title & garage backgrounds
└── audio/            # Sound effects & music
```

| Asset | Path | Purpose |
|-------|------|---------|
| `redcar.png` | `assets/sprites/redcar.png` | Player car sprite (default) |
| `A.png` | `assets/sprites/A.png` | Alternate car sprite |
| `matiz.png` | `assets/sprites/matiz.png` | Alternate car sprite |
| `moto.png` | `assets/sprites/moto.png` | Alternate car sprite |
| `herbie.png` | `assets/sprites/herbie.png` | Alternate car sprite |
| `hole.png` | `assets/sprites/hole.png` | Score-target hole sprite |
| `pole.png` | `assets/sprites/pole.png` | Obstacle pole sprite |
| `bg-image.jpg` | `assets/backgrounds/bg-image.jpg` | Title-screen background |
| `garage.jpg` | `assets/backgrounds/garage.jpg` | Garage background |
| `explosion.wav` | `assets/audio/explosion.wav` | Game-over sound effect |
| `holefall.wav` | `assets/audio/holefall.wav` | Collision sound effect |
| `bg-music.mp3` | `assets/audio/bg-music.mp3` | In-game background music |
| `garage-music.mp3` | `assets/audio/garage-music.mp3` | Garage/menu music |
| `herbie-horn.wav` | `assets/audio/herbie-horn.wav` | Herbie's random horn |

## Code Structure
- `index.html` — Entry point; contains all DOM structure (title screen, garage carousel, canvas, touch controls, game-over modal).
- `styles.css` — All visual styling.
- `events.js` — Game logic, input handling, rendering loop, audio management.

## Key Architectural Decisions
1. **Unified input layer** (`inputState`) — Both keyboard and touch events write to the same state object consumed by the game loop.
2. **Non-blocking UX** — All user-facing dialogs use DOM overlay modals, never `alert()`.
3. **Canvas aspect-ratio lock** — The `#game-wrapper` container enforces a 1:2 aspect ratio (max 400×800 px) and prevents touch scrolling.
4. **Audio API compliance** — All audio stop/reset uses `.pause()` + `.currentTime = 0`; never `.stop()`.
