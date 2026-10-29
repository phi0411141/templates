---
name: persona-walkthrough
description: Walk a website or user flow as several simulated user personas (first-time visitor, impatient, goal-oriented, novice, power user, accessibility user, AI agent) in a real browser and report usability and accessibility feedback from each. Use when asked for UX feedback, a usability review, persona testing, "how would users experience this page/flow", or a pre-launch sanity check of a site, landing page, signup, checkout, or onboarding flow, an accessibility check (contrast, text size, color-only meaning, zoom, keyboard navigation, WCAG), or how AI crawlers and agentic browsers experience a site, including AI search / AEO / GEO readiness (AI Overviews, ChatGPT/Perplexity citations, llms.txt questions).
allowed-tools: Bash(playwright-cli:*) Bash(npx:*) Bash(mkdir:*) Bash(curl:*)
---

# Persona Walkthrough

Drive the target site in a real browser once per persona. Each persona has
its own goal, patience, knowledge, and habits, so each one hits different
problems. The output is evidence-backed feedback: every finding points at a
step, a screenshot, and the exact UI text involved.

The browser is driven with the `playwright-cli` skill. Load it if its
commands are not already familiar.

## The Personas

| Persona | One-liner | Detail |
|---|---|---|
| First-time Visitor | Never heard of the product. "What is this, and is it for me?" | [personas/first-time-visitor.md](personas/first-time-visitor.md) |
| Impatient User | Has 60 seconds. Skims, never reads, bails on friction. | [personas/impatient-user.md](personas/impatient-user.md) |
| Goal-oriented User | Came to do one specific task. Measures the shortest path. | [personas/goal-oriented-user.md](personas/goal-oriented-user.md) |
| Novice User | Low tech confidence. Takes words literally, fears mistakes. | [personas/novice-user.md](personas/novice-user.md) |
| Power User | Expert. Keyboard, deep links, bulk actions, edge cases. | [personas/power-user.md](personas/power-user.md) |
| Accessibility User | Low vision, color-blind, keyboard only. Zooms to 200%, never touches a mouse. | [personas/accessibility-user.md](personas/accessibility-user.md) |
| AI Agent | Crawler, answer engine, or agentic browser. Reads raw HTML and the accessibility tree, not pixels. | [personas/ai-agent.md](personas/ai-agent.md) |

