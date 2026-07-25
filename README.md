# 🚗 The whole idea — Vertical Arcade Racer

[![JavaScript](https://img.shields.io/badge/Vanilla_JS-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Canvas](https://img.shields.io/badge/HTML5_Canvas-2D-000000?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![CSS3](https://img.shields.io/badge/CSS3-v3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Bootstrap](https://img.shields.io/badge/Bootstrap_5-CDN-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)

> **The whole idea** es un juego arcade de conducción vertical que implementa
> un sistema de física vehicular diferenciada por personaje, entrada unificada
> teclado/táctil y una máquina de estados de juego limpia — todo sobre
> Canvas 2D sin frameworks, sin build tools, sin dependencias externas más
> allá de Bootstrap 5 para el carrusel del garaje.

🎨 **El Reto Técnico:** Lograr que 4 vehículos se sientan radicalmente distintos
(aceleración, velocidad máxima, radio de giro, dimensiones) usando solo física
determinista en el bucle de renderizado, con un `inputState` que unifica teclado
y pantalla táctil sin race conditions, y una máquina de estados que reemplaza
la lógica anidada de booleanos por un enum limpio.

---

## 🎮 ¿Cómo se Controla el Coche? (Input Spec)

El sistema escribe en un único objeto `inputState` tanto desde el teclado físico
como desde los botones táctiles del HUD, eliminando la necesidad de bifurcar
la lógica de juego por dispositivo.

### ⌨️ Teclado: Arrow Keys

* **↑ (ArrowUp):** `inputState.up = true` → Aceleración progresiva por vehículo.
* **↓ (ArrowDown):** `inputState.down = true` → Freno.
* **← (ArrowLeft):** `inputState.left = true` → Giro a la izquierda con factor de velocidad.
* **→ (ArrowRight):** `inputState.right = true` → Giro a la derecha con factor de velocidad.
* **P:** Pausar / Reanudar.
* **Escape:** Volver al menú principal.

**Ecuación de Steering:**
$$ \text{factor} = \max(0.3,\ 1 - \frac{|\text{ySpeed}|}{50}) $$

### 🖐️ Táctil: Touch HUD

| Botón | Acción | inputState |
|-------|--------|------------|
| ◀ (btn-left) | Giro izquierda | `left = true` |
| ▶ (btn-right) | Giro derecha | `right = true` |
| GAS ⬆ (btn-up) | Acelerar | `up = true` |
| FRENO ⬇ (btn-down) | Frenar | `down = true` |
| ⏸ (btn-pause) | Pausa / Reanudar | — |

Todos los eventos usan `{ passive: false }` + `preventDefault()`. Multi-touch
seguro: cada botón mantiene su propio estado independiente.

---

## 🏎️ Física de Vehículos (Vehicle Spec)

Cada vehículo tiene estadísticas únicas que afectan aceleración, velocidad
máxima, radio de giro y dimensiones en pista:

| Vehículo | Sprite | Aceleración | Max Speed | Handling | Width | Height |
|----------|--------|-------------|-----------|----------|-------|--------|
| Carro rojo de Ramon | `redcar.png` | –0.20 | 8 | π/6 | 80 | 90 |
| Altheus | `A.png` | –0.25 | 10 | π/5 | 75 | 85 |
| Matiz Bumblebee | `matiz.png` | –0.15 | 6 | π/4 | 85 | 95 |
| La Motora | `moto.png` | –0.30 | 12 | π/3 | 60 | 70 |
| Herbie | `herbie.png` | –0.20 | 8.5 | π/5.5 | 80 | 90 |

Las estadísticas se muestran visualmente en el garaje mediante barras
(Speed / Accel / Turn) debajo de cada vehículo. El steering se escala
con la velocidad para evitar sobreviraje a alta velocidad.

---

## ⚙️ Máquina de Estados (Game State Machine)

```
 ┌──────────┐    P / ⏸     ┌─────────┐
 │  waiting │ ────────────> │ playing │ ────────> ──┐
 │          │               │         │    crash    │
 └──────────┘               │         │ <──────── │ │
       ▲                    └─────────┘           │ │
       │                        │  P / ⏸         │ │
       │                  ┌──────────┐            │ │
       └── restart ───────│ gameover │ <──────────┘ │
                    ┌─────│          │              │
                    │     └──────────┘              │
                    │         │ Escape              │
                    │    ┌───────────┐              │
                    └─── │ title (DOM) │ <─────────┘
                         └───────────┘
```

- **Title** — Pantalla de inicio con botón "Fall into place".
- **Garage** — Carrusel Bootstrap 5 con selección de vehículo.
- **Waiting** — Juego cargado, esperando P o ⏸ para comenzar.
- **Playing** — Bucle activo: input, física, spawn, detección, render.
- **Paused** — Juego congelado, overlay con instrucción de reanudación.
- **Game Over** — Overlay DOM con título, puntuación, high score y botón Restart.
  La escena congelada se renderiza detrás del overlay.

---

## ⚡ Características Principales

* **🔄 Unified Input Layer (`inputState`):** Teclado y táctil escriben en el mismo
  objeto `{ up, down, left, right }`. El game loop consume `inputState` sin saber
  ni importarle la fuente del input.
* **🎯 Game State Machine:** Enum de 5 estados que reemplaza el caos de booleanos
  superpuestos (`pause` / `start`). Transiciones claras y predecibles.
* **🏆 High Score Persistence:** El récord se mantiene en memoria durante toda la
  sesión. Se muestra en el overlay de game over (`#f0c040`) y en el HUD del canvas
  durante la partida.
* **📱 Mobile-First Viewport:** `#game-wrapper` con `max-width: 400px`,
  `aspect-ratio: 1 / 2`, `touch-action: none`. Meta viewport con
  `user-scalable=no, maximum-scale=1.0`.
* **🎨 Car Rotation:** El coche rota en tiempo real sobre el canvas usando
  `ctx.save()` / `ctx.translate()` / `ctx.rotate()` / `ctx.restore()` según
  el ángulo de giro. Extraído en función `drawCar()` para evitar duplicación.
* **🔊 Audio API Compliance:** `stopAudio()` usa `.pause()` + `.currentTime = 0`.
  Cero llamadas a `.stop()` en toda la base de código.
* **🏁 Road Rendering:** Asfalto oscuro (`#3a3a3a`), línea central discontinua
  con `setLineDash([24, 16])`, bordes blancos sólidos. La velocidad de scroll
  se sincroniza con `ySpeed` del vehículo.
* **🎨 Garage Background:** Fusión de `garage.jpg` con gradiente CSS oscuro
  (`linear-gradient + url()`). Barras de estadísticas visibles bajo cada coche.
* **🧩 Screen Transitions:** Animación `fadeIn` (`opacity + scale`) en todos los
  cambios de pantalla. Efectos `:hover` con `scale` y `box-shadow` en botones.
* **⛔ Non-Blocking Game-Over:** Overlay DOM absoluto dentro de `#game-wrapper`.
  El bucle `requestAnimationFrame` continúa corriendo — el modal no congela el
  event loop.

---

## 🔧 Cómo Ejecutar

Abrir `index.html` en cualquier navegador moderno. No requiere servidor, paso de
compilación ni instalación.

```bash
# Simplemente abre el archivo:
open index.html       # macOS
start index.html      # Windows
xdg-open index.html   # Linux
```

---

## 📂 Estructura de Especificaciones (SSD Layout)

```text
spec/
├── CONTEXT.md                    # Goals, constraints, architecture
├── constitution/
│   ├── asset-governance.md       # Reglas de inmutabilidad de assets
│   └── mobile-input-layer.md     # Abstracción del input unificado
├── features/
│   ├── 001-responsive-viewport/  # Viewport + aspect-ratio locking
│   ├── 002-touch-controls/       # Touch HUD binding spec
│   └── 003-game-over-modal/      # DOM overlay spec
├── AGENTS.md
assets/
├── sprites/                      # Vehicle & obstacle PNGs
├── backgrounds/                  # JPG backgrounds
└── audio/                        # WAV/MP3 sound & music
```

---

## 📦 Asset Inventory

Todos los archivos multimedia se organizan bajo `assets/`:

| File | Path | Purpose |
|------|------|---------|
| `redcar.png` | `assets/sprites/redcar.png` | Player car sprite (default) |
| `A.png` | `assets/sprites/A.png` | Alternate car sprite (Altheus) |
| `matiz.png` | `assets/sprites/matiz.png` | Alternate car sprite (Matiz) |
| `moto.png` | `assets/sprites/moto.png` | Alternate car sprite (Moto) |
| `herbie.png` | `assets/sprites/herbie.png` | Alternate car sprite (Herbie) |
| `hole.png` | `assets/sprites/hole.png` | Score-target hole sprite |
| `pole.png` | `assets/sprites/pole.png` | Obstacle pole sprite |
| `garage.jpg` | `assets/backgrounds/garage.jpg` | Garage background |
| `bg-image.jpg` | `assets/backgrounds/bg-image.jpg` | Title-screen background |
| `explosion.wav` | `assets/audio/explosion.wav` | Game-over sound effect |
| `holefall.wav` | `assets/audio/holefall.wav` | Collision sound effect |
| `bg-music.mp3` | `assets/audio/bg-music.mp3` | In-game background music |
| `garage-music.mp3` | `assets/audio/garage-music.mp3` | Garage/menu music |
| `herbie-horn.wav` | `assets/audio/herbie-horn.wav` | Herbie's random horn |
