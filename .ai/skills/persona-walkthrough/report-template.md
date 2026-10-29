# Persona Walkthrough Report Template

Copy into `[RUN_DIR]/report.md` and fill in. Drop sections that would be empty.

## Severity scale

| Level | Meaning |
|---|---|
| **Blocker** | A persona could not complete the task, or data was lost / wrong. |
| **Major** | Task completed only with real struggle: detours, confusion, retries, near-abandonment. |
| **Minor** | Noticeable friction or annoyance that didn't change the outcome. |
| **Polish** | Cosmetic, wording, or nice-to-have. |

---

```markdown
# Persona Walkthrough: [Target name]

- **Target:** [URL / flow, start → end]
- **Primary task:** [task]
- **Date:** [YYYY-MM-DD] · **Device:** [desktop / mobile / both]
- **Personas run:** [list]

> These are simulated personas driven by an AI agent, not real users.
> Treat findings as hypotheses and validate the critical ones with real users.

## Summary

| Persona | Outcome | Steps | Verdict (in their words) |
|---|---|---|---|
| First-time Visitor | ✅ completed | 9 | "Took a minute to get it, but the demo sold me." |
| Impatient User | ❌ abandoned at step 5 | 5 | "Cookie wall, then a newsletter popup. Gone." |
| Goal-oriented User | ⚠️ struggled | 14 | ... |
| Novice User | ... | ... | ... |
| Power User | ... | ... | ... |
| Accessibility User | ... | ... | ... |
| AI Agent | ... | ... | ... |

**Top takeaways:** 2–4 sentences on the most important things to fix and why.

## Findings

Ordered by severity, then by number of personas affected.

### F1. [Short title] — Blocker
- **Hit by:** Impatient User (step 3), Novice User (step 6)
- **Where:** [page / component]
- **What happened:** [observed behavior, with exact UI text in quotes]
- **Why it matters:** [impact on the persona's goal]
- **Evidence:** `impatient-user/03-signup.png`, `novice-user/06-error.png`; console: [error, if any]
- **Suggestion:** [concrete change]
- **Observed / inferred:** observed

### F2. ...

## What worked well

- [Things personas praised or moved through smoothly. Keep these.]

## Accessibility

From the Accessibility User journal and scans. Pass / fail / unknown per
area of `accessibility-checklist.md`, citing WCAG criteria. This is a quick
check, not a conformance audit.

| Area | Result | Evidence |
|---|---|---|
| Text contrast | fail | 7 elements under 4.5:1, worst: footer links 2.3:1 (`accessibility-user/01-scan.json`) |
| Color-only meaning | fail | Form errors shown only as red border (`accessibility-user/09-grayscale.png`) |
| Text size & zoom | pass | Readable at 200%, reflows at 320px (`accessibility-user/05-zoom200.png`) |
| Keyboard | ... | ... |
| Pointer targets | ... | ... |
| Names & labels | ... | ... |
| Errors & status | ... | ... |
| Motion & time | ... | ... |

Unknown, needs real assistive tech: [e.g. screen reader announcements of status messages]

## AI readiness

From the AI Agent journal. Pass / fail / unknown per area of
`ai-readiness-checklist.md`, with evidence. List "unknown" items the user
must check themselves (Search Console, CrUX, Merchant Center).

| Area | Result | Evidence |
|---|---|---|
| Indexability | pass | 200, no noindex, in sitemap |
| Content in raw HTML | fail | `<main>` empty without JS (`ai-agent/raw.html`) |
| Question answerable & citable | ... | ... |

## Objective signals

| Page | Load time | Console errors | Failed requests | Contrast fails |
|---|---|---|---|---|
| / | 1.1s | 0 | 0 | 3 |

## Prioritized fix list

1. [F1 fix], high impact
2. ...

## Appendix

- Journals: `[persona-slug]/journal.md`
- Scope: `scope.md`
- Assumptions made: [e.g. inferred primary task from the main CTA]
```
