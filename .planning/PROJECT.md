# Just For You 💖

## What This Is

An interactive, premium surprise platform designed to create personalized, animated messages for special someone. It features dynamic interaction modes, emotional sequences, and a customizable certificate of a beautiful moment.

## Core Value

Create a memorable, high-quality digital surprise experience that feels personal and premium.

## Requirements

### Validated

- ✓ Interactive Surprise Experience — Phase 0
- ✓ Dynamic "Fun" vs "Serious" modes — Phase 0
- ✓ Theme System (Dark/Light/Cute/Minimal) — Phase 0
- ✓ Certificate Generation with inline styling — Phase 1
- ✓ High-quality image download (3x ratio) — Phase 1

### Active

- [ ] Optimize Certificate Download Quality — Phase 1
- [ ] Fix backdrop-blur capture issues — Phase 1

### Out of Scope

- [ ] PDF Generation — Keeping it image-based for easy sharing
- [ ] Video exports — Too resource-intensive for v1

## Context

- Tech stack: Next.js 15, Tailwind 4, Framer Motion, html-to-image.
- The project aims for a "wow" aesthetic with glassmorphism and smooth animations.
- Certificate download was recently optimized to ensure visual consistency between web and exported image.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| html-to-image | Better control over pixel ratio and SVG capturing than html2canvas | ✓ Good |
| Inline styling for Certificate | Ensures styles are captured correctly by capture library | ✓ Good |

---
*Last updated: 2026-04-24 after initial GSD setup*
