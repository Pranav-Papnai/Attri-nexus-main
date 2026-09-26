---
name: remotion
description: Comprehensive guide, API reference, and best practices for creating programmatic videos, animations, and motion graphics with Remotion (React for Video).
---

# Remotion (React for Video) Skill Guide

Remotion allows you to write videos programmatically using React, HTML, CSS, Canvas, and SVG.

---

## 1. Core Concepts & Rules

### Golden Rules of Remotion
1. **Frame-Driven State Only**: Never use `useState` or `useEffect` timers (`setTimeout`, `setInterval`) for driving animations. Everything must derive deterministically from `const frame = useCurrentFrame()` and `const { fps, durationInFrames, width, height } = useVideoConfig()`.
2. **Pure Functions**: A given frame must always render the exact same visual output.
3. **No CSS Transitions/Animations**: Avoid CSS `@keyframes` and transitions. Use `interpolate()` or `spring()` to compute inline CSS styles or transform matrix values.

---

## 2. Essential Remotion APIs

### 1. `useCurrentFrame()` & `useVideoConfig()`
```tsx
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const MyAnimation = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  return (
    <div style={{ fontSize: 40, color: 'white' }}>
      Frame: {frame} / {durationInFrames} ({fps} FPS)
    </div>
  );
};
```

### 2. `interpolate()`
Maps frame ranges to numerical values (opacity, translation, scale, rotation):
```tsx
import { interpolate, useCurrentFrame } from 'remotion';

const frame = useCurrentFrame();

const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

const translateY = interpolate(frame, [0, 30], [50, 0], {
  extrapolateRight: 'clamp',
});
```

### 3. `spring()` (Physics-Based Motion)
Creates natural, organic spring dynamics:
```tsx
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const scale = spring({
  frame,
  fps,
  config: {
    damping: 12,
    mass: 0.5,
    stiffness: 100,
  },
});
```

### 4. `<Sequence />` & `<Series />`
Controls when child components mount and play relative to the video timeline:
```tsx
import { Sequence, Series } from 'remotion';

// Sequence with absolute start frame & duration
<Sequence from={0} durationInFrames={60}>
  <TitleSlide />
</Sequence>
<Sequence from={60} durationInFrames={90}>
  <ProductDemo />
</Sequence>

// Series for sequential playback without manual frame math
<Series>
  <Series.Sequence durationInFrames={60}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={120}>
    <MainContent />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <Outro />
  </Series.Sequence>
</Series>
```

---

## 3. Project Structure

```text
src/
├── Root.tsx             # Defines <Composition /> entries
├── compositions/        # Video composition components
│   ├── MainVideo.tsx
│   ├── components/      # Reusable visual cards, kinetic typography
│   └── assets/          # Audio tracks, fonts, branding images
└── index.ts             # Calls registerRoot(Root)
```

### Defining Compositions in `Root.tsx`:
```tsx
import { Composition } from 'remotion';
import { MainVideo } from './compositions/MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainVideo"
        component={MainVideo}
        durationInFrames={300} // 10 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Attri Nexus Pure Commodities',
        }}
      />
    </>
  );
};
```

---

## 4. CLI & Workflow Commands

```bash
# Start the Remotion Player Preview Studio in browser
npx remotion preview

# Render video composition to MP4
npx remotion render src/index.ts MainVideo out/video.mp4

# Render with custom props
npx remotion render src/index.ts MainVideo out/video.mp4 --props='{"title":"Special Edition"}'

# Render as GIF or WebM
npx remotion render src/index.ts MainVideo out/animation.gif
```

---

## 5. Audio & Media Handling

```tsx
import { Audio, Img, staticFile } from 'remotion';

// Audio track with volume fade-in/fade-out
const volume = interpolate(frame, [0, 30, 270, 300], [0, 1, 1, 0], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

<Audio src={staticFile('music/bg-track.mp3')} volume={volume} />
<Img src={staticFile('images/logo.png')} style={{ width: 200 }} />
```
