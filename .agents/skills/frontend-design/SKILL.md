---
name: frontend-design
description: Comprehensive design system principles, typography guidelines, component patterns, and UI/UX best practices for building polished, modern, high-converting frontend interfaces.
---

# Frontend Design System & UI/UX Skill Guide

This skill provides design standards, token architecture, component guidelines, and visual polish rules for web applications.

---

## 1. Visual Hierarchy & Design Principles

### A. The "Anti-Vibe-Coding" Standard
- Avoid plain flat designs or generic admin-dashboard aesthetics.
- Avoid low-contrast text, unorganized spacing, and unnecessary emoji icons.
- Ensure every element has intentional padding, clear typography hierarchy, and purposeful hover/active feedback.

### B. Spacing & Rhythm
- Use a consistent 4px / 8px scale:
  - **Component padding**: `p-4`, `p-6`, `p-8`
  - **Grid gaps**: `gap-3`, `gap-5`, `gap-6`
  - **Section vertical padding**: `py-16 sm:py-20 lg:py-24`
- Keep touch targets at least `44px × 44px` (`py-3 px-4` or taller) for all buttons and interactive elements.

---

## 2. Typography System

### A. Font Pairing Philosophy
1. **Headings & Display**:
   - High-end Editorial / Luxury: `Playfair Display`, `Cinzel`, or serif accents (`font-serif font-bold tracking-tight`).
   - Modern Tech / Clean SaaS: `Plus Jakarta Sans`, `Inter`, `Outfit` (`font-sans font-extrabold tracking-tight`).
2. **Body Text & Technical Specs**:
   - Clean, highly legible sans-serif (`font-sans font-normal` / `font-light`, `text-sm sm:text-base leading-relaxed`).
3. **Eyebrow Pills & Badges**:
   - Small, wide-tracked uppercase: `text-[10px]` to `text-[11px] font-bold uppercase tracking-[0.14em]` to `tracking-[0.18em]`.

---

## 3. Color & Surface Architecture

### A. Palette Structure
- **Primary Navy / Dark**: `#0B132B`, `#1C2541` (Deep institutional confidence).
- **Crimson / Ruby Accent**: `#B22234`, `#931B2A` (Action CTA buttons, alerts, highlighted badges).
- **Warm Gold Accent**: `#C5A059`, `#A8833C`, `#F4EDE0` (Luxury badges, stars, highlights).
- **Background Surfaces**:
  - Light Canvas: `#F8FAFC` (Slate 50), `#FFFFFF` (Card surfaces).
  - Dark Mode: `#0B132B`, `#111B38`.

### B. Borders & Shadows
- Subtle borders: `border border-slate-200/90` or `border-white/15`.
- Soft elevation: `shadow-xs hover:shadow-md` or `hover:shadow-lg` with smooth transitions (`transition-all duration-300`).

---

## 4. Component Patterns

### A. Product Cards
- Clear top category ribbon (`px-3 py-1 rounded-full text-xs font-semibold`).
- Bold product title with hover color transition.
- 2-line spec/description with clean truncate.
- Grade/finish chips (`px-2.5 py-0.5 rounded-md text-[10px]`).
- Prominent 2-button CTA grid (`Details →` and `Enquire Now`).

### B. Interactive Filter Tabs
- Wrapped inside a dedicated container box (`bg-slate-50 border border-slate-200 p-4 rounded-2xl`).
- High-contrast active tab state (`bg-[#0B132B] text-white shadow-md scale-[1.02]`).
- Clean SVG vector icons (`lucide-react`) next to labels.

### C. Action Buttons & CTAs
- **Primary CTA**: Solid rich crimson `#B22234` or deep navy `#0B132B`, `py-3.5 px-6 font-bold tracking-wide rounded-xl shadow-md`.
- **Hover Motion**: Arrow or icon translates forward on hover (`group-hover:translate-x-1.5 transition-transform duration-200`).
- **Active State**: Micro-scale down (`active:scale-[0.98]`).

---

## 5. Animation & Smooth Motion

- Use **Lenis Smooth Scroll** for continuous, luxurious scrolling feel.
- Image Carousels: Smooth 1000ms cross-fade with subtle 5000ms Ken Burns scale (`scale-105`).
- Transitions: Use standard bezier curves `transition-all duration-300 ease-out`.
