# Mobile Input Layer

## Abstraction Principle
All game input — whether from physical keyboard or on-screen touch HUD — must converge into a single `inputState` object consumed by the game loop.

## `inputState` Shape
```js
const inputState = {
  up: false,
  down: false,
  left: false,
  right: false
};
```

## Binding Rules
1. **Keyboard**: `keydown` sets the corresponding flag to `true`; `keyup` sets it to `false`.
2. **Touch (passive: false)**: `touchstart` on a HUD button sets the flag to `true`; `touchend` sets it to `false`.
3. **Race condition prevention**: Touch events call `event.preventDefault()` to suppress default browser behaviour (scrolling, zoom, context menus).

## Game Loop Consumption
The `vroom()` and steering logic reads from `inputState` every frame, never from DOM queries or raw event objects.
