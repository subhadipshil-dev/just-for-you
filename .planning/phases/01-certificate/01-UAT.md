---
status: testing
phase: 01-certificate
source: [.planning/phases/01-certificate/01-01-SUMMARY.md]
started: 2026-04-24T21:02:30Z
updated: 2026-04-24T21:02:30Z
---

## Current Test

number: 1
name: Download Certificate Image
expected: |
  Navigate to a surprise page, accept the surprise, enter a name, and click "Save as Image". 
  A file named `certificate-[id].png` should be downloaded. 
  The download should complete without errors or alerts.
awaiting: user response

## Tests

### 1. Download Certificate Image
expected: |
  Navigate to a surprise page, accept the surprise, enter a name, and click "Save as Image". 
  A file named `certificate-[id].png` should be downloaded. 
  The download should complete without errors or alerts.
result: [pending]

### 2. Certificate Visual Consistency
expected: |
  Open the downloaded certificate image. 
  The text (Title, Awarded To, Date) should be sharp and correctly aligned. 
  The background pattern (dots) and icons (heart, seal) should be visible and look premium.
result: [pending]

### 3. High Resolution Quality
expected: |
  Zoom into the downloaded certificate. 
  The text should remain sharp even at 200% zoom, confirming the 3x pixel ratio is working correctly.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0

## Gaps

[none yet]
