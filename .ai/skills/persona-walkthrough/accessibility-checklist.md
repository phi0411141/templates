# Accessibility Checklist

The yardstick for the Accessibility User persona. Based on WCAG 2.2 level AA,
the standard most accessibility laws reference (ADA case law, EU European
Accessibility Act / EN 301 549, Section 508). The criterion number follows
each item so findings can cite it.

Mark each area **pass / fail / unknown** with evidence (scan output,
screenshot, quoted UI text). Never mark pass without showing what you looked
at. This is a quick walkthrough, not an audit: items that need real
assistive tech (VoiceOver/NVDA announcements, voice control) are
**unknown** unless observed; list them for the user to check.

## 1. Text contrast
- [ ] Body text has contrast of at least **4.5:1** against its background (1.4.3).
- [ ] Large text (≥24px, or ≥18.66px bold) has at least **3:1** (1.4.3).
- [ ] Placeholder text, disabled-looking-but-active text, captions, and
      footer text meet the same ratios. These are the usual offenders.
- [ ] Text over images or gradients is readable everywhere it sits (check
      the screenshot; the scan can't measure it).

## 2. Non-text contrast and color
- [ ] Input borders, icons that convey meaning, focus indicators, and chart
      elements have at least **3:1** against adjacent colors (1.4.11).
- [ ] Color is never the only way to convey information: errors, required
      fields, status, selected state, chart series (1.4.1).
- [ ] Links inside body text are distinguishable without color
      (underline, or 3:1 against surrounding text plus a non-color cue on focus/hover) (1.4.1).

## 3. Text size and spacing
- [ ] Body text is comfortably sized: 16px or larger is the norm; anything
      under 12px is a finding unless it's legal fine print (best practice,
      not a WCAG number).
- [ ] Text resizes to 200% without loss of content or function (1.4.4).
- [ ] Content reflows at 320px width with no two-dimensional scrolling,
      except for maps, tables, and similar (1.4.10).
- [ ] No clipping or overlap with line-height 1.5, letter spacing 0.12em,
      word spacing 0.16em, paragraph spacing 2em (1.4.12).
- [ ] Text is real text, not an image of text (1.4.5).

## 4. Keyboard
- [ ] Every action is reachable and operable by keyboard (2.1.1).
- [ ] No keyboard trap; Escape closes dialogs and menus (2.1.2).
- [ ] Focus is always visible (2.4.7) and not hidden under sticky headers or
      cookie banners (2.4.11).
- [ ] Focus order follows the visual and reading order (2.4.3).
- [ ] A "Skip to main content" link or equivalent landmark navigation exists (2.4.1).
- [ ] Opening a dialog moves focus into it; closing returns focus to the trigger.

## 5. Pointer targets
- [ ] Click/tap targets are at least **24×24px**, or have enough spacing
      around them (2.5.8). 44×44px is the comfortable target on mobile.
- [ ] Drag-only interactions have a single-pointer alternative (2.5.7).

## 6. Names, labels, and structure
- [ ] Every form field has a visible label, not only a placeholder (3.3.2, 1.3.1).
- [ ] Every button and link has an accessible name that says what it does (4.1.2, 2.4.4).
- [ ] Informative images have meaningful `alt`; decorative ones have `alt=""` (1.1.1).
- [ ] Page has a `<title>` (2.4.2), a `lang` attribute (3.1.1), one `<h1>`,
      and headings that outline the content (1.3.1, 2.4.6).

## 7. Errors and status
- [ ] Errors are described in text, identify the field, and say how to fix
      it (3.3.1, 3.3.3).
- [ ] Status messages (saved, added to cart, N results) are announced
      without moving focus, e.g. via `role="status"` / `aria-live` (4.1.3).
- [ ] Legal, financial, or data-changing submissions can be reviewed,
      corrected, or undone (3.3.4).

## 8. Motion and time
- [ ] Anything that moves, blinks, or auto-updates for more than 5 seconds
      can be paused (2.2.2).
- [ ] Non-essential animation respects `prefers-reduced-motion`
      (2.3.3, AAA, but reported as Minor because it's cheap to fix).
- [ ] Nothing flashes more than 3 times per second (2.3.1).
- [ ] Time limits can be extended or turned off (2.2.1).

## Not findings

- A missing accessibility overlay widget. Overlays don't fix underlying
  issues and often add new ones.
- Failing AAA criteria (7:1 contrast, etc.), unless the site claims AAA.
  Mention as Polish at most.
- Automated scan hits you couldn't confirm visually. Report them as
  "inferred", or drop them.

## Severity guide

Map to the report's severity scale:

- **Blocker:** the task can't be completed by keyboard, focus trap,
  required information unreadable, outcome conveyed only by color.
- **Major:** body text or primary CTA below contrast minimum, invisible
  focus, unlabeled form fields, layout broken at 200% zoom.
- **Minor:** secondary text contrast, small targets, missing skip link,
  animation ignoring reduced motion.
- **Polish:** AAA-level improvements, wording of `alt` text.

## References

- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- Understanding contrast: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
- WebAIM contrast checker: https://webaim.org/resources/contrastchecker/
