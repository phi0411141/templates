# Report Template

Read this when writing a Level 2+ report. Adapt sections to the investigation; drop any that would be empty rather than padding them.

## Contents

1. Template
2. Section guidance
3. Citation style
4. Worked example (abbreviated)

---

## 1. Template

```markdown
# Research: <topic>

## Bottom Line
## How It Works
## Key Findings
## Existing Solutions          (Mode B, sometimes A/E)
## Implementation Path         (Mode C, sometimes B)
## Important Details
## Risks / Gotchas
## Unknowns
## Recommendation
```

---

## 2. Section guidance

**Bottom Line.** Two to four paragraphs, first. What was discovered, whether the idea/technology is viable, and what matters most. An engineer who reads only this section should know the verdict, the mechanism in one sentence, and the single biggest gotcha.

**How It Works.** The actual mechanism, not the marketing description. Use a text diagram when structure matters:

```text
A
↓
B
↓
C
```

Include formulas and state transitions where relevant, in the format from `blockchain-protocols.md` if it is a formula.

**Key Findings.** The technical discoveries that affect implementation, architecture, correctness, cost, scalability, or security. Prioritize ruthlessly; a finding that changes no decision belongs in Important Details or nowhere.

**Existing Solutions.** When applicable:

| Solution | What it solves | Strengths | Limitations |
| --- | --- | --- | --- |

Keep the table to the candidates worth considering. Classify each (direct / partial / primitive / adjacent / unsuitable).

**Implementation Path.** Recommended architecture with technology choices explained:

```text
Client
   ↓
Gateway
   ↓
Processing service
   ├── Component A
   ├── Component B
   └── Component C
```

Say what to build first and what can be deferred.

**Important Details.** APIs, formulas, constants, addresses, schemas, limits, configuration, edge cases — only those relevant to implementation.

**Risks / Gotchas.** Concrete issues likely to bite, with evidence (issue links, audit findings, observed behavior). Not generic warnings.

**Unknowns.** Only unresolved questions that materially matter, each with how it could be verified.

**Recommendation.** Decision-oriented: adopt, prototype first, use existing solution X, build a thin layer around primitive Y, avoid, or resolve one specific uncertainty before deciding. Explain why in terms of the findings.

Use confidence labels (**Confirmed** / **Strong evidence** / **Likely** / **Unknown**) on claims where uncertainty affects the decision. Omit them elsewhere.

---

## 3. Citation style

Cite close to the claim. Link to the most specific artifact available: a source file and function, a contract or transaction, a docs page section, an issue, a spec clause. Prefer primary sources. Do not end the report with a dump of every URL visited — the reader should be able to go from any claim directly to its evidence.

---

## 4. Worked example (abbreviated)

**Request:** "I keep seeing 'Lightpanda' mentioned — research it, we're evaluating headless browsers for a scraping pipeline."

**Mode:** A + E, Level 2.

```markdown
# Research: Lightpanda headless browser

## Bottom Line

Lightpanda is a from-scratch headless browser written in Zig that implements a
subset of the web platform (DOM, XHR/fetch, a JS engine via V8) with the explicit
goal of being much lighter than headless Chrome for automation and scraping. It
exposes the Chrome DevTools Protocol, so Puppeteer/Playwright scripts can drive it
with a one-line change [docs: CDP support].

For the scraping pipeline the trade is clear: large speed and memory gains on
pages that render server-side or use modest JS, versus incomplete rendering on
pages that depend on CSS layout, canvas, WebGL, or less common APIs — it has no
layout engine at all (**Confirmed**, README + architecture doc). Whether it fits
depends on what fraction of target sites fall in the first bucket, which is
unknown without a sample run.

## How It Works

Puppeteer/Playwright → CDP over WebSocket → Lightpanda server
  → HTML parser → DOM (Zig) → V8 isolate with Web API bindings
  → network stack (fetch/XHR) ... no layout / paint stage

## Key Findings

- No layout or rendering: `getBoundingClientRect`, screenshots, and anything
  visual are unsupported (**Confirmed**, issue #NNN).
- CDP coverage is partial; the docs list supported domains (**Confirmed**).
- Memory per page in the project's own benchmark is ~10× lower than headless
  Chrome (**vendor benchmark — unverified**).

## Existing Solutions
| Solution | What it solves | Strengths | Limitations |
| Headless Chrome | Full fidelity | Everything renders | Heavy |
| Lightpanda | Fast DOM+JS automation | Light, CDP-compatible | No layout |
| ... |

## Risks / Gotchas
- Pre-1.0; API and CDP coverage change between releases (**Confirmed**, changelog).
- Sites detecting automation may fingerprint the missing layout APIs (**Likely**).

## Unknowns
- Fraction of the target site list that renders correctly. Verify: run the
  existing scraper against a 50-site sample with Lightpanda as the CDP endpoint
  and diff extracted fields.

## Recommendation
Prototype, don't adopt yet. Route a sample of the pipeline through Lightpanda
behind a feature flag, fall back to Chrome on extraction mismatch, and measure
the hit rate. Adopt as the default path only if >80% of sites pass.
```

Note what the example does: verdict first, mechanism as a flow, findings labeled by confidence, a concrete verification step for the unknown, and a recommendation phrased as conditions.
