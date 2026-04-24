---
phase: 01-certificate
plan: 01
subsystem: ui
tags: [react, html-to-image, framer-motion]
requirements-completed: [REQ-CERT-01, REQ-CERT-02]
---

# Phase 1: Certificate Optimization Summary

**Optimized certificate download quality and visual consistency for exported images.**

## Accomplishments
- Implemented high-resolution (3x pixel ratio) image capture for certificates.
- Standardized certificate styles using inline CSS to ensure capture accuracy.
- Added backdrop-blur fallback for exported images to prevent gray boxes.
- Improved font loading synchronization before image capture.

## Files Created/Modified
- `src/app/s/[id]/page.tsx` - Updated `handleDownload` logic and certificate component styles.

## Decisions Made
- Used `pixelRatio: 3` to provide sharp, printable certificates on high-DPI screens.
- Replaced Tailwind utility classes with inline styles in the certificate component specifically for the capture engine.