Run all seven unless the user picks a subset. The Accessibility User judges
the site against [accessibility-checklist.md](accessibility-checklist.md)
(WCAG 2.2 AA) and runs [scripts/a11y-scan.js](scripts/a11y-scan.js) on key
pages to measure contrast, text size, and target size; never skip it unless
the user says so. If the user only asks about accessibility, run just the
Accessibility User. The AI Agent persona judges the
site against [ai-readiness-checklist.md](ai-readiness-checklist.md) (based on
Google's AI optimization guide); skip it only if the user says AI
discoverability is out of scope. If the user only asks about AI search
readiness, run just the AI Agent persona.

## Workflow

### 1. Scope the run

Collect these before opening a browser. Infer what you can from the request
and the codebase; ask only for what is missing and blocking.

- **Target** — URL (local dev server or deployed) and, if it is a flow, the
  start page and end state ("order confirmation page", "first project created").
- **Primary task** — the concrete job a goal-oriented user would come to do.
  If not given, infer it from the page's main call to action and state your
  assumption.
- **Credentials / test data** — test account, test card, seed data. Never
  use real personal or payment data.
- **Boundaries** — actions personas must NOT take (real purchases, sending
  emails to real people, deleting data, production writes). Default: stop at
  the final irreversible submit and record what would happen.
- **Device** — desktop (default), mobile (`--mobile`), or both.

If the target is a local app that isn't running, start it (see the `run`
skill or the project's README) before continuing.

### 2. Set up the workspace

Store everything under the project's `.temp/` directory:

```
.temp/persona-walkthrough/<YYYYMMDD-HHMM>-<target-slug>/
  scope.md                    # what was agreed in step 1
  first-time-visitor/         # one folder per persona
    journal.md                # step-by-step log
    01-landing.png ...        # screenshots referenced by the journal
  ...
  report.md                   # final consolidated report
```

### 3. Walk the site as each persona

Each persona gets its **own isolated browser session** so cookies, history
and local storage do not leak between them:

```bash
playwright-cli -s=first-time-visitor open https://example.com
playwright-cli -s=impatient-user open https://example.com
```

**Parallel (preferred when subagents are available):** dispatch one
subagent per persona using [persona-agent-prompt.md](persona-agent-prompt.md).
Each one writes its journal into its own folder. Wait for all of them, then
consolidate.

**Sequential (no subagents):** walk the personas one at a time yourself.
Before each one, re-read its persona file and consciously drop everything
you learned as the previous persona. A novice does not know where the
settings menu is just because the power user found it.

Rules for every persona walk:

1. **Stay in character.** Decide each next action from the persona's
   behavior rules, not from what you as an agent know is the right path.
   If the persona would click the wrong thing, click the wrong thing.
2. **Only use what is on screen.** No reading source code, no guessing
   URLs (the Power User may try URL patterns, but must say so), no prior
   knowledge of the app. The AI Agent's "screen" is HTTP responses, raw
   HTML, and the accessibility tree; it may fetch those, never source code.
   The Accessibility User may run the scan script and change zoom, viewport,
   color filters, and media emulation, the way a real user changes their
   browser settings.
3. **Journal every step** in the format below, with a screenshot at every
   meaningful state change.
4. **Respect the budget.** Each persona file sets a step / time budget and
   abandonment triggers. When one fires, the persona gives up; record why.
   Giving up is a finding, not a failure of the walk.
5. **Respect boundaries** from scope.md. Never cross an irreversible action.
6. **Capture objective signals too:** console errors (`playwright-cli console
   error`), failed requests (`playwright-cli requests`), and load time where
   the persona cares about speed.
7. **Note accessibility friction in passing.** Every persona, not just the
   Accessibility User, records text it found hard to read, meaning it could
   only get from color, or targets that were hard to hit. Real users have
   tired eyes, glare, and small phones too.

Journal step format:

```markdown
### Step 4 — Pricing page
- **Saw:** Three plan cards; CTA on each says "Get started". Screenshot: 04-pricing.png
- **Thinking (in character):** "Which one is the free one? None of them say free."
- **Did:** Clicked "Get started" on the left card (cheapest-looking).
- **Result:** Landed on signup form, no plan shown. Unsure what I signed up for.
- **Feeling:** confused (2/5)
- **Signals:** 0 console errors; page load 1.2s; scan: 3 contrast fails (04-scan.json)
```

End each journal with: outcome (completed / completed with struggle /
abandoned at step N), total steps, the persona's one-sentence verdict in
their own voice, and their top 3 issues.

### 4. Consolidate the report

Write `report.md` using [report-template.md](report-template.md):

- Merge duplicate findings across personas. A problem hit by 3 personas
  ranks above one hit by 1, at equal severity.
- Rate severity with the scale in the template. Severity reflects impact on
  the persona, not how easy the fix is.
- Every finding must cite evidence: persona, step, screenshot, quoted UI text.
  Mark anything inferred rather than observed as such.
- Include what worked well. Teams need to know what not to break.
- End with a short prioritized fix list.

### 5. Deliver

Summarize in chat: the outcome per persona (one line each), the top 3–5
findings, and the path to `report.md`. Close every browser session:

```bash
playwright-cli close-all
```

## Guardrails

- The accessibility pass is a quick check, not a WCAG audit or conformance
  claim. Say so, and recommend testing with real screen readers and with
  disabled users for anything critical.
- Personas are simulations, not real user research. Say so in the report and
  recommend validating the critical findings with real users.
- Don't pad. If a persona finds nothing wrong, say so; don't invent issues to
  fill a quota.
- Don't fix the site during the walk. This skill produces feedback; fixing is
  a separate step the user asks for.
- If the site needs auth that you don't have, or blocks automation (captcha,
  bot wall), stop and ask rather than working around it.
