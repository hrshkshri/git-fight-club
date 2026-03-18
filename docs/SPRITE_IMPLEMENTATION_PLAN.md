# Sprite Sheet Implementation Plan
## Git Fight Club — Character Animation System

---

## 1. What You Need to Create

### Sprite Sheet Specs

| Property | Value |
|---|---|
| File name | `fighter.png` |
| Drop location | `/public/sprites/fighter.png` |
| Background | **Transparent** (no background color) |
| Frame size | **64 × 64 px** each frame |
| Layout | All frames in **one horizontal row** |
| Art style | Pixel art, side-view, facing RIGHT |
| Total frames | **16 frames** |
| Total image size | **1024 × 64 px** (16 frames × 64px wide) |

---

## 2. Exact Frame Layout

Draw these 16 frames left-to-right in one row:

```
Frame:  1    2    3    4    5    6    7    8    9   10   11   12   13   14   15   16
       [I1] [I2] [I3] [I4] [W1] [W2] [W3] [W4] [A1] [A2] [A3] [A4] [H1] [H2] [H3] [H4]
        ←── IDLE ──→  ←──── WALK ────→  ←── ATTACK ──→  ←─── HIT ───→
```

### Frame Descriptions

#### IDLE — Frames 1–4 (breathing / ready stance)
- Fighter in fighting stance, facing right
- Slight up-down motion between frames (like breathing)
- Fists raised in guard position
- Knees slightly bent
- Frame 1 = standing tall, Frame 2 = slightly crouched, Frame 3 = tall again, Frame 4 = slight lean

#### WALK — Frames 5–8 (stepping forward)
- Fighter walking/stepping toward opponent (facing right)
- Classic walk cycle: weight shifts side to side
- Frame 5 = left foot forward, Frame 6 = neutral, Frame 7 = right foot forward, Frame 8 = neutral

#### ATTACK — Frames 9–12 (punch)
- Frame 9 = wind-up (arm pulled back, body coiled)
- Frame 10 = mid-punch (arm extends forward)
- Frame 11 = full extension (fist fully out, lean forward)
- Frame 12 = recovery (returning to guard)

#### HIT — Frames 13–16 (taking damage / stagger)
- Frame 13 = normal stance (before impact)
- Frame 14 = impact (body jerks back, head snapping backward)
- Frame 15 = mid-stagger (leaning back further)
- Frame 16 = recovering (coming back forward)

---

## 3. Character Design Guidelines

### Proportions (inside 64×64 canvas)
```
Head:    16×16 px  — centered around x=36, y=8  (slightly right of center, fighting lean)
Torso:   20×20 px  — centered around x=32, y=28
Arms:    8×18 px   — right arm extends to x=52 on attack
Legs:    10×24 px  — straddle from x=24 to x=44
Feet:    12×6 px   — flat on the floor at y=58
```

### Color (GREYSCALE — we handle color in code)
- Draw the character in **white or light grey only**
- We apply color (blue for P1, red for P2) via CSS `hue-rotate` + `sepia` filter
- This means ONE sprite sheet works for both players
- Outline/shadow: dark grey (#333) — NOT black (breaks the filter)
- Body fill: white (#fff) or light grey (#ddd)
- Leave background fully transparent

### Style Notes
- Chunky pixel art — minimum 3px thick limbs
- Rounded helmet / visor is fine
- Big fists (at least 8×8 px) for readability
- Clear silhouette — even at small size the pose should be readable

---

## 4. How I Will Implement It

### File: `src/app/components/CharacterSprite.tsx`

The component will:

1. **Load** `/public/sprites/fighter.png` as a CSS `background-image`
2. **Select frame** by shifting `background-position-x` to the right frame
3. **Animate** using CSS `animation` with `steps(1)` — snaps between frames like real pixel art
4. **Color** P1 blue and P2 red using a CSS filter chain:
   ```css
   /* P1 Blue */
   filter: sepia(1) saturate(5) hue-rotate(180deg) brightness(1.2)
           drop-shadow(0 0 8px #00aaff) drop-shadow(0 0 24px #0044ff88);

   /* P2 Red */
   filter: sepia(1) saturate(5) hue-rotate(320deg) brightness(1.2)
           drop-shadow(0 0 8px #ff2200) drop-shadow(0 0 24px #ff000088);
   ```
5. **Flip** P2 to face left using `scaleX(-1)`

### Animation State Machine

```
isAttacking=false, isHit=false  →  IDLE loop (frames 1–4, 8 FPS)
isAttacking=false, isHit=false  →  WALK loop (frames 5–8, 10 FPS) ← during battle
isAttacking=true                →  ATTACK once (frames 9–12, 12 FPS) then back to idle
isHit=true                      →  HIT once (frames 13–16, 10 FPS) then back to idle
```

### CSS Animation Approach

```css
/* Each animation shifts background-position by frameWidth (64px) per step */
@keyframes idle-anim {
  0%   { background-position-x: 0px;    }  /* frame 1 */
  25%  { background-position-x: -64px;  }  /* frame 2 */
  50%  { background-position-x: -128px; }  /* frame 3 */
  75%  { background-position-x: -192px; }  /* frame 4 */
  100% { background-position-x: 0px;    }  /* loop */
}

@keyframes walk-anim {
  0%   { background-position-x: -256px; }  /* frame 5 */
  25%  { background-position-x: -320px; }  /* frame 6 */
  50%  { background-position-x: -384px; }  /* frame 7 */
  75%  { background-position-x: -448px; }  /* frame 8 */
}

@keyframes attack-anim {
  0%   { background-position-x: -512px; }  /* frame 9  */
  33%  { background-position-x: -576px; }  /* frame 10 */
  66%  { background-position-x: -640px; }  /* frame 11 */
  100% { background-position-x: -704px; }  /* frame 12 */
}

@keyframes hit-anim {
  0%   { background-position-x: -768px; }  /* frame 13 */
  33%  { background-position-x: -832px; }  /* frame 14 */
  66%  { background-position-x: -896px; }  /* frame 15 */
  100% { background-position-x: -960px; }  /* frame 16 */
}
```

All animations use `animation-timing-function: steps(1)` — this makes it snap between frames instantly, giving the authentic pixel art feel (not smooth interpolation).

### Framer Motion (for movement, not frames)

Framer Motion handles the CHARACTER POSITION — lunge, stagger, float:
- Attack: `x` lunge toward opponent (+80px spring)
- Hit: `x` stagger back (−20px), `rotate` lean back
- Idle: gentle `y` float (0 → −6px loop)
- The CSS animation handles WHICH FRAME to show

---

## 5. Summary Checklist for Nano Banana

- [ ] Canvas size: **1024 × 64 px**
- [ ] 16 frames, each **64 × 64 px**, left to right
- [ ] Transparent background
- [ ] Character faces **RIGHT**
- [ ] Frames 1–4: Idle (breathing)
- [ ] Frames 5–8: Walk (stepping forward)
- [ ] Frames 9–12: Attack (punch)
- [ ] Frames 13–16: Hit (stagger)
- [ ] Color: **white/light grey fill, dark grey outline** (no colors — we add in code)
- [ ] Save as PNG with alpha channel

---

Once you drop `fighter.png` into `/public/sprites/`, I will implement the full `CharacterSprite.tsx` component immediately.
